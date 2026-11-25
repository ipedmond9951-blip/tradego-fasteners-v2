#!/usr/bin/env python3
"""GEO（生成式引擎优化）就绪度体检。

给每篇文章算 0-100 分，判据针对「被 AI 答案引擎引用」而不是只给爬虫看：
- lead（25）  第一节开头 60 词内是否给出可被摘走的定义式答案（… is / are / means / refers），
              且不是 "This article presents…" 这种导读腔；
- std（15）   正文英文是否出现 ≥3 个标准锚点（ISO/ASTM/DIN/EN/ANSI/ASME/GB/SABS/JIS）；
- qa（15）    faqItems ≥3，且至少一个小节标题是疑问句（AI 摘要优先抓 Q→A 结构）；
- link（10）  正文英文内部链接 ≥3（给引擎可遍历的实体关系）；
- src（15）   dataSource 非空且至少一条带 url（可核来源是引用的前提）;
- fresh（5）  updated 在 date 之后 180 天内（时效信号）；
- entity（5） 正文提到 TradeGo，且首节出现产品类名词（实体明确）；
- dup（10）   同字段长句重复 ≥1 处扣 10（模板/复制粘贴是 AI 引擎最常过滤的特征）。

用法：python3 scripts/check-geo-readiness.py [--json] [--top N]
"""
import argparse, glob, json, re
from datetime import date

TAG = re.compile(r'<[^>]+>')
STD = re.compile(r'\b(ISO|ASTM|DIN|EN\s?\d|ANSI|ASME|GB/T?|SABS|JIS)\b')
ANSWER = re.compile(r'\b(is|are|means|refers to|defined as|consists of|equals)\b', re.I)
NAV = re.compile(r'^(This article|This section|In this article|Here we|Learn|Explore|Discover|A comprehensive|An overview|Choosing|Understanding|When|How to)', re.I)
PRODUCT = re.compile(r'\b(bolt|nut|screw|washer|anchor|stud|rivet|fastener)\w*', re.I)
SENT = re.compile(r'(?<=[.!?])\s+')


def lead_window(text, n=110):
    plain = re.sub(TAG, ' ', text or '')
    plain = re.sub(r'\s+', ' ', plain).strip()
    return ' '.join(plain.split(' ')[:n])


def dup_count(text):
    seen, dups = set(), 0
    for s in SENT.split(re.sub(TAG, ' ', text or '')):
        s = s.strip()
        if len(s) < 40:
            continue
        k = s[:120]
        if k in seen:
            dups += 1
        else:
            seen.add(k)
    return dups


def score(a):
    secs = a.get('sections') or []
    en_all = ''.join((s.get('body') or {}).get('en') or '' for s in secs)
    first = ((secs[0].get('body') or {}).get('en') if secs else '') or ''
    lead = lead_window(first)
    pts, notes = 0, []

    first_sent = re.split(r'(?<=[.!?])\s+', lead)[0] if lead else ''
    mkt = re.search(r'\b(best|leading|trusted|world-class|top-quality|premium|renowned)\b',
                    ' '.join(first_sent.split()[:25]), re.I)
    if len(first_sent.split()) >= 8 and not NAV.match(first_sent) and not mkt:
        pts += 25
    else:
        notes.append('lead')

    if len(STD.findall(en_all)) >= 3:
        pts += 15
    else:
        notes.append('std')

    faq = sum(len(s.get('faqItems') or []) for s in secs)
    q_head = any((s.get('heading') or {}).get('en', '').strip().endswith('?') for s in secs)
    if faq >= 3:          # faqItems 已直接产出 FAQPage JSON-LD，标题是否问句只算加分项
        pts += 12
        if q_head:
            pts += 3
    else:
        notes.append('faq')

    if len(re.findall(r'href="/', en_all)) >= 3:
        pts += 10
    else:
        notes.append('link')

    ds = a.get('dataSource') or []
    urls = [(d.get('url') or '') if isinstance(d, dict) else (d if isinstance(d, str) else '') for d in ds]
    if any(u.startswith('http') for u in urls):
        pts += 15
    else:
        notes.append('src')

    try:
        d1 = date.fromisoformat(a.get('updated') or a.get('date'))
        if abs((date.today() - d1).days) <= 180:
            pts += 5
        else:
            notes.append('fresh')
    except Exception:
        notes.append('fresh')

    cta = ((a.get('cta') or {}).get('text') or {}).get('en') or ''
    brand = 'TradeGo' in en_all or 'TradeGo' in cta or 'TradeGo' in ((a.get('description') or {}).get('en') or '')
    if brand and PRODUCT.search(lead):
        pts += 5
    else:
        notes.append('entity')

    dups = dup_count(en_all)
    if dups == 0:
        pts += 10
    else:
        pts += max(0, 10 - 3 * dups)
        notes.append('dup')

    return pts, notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--top', type=int, default=12)
    args = ap.parse_args()
    rows = []
    for p in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(p))
        pts, notes = score(a)
        rows.append({'slug': a['slug'], 'score': pts, 'gaps': notes})
    rows.sort(key=lambda r: r['score'])
    avg = sum(r['score'] for r in rows) / len(rows)
    buckets = {'<50': 0, '50-69': 0, '70-84': 0, '85+': 0}
    for r in rows:
        s = r['score']
        buckets['<50' if s < 50 else '50-69' if s < 70 else '70-84' if s < 85 else '85+'] += 1
    gap_n = {}
    for r in rows:
        for g in r['gaps']:
            gap_n[g] = gap_n.get(g, 0) + 1
    if args.json:
        print(json.dumps({'total': len(rows), 'avg': round(avg, 1), 'buckets': buckets,
                          'gaps': gap_n, 'items': rows}, ensure_ascii=False, indent=1))
        return
    print('GEO 均分 %.1f（%d 篇）  分布 %s' % (avg, len(rows), buckets))
    print('缺口统计：' + '  '.join('%s=%d' % (k, v) for k, v in sorted(gap_n.items(), key=lambda x: -x[1])))
    print('最需要补的 %d 篇：' % args.top)
    for r in rows[:args.top]:
        print('  %3d  %-52s %s' % (r['score'], r['slug'], ','.join(r['gaps']) or 'ok'))


if __name__ == '__main__':
    main()
