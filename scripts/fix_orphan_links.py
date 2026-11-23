#!/usr/bin/env python3
"""
补孤岛页/弱内链页的 relatedArticles（2026-11-23）。

背景：56 篇既没有 relatedArticles、正文也没有 /industry/ 内链，平均内链只有 2.2 条。
页面本身有「More in this Category」自动推荐，但只取同分类 4 篇，同分类弱相关时几乎不给链接。

做法：给候选文章打分 —— 同分类 +4、同地区 +3、标题关键词 Jaccard *6，
取前 4 篇写进 relatedArticles（用 slug 字符串，页面会按语种取本地标题）。
只补"空或只有 1 条"的文章，已有的不覆盖。

用法：python3 scripts/fix_orphan_links.py [--apply]
"""
import glob
import json
import re
import sys
from collections import defaultdict

STOP = set('the a an of for in on to and with by from at is are be as that this these those '
           'guide how what why when where which your you our we it its not no or vs per '
           'fastener fasteners africa african guide market procurement sourcing supplier '
           'suppliers import export demand china chinese b2b price pricing wholesale buying '
           'buyer complete best top requirements 2026 2025 2024 trade'.split())
WORD = re.compile(r"[A-Za-z0-9][A-Za-z0-9\-\.]{1,}")
LIMIT = 4


def tokens(art):
    text = ' '.join([(art.get('title') or {}).get('en', '')] +
                    [str(k) for k in (art.get('keywords') or [])])
    return {w.lower() for w in WORD.findall(text) if w.lower() not in STOP and len(w) > 2}


def main():
    apply = '--apply' in sys.argv
    arts = []
    paths = {}
    for p in sorted(glob.glob('content/articles/*.json')):
        d = json.load(open(p))
        if d.get('redirectTo'):
            continue
        arts.append(d)
        paths[d['slug']] = p
    toks = {d['slug']: tokens(d) for d in arts}
    by_cat = defaultdict(list)
    for d in arts:
        by_cat[d.get('category')].append(d['slug'])

    changed = 0
    report = []
    for d in arts:
        path = paths[d['slug']]
        ra = d.get('relatedArticles') or []
        if len(ra) >= 2:
            continue
        me = d['slug']
        have = {a if isinstance(a, str) else a.get('slug') for a in ra}
        scored = []
        for od in arts:
            other = od['slug']
            if other == me or other in have:
                continue
            score = 0.0
            if od.get('category') and od.get('category') == d.get('category'):
                score += 4
            if d.get('region') and od.get('region') == d.get('region'):
                score += 3
            a, b = toks[me], toks[other]
            if a and b:
                score += 6 * len(a & b) / len(a | b)
            scored.append((score, other))
        scored.sort(reverse=True)
        picks = [s for sc, s in scored[:LIMIT] if sc > 0]
        if len(picks) < 3:
            picks += [s for s in by_cat[d.get('category')] if s not in picks and s != me][:3 - len(picks)]
        if not picks:
            continue
        d['relatedArticles'] = picks
        changed += 1
        report.append((me, [(s, round(sc, 2)) for sc, s in scored[:LIMIT]]))
        if apply:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write('\n')

    print(('APPLIED' if apply else 'DRY'), '补 relatedArticles 的文章:', changed)
    for r in report[:5]:
        print(' ', r[0], '->', r[1])


if __name__ == '__main__':
    main()
