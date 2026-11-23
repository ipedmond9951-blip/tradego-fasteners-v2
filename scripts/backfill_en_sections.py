#!/usr/bin/env python3
"""
补齐英文薄段落（2026-11-23）。

问题：部分文章的英文正文只有几十~几百字符（其它语种同一段 1000-2000 字符），
英文读者点进来几乎无内容，也拉低整页可索引文本。

做法：以该段最长的非英语正文为事实来源，让写作通道产出等量英文正文
（不是逐句翻译，而是按同样事实重写为英文），校验：纯 ASCII、长度≥来源 60%、
无 HTML、长度≤来源 130%。写回 body['en']，并记录原文以便回滚。

用法：
  python3 scripts/backfill_en_sections.py            # 干跑
  python3 scripts/backfill_en_sections.py --apply
"""
import glob
import json
import os
import re
import subprocess  # noqa: F401
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from llm_client import generate as llm_generate  # noqa: E402

RATIO = 0.5          # en / 其它语种中位数 低于此即视为薄
RAWLOG = 'logs/backfill-en.log'

PROMPT = """Rewrite the following section body in natural native English for a B2B fastener website.

Rules:
- Same facts, same structure, same commercial angle. Do not add new numbers, prices, names or claims.
- Plain prose with short paragraphs; no HTML tags, no markdown, no bullet symbols except "- ".
- Length should be close to the source length.
- Keep codes as-is: ISO, DIN, ASTM, HDG, SS316, M8, AfCFTA, USD.

HEADING: {heading}

SOURCE ({lang}):
{body}

Return only the English text.
"""


def call_llm(prompt):
    try:
        return llm_generate(prompt, max_tokens=8000).strip()
    except Exception as e:
        print('  llm 失败:', repr(e)[:90], flush=True)
        return ''


PUNCT = str.maketrans({'\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"',
                        '\u2013': '-', '\u2014': ' - ', '\u2026': '...', '\u00b0': ' deg ',
                        '\u00a0': ' ', '\u00b2': '2', '\u00d7': 'x', '\u00b1': '+/-'})


def clean(t):
    t = re.sub(r'^```.*$', '', t, flags=re.M)
    t = re.sub(r'<[^>]+>', '', t)
    t = t.translate(PUNCT)
    return t.strip()


NONLAT_RE = re.compile(r'[\u4e00-\u9fff\u0600-\u06ff\u0400-\u04ff\u0900-\u097f\u3040-\u30ff\uac00-\ud7af]')


def main():
    apply = '--apply' in sys.argv
    rows = []
    for f in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(f, encoding='utf-8'))
        for i, sec in enumerate(a.get('sections') or []):
            b = sec.get('body') or {}
            if not isinstance(b, dict):
                continue
            en = (b.get('en') or '')
            others = [(len(v or ''), k) for k, v in b.items() if k != 'en' and isinstance(v, str)]
            if not others or not en:
                continue
            med = sorted(x[0] for x in others)[len(others) // 2]
            if med and len(en) / med < RATIO:
                rows.append((f, a['slug'], i, en, med, b, sec.get('heading') or {}))
    rows.sort(key=lambda r: len(r[3]) / r[4])
    print(f'薄英文段落 {len(rows)} 段 / {len({r[1] for r in rows})} 篇', flush=True)

    changed = 0
    for f, slug, i, en, med, b, head in rows:
        src_len, src_lang = max((len(v or ''), k) for k, v in b.items() if k != 'en' and isinstance(v, str))
        src = b[src_lang]
        if src_len < 400:
            continue
        heading = (head.get('en') or '').strip()
        out = ''
        for attempt in range(2):
            out = clean(call_llm(PROMPT.format(heading=heading, lang=src_lang, body=src[:2600])))
            ok = (out and not NONLAT_RE.search(out) and 0.5 * src_len <= len(out) <= 1.3 * src_len)
            with open(RAWLOG, 'a', encoding='utf-8') as lf:
                lf.write(f'\n== {slug} sec{i} attempt{attempt + 1} len={len(out)} src={src_len} ok={ok} ==\n')
            if ok:
                break
            out = ''
            time.sleep(8)
        if not out:
            print(f'  跳过 {slug} sec{i}（通道没给合格输出）', flush=True)
            continue
        b['en'] = out
        changed += 1
        print(f'  {slug} sec{i}: {len(en)} -> {len(out)} (src {src_lang} {src_len})', flush=True)
        if apply:
            a = json.load(open(f, encoding='utf-8'))
            a['sections'][i]['body']['en'] = out
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(a, fh, ensure_ascii=False, indent=2)
                fh.write('\n')
    print(f'{"APPLIED" if apply else "DRY"} 补完 {changed} 段')


if __name__ == '__main__':
    main()
