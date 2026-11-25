#!/usr/bin/env python3
"""
多语种标题/摘要本地化（2026-11-23）。

问题：36 篇文章的部分语种 title / metaDescription 直接用了英文原文
（其中 zh/ar/ru/ja/hi 里出现的纯 ASCII 文本最明显），违反"10 语种原生标题与描述"。

做法：逐篇把"待本地化字段"打包成一次请求，走 scripts/seo-llm.sh（codex 额度已耗尽，
默认落到浏览器 gemini/grok），要求模型返回 JSON；本地做长度/语种/幂等校验，
不通过就重试一次，仍失败则跳过并记录。

用法：
  python3 scripts/localize_articles.py --limit 5        # 先试 5 篇
  python3 scripts/localize_articles.py                  # 全量
进度文件：logs/localize-progress.json（可断点续跑）
"""
import json
import glob
import os
import re
import subprocess  # noqa: F401
import sys as _sys
_sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from llm_client import generate_json as _llm_json
import sys
import argparse

LANGS = ['zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']
NONLAT = {'zh', 'ar', 'ru', 'ja', 'hi'}
NATIVE_RE = re.compile(r'[\u4e00-\u9fff\u0600-\u06ff\u0400-\u04ff\u0900-\u097f\u3040-\u30ff]')
PROGRESS = 'logs/localize-progress.json'
CJK = {'zh', 'ja'}


def ascii_only(t: str) -> bool:
    return bool(t) and not NATIVE_RE.search(t)


def needs_job(art: dict) -> dict:
    t = art.get('title') or {}
    m = art.get('metaDescription') or {}
    en_t = (t.get('en') or '').strip().lower()
    en_m = (m.get('en') or '').strip()
    todo = {}
    for L in LANGS:
        tl = (t.get(L) or '').strip()
        ml = (m.get(L) or '').strip()
        j = {}
        if not tl or tl.lower() == en_t or (L in NONLAT and ascii_only(tl)):
            j['title'] = True
        if not ml or ml == en_m or (L in NONLAT and ascii_only(ml)):
            j['meta'] = True
        if j:
            todo[L] = j
    return todo


PROMPT = """You are a native copywriter for a B2B fastener export site (TradeGo Fasteners, China → Africa/Asia buyers).
Localize the English title and meta description into these languages: {langs}.

Rules:
- Write like a native in that market, not a literal translation. Keep the commercial angle: what the buyer gets.
- Keep brand/product codes as-is: TradeGo, ISO, ASTM, DIN, HDG, SS316, M8, USD, AfCFTA, and place names.
- Title: max {tmax} characters, no clickbait, must contain the product/topic keyword.
- Meta description: {mlen}, one or two full sentences, no HTML, no quotes, must read as a reason to click.
- Arabic/Hindi/Chinese/Japanese/Russian must be in native script only — no English words except the codes above.
- Do not invent numbers that are not in the source.

Source (English):
TITLE: {title}
META: {meta}
TOPIC: {category}
KEYWORDS: {keywords}

Return ONLY valid JSON, no code fence, exactly this shape (only the languages listed above):
{{"zh": {{"title": "...", "meta": "..."}}, "ar": {{"title": "...", "meta": "..."}}}}
"""


def build_prompt(art: dict, todo: dict) -> str:
    langs = ', '.join(todo.keys())
    tmax = 40
    mlen = '70-110 characters (CJK)' if any(L in CJK for L in todo) else '120-160 characters'
    return PROMPT.format(
        langs=langs, tmax=tmax, mlen=mlen,
        title=art['title']['en'], meta=art['metaDescription']['en'],
        category=art.get('category', 'Fastener guide'),
        keywords=', '.join((art.get('keywords') or [])[:6]) if isinstance(art.get('keywords'), list) else str(art.get('keywords') or ''),
    )


def call_llm(prompt: str) -> str:
    try:
        data = _llm_json(prompt, max_tokens=6000)
        return json.dumps(data, ensure_ascii=False)
    except Exception as e:
        print('  llm 失败:', repr(e)[:90], flush=True)
        return ''


