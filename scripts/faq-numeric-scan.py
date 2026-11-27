#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FAQ 数字口径扫描器（两线共用一支尺子）。

用法：
  python3 scripts/faq-numeric-scan.py               # 全库，按区块统计
  python3 scripts/faq-numeric-scan.py --region a    # A 区 39 篇
  python3 scripts/faq-numeric-scan.py --region b    # B 区（排除 A 区与在途脏文件）
  python3 scripts/faq-numeric-scan.py --csv out.csv # 逐篇两列台账
  python3 scripts/faq-numeric-scan.py --slug X      # 单篇明细（含命中原文）

判据分两级，别混：
  PRICE   价格类：USD/$ + 数字、以及 "N% higher/lower/more" —— 属红线，必须清零。
  COMMIT  承诺类：N-M weeks / N-M tons（交期承诺、起订量吨位）—— 属口径问题，按轮清。
  scope：faq（默认，只扫 FAQ 答案）｜body（只扫正文段）｜all（两者）。
  不计：航线/清关/内陆天数（事实性物流口径）、标准限值与标准号、法定税率。

注意：正则必须"数字前置"（USD\\s?\\d）。写成 USD\\s?[\\d,.]+ 会把
"cannot access USD." 判成金额（字符类里含 '.'），台账会虚高。
"""
import argparse, csv, glob, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, 'content', 'articles')

PRICE = re.compile(r'(USD\s?\d|\$\s?\d|\d+(?:\.\d+)?\s?%\s?(?:higher|lower|more|cheaper|more expensive))', re.I)
COMMIT = re.compile(r'(\d+(?:\.\d+)?\s?[-–]\s?\d+(?:\.\d+)?\s?(?:weeks|tons|tonnes)|\b\d+(?:\.\d+)?\s?(?:weeks|tons|tonnes)\b)', re.I)


def a_region():
    p = os.path.join(ROOT, 'docs', 'seo-geo-main-owned-40-2026-1125.csv')
    if not os.path.exists(p):
        return set()
    with open(p, encoding='utf-8') as f:
        return {r['slug'] for r in csv.DictReader(f) if r.get('slug')}


def dirty():
    """工作区里他人 ` M` 在途件（R5：一律不碰、不计入任何一方债）。"""
    try:
        out = subprocess.run(['git', 'status', '--short', 'content/articles'], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout
    except Exception:
        return set()
    s = set()
    for line in out.splitlines():
        parts = line.split()
        if parts and parts[-1].endswith('.json'):
            s.add(os.path.basename(parts[-1])[:-5])
    return s


def scan(scope='faq'):
    A = a_region(); D = dirty(); rows = []
    for f in sorted(glob.glob(os.path.join(ART, '*.json'))):
        slug = os.path.basename(f)[:-5]
        try:
            d = json.load(open(f, encoding='utf-8'))
        except Exception:
            continue
        price = []; commit = []
        for si, sec in enumerate(d.get('sections', [])):
            if scope in ('body', 'all'):
                for loc, t in (sec.get('body') or {}).items():
                    if not t:
                        continue
                    if PRICE.search(t):
                        price.append((si, 'body', loc, PRICE.search(t).group(0)))
                    if COMMIT.search(t):
                        commit.append((si, 'body', loc, COMMIT.search(t).group(0)))
            if scope in ('faq', 'all'):
              for fi, it in enumerate(sec.get('faqItems', []) or []):
                for loc, t in (it.get('a') or {}).items():
                    if not t:
                        continue
                    if PRICE.search(t):
                        price.append((si, fi, loc, PRICE.search(t).group(0)))
                    if COMMIT.search(t):
                        commit.append((si, fi, loc, COMMIT.search(t).group(0)))
        rows.append(dict(slug=slug, price=price, commit=commit, region='a' if slug in A else 'b', dirty=slug in D))
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--region', choices=['a', 'b', 'all'], default='all')
    ap.add_argument('--csv', default='')
    ap.add_argument('--slug', default='')
    ap.add_argument('--scope', choices=['faq', 'body', 'all'], default='faq')
    a = ap.parse_args()
    rows = scan(a.scope)
    sel = [r for r in rows if r['region'] != 'b' or not r['dirty']]
    if a.region != 'all':
        sel = [r for r in sel if r['region'] == a.region]
    if a.slug:
        for r in sel:
            if r['slug'] != a.slug:
                continue
            print(r['slug'], 'PRICE', len(r['price']), 'COMMIT', len(r['commit']))
            for h in r['price']: print('  price  ', h)
            for h in r['commit']: print('  commit ', h)
        return
    files_p = len([r for r in sel if r['price']])
    files_c = len([r for r in sel if r['commit']])
    print(f"PRICE: {files_p} 篇 / {sum(len(r['price']) for r in sel)} 条   COMMIT: {files_c} 篇 / {sum(len(r['commit']) for r in sel)} 条   （在途脏文件已排除 {len([r for r in rows if r['dirty']])} 篇）")
    if a.csv:
        with open(a.csv, 'w', encoding='utf-8', newline='') as f:
            w = csv.writer(f)
            w.writerow(['slug', 'region', 'price_items', 'commit_items'])
            for r in sorted(sel, key=lambda x: (-len(x['price']), -len(x['commit']))):
                if r['price'] or r['commit']:
                    w.writerow([r['slug'], r['region'], len(r['price']), len(r['commit'])])
        print('written', a.csv)


if __name__ == '__main__':
    main()
