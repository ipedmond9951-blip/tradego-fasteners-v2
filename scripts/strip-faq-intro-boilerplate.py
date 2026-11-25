#!/usr/bin/env python3
"""去掉非英语 FAQ 小节里残留的英文样板句 'See frequently asked questions below.'。
它从来不会被渲染（模板对 FAQ 小节改用本地语 FAQ_INTRO），但会污染正文语种体检。"""
import json, glob, re, sys

PAT = re.compile(r'<p>\s*(See (?:the )?frequently asked questions[^<]*?)\s*</p>', re.I)
BARE = re.compile(r'^\s*See (?:the )?frequently asked questions[^<]*?\.?\s*$', re.I)

def clean(t):
    if not t: return t, 0
    n = t
    n2, k = PAT.subn('', n)
    if bare := BARE.match(n2):
        n2, k2 = '', 1
        k += k2
    return n2, k

def main(apply):
    changed = articles = 0
    for p in sorted(glob.glob('content/articles/*.json')):
        d = json.load(open(p)); dirty = False
        for s in d.get('sections', []):
            for lg, t in list((s.get('body') or {}).items()):
                if lg == 'en': continue
                nt, k = clean(t)
                if k:
                    s['body'][lg] = nt; changed += k; dirty = True
        if dirty:
            articles += 1
            if apply:
                open(p, 'w').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
    print(f"{'APPLIED' if apply else 'DRY'}: {changed} 处 / {articles} 篇")

if __name__ == '__main__':
    main('--apply' in sys.argv)
