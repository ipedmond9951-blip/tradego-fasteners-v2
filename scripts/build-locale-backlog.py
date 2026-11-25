#!/usr/bin/env python3
"""生成本地语正文扩写队列：按覆盖度从低到高排，覆盖度 = 本地正文长度 / 英文同节长度。

输出 content/locale-backlog.json：
  {"generated": "...", "total": n, "items": [{"slug","lang","coverage","sections","missing"}]}
missing = 需要扩写的小节序号（该节本地正文 < 英文 55%）。
"""
import glob
import json
import re
from datetime import datetime, timezone, timedelta

TAG = re.compile(r'<[^>]+>')
FACTOR = {'zh': 2, 'ja': 1.6}


def plain(s):
    return len(re.sub(r'\s+', '', TAG.sub('', s or '')))


def main():
    items = []
    for p in sorted(glob.glob('content/articles/*.json')):
        d = json.load(open(p))
        slug = p.split('/')[-1][:-5]
        total = {}
        passed = {}
        missing = {}
        for i, sec in enumerate(d.get('sections', [])):
            body = sec.get('body') or {}
            e = plain(body.get('en'))
            if e < 100:
                continue
            for lg, v in body.items():
                if lg == 'en' or not isinstance(v, str):
                    continue
                total[lg] = total.get(lg, 0) + 1
                if plain(v) * FACTOR.get(lg, 1) >= e * 0.5:
                    passed[lg] = passed.get(lg, 0) + 1
                else:
                    missing.setdefault(lg, []).append(i)
        for lg in total:
            cov = passed.get(lg, 0) / total[lg]
            if cov < 0.8:
                items.append({'slug': slug, 'lang': lg, 'coverage': round(cov, 2),
                              'sections': len(d.get('sections', [])), 'missing': missing.get(lg, [])})
    items.sort(key=lambda x: (x['coverage'], -len(x['missing'])))
    out = {'generated': datetime.now(timezone(timedelta(hours=8))).isoformat(timespec='seconds'),
           'total': len(items), 'items': items}
    json.dump(out, open('content/locale-backlog.json', 'w'), ensure_ascii=False, indent=1)
    print(f'队列 {len(items)} 条，最短覆盖 {items[0]["coverage"] if items else 0}')


if __name__ == '__main__':
    main()
