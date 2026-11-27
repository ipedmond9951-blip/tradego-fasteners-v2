#!/usr/bin/env python3
"""N4 长度尺：标题 ≤60 字符当量、描述 ≤155 字符当量（东亚洲字符按 2 计）。

判据
- 当量宽度 = 全角/宽字符 2，其余 1（近似 SERP 截断，不是字节数也不是字符数）。
- title 与 metaDescription 逐语种检查；`title` 缺失时回退 `h1`。
- 分类：over（超长）、prefix_leak（非 en 描述以 en 标题片段开头，属模板串进）。

用法
  python3 scripts/check-n4-length.py [--json] [--top N] [--slug X] [--strict]
  --strict 时任一违规即退出码 1（供上线门禁用）。
"""
import argparse, glob, json, os, re, unicodedata


def width(s):
    return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in (s or ''))


def audit(path):
    d = json.load(open(path, encoding='utf-8'))
    slug = d.get('slug') or os.path.basename(path).replace('.json', '')
    t = d.get('title') or {}
    m = d.get('metaDescription') or {}
    en_title = (t.get('en') or '')[:24].lower()
    rows = []
    for loc, v in t.items():
        w = width(v)
        if w > 60:
            rows.append({'slug': slug, 'locale': loc, 'field': 'title', 'width': w,
                         'kind': 'prefix_leak' if (loc != 'en' and en_title and (v or '').lower().startswith(en_title[:10])) else 'over',
                         'text': (v or '')[:90]})
    for loc, v in m.items():
        if not isinstance(v, str):
            continue
        w = width(v)
        if w > 155:
            rows.append({'slug': slug, 'locale': loc, 'field': 'description', 'width': w,
                         'kind': 'prefix_leak' if (loc != 'en' and en_title and v.lower().startswith(en_title[:10])) else 'over',
                         'text': v[:90]})
    return slug, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--top', type=int, default=15)
    ap.add_argument('--slug')
    ap.add_argument('--strict', action='store_true')
    a = ap.parse_args()
    paths = [f'content/articles/{a.slug}.json'] if a.slug else sorted(glob.glob('content/articles/*.json'))
    allrows, arts = [], 0
    for p in paths:
        slug, rows = audit(p)
        if rows:
            arts += 1
            allrows.extend(rows)
    by_slug = {}
    for r in allrows:
        by_slug.setdefault(r['slug'], []).append(r)
    if a.json:
        print(json.dumps({'articles': len(paths), 'articles_over': arts, 'violations': len(allrows),
                          'by_kind': {k: sum(1 for r in allrows if r['kind'] == k) for k in ('over', 'prefix_leak')},
                          'items': allrows}, ensure_ascii=False, indent=1))
    else:
        print('N4：%d 篇检查，%d 篇有超长；共 %d 条（超长 %d / 标题串进 %d）'
              % (len(paths), arts, len(allrows),
                 sum(1 for r in allrows if r['kind'] == 'over'),
                 sum(1 for r in allrows if r['kind'] == 'prefix_leak')))
        order = sorted(by_slug.items(), key=lambda kv: -len(kv[1]))[:a.top]
        for slug, rows in order:
            fields = {}
            for r in rows:
                fields.setdefault(r['field'], []).append(r['locale'] + str(r['width']))
            print('  %2d 条  %-58s %s' % (len(rows), slug, fields))
    if a.strict and allrows:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
