#!/usr/bin/env python3
"""按 docs/SEO-GEO-STRATEGY.md 的批次口径生成整改工单（只读内容，不改正文）。

输出 docs/seo-geo-worklist-2026-1125.csv，一行一个「文章 × 问题」，列：
  batch   1=点击率P0 / 2=GEO可摘性 / 3=覆盖质量 / 4=常态
  slug category exposure clicks ctr_pct best_position
  title_len meta_len echo p1 ent qh zh_share inbound template_score issues actions

口径与策略文件一致，不从代码里另立标准：
  - 标题 >55 字符、meta >160 字符 → 批次 1（SERP 截断，改标题是当天见效的杠杆）
  - 曝光 ≥100 且 CTR <1% → 批次 1
  - 首段复述标题（echo）/ p1 不在 40–130 / 实体密度 <2 千词 → 批次 2
  - zh 节覆盖 <0.2 或模板文命中 ≥50% 或零站内入链 → 批次 3
  - 其余 → 批次 4

用法：python3 scripts/build-seo-geo-worklist.py [--out docs/...csv]
"""
import argparse, csv, glob, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, 'content', 'articles')
P0 = os.path.join(ROOT, 'docs', 'seo-p0-ctr-pages-2026-1125.csv')

sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import importlib.util
spec = importlib.util.spec_from_file_location('geo_audit', os.path.join(ROOT, 'scripts', 'geo_audit.py'))
geo = importlib.util.module_from_spec(spec); spec.loader.exec_module(geo)

TAG = re.compile(r'<[^>]+>')


def plain_len(s):
    if not s:
        return 0
    return len(re.sub(r'\s+', '', TAG.sub('', s)))


def zh_share(a):
    total = passed = 0
    for s in a.get('sections') or []:
        body = s.get('body') or {}
        en = plain_len(body.get('en'))
        if en < 100:
            continue
        total += 1
        if plain_len(body.get('zh')) * 2 >= en * 0.5:
            passed += 1
    return round(passed / total, 2) if total else 0


def p0_rows():
    rows = {}
    if not os.path.exists(P0):
        return rows
    for r in csv.DictReader(open(P0)):
        rows[r['slug']] = r
    return rows


def template_scores():
    try:
        out = subprocess.run([sys.executable, os.path.join(ROOT, 'scripts', 'check-template-filler.py'), '--json'],
                             capture_output=True, text=True, cwd=ROOT)
        data = json.loads(out.stdout)
        items = data.get('items') or data.get('articles') or []
        return {i['slug']: i.get('score') or i.get('ratio') or 0 for i in items}
    except Exception:
        return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(ROOT, 'docs', 'seo-geo-worklist-2026-1125.csv'))
    args = ap.parse_args()
    arts = {}
    inbound = {}
    for p in glob.glob(os.path.join(ART, '*.json')):
        a = json.load(open(p, encoding='utf-8'))
        if a.get('redirectTo'):
            continue
        arts[a['slug']] = a
        for r in a.get('relatedArticles') or []:
            slug = r if isinstance(r, str) else (r or {}).get('slug')
            if slug:
                inbound[slug] = inbound.get(slug, 0) + 1
    p0 = p0_rows()
    tmpl = template_scores()

    rows = []
    for slug, a in arts.items():
        title_en = (a.get('title') or {}).get('en') or ''
        meta_en = (a.get('metaDescription') or {}).get('en') or (a.get('description') or {}).get('en') or ''
        g = geo.audit(os.path.join(ART, slug + '.json'))
        g = g or {}
        zh = zh_share(a)
        inb = inbound.get(slug, 0)
        ts = tmpl.get(slug, 0)
        ex = p0.get(slug, {})
        issues = []
        if len(title_en) > 55:
            issues.append('title>55')
        if len(meta_en) > 160:
            issues.append('meta>160')
        ctr = None
        if ex:
            try:
                ctr = float(ex.get('ctr_pct') or 0)
            except ValueError:
                ctr = None
            if ctr is not None and ctr < 1.0:
                issues.append('ctr<1%')
        if g.get('echo'):
            issues.append('echo')
        if not (40 <= (g.get('p1') or 0) <= 130):
            issues.append('p1_out')
        if (g.get('ent') or 0) < 2:
            issues.append('ent<2')
        if zh < 0.2:
            issues.append('zh_thin')
        if ts >= 0.5:
            issues.append('template')
        if inb == 0:
            issues.append('orphan')

        batches = set()
        if {'title>55', 'meta>160', 'ctr<1%'} & set(issues):
            batches.add(1)
        if {'echo', 'p1_out', 'ent<2'} & set(issues):
            batches.add(2)
        if {'zh_thin', 'template', 'orphan'} & set(issues):
            batches.add(3)
        if not batches:
            batches.add(4)
        actions = []
        if 'title>55' in issues:
            actions.append('收短标题≤55')
        if 'meta>160' in issues:
            actions.append('描述120-155')
        if 'echo' in issues:
            actions.append('首段答案化(≤130词,首句定义)')
        if 'p1_out' in issues:
            actions.append('首段长度落40-130')
        if 'ent<2' in issues:
            actions.append('补可核实体(M10×1.5/8.8/ISO4014/HDG≥50µm)')
        if 'zh_thin' in issues:
            actions.append('zh补正文')
        if 'template' in issues:
            actions.append('按4节骨架重写')
        if 'orphan' in issues:
            actions.append('relatedArticles双向+首现产品名挂链')
        rows.append({
            'batch': min(batches), 'batches': ','.join(str(b) for b in sorted(batches)), 'slug': slug, 'category': a.get('category', ''),
            'exposure': ex.get('impressions', ''), 'clicks': ex.get('clicks', ''),
            'ctr_pct': ex.get('ctr_pct', ''), 'best_position': ex.get('best_position', ''),
            'title_len': len(title_en), 'meta_len': len(meta_en),
            'echo': g.get('echo', ''), 'p1': g.get('p1', ''), 'ent': g.get('ent', ''), 'qh': g.get('qh', ''),
            'zh_share': zh, 'inbound': inb, 'template_score': ts,
            'issues': ','.join(issues), 'actions': '；'.join(actions),
        })

    def key(r):
        try:
            exp = int(r['exposure'] or 0)
        except ValueError:
            exp = 0
        return (r['batch'], -exp, r['slug'])
    rows.sort(key=key)
    with open(args.out, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    counts = {}
    for r in rows:
        for b in r['batches'].split(','):
            counts[b] = counts.get(b, 0) + 1
    iss = {}
    for r in rows:
        for i in r['issues'].split(','):
            if i:
                iss[i] = iss.get(i, 0) + 1
    print('工单已写 %s：%d 篇' % (args.out, len(rows)))
    print('批次分布:', {k: counts[k] for k in sorted(counts)})
    print('问题分布:', dict(sorted(iss.items(), key=lambda x: -x[1])))


if __name__ == '__main__':
    main()
