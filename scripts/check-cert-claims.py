#!/usr/bin/env python3
"""认证表述体检（高精度版）。

只抓「自称已持有认证」这类高风险句式，不做主题词扫描，避免上千条噪音。
红线允许两种写法：
  A. 按 SABS 1195 / DIN / ISO 生产
  B. 证书按订单要求提供（on request / à la demande / auf Anfrage / по запросу …）

用法：python3 scripts/check-cert-claims.py [--json] [--top N]
"""
import argparse, glob, json, re

PATTERNS = [
    ('EN-self-is', re.compile(
        r'(TradeGo(?:\s?Fasteners)?|we|our (?:company|factory|plant))[^.]{0,60}'
        r'(?:is|are|was|were|has been|have been|holds?|maintains?|operates?[^.]{0,20}under)'
        r'[^.]{0,40}(?:ISO\s?\d+|CE|SABS)[^.]{0,25}(?:certified|certificated|approved|registered|accredited)', re.I)),
    ('EN-adj', re.compile(
        r'(?:ISO\s?\d{4,5}|CE|SABS)[ -]?(?:certified|certificated|approved|accredited)'
        r'[ -](?:supplier|manufacturer|factory|maker|company|producer)', re.I)),
    ('EN-adverb', re.compile(
        r'(?:fully|duly|officially)[ -](?:ISO\s?\d+|CE|SABS)[ -]?(?:certified|approved)', re.I)),
    ('ZH-持有', re.compile(r'(?:已?通过|已?取得|已?获得|持有)[^。；]{0,20}(?:ISO\s?9001|ISO\s?\d{4,5}|CE|SABS)[^。；]{0,12}认证')),
    ('ZH-自称', re.compile(r'(?:我们|本公司|本厂)[^。；]{0,15}(?:是|为)[^。；]{0,10}(?:ISO|CE|SABS)[^。；]{0,10}认证')),
    ('JA-取得', re.compile(r'(?:ISO\s?\d{4,5}|CE|SABS)[^。]{0,15}(?:認証を?取得|認証済み|認証を受け)')),
    ('ES-持有', re.compile(r'(?:estamos|somos|contamos con|disponemos de)[^.]{0,40}(?:ISO|CE|SABS)[^.]{0,25}(?:certificad|acreditad)', re.I)),
    ('FR-持有', re.compile(r'(?:nous sommes|notre (?:usine|entreprise)|nous disposons)[^.]{0,40}(?:ISO|CE|SABS)[^.]{0,25}(?:certifi|accrédit)', re.I)),
    ('DE-持有', re.compile(r'(?:wir sind|unser (?:Werk|Unternehmen)|wir verfügen)[^.]{0,40}(?:ISO|CE|SABS)[^.]{0,25}(?:zertifiziert|akkreditiert)', re.I)),
    ('RU-持有', re.compile(r'(?:мы|наш завод|наша компания)[^.]{0,40}(?:ISO|CE|SABS)[^.]{0,25}(?:сертифицирован|аккредитован)', re.I)),
    ('AR-持有', re.compile(r'(?:نحن|مصنعنا|شركتنا)[^.]{0,40}(?:ISO|CE|SABS)[^.]{0,25}(?:معتمد|حاصل)', re.I)),
]
ALLOW = re.compile(
    r'(on request|as required|per order|按订单|依订单|按订单要求|à la demande|sur demande|'
    r'auf Anfrage|por pedido|a pedido|по запросу|по заказу|عند الطلب|依頼|オンデマンド|'
    r'aligned|aligned procedures|按\s?(?:SABS|DIN|ISO)[^。]{0,8}生产|合规生产)', re.I)
SENT = re.compile(r'(?<=[.!?。！？؛])\s?')
TAG = re.compile(r'<[^>]+>')


def scan_text(txt):
    hits = []
    for s in SENT.split(TAG.sub(' ', txt)):
        s = s.strip()
        if not s or ALLOW.search(s):
            continue
        for name, pat in PATTERNS:
            if pat.search(s):
                hits.append((name, s[:200]))
                break
    return hits


def walk_strings(node, out):
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, list):
        for x in node:
            walk_strings(x, out)
    elif isinstance(node, dict):
        for v in node.values():
            walk_strings(v, out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--top', type=int, default=20)
    args = ap.parse_args()
    rows = []
    for p in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(p, encoding='utf-8'))
        strs = [json.dumps({k: a[k] for k in ('title', 'description', 'metaDescription', 'cta') if k in a}, ensure_ascii=False)]
        walk_strings(a.get('sections') or [], strs)
        hits = [h for s in strs for h in scan_text(s)]
        if hits:
            rows.append({'slug': a['slug'], 'count': len(hits), 'items': hits})
    for p in ['public/llms.txt'] + glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True):
        try:
            txt = open(p, encoding='utf-8').read()
        except Exception:
            continue
        hits = scan_text(txt)
        if hits:
            rows.append({'slug': p, 'count': len(hits), 'items': hits})
    rows.sort(key=lambda r: -r['count'])
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
        return
    print('待复核 %d 处，涉及 %d 个文件' % (sum(r['count'] for r in rows), len(rows)))
    for r in rows[:args.top]:
        print('  %-52s %d' % (r['slug'], r['count']))
        for name, it in r['items'][:2]:
            print('      [%s] %s' % (name, it[:150]))


if __name__ == '__main__':
    main()
