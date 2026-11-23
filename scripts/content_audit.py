#!/usr/bin/env python3
"""全站内容审计（只用本地文件，不调用任何外部 AI）。

六项核心指标 + 四类附加检查，全部 0 才算干净：

  JSON 损坏 / 多语种标题空缺 / 英文薄段 / 正文 markdown
  英文正文中文残留 / 英文 meta 硬伤
  附加：零内链文章、跨文章重复的本地化标题、伪本地化标题、占位垃圾标记

用法：
  python3 scripts/content_audit.py                 # 人类可读报告，有问题 exit 1
  python3 scripts/content_audit.py --json OUT.json # 同时导出机器可读结果
  python3 scripts/content_audit.py --gaps OUT.json # 导出待补清单（slug + 语种 + 现英文标题）
"""
import argparse
import glob
import json
import os
import re
import sys

LANGS = ['zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']
CJK = re.compile(r'[\u4e00-\u9fa5\u3040-\u30ff\u0600-\u06ff\u0900-\u097f]')
MD = re.compile(r'\*\*|^#{2,4} ', re.M)
PLACEHOLDER = re.compile(r'\[[Xx]\]\s*%|TODO|Lorem ipsum|Emergency fallback', re.I)
THIN_CHARS = 200
META_MIN = 70
LATIN = re.compile(r'[a-z0-9]{4,}')
# 拉丁语种的功能词：出现即认为是原生文案，用来压掉伪本地化的误报
STOPWORDS = {
    'fr': ['des', 'du', 'pour', 'avec', 'dans', 'sur', 'les', 'aux', 'au', 'et', 'en'],
    'es': ['de', 'para', 'con', 'del', 'los', 'las', 'una'],
    'pt': ['de', 'para', 'com', 'dos', 'das', 'uma', 'nos'],
    'de': ['für', 'und', 'mit', 'der', 'die', 'das', 'von'],
}


def load_articles():
    arts, broken = {}, []
    for f in sorted(glob.glob('content/articles/*.json')):
        try:
            a = json.load(open(f, encoding='utf-8'))
        except Exception as e:
            broken.append((os.path.basename(f), repr(e)[:60]))
            continue
        arts[a.get('slug') or os.path.basename(f)[:-5]] = a
    return arts, broken


def en_body(section):
    b = section.get('body')
    if isinstance(b, dict):
        return b.get('en') or ''
    return b or ''


def audit(arts):
    res = {}
    title_gaps, meta_gaps, thin, md_hits, cjk_hits, meta_bad = [], [], [], [], [], []

    for slug, a in arts.items():
        t = a.get('title') or {}
        m = a.get('metaDescription') or {}
        for l in LANGS:
            if not (t.get(l) or '').strip():
                title_gaps.append((slug, l))
            if not (m.get(l) or '').strip():
                meta_gaps.append((slug, l))

        for i, s in enumerate(a.get('sections') or []):
            body = en_body(s)
            if len(body) < THIN_CHARS:
                thin.append((slug, i, len(body)))
            if MD.search(body):
                md_hits.append((slug, i))
            if CJK.search(body):
                c = CJK.search(body)
                cjk_hits.append((slug, i, body[max(0, c.start() - 20):c.end() + 20]))
            if PLACEHOLDER.search(body):
                md_hits.append((slug, i))

        en_meta = (m.get('en') or '').strip()
        if re.search(r'[#*]', en_meta) or len(en_meta) < META_MIN or PLACEHOLDER.search(en_meta):
            meta_bad.append((slug, len(en_meta)))
        # redirectTo 的文章本身 301 到别处，不进内链考核
        if not a.get('redirectTo') and len(a.get('relatedArticles') or []) < 2:
            res.setdefault('weak_links', []).append(slug)

    # 跨文章重复的本地化标题（串台的残留信号）
    dup = {}
    for slug, a in arts.items():
        for l in LANGS:
            v = (a.get('title') or {}).get(l)
            if v and v.strip():
                dup.setdefault((l, v.strip()), []).append(slug)
    dup_titles = [(l, v, s) for (l, v), s in dup.items() if len(set(s)) > 1]

    # 伪本地化：本语种标题里 ≥60% 的英文词与英文标题重合
    pseudo = []
    for slug, a in arts.items():
        en = (a.get('title') or {}).get('en') or ''
        et = set(LATIN.findall(en.lower()))
        if not et:
            continue
        for l in LANGS:
            v = ((a.get('title') or {}).get(l) or '').strip()
            if not v:
                continue
            lt = set(LATIN.findall(v.lower()))
            if l in STOPWORDS and any(w in v.lower().split() for w in STOPWORDS[l]):
                continue
            if len(lt & et) / len(et) >= 0.6:
                pseudo.append((slug, l))

    res.update({
        'articles': len(arts),
        'title_gaps': title_gaps,
        'meta_gaps': meta_gaps,
        'thin': thin,
        'md_hits': md_hits,
        'cjk_hits': cjk_hits,
        'meta_bad': meta_bad,
        'weak_links': res.get('weak_links', []),
        'dup_titles': dup_titles,
        'pseudo': pseudo,
    })
    return res


