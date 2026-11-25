#!/usr/bin/env python3
"""GEO 批量加固：正文内链 + 可核来源。

两条动作都只做「已有事实的挂接」，不新增任何断言：

1. **内链**：把正文里第一次出现的真实产品名（anchor bolts / washers …）包成
   站内产品链接 `/en/products/<slug>`，最多 3 个/篇。只在纯文本节点里替换，
   已经在 <a> 里的、标题里的都不碰。产品 slug 只取 `src/lib/products.ts`
   里真实存在的，`relatedProducts` 里不存在的 slug 一律跳过。
2. **来源**：`dataSource` 缺失或缺 url 时，从仓库其它文章已核过的来源池里挑，
   只有「来源名里的标准号/关键词」在本篇正文出现过才挂（fail-closed，凑不满就跳过）。

用法：python3 scripts/geo-enrich.py [--apply] [--slug S]
"""
import argparse, glob, json, os, re

TAG = re.compile(r'<[^>]+>')
PRODUCTS_TS = 'src/lib/products.ts'
ANCH = re.compile(r'(<a\s[^>]*>.*?</a>)', re.I | re.S)
STD_TOKEN = re.compile(r'(ISO\s?\d+[-\d]*|ASTM\s?[A-Z]\d+[-\d]*|DIN\s?\d+[-\d]*|EN\s?\d+[-\d]*|GB/T?\s?\d+[-\d]*|JIS\s?[A-Z]\s?\d+)')


def product_slugs():
    if not os.path.exists(PRODUCTS_TS):
        return []
    return re.findall(r"slug: ['\"]([^'\"]+)", open(PRODUCTS_TS).read())


def source_pool():
    pool = {}
    for p in glob.glob('content/articles/*.json'):
        ds = json.load(open(p)).get('dataSource') or []
        for d in ds:
            if isinstance(d, str) and d.startswith('http'):
                pool.setdefault(d, None)
            elif isinstance(d, dict) and (d.get('url') or '').startswith('http'):
                pool[d['url']] = {'name': d.get('name') or d['url'], 'url': d['url']}
    return pool


def link_products(text, slugs, limit=3):
    """在纯文本节点里给产品名加内链，返回 (新文本, 加了几处, 用了哪些slug)。"""
    used = []
    for slug in slugs:
        if slug in used or len(used) >= limit:
            continue
        label = slug.replace('-', ' ')
        pat = re.compile(r'(?<![A-Za-z-])' + re.escape(label) + r'(?![A-Za-z-])', re.I)
        parts = ANCH.split(text)
        done = False
        for i in range(0, len(parts), 2):          # 偶数位是纯文本节点
            m = pat.search(parts[i])
            if m and 'href="' not in parts[i]:
                parts[i] = parts[i][:m.start()] + '<a href="/en/products/%s">%s</a>' % (slug, m.group(0)) + parts[i][m.end():]
                done = True
                break
        if done:
            text = ''.join(parts)
            used.append(slug)
    return text, len(used), used


def fill_sources(a, pool):
    text = ' '.join(''.join((s.get('body') or {}).get(l) or '' for s in a['sections'])
                    for l in ('en', 'zh'))
    toks = set(t.upper().replace('  ', ' ') for t in STD_TOKEN.findall(TAG.sub(' ', text)))
    old = a.get('dataSource') or []
    have = [(d.get('url') or '') if isinstance(d, dict) else d for d in old]
    if any(u.startswith('http') for u in have if isinstance(u, str)) and old:
        return old, []
    picked = []
    for url, meta in pool.items():
        name = TAG.sub('', (meta or {}).get('name') or '')
        its = set(t.upper().replace('  ', ' ') for t in STD_TOKEN.findall(name))
        if its and its & toks:
            picked.append({'name': (meta or {}).get('name') or url, 'url': url})
        if len(picked) >= 3:
            break
    return (picked or old), picked


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--slug')
    args = ap.parse_args()
    slugs_ok = product_slugs()
    pool = source_pool()
    files = [f'content/articles/{args.slug}.json'] if args.slug else sorted(glob.glob('content/articles/*.json'))
    n_link = n_src = n_skip = 0
    for p in files:
        a = json.load(open(p))
        changed = False
        # 1) 内链
        en = ''.join((s.get('body') or {}).get('en') or '' for s in a['sections'])
        if len(re.findall(r'href="/', en)) < 3:
            rp = a.get('relatedProducts') or []
            rp = [x.get('slug') if isinstance(x, dict) else x for x in rp]
            wanted = [r for r in rp if isinstance(r, str) and r in slugs_ok]
            used_global = set()
            for sec in a['sections']:
                if len(re.findall(r'href="/', ''.join((s.get('body') or {}).get('en') or '' for s in a['sections']))) >= 3:
                    break
                body = sec.get('body') or {}
                if not body.get('en'):
                    continue
                cand = [w for w in wanted if w not in used_global]
                body_txt = ANCH.sub('', body['en'])
                cand += [w for w in slugs_ok if w not in used_global and w not in cand
                         and re.search(r'(?<![A-Za-z-])' + re.escape(w.replace('-', ' ')) + r'(?![A-Za-z-])', body_txt, re.I)][:2]
                new, n, used = link_products(body['en'], cand)
                if n:
                    body['en'] = new
                    used_global.update(used)
                    changed = True
                    n_link += n
        # 2) 来源
        old = a.get('dataSource') or []
        have_url = any(((d.get('url') or '') if isinstance(d, dict) else d).startswith('http')
                       for d in old if isinstance(d, (dict, str)))
        if not have_url:
            src, picked = fill_sources(a, pool)
            if picked:
                a['dataSource'] = src
                changed = True
                n_src += len(picked)
        if changed:
            a['updated'] = '2026-11-25'
            if args.apply:
                json.dump(a, open(p, 'w'), ensure_ascii=False, indent=2)
                open(p, 'a').write('\n')
        else:
            n_skip += 1
    print('%s：内链 +%d 处，来源 +%d 条，跳过 %d 篇' %
          ('已落盘' if args.apply else 'DRY-RUN', n_link, n_src, n_skip))


if __name__ == '__main__':
    main()
