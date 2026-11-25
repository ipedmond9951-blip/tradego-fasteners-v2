#!/usr/bin/env python3
"""
用 Groq（OpenAI 兼容接口）批量生成产品页 SEO 短字段：标题 / Meta 描述 / H1 / 图片 alt。

设计原则：
- 只做「短文本批量」：标题、描述、alt 这类几十字的字段，不碰长文正文。
- 产品事实全部来自 src/lib/products.ts，模型只负责按目标语言重写，不许编造规格。
- 每个语言单独一次调用，要求原生表达（不接受英文原文混进 de/ja/ar 等）。
- 不写进生产关键路径：产出落到 JSON 文件，人工或脚本再决定是否写回。

用法：
  export GROQ_API_KEY=gsk_...
  python3 scripts/groq_seo_fields.py --products drywall-screws,anchor-bolts --langs de,ja,es
  python3 scripts/groq_seo_fields.py --all --langs en,de --out data/groq-seo-out.json

可选参数：
  --model       默认 openai/gpt-oss-120b（质量优先）；--model openai/gpt-oss-20b 更快更省
  --dry-run     只打印将要发出的 prompt，不调 API
"""

import argparse
import ast
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

API_URL = "https://api.groq.com/openai/v1/chat/completions"

# 这把 key 的账号档位是 on_demand，TPM 上限 8000（每分钟 token）。超了直接 HTTP 413
# "Request too large ... tokens per minute (TPM): Limit 8000"，所以批量跑必须限速。
TPM_LIMIT = 8000
TPM_SAFETY = 6500  # 留一点余量，给重试和其他调用让位
PRODUCTS_TS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "lib", "products.ts")

LANG_NAMES = {
    "en": "English", "zh": "简体中文", "es": "Español", "fr": "Français", "pt": "Português",
    "ar": "العربية", "ru": "Русский", "ja": "日本語", "de": "Deutsch", "hi": "हिन्दी",
}

SYSTEM = (
    "You are an SEO copywriter for an industrial fastener export site (TradeGo Fasteners). "
    "You write compact B2B metadata in the target language, aimed at importers, distributors and "
    "contractors. Never invent dimensions, standards, grades or certifications: use only the facts given. "
    "Reply with a single JSON object and nothing else."
)

USER_TMPL = """Target language: {lang_name} ({lang_code}) — write natively in this language, no English phrases.

Product facts:
{facts}

Produce JSON with exactly these keys:
  "title": page title, <= 60 characters, includes the product name plus one differentiator (standard or application or wholesale/OEM angle). No keyword stuffing.
  "meta": meta description, <= 155 characters, one clear benefit + concrete application + supply angle (bulk/export/MOQ if the facts mention it).
  "h1": page heading, <= 70 characters, natural, not identical to the title.
  "image_alt": image alt text, <= 120 characters, describes what is visibly in the photo of this fastener.

Rules: keep numbers and standards exactly as given; do not add certifications that are not in the facts."""


def extract_products(ts_path):
    """从 src/lib/products.ts 里抽出产品事实（slug / specs / features / applications）。"""
    src = open(ts_path, encoding="utf-8").read()
    blocks = re.split(r"\n\s{2}\{ slug:", src)[1:]
    products = {}
    for b in blocks:
        b = "{ slug:" + b
        slug = re.match(r"\{ slug: '([^']+)'", b).group(1)
        name_key = re.search(r"nameKey: '([^']+)'", b)
        specs = re.search(r"specs: (\{.*?\})\s*,\s*(?:features|applications|minOrder|leadTime)", b, re.S)
        feats = re.search(r"features: (\[.*?\])\s*,\s*(?:applications|minOrder|leadTime)", b, re.S)
        apps = re.search(r"applications: (\[.*?\])\s*,\s*(?:faq|minOrder|leadTime)", b, re.S)
        products[slug] = {
            "slug": slug,
            "name_key": name_key.group(1) if name_key else "",
            "specs": _js_literal(specs.group(1)) if specs else {},
            "features": _js_literal(feats.group(1)) if feats else [],
            "applications": _js_literal(apps.group(1)) if apps else [],
        }
    return products


def _js_literal(text):
    """把 JS 对象/数组字面量转成 Python 字面量：只补引号，不做执行。"""
    quoted = re.sub(r"([{,\[])\s*([A-Za-z_$][\w$]*)\s*:", r'\1"\2":', text)
    return ast.literal_eval(quoted)


def facts_block(p):
    lines = [f"slug: {p['slug']}"]
    for k, v in (p["specs"] or {}).items():
        lines.append(f"{k}: {v}")
    if p["features"]:
        lines.append("features: " + ", ".join(p["features"]))
    if p["applications"]:
        lines.append("applications: " + ", ".join(p["applications"]))
    return "\n".join(lines)


