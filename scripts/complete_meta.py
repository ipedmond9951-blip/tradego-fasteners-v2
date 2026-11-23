#!/usr/bin/env python3
"""
补全被截断的 en meta（2026-11-23）。

历史"正文前 150 字"切法留下一批停在半个句子/连接词上的摘要。
做法：把当前 meta 当作正文里的一个前缀，从截断点往后续到最近的句末（. ! ?），
上限 175 字符；续不上或结果仍不合规就跳过，交给人工。

用法：python3 scripts/complete_meta.py [--apply]
"""
import glob
import json
import re
import sys

MAXLEN = 175
MINLEN = 100


def clean(t):
    return re.sub(r'\s+', ' ', re.sub(r'[#*_`>]+', '', t)).strip()


def good(m):
    return (MINLEN <= len(m) <= 180 and m[-1] in '.!?' and
            not re.search(r'\*\*|###|<|>', m) and
            not re.search(r'(,\s*|\band\s*|\bto\s*|\bfor\s*|\bwith\s*|\bthe\s*|\bof\s*|\bin\s*)$', m))


def body_text(art):
    best = ''
    for sec in art.get('sections') or []:
        b = (sec.get('body') or {}).get('en') or ''
        if len(b) > len(best):
            best = b
    return clean(best)


def complete(meta, body):
    meta = clean(meta)
    probe = meta[:70]
    idx = body.find(probe)
    if idx < 0:
        probe = meta[:40]
        idx = body.find(probe)
    if idx < 0:
        return None
    end = idx + len(meta)
    # 从截断点往后找句末
    m = re.search(r'[.!?](\s|$)', body[end:end + 90])
    if not m:
        return None
    cand = body[idx:end + m.end()].strip()
    cand = re.sub(r'\s+', ' ', cand)
    if len(cand) > MAXLEN:
        # 回退到 175 内的最后一个边界
        cut = cand[:MAXLEN]
        mm = list(re.finditer(r'[.!?](\s|$)', cut))
        if not mm:
            return None
        cand = cut[:mm[-1].end()].strip()
    return cand if good(cand) else None


def main():
    apply = '--apply' in sys.argv
    fixed, skipped = 0, []
    for f in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(f, encoding='utf-8'))
        m = ((a.get('metaDescription') or {}).get('en') or '').strip()
        if good(m):
            continue
        new = complete(m, body_text(a))
        if not new:
            skipped.append(a['slug'])
            continue
        a.setdefault('metaDescription', {})['en'] = new
        fixed += 1
        if fixed <= 5:
            print(f'\n{a["slug"]}  {len(m)} -> {len(new)}\n  {new}')
        if apply:
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(a, fh, ensure_ascii=False, indent=2)
                fh.write('\n')
    print(('APPLIED' if apply else 'DRY'), f'补全 {fixed} 条；仍需人工 {len(skipped)}: {skipped}')


if __name__ == '__main__':
    main()
