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
# 运营事实：航线/清关时效与整柜载重属可现场核对的作业量，不是市场统计（见 CONTENT-CONTRACT 254/260）
OPS = re.compile(r'(\b\d+[-–]\d+\s?(days|hours)\b|\btransit\b|\bteu\b|\b\d+\s?(tonnes|tons)\s?(net|gross|per container)?|24 tonnes)', re.I)
# 法定项：关税/增值税/附加税/保险费率由税则与税法直接规定，正文只要锚定到法规即可（见 260）
STATUTE_RATE = re.compile(r'^(\d+(\.\d+)?%|\d+(\.\d+)?\s?%|110%|100%)$')
STATUTE_ANCHOR = re.compile(
    r'(tariff notice|customs (and excise )?(tariff|act)|value added tax act|c[oó]digo do iva|pauta aduaneira|'
    r'finance act|statutory instrument|GRA|ICUMS|ZIMRA|ZIDA|HS\s?\d{4}|chapter \d+|act \d{3,4})', re.I)
SENT = re.compile(r'(?<=[.!?。！？])\s?')


def field_text(v):
    return v if isinstance(v, str) else ''


def audit(path, locale):
    d = json.load(open(path))
    hits, total, ops, stat_ok, para_ok = [], 0, 0, 0, 0
    for si, s in enumerate(d.get('sections') or []):
        body = field_text((s.get('body') or {}).get(locale))
        if not body:
            continue
        sec_anchor = bool(STATUTE_ANCHOR.search(TAG.sub(' ', body)))
        # 段落级归属：同一段里出现过来源线索，整段数字视为有归属（表格式引用不逐句重复）
        paras = [p for p in re.split(r'(?<=</p>)', body) if p.strip()]
        for pi, para in enumerate(paras):
            para_plain = TAG.sub(' ', para)
            para_has_src = bool(SOURCE.search(para_plain))
            sents = SENT.split(para_plain)
            for i, sent in enumerate(sents):
                sent = sent.strip()
                if not sent:
                    continue
                for m in STAT.finditer(sent):
                    if CTX.search(sent):
                        continue
                    total += 1
                    tok = m.group(0).strip()
                    if OPS.search(sent):
                        ops += 1
                        continue
                    ctx = sent + ' ' + (sents[i - 1] if i else '')
                    if SOURCE.search(ctx) or para_has_src:
                        if para_has_src and not SOURCE.search(ctx):
                            para_ok += 1
                        continue
                    if sec_anchor and STATUTE_RATE.match(tok.replace(' ', '')):
                        stat_ok += 1
                        continue
                    hits.append({'section': si, 'stat': tok, 'sentence': sent[:160]})
    ds = d.get('dataSource') or []
    has_src = bool(ds)
    return {'slug': d['slug'], 'stats': total, 'unsourced': len(hits), 'ops': ops,
            'statutory': stat_ok, 'para_sourced': para_ok, 'hasDataSource': has_src, 'items': hits}


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
    print('%s：%d 篇有统计数字，共 %d 处；无来源 %d 处（涉及 %d 篇）；'
          '运作事实 %d 处、法定费率 %d 处、段落已归属 %d 处另计'
          % (args.locale, len(rows), tot_s, tot_u, art_u,
             sum(r.get('ops', 0) for r in rows), sum(r.get('statutory', 0) for r in rows),
             sum(r.get('para_sourced', 0) for r in rows)))
    for r in rows[:args.top]:
        print('  %3d 处无源 / %3d 处   %s' % (r['unsourced'], r['stats'], r['slug']))
        for it in r['items'][:1]:
            print('        ', it['stat'], '|', it['sentence'][:110])


if __name__ == '__main__':
    main()
