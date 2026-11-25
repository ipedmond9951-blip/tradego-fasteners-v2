#!/usr/bin/env python3
"""金额类断言体检（只读，退出码恒 0）。
背景：docs/CONTENT-CONTRACT.md 第 15/24 条要求「没有可核来源的金额一律换成结构性描述」。
本脚本把正文里出现的金额分两档：
  - high：所在小节 / 段落标题带价格语义（price / price list / quote / 价格 / 报价 / 价目）
  - low ：其余（运费示例、关税税率举例等，仍需人工判断）
用法：python3 scripts/check-money-claims.py [--json] [--top N]
"""
import json, glob, re, sys

MONEY = re.compile(r'(?:USD\s?[\d,.]+|\$[\d,.]+|€\s?[\d,.]+|[\d,.]+\s?(?:万\s?)?(?:USD|EUR|RMB|CNY|MAD|美元|美金|兰特|奈拉|卢比|港元)|[\d,.]+\s?元)')
PRICE_CTX = re.compile(r'(price|quote|quotation|cost per|per ton|per tonne|per kg|价格|报价|价目|单价|每吨|每公斤)', re.I)


def iterate(paths):
    for path in paths:
        a = json.load(open(path))
        for s in a.get('sections', []):
            heading = s.get('heading') or {}
            for key in ('heading', 'body'):
                d = s.get(key)
                if not isinstance(d, dict):
                    continue
                for lang, text in d.items():
                    if isinstance(text, str):
                        yield path, s.get('id'), key, lang, text, ' '.join(
                            v for v in heading.values() if isinstance(v, str))


def main():
    as_json = '--json' in sys.argv
    top = 10
    if '--top' in sys.argv:
        top = int(sys.argv[sys.argv.index('--top') + 1])
    stats = {}
    total = 0
    high = 0
    for path, sid, key, lang, text, headtext in iterate(sorted(glob.glob('content/articles/*.json'))):
        hits = MONEY.findall(text)
        if not hits:
            continue
        is_price = bool(PRICE_CTX.search(headtext) or PRICE_CTX.search(sid or ''))
        e = stats.setdefault(path.split('/')[-1], {'money': 0, 'high': 0})
        e['money'] += len(hits)
        total += len(hits)
        if is_price:
            e['high'] += len(hits)
            high += len(hits)
    ranked = sorted(stats.items(), key=lambda x: (-x[1]['high'], -x[1]['money']))
    if as_json:
        print(json.dumps({'total': total, 'high': high, 'articles': len(stats),
                          'top': [{'file': k, **v} for k, v in ranked[:top]]}, ensure_ascii=False))
        return
    print('金额断言：%d 处 / %d 篇，其中价格语义上下文 %d 处' % (total, len(stats), high))
    for k, v in ranked[:top]:
        print('  %-58s 金额 %3d  价格语义 %3d' % (k, v['money'], v['high']))


if __name__ == '__main__':
    main()
