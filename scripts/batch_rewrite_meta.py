#!/usr/bin/env python3
"""
批量重写英文 meta（2026-11-23 收尾）。

用途：把"停在半句/带 markdown/太短"的 en meta 批量交给写作通道重写。
输入：/tmp/meta_fix.json（[{slug, title, cur, kw}]）
输出：直接写回 content/articles/*.json 的 metaDescription.en

校验：纯 ASCII、100-170 字符、以 .!? 结尾、无 markdown/HTML、不以连接词收尾。

用法：python3 scripts/batch_rewrite_meta.py [--apply]
"""
import json
import os
import re
import subprocess  # noqa: F401
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from llm_client import generate_json  # noqa: E402

BATCH = 8

PROMPT = """Rewrite the meta descriptions below for a B2B fastener export site (TradeGo, China to Africa/Asia buyers).

For each item return ONE meta description in English:
- 100-160 characters, exactly one or two complete sentences, ends with a period.
- Must open with the topic keyword from the title, must read like a reason to click (what the buyer gets).
- No markdown, no quotes, no HTML, no keyword stuffing, no "critical concern for B2B buyers" filler.
- Do not invent numbers that are not in the current text.

Items:
{items}

Return ONLY a JSON object mapping the id to the meta string, no code fence:
{shape}
"""


def good(m):
    return (100 <= len(m) <= 175 and m[-1] in '.!?' and m.isascii() and
            not re.search(r'\*\*|##|<|>|"', m) and
            not re.search(r'(,\s*|\band\s*|\bto\s*|\bfor\s*|\bwith\s*|\bthe\s*|\bof\s*)$', m))


def call(prompt):
    try:
        return generate_json(prompt, max_tokens=6000)
    except Exception as e:
        print('  json 失败:', repr(e)[:90], flush=True)
        return {}


def main():
    import glob
    apply = '--apply' in sys.argv
    items = json.load(open('/tmp/meta_fix.json', encoding='utf-8'))
    paths = {}
    for p in glob.glob('content/articles/*.json'):
        a = json.load(open(p, encoding='utf-8'))
        paths[a['slug']] = p

    done = 0
    for i in range(0, len(items), BATCH):
        part = items[i:i + BATCH]
        lines, shape = [], '{'
        for n, it in enumerate(part, 1):
            key = f'i{n}'
            lines.append(f'{key}: TITLE: {it["title"]}\n     CURRENT: {it["cur"][:150]}')
            shape += (', ' if n > 1 else '') + f'"{key}": "..."'
        shape += '}'
        prompt = PROMPT.format(items='\n'.join(lines), shape=shape)
        got = {}
        for attempt in range(2):
            got = call(prompt)
            valid = {k: v for k, v in got.items() if isinstance(v, str) and good(v.strip())}
            if len(valid) >= max(1, len(part) // 2):
                got = valid
                break
            got = {}
            time.sleep(8)
        for n, it in enumerate(part, 1):
            v = got.get(f'i{n}')
            if not v:
                print(f'  未拿到 {it["slug"]}', flush=True)
                continue
            p = paths.get(it['slug'])
            if not p:
                continue
            a = json.load(open(p, encoding='utf-8'))
            a.setdefault('metaDescription', {})['en'] = v.strip()
            if apply:
                with open(p, 'w', encoding='utf-8') as fh:
                    json.dump(a, fh, ensure_ascii=False, indent=2)
                    fh.write('\n')
            done += 1
            print(f'  {it["slug"]} -> {len(v)} chars', flush=True)
    print(f'{"APPLIED" if apply else "DRY"} 重写 {done}/{len(items)}')


if __name__ == '__main__':
    main()
