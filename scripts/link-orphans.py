#!/usr/bin/env python3
"""给孤儿文章补入站内链：把孤儿挂进同类别相关文章的 relatedArticles。

孤儿定义：全库没有任何一篇的 relatedArticles 指向它（爬虫只能靠 sitemap 找到）。
做法：同 category 优先、关键词重叠打分，选前 2 个候选宿主追加一条 {"slug","title"}；
宿主 relatedArticles 已有该篇、已满 6 条、或文件当前有未提交改动则跳过（fail-closed）。

用法：python3 scripts/link-orphans.py [--apply] [--top N]
"""
import argparse, glob, json, re, subprocess, collections

CAP = 6


def entries(a):
    return [r['slug'] if isinstance(r, dict) else r for r in (a.get('relatedArticles') or [])]


PRODUCT = {'screws', 'screw', 'bolts', 'bolt', 'nuts', 'nut', 'washers', 'washer', 'anchors', 'anchor',
           'rivets', 'rivet', 'nails', 'nail', 'rods', 'rod', 'threaded', 'tapping', 'sleeve', 'drop',
           'expansion', 'plastic', 'coating', 'membrane', 'tape', 'fabric', 'wire', 'nail', 'pins',
           'dowels', 'set', 'timber', 'roofing', 'drywall', 'chipboard', 'coach', 'binding', 'butyl'}
STOP = {'fastener', 'fasteners', 'guide', 'buying', 'guide:', 'sourcing', 'supplier', 'suppliers',
        'africa', 'china', 'market', 'wholesale', 'procurement', 'quality', 'specification',
        '完整', '指南'}


def toks(a):
    t = ' '.join([(a.get('title') or {}).get('en') or '',
                  a.get('keywords') if isinstance(a.get('keywords'), str) else ' '.join(a.get('keywords') or [])])
    return {w for w in re.findall(r'[a-z]{4,}', t.lower())} - STOP


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--top', type=int, default=10)
    ap.add_argument('--verbose', action='store_true')
    args = ap.parse_args()
    files = {p: json.load(open(p, encoding='utf-8')) for p in sorted(glob.glob('content/articles/*.json'))}
    by_slug = {a['slug']: (p, a) for p, a in files.items()}
    out = subprocess.run(['git', 'status', '--porcelain', '--', 'content/articles'], capture_output=True, text=True).stdout
    dirty = {l[3:].strip() for l in out.splitlines() if l.strip()}

    inbound = collections.Counter()
    for p, a in files.items():
        for t in entries(a):
            if t != a['slug']:
                inbound[t] += 1
    orphans = [s for s in by_slug if inbound[s] == 0]

    added, skipped, touched = 0, [], {}
    for slug in orphans:
        p_o, o = by_slug[slug]
        cat = o.get('category')
        ot = toks(o)
        cands = []
        for s2, (p2, a2) in by_slug.items():
            if s2 == slug or entry_ok(a2, slug) is False:
                continue
            if s2 in entries(a2):
                continue
            shared = ot & toks(a2)
            # 必须有共同的产品名词（不能只靠 construction / buyers / lead 这类泛词）
            if not (shared & PRODUCT):
                continue
            overlap = len(shared)
            if overlap < 2:
                continue
            score = overlap
            if a2.get('category') == cat:
                score += 1
            if (a2.get('region') or '') == (o.get('region') or ''):
                score += 1
            cands.append((score, s2))
        cands.sort(reverse=True)
        got = 0
        for score, host in cands:
            if score <= 1:
                break
            p_h, h = by_slug[host]
            if p_h in dirty:
                continue
            if len(entries(h)) >= CAP:
                continue
            title = (o.get('title') or {}).get('en') or slug
            h.setdefault('relatedArticles', []).append({'slug': slug, 'title': title[:70]})
            touched[p_h] = h
            got += 1
            added += 1
            if got >= 2:
                break
        if not got:
            skipped.append(slug)

    print('孤儿 %d 篇；可补入站内链 %d 条，涉及宿主 %d 篇；未能补 %d 篇' % (len(orphans), added, len(touched), len(skipped)))
    for p, h in list(touched.items())[:args.top]:
        print('  host %-46s now %d' % (p.split('/')[-1][:-5], len(entries(h))))
    if args.verbose:
        for p, h in touched.items():
            rs = [r['slug'] for r in (h.get('relatedArticles') or []) if isinstance(r, dict)]
            print('  %s ← %s' % (p.split('/')[-1][:-5], rs[-1]))
    if not args.apply:
        print('DRY-RUN（加 --apply 落盘）')
        return
    for p, h in touched.items():
        json.dump(h, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('已落盘 %d 篇宿主' % len(touched))
    open('/tmp/orphan-hosts.txt', 'w').write('\n'.join(touched) + '\n')


def entry_ok(a, slug):
    return True


if __name__ == '__main__':
    main()
