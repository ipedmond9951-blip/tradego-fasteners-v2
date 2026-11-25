#!/usr/bin/env python3
"""检查"半截译文"：同一小节里本地语正文长度明显短于英文原文（多为本地化被截断）。

判据：去掉标签与空白后比较字符数，本地/英文 < 0.55 视为不完整。
日韩中文本更紧凑，阈值放宽到 0.45；阿拉伯/俄/印地语通常更长，仍按 0.55。
用法：python3 scripts/check-body-len.py [--json] [--slug SLUG] [--strict]
"""
import argparse
import glob
import json
import re

TAG = re.compile(r'<[^>]+>')
THRESH = {'zh': 0.45, 'ja': 0.45, 'ko': 0.45, 'ar': 0.55, 'ru': 0.55, 'hi': 0.55,
          'es': 0.55, 'fr': 0.55, 'pt': 0.55, 'de': 0.55}


def plain(s):
    return re.sub(r'\s+', '', TAG.sub('', s or ''))


def scan(only_slug=None):
    arts = []
    for p in glob.glob('content/articles/*.json'):
        slug = p.split('/')[-1][:-5]
        if only_slug and slug != only_slug:
            continue
        d = json.load(open(p))
        rows = []
        for i, sec in enumerate(d.get('sections', [])):
            en = plain((sec.get('body') or {}).get('en'))
            if len(en) < 200:
                continue
            for lg, v in (sec.get('body') or {}).items():
                if lg == 'en' or not isinstance(v, str):
                    continue
                t = plain(v)
                if not t:
                    rows.append({'section': i, 'lang': lg, 'ratio': 0.0, 'len': 0, 'en': len(en)})
                    continue
                ratio = len(t) / len(en)
                if ratio < THRESH.get(lg, 0.55):
                    rows.append({'section': i, 'lang': lg, 'ratio': round(ratio, 2),
                                 'len': len(t), 'en': len(en)})
        if rows:
            arts.append({'slug': slug, 'rows': rows})
    return arts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--slug')
    ap.add_argument('--strict', action='store_true')
    a = ap.parse_args()
    arts = scan(a.slug)
    total = sum(len(x['rows']) for x in arts)
    if a.json:
        print(json.dumps({'total': total, 'articles': arts}, ensure_ascii=False, indent=1))
    else:
        print(f'半截译文：{total} 处，涉及 {len(arts)} 篇')
        for x in arts[:12]:
            worst = sorted(x['rows'], key=lambda r: r['ratio'])[:2]
            print(f"  {x['slug'][:44]:<44} {len(x['rows'])} 处  最短 " +
                  ', '.join(f"§{r['section']}.{r['lang']}={r['ratio']}({r['len']}/{r['en']})" for r in worst))
    if a.strict and total:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
