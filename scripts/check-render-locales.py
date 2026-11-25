#!/usr/bin/env python3
"""check-render-locales.py — 线上多语种 FAQ 渲染抽检

为什么要这层检查（2026-11-25 踩到）：
FAQ 改成 native-only 后，某些语种没有原生译文 → 条目被过滤，但小节标题还在，
线上出现"Preguntas frecuentes"下面一条问答都没有的空区块，tsc 和内容闸门都发现不了。
本脚本直接抓线上 HTML 断言三件事：
  1) 非英文页不得出现英文问句原文（语言泄漏）
  2) 有 FAQ 标题就必须有问答条目（防空标题）
  3) 英文页必须有 FAQPage 结构化数据

用法：
  python3 scripts/check-render-locales.py                    # 默认抽样
  python3 scripts/check-render-locales.py --samples 10 --quiet
退出码：0 通过；1 发现违规（audit 会记为问题项）。
"""
import argparse
import json
import os
import random
import sys
import re, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://www.tradego-fasteners.com"
LOCALES = ["en", "zh", "ja", "es", "fr", "pt", "ar"]
FAQ_HEADINGS = {
    "en": "Frequently Asked Questions",
    "zh": "常见问题",
    "ja": "よくある質問",
    "es": "Preguntas frecuentes",
    "fr": "Questions fréquentes",
    "pt": "Perguntas frequentes",
    "ar": "الأسئلة",
}


def load_articles():
    out = []
    arts = os.path.join(ROOT, "content", "articles")
    for name in sorted(os.listdir(arts)):
        if not name.endswith(".json"):
            continue
        path = os.path.join(arts, name)
        try:
            with open(path) as f:
                d = json.load(f)
        except (json.JSONDecodeError, OSError):
            continue
        items = [i for s in d.get("sections", []) for i in s.get("faqItems", [])]
        en_q = ""
        for i in items:
            q = (i.get("q") or {}).get("en", "")
            if q:
                en_q = q
                break
        out.append({"slug": name[:-5], "items": len(items), "en_q": en_q})
    return [a for a in out if a["items"] > 0]


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "tradego-render-check/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8", "ignore")
    except Exception as e:
        return f"__ERROR__{e}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--samples", type=int, default=6)
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args()
    random.seed(20261125)
    arts = load_articles()
    sample = random.sample(arts, min(a.samples, len(arts)))

    problems = []
    checked = 0
    for art in sample:
        for loc in LOCALES:
            url = f"{BASE}/{loc}/industry/{art['slug']}/"
            html = fetch(url)
            checked += 1
            if html.startswith("__ERROR__"):
                problems.append(f"{loc}/{art['slug']}: 抓取失败 {html[9:60]}")
                continue
            q_count = html.count('"@type":"Question"')
            # 2026-11-25 修: 之前只判 heading 文本出现在 HTML 里, 结果被导航栏的"FAQ/常见问题"链接
            # 命中了 (ar 的 الأسئلة 就在顶部菜单), 5 处"空 FAQ"全是误报。必须限定在 <h2> 里。
            heading = FAQ_HEADINGS.get(loc, "")
            has_heading = bool(heading) and bool(re.search(r'<h2[^>]*>' + re.escape(heading), html))
            # 1) 语言泄漏：非英文页出现英文问句（取前 24 字符，避开 HTML 转义差异）
            if loc != "en" and art["en_q"]:
                snippet = art["en_q"][:24]
                if snippet and snippet in html:
                    problems.append(f"{loc}/{art['slug']}: 出现英文问答")
            # 2) 空 FAQ 区：有标题无问答
            if has_heading and q_count == 0:
                problems.append(f"{loc}/{art['slug']}: FAQ 标题存在但 0 条问答")
            # 3) 英文页必须有结构化数据
            if loc == "en" and q_count == 0:
                problems.append(f"en/{art['slug']}: 无 FAQPage 条目")
            # 4) 有问答就必须有 FAQPage（避免只渲染折叠块、结构化数据丢了）
            if q_count > 0 and '"@type":"FAQPage"' not in html and "@type&quot;:&quot;FAQPage" not in html:
                problems.append(f"{loc}/{art['slug']}: 有问答但缺 FAQPage 结构化数据")
            # 5) FAQ 小节正文的英文副本泄漏：以前 section.body 会整段回退英文，
            #    抽检只查问句抓不到这一层；现在改成渲染层本地化引导语，这里守回归。
            if loc != "en" and "See frequently asked questions below" in html:
                problems.append(f"{loc}/{art['slug']}: FAQ 正文回退了英文原文")

    if not a.quiet:
        print(f"🔎 多语种渲染抽检：{len(sample)} 篇 × {len(LOCALES)} 语种 = {checked} 个页面")
    if problems:
        for p in problems:
            print(f"  ❌ {p}")
        print(f"  ❌ 共 {len(problems)} 处问题")
        sys.exit(1)
    if not a.quiet:
        print("  ✅ 无英文泄漏、无空 FAQ 区、英文页均有结构化数据")


if __name__ == "__main__":
    main()