def build_prompt(p, lang):
    return USER_TMPL.format(lang_name=LANG_NAMES.get(lang, lang), lang_code=lang, facts=facts_block(p))


class RateLimiter:
    """按 TPM 预算给调用排队：最近 60 秒内已用 token 不能再超过 TPM_SAFETY。"""

    def __init__(self, budget=TPM_SAFETY, window=60.0):
        self.budget = budget
        self.window = window
        self.used = []  # [(时间戳, tokens)]

    def wait(self, estimate):
        while True:
            now = time.time()
            self.used = [(t, n) for t, n in self.used if now - t < self.window]
            spent = sum(n for _, n in self.used)
            if spent + estimate <= self.budget:
                return
            sleep_for = self.window - (now - self.used[0][0]) + 0.5
            print(f"  … TPM 预算已用 {spent}，等待 {sleep_for:.1f}s")
            time.sleep(max(sleep_for, 0.5))

    def record(self, tokens):
        self.used.append((time.time(), tokens))


def call_groq(key, model, prompt, timeout=60):
    body = {
        "model": model,
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 700,
        "reasoning_effort": "low",  # gpt-oss 系列带推理，不压低会把 token 全花在思维链上
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            # Groq 前面有 Cloudflare，默认 Python-urllib UA 会被 1010 拦掉，必须带正常 UA
            "User-Agent": "tradego-seo/1.0 (python-urllib)",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = json.loads(r.read())
    content = data["choices"][0]["message"]["content"].strip()
    usage = data.get("usage", {})
    try:
        return json.loads(content), usage
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", content, re.S)
        if not m:
            raise ValueError(f"模型没有返回 JSON：{content[:200]}")
        return json.loads(m.group(0)), usage


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--products", help="逗号分隔的产品 slug")
    ap.add_argument("--all", action="store_true", help="处理全部产品")
    ap.add_argument("--langs", default="en", help="逗号分隔的语言代码，如 de,ja,es")
    ap.add_argument("--model", default="openai/gpt-oss-120b")
    ap.add_argument("--out", default="data/groq-seo-out.json")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    key = os.environ.get("GROQ_API_KEY")
    if not key and not args.dry_run:
        sys.exit("缺少环境变量 GROQ_API_KEY")

    catalogue = extract_products(PRODUCTS_TS)
    if args.all:
        slugs = list(catalogue)
    elif args.products:
        slugs = [s.strip() for s in args.products.split(",") if s.strip()]
    else:
        sys.exit("需要 --products 或 --all")
    missing = [s for s in slugs if s not in catalogue]
    if missing:
        sys.exit(f"products.ts 里找不到这些 slug：{missing}")

    langs = [l.strip() for l in args.langs.split(",") if l.strip()]
    unknown = [l for l in langs if l not in LANG_NAMES]
    if unknown:
        sys.exit(f"未知语言代码：{unknown}（支持 {list(LANG_NAMES)}）")

    out = {"model": args.model, "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "items": []}
    total_tokens = 0
    t0 = time.time()
    limiter = RateLimiter()

    for slug in slugs:
        p = catalogue[slug]
        for lang in langs:
            prompt = build_prompt(p, lang)
            if args.dry_run:
                print(f"\n--- {slug} / {lang} ---\n{prompt}")
                continue
            try:
                limiter.wait(estimate=900)  # 单条大约 600-900 token
                fields, usage = call_groq(key, args.model, prompt)
            except urllib.error.HTTPError as e:
                body = e.read().decode()[:300]
                print(f"[FAIL] {slug}/{lang}: HTTP {e.code} {body}")
                continue
            except Exception as e:
                print(f"[FAIL] {slug}/{lang}: {e}")
                continue
            limiter.record(usage.get("total_tokens", 0))
            total_tokens += usage.get("total_tokens", 0)
            flags = []
            if len(fields.get("title", "")) > 60:
                flags.append("title>60")
            if len(fields.get("meta", "")) > 155:
                flags.append("meta>155")
            out["items"].append({"slug": slug, "lang": lang, **fields, "usage": usage, "flags": flags})
            warn = f"  ⚠ {','.join(flags)}" if flags else ""
            print(f"[OK] {slug}/{lang}  title={len(fields.get('title',''))}c  meta={len(fields.get('meta',''))}c  "
                  f"tokens={usage.get('total_tokens',0)}{warn}")

    if args.dry_run:
        return
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"\n完成 {len(out['items'])} 条 → {args.out}   合计 tokens={total_tokens}   耗时 {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main()