def report(r, broken):
    rows = [
        ('JSON 损坏', len(broken), 'FAIL'),
        ('多语种标题空缺', len(r['title_gaps']), 'FAIL'),
        ('多语种描述空缺', len(r['meta_gaps']), 'WARN'),
        ('英文薄段 (<%d 字符)' % THIN_CHARS, len(r['thin']), 'FAIL'),
        ('正文 markdown / 占位符', len(r['md_hits']), 'FAIL'),
        ('英文正文混入中文', len(r['cjk_hits']), 'FAIL'),
        ('英文 meta 硬伤', len(r['meta_bad']), 'FAIL'),
        ('内链不足 (<2 条)', len(r['weak_links']), 'WARN'),
        ('跨文章重复标题', len(r['dup_titles']), 'FAIL'),
        ('伪本地化标题', len(r['pseudo']), 'WARN'),
    ]
    print(f'=== 内容审计 · {r["articles"]} 篇文章 ===')
    worst = 'PASS'
    for name, n, level in rows:
        flag = 'ok ' if n == 0 else ('✗  ' if level == 'FAIL' else '!  ')
        print(f'{flag}{name:<28}{n}')
        if n and level == 'FAIL':
            worst = 'FAIL'
        elif n and worst != 'FAIL':
            worst = 'WARN'
    print(f'=== 结论：{worst} ===')

    if broken:
        print('\n[损坏文件]')
        for b in broken[:10]:
            print('  ', b)
    for label, key, show in [('标题空缺', 'title_gaps', 12), ('薄段', 'thin', 12), ('中文残留', 'cjk_hits', 6),
                             ('meta 硬伤', 'meta_bad', 12), ('重复标题', 'dup_titles', 6), ('伪本地化', 'pseudo', 8)]:
        if r[key]:
            print(f'\n[{label}]')
            for x in r[key][:show]:
                print('  ', x)
    return worst


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', dest='json_out')
    ap.add_argument('--gaps', dest='gap_out', help='导出待补清单（多语种标题/描述缺口）')
    args = ap.parse_args()

    arts, broken = load_articles()
    r = audit(arts)
    worst = report(r, broken)

    if args.json_out:
        json.dump({'summary': {k: (len(v) if isinstance(v, list) else v) for k, v in r.items() if k != 'articles'},
                   'articles': r['articles'], 'broken': broken,
                   'detail': {k: r[k] for k in r if isinstance(r[k], list)}},
                  open(args.json_out, 'w'), ensure_ascii=False, indent=1)
        print(f'\n已写出 {args.json_out}')

    if args.gap_out:
        gaps = [{'slug': s, 'en': (arts[s].get('title') or {}).get('en'),
                 'missing_title': [l for l in LANGS if not ((arts[s].get('title') or {}).get(l) or '').strip()],
                 'missing_meta': [l for l in LANGS if not ((arts[s].get('metaDescription') or {}).get(l) or '').strip()]}
                for s in sorted(set(s for s, _ in r['title_gaps']) | set(s for s, _ in r['meta_gaps']))]
        json.dump(gaps, open(args.gap_out, 'w'), ensure_ascii=False, indent=1)
        print(f'已写出待补清单 {args.gap_out}（{len(gaps)} 篇）')

    sys.exit(1 if worst == 'FAIL' else 0)


if __name__ == '__main__':
    main()
