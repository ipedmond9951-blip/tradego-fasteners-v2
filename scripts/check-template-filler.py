#!/usr/bin/env python3
"""模板填充物检测：找出「英文正文是机器模板」的文章。

判据（任一命中即计一分，按小节的最高分累加）：
- FINGERPRINT：命中已知模板句（案例段「A project in the fastener industry encountered…」、
  「Standards-based procurement requires continuous learning…」、「The comparison methodology above
  uses typical ranges…」、「This procurement framework applies to fastener sourcing for construction…」等）；
- DUPLICATE：同一字段内有一模一样的长句/长段重复出现（≥40 字），模板生成器常见的症状；
- PLACEHOLDER：出现未替换的占位符（`{{…}}`、`TODO`、`lorem ipsum`、`fastener industry` 这类泛称连用）。

输出每篇的 filler 比例（命中节 / 正文节）。≥50% 视为「模板文」，不应再排队翻译，
应先重写或摘索引。
用法：python3 scripts/check-template-filler.py [--json] [--top N] [--threshold 0.5]
"""
import argparse, glob, json, re

FINGERPRINT = [
    'A project in the fastener industry encountered',
    'Standards-based procurement requires continuous learning',
    'The comparison methodology above uses typical ranges',
    'This procurement framework applies to fastener sourcing for construction',
    'Always require original mill test certificates, ISO 9001 certification, and pre-shipment samples',
    'The verification checklist applies to both initial supplier qualification',
    'This article presents five real-world case studies documented between 2018 and 2024',
    'For B2B buyers, understanding failure modes helps procurement teams write more effective specifications',
]
PLACEHOLDER = re.compile(r'{{|}}\b|TODO|lorem ipsum', re.I)
SENT = re.compile(r'(?<=[.!?])\s+')


def dup_sentences(text):
    plain = re.sub('<[^>]+>', ' ', text)
    seen, dups = set(), 0
    for s in SENT.split(plain):
        s = s.strip()
        if len(s) < 40:
            continue
        key = s[:120]
        if key in seen:
            dups += 1
        else:
            seen.add(key)
    return dups


def score(text):
    plain = re.sub('<[^>]+>', '', text)
    if len(plain) < 60:
        return 0.0
    pts = 0
    if any(f in text for f in FINGERPRINT):
        pts += 1
    if dup_sentences(text) >= 1:
        pts += 1
    if PLACEHOLDER.search(text):
        pts += 1
    return min(pts / 3.0, 1.0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--top', type=int, default=10)
    ap.add_argument('--threshold', type=float, default=0.5)
    args = ap.parse_args()

    rows = []
    for p in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(p))
        filled = total = 0
        for s in a.get('sections', []):
            b = s.get('body')
            if not isinstance(b, dict):
                continue
            en = b.get('en') or ''
            if len(re.sub('<[^>]+>', '', en)) < 60:
                continue
            total += 1
            if score(en) >= 0.34:
                filled += 1
        if total:
            rows.append({'slug': a['slug'], 'filler': filled, 'sections': total,
                         'ratio': round(filled / total, 3)})

    rows.sort(key=lambda r: (-r['ratio'], -r['filler']))
    bad = [r for r in rows if r['ratio'] >= args.threshold]
    if args.json:
        print(json.dumps({'total': len(rows), 'templated': len(bad),
                          'sections_hit': sum(r['filler'] for r in rows),
                          'threshold': args.threshold, 'items': rows}, ensure_ascii=False, indent=1))
        return
    print('模板文：%d / %d 篇（阈值 %.0f%%），命中小节 %d 个'
          % (len(bad), len(rows), args.threshold * 100, sum(r['filler'] for r in bad)))
    for r in bad[:args.top]:
        print('  %3.0f%%  %d/%d  %s' % (r['ratio'] * 100, r['filler'], r['sections'], r['slug']))


if __name__ == '__main__':
    main()
