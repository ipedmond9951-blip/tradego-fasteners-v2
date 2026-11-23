#!/usr/bin/env python3
"""
修英文 meta 的截断与残渣（2026-11-23 收尾）。

体检出来的问题：
1. 约 90 条 en meta 正好卡在 150 字符、停在连接词/半个词上（历史"正文前 150 字"切法的遗留）；
2. 少数带 markdown（**xxx**、###）；
3. 少数太短（< 70）或本身就是半句（"...: 1."）。

做法：从该文正文（en）里按完整句子累积，直到再加一句会超过 158，落在句末；
若第一句本身就超长，则按词边界截到 ≤156 并补句号；清掉 markdown 符号。
不达标才动手，达标的保持原样。

用法：python3 scripts/fix_meta_truncation.py [--apply]
"""
import glob
import json
import re
import sys

MAXLEN = 158
MINLEN = 100


def clean(t):
    t = re.sub(r'[#*_`>]+', '', t)
    t = re.sub(r'^\s*[-•]\s*', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def sentences(text):
    text = clean(text)
    out = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in out if s.strip()]


def good(m):
    return (MINLEN <= len(m) <= 180 and m[-1] in '.!?' and
            not re.search(r'\*\*|###|<|>', m) and
            not re.search(r'(,\s*|\band\s*|\bto\s*|\bfor\s*|\bwith\s*|\bthe\s*|\bof\s*)$', m))


def rebuild(art):
    body = ''
    for sec in art.get('sections') or []:
        b = (sec.get('body') or {}).get('en') or ''
        if len(b) > len(body):
            body = b
        if len(body) > 400:
            break
    if len(body) < 80:
        body = (art.get('description') or {}).get('en') or body
    ss = sentences(body)
    if not ss:
        return None
    acc = ''
    for s in ss:
        cand = (acc + ' ' + s).strip() if acc else s
        if len(cand) <= MAXLEN:
            acc = cand
            if len(acc) >= MINLEN:
                break
        else:
            break
    if len(acc) < MINLEN:
        # 第一句就长：按词边界截
        first = ss[0]
        if len(first) > MAXLEN:
            cut = first[:MAXLEN]
            cut = re.sub(r'\s+\S*$', '', cut).rstrip(' ,;:-')
            acc = cut + '.'
        else:
            acc = first
            for s in ss[1:]:
                if len(acc) + len(s) + 1 <= MAXLEN:
                    acc += ' ' + s
                else:
                    break
    acc = acc.strip()
    if acc[-1] not in '.!?':
        acc = re.sub(r'\s+\S*$', '', acc).rstrip(' ,;:-') + '.'
    return acc if MINLEN <= len(acc) <= 180 else None


def main():
    apply = '--apply' in sys.argv
    changed, sample = 0, []
    for f in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(f, encoding='utf-8'))
        m = ((a.get('metaDescription') or {}).get('en') or '').strip()
        if good(m):
            continue
        new = rebuild(a)
        if not new or not good(new):
            continue
        a.setdefault('metaDescription', {})['en'] = new
        changed += 1
        sample.append((a['slug'], len(m), m[-30:], len(new), new))
        if apply:
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(a, fh, ensure_ascii=False, indent=2)
                fh.write('\n')
    print(('APPLIED' if apply else 'DRY'), '重写 en meta:', changed)
    for s in sample[:6]:
        print(f'\n{s[0]}  {s[1]} -> {s[3]}\n  old尾: ...{s[2]}\n  new: {s[4]}')


if __name__ == '__main__':
    main()
