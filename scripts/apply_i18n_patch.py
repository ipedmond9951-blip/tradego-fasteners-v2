#!/usr/bin/env python3
"""把人工/Agent 直写的多语种标题与描述补丁写入 content/articles。

用法：python3 scripts/apply_i18n_patch.py /tmp/i18n_fix1.json /tmp/i18n_fix2.json ...
补丁格式：{"<slug>": {"<lang>": {"t": "标题", "m": "描述"}}}

校验：标题 10~90 字符、描述 80~170 字符；非拉丁语种必须含本语种字符；
不得出现连续 5 个以上英文单词（防伪本地化）；全部通过才落盘。
"""
import json
import re
import sys
import glob
import os

LANGS = ['zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']
NON_LATIN = {
    'zh': r'[\u4e00-\u9fa5]',
    'ja': r'[\u3040-\u30ff\u4e00-\u9fa5]',
    'ar': r'[\u0600-\u06ff]',
    'ru': r'[\u0400-\u04ff]',
    'hi': r'[\u0900-\u097f]',
}


BOUNDS = {
    'zh': (10, 60, 55, 105), 'ja': (12, 62, 55, 105), 'hi': (12, 80, 75, 140),
    'ar': (12, 70, 80, 165), 'ru': (15, 95, 100, 205),
    'es': (18, 92, 105, 212), 'fr': (18, 92, 105, 212),
    'pt': (18, 92, 105, 212), 'de': (18, 92, 105, 212),
}
LATIN_LANGS = {'es', 'fr', 'pt', 'de'}


def check(lang, title, meta):
    errs = []
    t0, t1, m0, m1 = BOUNDS.get(lang, (10, 90, 80, 190))
    if not (t0 <= len(title) <= t1):
        errs.append(f'标题长度 {len(title)}')
    if not (m0 <= len(meta) <= m1):
        errs.append(f'描述长度 {len(meta)}')
    pat = NON_LATIN.get(lang)
    if pat and not re.search(pat, title):
        errs.append('标题非本语种')
    if pat and not re.search(pat, meta):
        errs.append('描述非本语种')
    if lang not in LATIN_LANGS and re.search(r'\b(?:[A-Za-z]{3,}\s+){4,}[A-Za-z]{3,}\b', title):
        errs.append('标题含整句英文')
    return errs


def main():
    patch = {}
    for p in sys.argv[1:]:
        data = json.load(open(p, encoding='utf-8'))
        for slug, langs in data.items():
            patch.setdefault(slug, {}).update(langs)

    files = {os.path.basename(f)[:-5]: f for f in glob.glob('content/articles/*.json')}
    applied = failed = 0
    problems = []
    for slug, langs in patch.items():
        f = files.get(slug)
        if not f:
            problems.append(f'找不到文章 {slug}')
            continue
        art = json.load(open(f, encoding='utf-8'))
        changed = False
        for lang, val in langs.items():
            if lang not in LANGS:
                problems.append(f'{slug}: 未知语种 {lang}')
                continue
            t = (val.get('t') or '').strip()
            m = (val.get('m') or '').strip()
            errs = check(lang, t, m)
            if errs:
                problems.append(f'{slug}/{lang}: {"; ".join(errs)}')
                failed += 1
                continue
            art['title'][lang] = t
            art.setdefault('metaDescription', {})[lang] = m
            changed = True
            applied += 1
        if changed:
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(json.dumps(art, ensure_ascii=False, indent=2) + '\n')

    print(f'写入 {applied} 槽，失败 {failed} 槽')
    for p in problems[:20]:
        print('  ✗', p)


if __name__ == '__main__':
    main()
