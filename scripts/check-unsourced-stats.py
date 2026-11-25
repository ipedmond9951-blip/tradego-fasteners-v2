#!/usr/bin/env python3
"""查「没出处的数字」：百分比、市场体量、产能、项目金额。

AI 答案引擎不会引用一句没有来源的数字，搜索引擎也会把它当低质信号；更重要的是
写错一个百分比比不写更伤信任。判据：
  - 命中统计型数字（x% / x 亿 / x billion / x 万吨 / x 套）
  - 同句或前一句里没有来源线索（according to / 据…统计 / per / ISO / 标准号 /
    World Bank / AfDB / 报告名）
  - 不是标准限值（MPa / HV / µm / mm / TPI / °C 这类工程参数不算统计数字）
默认只报告，不改内容。

用法：python3 scripts/check-unsourced-stats.py [--json] [--top N] [--locale en|zh]
"""
import argparse, glob, json, re

TAG = re.compile(r'<[^>]+>')
STAT = re.compile(
    r'(\d[\d,.]*\s?%|\d[\d,.]*\s?(?:billion|million|trillion)\b|\d[\d,.]*\s?(?:万|亿)(?:吨|套|件|美元|元)?|\d[\d,.]*\s?(?:tonnes|tons|units|containers)\b)',
    re.I)
SOURCE = re.compile(
    r'(according to|per\s|reported by|data from|source:|据|统计|报告|世界银行|World Bank|AfDB|African Development|IMF|ISO\s?\d|DIN\s?\d|ASTM|EN\s?\d|JIS|GB/T?)',
    re.I)
CTX = re.compile(r'(MPa|HV|µm|um\b|mm\b|TPI|°C|HRC|kN|Nm|N·m|grade|class|property class)', re.I)
SENT = re.compile(r'(?<=[.!?。！？])\s?')


def field_text(v):
    return v if isinstance(v, str) else ''


def audit(path, locale):
    d = json.load(open(path))
    hits, total = [], 0
    for si, s in enumerate(d.get('sections') or []):
        body = field_text((s.get('body') or {}).get(locale))
        if not body:
            continue
        plain = TAG.sub(' ', body)
        sents = SENT.split(plain)
        for i, sent in enumerate(sents):
            sent = sent.strip()
            if not sent:
                continue
            for m in STAT.finditer(sent):
                # 工程参数语境（标准限值/尺寸）不算统计数字
                if CTX.search(sent):
                    continue
                total += 1
                ctx = sent + ' ' + (sents[i - 1] if i else '')
                if not SOURCE.search(ctx):
                    hits.append({'section': si, 'stat': m.group(0).strip(), 'sentence': sent[:160]})
    ds = d.get('dataSource') or []
    has_src = bool(ds)
    return {'slug': d['slug'], 'stats': total, 'unsourced': len(hits), 'hasDataSource': has_src, 'items': hits}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--top', type=int, default=15)
    ap.add_argument('--locale', default='en')
    args = ap.parse_args()
    rows = []
    for p in sorted(glob.glob('content/articles/*.json')):
        r = audit(p, args.locale)
        if r['stats']:
            rows.append(r)
    rows.sort(key=lambda r: -r['unsourced'])
    tot_u = sum(r['unsourced'] for r in rows)
    tot_s = sum(r['stats'] for r in rows)
    art_u = sum(1 for r in rows if r['unsourced'])
    if args.json:
        print(json.dumps({'locale': args.locale, 'articles': len(rows), 'stats': tot_s,
                          'unsourced': tot_u, 'articles_with_unsourced': art_u, 'items': rows},
                         ensure_ascii=False, indent=1))
        return
    print('%s：%d 篇有统计数字，共 %d 处；其中 %d 处无来源（涉及 %d 篇）'
          % (args.locale, len(rows), tot_s, tot_u, art_u))
    for r in rows[:args.top]:
        print('  %3d 处无源 / %3d 处   %s' % (r['unsourced'], r['stats'], r['slug']))
        for it in r['items'][:1]:
            print('        ', it['stat'], '|', it['sentence'][:110])


if __name__ == '__main__':
    main()