def parse_json(raw: str):
    if not raw:
        return None
    s = re.sub(r'^```(?:json)?|```$', '', raw.strip(), flags=re.M).strip()
    i, j = s.find('{'), s.rfind('}')
    if i < 0 or j < 0:
        return None
    try:
        return json.loads(s[i:j + 1])
    except Exception:
        return None


def validate(data: dict, todo: dict) -> tuple[dict, list]:
    ok, problems = {}, []
    for L, want in todo.items():
        v = data.get(L) or {}
        if not isinstance(v, dict):
            problems.append(f'{L}: 结构缺失')
            continue
        good = True
        if want.get('title'):
            t = (v.get('title') or '').strip()
            if not t or len(t) > 78:
                problems.append(f'{L}: title 长度异常({len(t)})')
                good = False
            elif L in NONLAT and ascii_only(t):
                problems.append(f'{L}: title 仍是英文')
                good = False
        if want.get('meta'):
            m = (v.get('meta') or '').strip()
            if not m or len(m) > 180 or len(m) < 35:
                problems.append(f'{L}: meta 长度异常({len(m)})')
                good = False
            elif L in NONLAT and ascii_only(m):
                problems.append(f'{L}: meta 仍是英文')
                good = False
            elif '<' in m or '&lt;' in m:
                problems.append(f'{L}: meta 含 HTML')
                good = False
        if good:
            ok[L] = v
    return ok, problems


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--slugs', default='')
    args = ap.parse_args()

    os.makedirs('logs', exist_ok=True)
    prog = {}
    if os.path.exists(PROGRESS):
        prog = json.load(open(PROGRESS))

    targets = []
    pattern = 'content/articles/*.json'
    for path in sorted(glob.glob(pattern)):
        art = json.load(open(path))
        todo = needs_job(art)
        if not todo:
            continue
        if prog.get(art['slug'], {}).get('done'):
            continue
        if args.slugs and art['slug'] not in args.slugs.split(','):
            continue
        targets.append((path, art, todo))
    if args.limit:
        targets = targets[:args.limit]
    print(f'待处理文章 {len(targets)} 篇', flush=True)

    for idx, (path, art, todo) in enumerate(targets, 1):
        slug = art['slug']
        raw = call_llm(build_prompt(art, todo))
        data = parse_json(raw)
        ok, problems = validate(data or {}, todo)

        if not ok and raw:
            # 重试一次：只补失败的语种，并强调"只要 JSON"
            retry_todo = {L: todo[L] for L in todo if L not in ok}
            raw2 = call_llm('STRICT: return ONLY the JSON object, no prose.\n' + build_prompt(art, retry_todo))
            data2 = parse_json(raw2)
            ok2, problems2 = validate(data2 or {}, retry_todo)
            ok.update(ok2)
            problems += problems2

        if ok:
            _sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            import lang_guard
            for L, v in ok.items():
                t = (v.get('title') or '').strip()
                m = (v.get('meta') or '').strip()
                if t and lang_guard.ok(L, t, ((art.get('title') or {}).get('en') or ''))[0]:
                    art['title'][L] = t
                elif t:
                    print(f'  ⚠️  丢弃 title.{L}：{lang_guard.reason(L, t)[0]}', flush=True)
                if m and lang_guard.ok(L, m, ((art.get('metaDescription') or {}).get('en') or ''))[0]:
                    art['metaDescription'][L] = m
                elif m:
                    print(f'  ⚠️  丢弃 meta.{L}：{lang_guard.reason(L, m)[0]}', flush=True)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(art, f, ensure_ascii=False, indent=2)
                f.write('\n')

        prog[slug] = {'done': len(problems) == 0, 'ok': sorted(ok.keys()), 'problems': problems}
        json.dump(prog, open(PROGRESS, 'w'), ensure_ascii=False, indent=2)
        print(f'[{idx}/{len(targets)}] {slug}: 成功 {sorted(ok.keys())} {("问题:" + ";".join(problems)) if problems else ""}', flush=True)

    failed = [k for k, v in prog.items() if not v.get('done')]
    print(f'完成。仍有问题: {len(failed)} 篇 → {failed[:10]}')


if __name__ == '__main__':
    main()
