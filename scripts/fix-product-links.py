#!/usr/bin/env python3
"""把正文里"相关资源"产品链接的英文锚文本换成本地语已有译名。

译名不是机器翻译，而是从全站同语种已本地化的锚文本里取多数值（数据自洽）。
默认只报告，--apply 落盘。改动只碰 <a> 的文字节点，href/class 原样保留。
"""
import glob, json, re, sys, collections

PAT = re.compile(r'(<a href="/en/products/([^"]+)"[^>]*>)([^<]+)(</a>)')
CANON = {'stainless-bolts': 'stainless steel fasteners', 'anchor-bolts': 'anchor bolts',
         'high-tensile-bolts': 'high-tensile bolts', 'hex-bolts': 'hex bolts',
         'lock-nuts': 'lock nuts', 'washers': 'washers',
         'self-drilling-screws': 'self-drilling screws', 'socket-screws': 'socket screws'}


def localized(prod, label):
    """锚文本是否已是本地译名：非英文原文即可（拉丁语种同样要换）。"""
    return label.strip().lower() != CANON.get(prod, '\x00')


def collect():
    votes = collections.defaultdict(collections.Counter)
    for p in glob.glob('content/articles/*.json'):
        d = json.load(open(p))
        secs = d.get('sections', [])
        for s in secs:
            for lg, v in (s.get('body') or {}).items():
                if lg == 'en' or not isinstance(v, str):
                    continue
                for m in PAT.finditer(v):
                    prod, label = m.group(2), m.group(3).strip()
                    if localized(prod, label):
                        votes[(lg, prod)][label] += 1
    return {k: c.most_common(1)[0][0] for k, c in votes.items() if c.total() >= 3}


def main():
    apply = '--apply' in sys.argv
    table = collect()
    per_locale = collections.Counter()
    per_prod = collections.Counter()
    touched = 0
    for p in sorted(glob.glob('content/articles/*.json')):
        d = json.load(open(p))
        changed = False
        for s in d.get('sections', []):
            for lg, v in (s.get('body') or {}).items():
                if lg == 'en' or not isinstance(v, str):
                    continue
                def sub(m):
                    nonlocal changed, touched
                    prod, label = m.group(2), m.group(3).strip()
                    if localized(prod, label):
                        return m.group(0)
                    new = table.get((lg, prod))
                    if not new:
                        return m.group(0)
                    changed = True
                    touched += 1
                    per_locale[lg] += 1
                    per_prod[prod] += 1
                    return m.group(1) + new + m.group(4)
                nv = PAT.sub(sub, v)
                if nv != v:
                    s['body'][lg] = nv
        if changed and apply:
            json.dump(d, open(p, 'w'), ensure_ascii=False, indent=2)
            open(p, 'a').write('\n')
    print(f"{'已替换' if apply else '待替换'} {touched} 处，覆盖语种 {dict(per_locale)}")
    print("产品分布:", dict(per_prod))


if __name__ == '__main__':
    main()
