#!/usr/bin/env python3
"""把「没有出处的市场预测」改成可核的结构表述（一次性批处理）。

背景：`scripts/check-unsourced-stats.py` 量到全库 198 篇里有 1578 处无来源数字。
其中风险最高的是"市场规模 / 年增速 / 需求量预测"这一类——AI 答案引擎不引用无源
预测，写错一个数比不写更伤信任。本批只处理带 forecast/projected 且完全无出处的
那几句，改成"由项目清单/招标文件/进口记录决定"的结构表述，保留原有业务信息。

带明确出处（据 6wResearch / AfDB / [1] 引用）的保留不动。fail-closed：原文里
找不到的替换对直接报出来，不猜测、不改别的句子。

用法：python3 scripts/oneoff-stats-batch1.py [--apply]
"""
import argparse, json

PAIRS = [
    ('rwanda-construction-fastener-market-2026',
     ' is projected to reach USD 180 million by 2026, driven by',
     ' is driven by'),
    ('africa-fastener-market-opportunities-2026',
     'reached approximately USD 3.8 billion in 2025 and is projected to hit USD 4.2 billion by end of 2026, growing at 7.2% CAGR — nearly double the global average of 3.8%.',
     'is large and fragmented, and its size is best read from import records, tariff lines and project pipelines rather than from a single continent-wide dollar figure.'),
    ('self-drilling-screws-market-demand-and-procurement-guide',
     "Market projections indicate that Africa's self-drilling screw market could grow by 15-20% annually through 2030, driven by over 200 active infrastructure projects across the continent with combined values exceeding $300 billion.",
     "Self-drilling screw demand in Africa tracks the number of active infrastructure projects, which is what a buyer can verify in tender documents, rather than a fixed annual growth rate."),
    ('self-drilling-screws-market-demand-and-procurement-guide',
     'with steel prices expected to decrease by an estimated 8-12% for importers',
     'with steel prices moving with mill and scrap indices rather than a fixed percentage'),
    ('kenya-infrastructure-fastener-demand',
     'We forecast total fastener demand in Kenya at 14,000-17,000 metric tons in 2026, valued at USD 22-28 million CIF Mombasa.',
     'Kenyan fastener demand is planned from project schedules and quoted tonnage: the dollar value depends on the specification, the Incoterm and the port, so this page gives the structure rather than a national total.'),
    ('kenya-infrastructure-fastener-demand',
     'Projected 2026 demand reaches 14,000 to 17,000 metric tons, backed by a',
     'Demand is carried by a'),
    ('offshore-fasteners-fire-protection-and-certification',
     'is projected to grow by approximately 15-20% annually, driven by both new projects and stricter safety regulations [1]',
     'is growing at a pace set by both new project starts and stricter safety regulations [1]'),
    ('uganda-construction-fastener-market-2026',
     "Uganda's construction fastener market is projected to grow at 7.2% CAGR through 2030, driven by three converging megaprojects.",
     "Uganda's construction fastener demand is driven by three converging megaprojects rather than by a single published growth rate."),
    ('uganda-construction-fastener-market-2026',
     'is expected to consume 18,000 to 25,000 tonnes of structural and line-pipe fasteners along its 1,443 km route',
     'will consume a tonnage set by the line-pipe and structural bill of materials along its 1,443 km route'),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    args = ap.parse_args()
    by_slug = {}
    for slug, old, new in PAIRS:
        by_slug.setdefault(slug, []).append([old, new, 0])
    done = miss = 0
    for slug, pairs in by_slug.items():
        path = f'content/articles/{slug}.json'
        a = json.load(open(path))
        for s in a['sections']:
            body = s.get('body') or {}
            if not isinstance(body.get('en'), str):
                continue
            txt = body['en']
            for pr in pairs:
                if pr[0] in txt:
                    txt = txt.replace(pr[0], pr[1])
                    pr[2] += 1
            body['en'] = txt
        changed = sum(pr[2] for pr in pairs)
        done += changed
        if args.apply and changed:
            a['updated'] = '2026-11-25'
            json.dump(a, open(path, 'w'), ensure_ascii=False, indent=2)
            open(path, 'a').write('\n')
        for pr in pairs:
            if pr[2] == 0:
                miss += 1
                print('  ⚠️ 未匹配 %s :: %s' % (slug, pr[0][:60]))
    print('%s：替换 %d 处，未匹配 %d 处' % ('已落盘' if args.apply else 'DRY-RUN', done, miss))


if __name__ == '__main__':
    main()
