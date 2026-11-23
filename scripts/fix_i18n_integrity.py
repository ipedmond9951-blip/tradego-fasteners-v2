#!/usr/bin/env python3
"""
多语种字段完整性收口（2026-11-23）。

今天批量本地化时，多个进程共用了同一个临时提示词文件（/tmp/localize-prompt.md），
出现"串台"：A 文章的阿拉伯语标题被写成 B 文章的内容。这类错误在结构上看不出来，
但只要两篇文章出现一模一样的本地化标题/摘要，就可以判定至少一方是串台的。

处理原则：宁可让页面回退英文（站点已有 title[locale] → en 的回退链），也不上线错主题的本地化。
本脚本做三件事：
  1. 跨文章重复的本地化 title / meta → 双方都清空；
  2. 明显异常（标题 <10 字符、与英文同名、meta <25 字符）→ 清空；
  3. 正文里的 markdown 标题行与 **加粗** 标记 → 去掉。

用法：python3 scripts/fix_i18n_integrity.py [--apply]
"""
import glob
import json
import re
import sys
from collections import defaultdict


def main():
    apply = '--apply' in sys.argv
    files = {}
    for f in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(f, encoding='utf-8'))
        files[a['slug']] = [f, a]

    ti, mi = defaultdict(list), defaultdict(list)
    for slug, (f, a) in files.items():
        for L, v in (a.get('title') or {}).items():
            if v and L != 'en':
                ti[(L, v.strip().lower())].append(slug)
        for L, v in (a.get('metaDescription') or {}).items():
            if v and L != 'en':
                mi[(L, v.strip().lower())].append(slug)

    blank = defaultdict(set)
    for (L, v), slugs in ti.items():
        if len(slugs) > 1:
            for s in slugs:
                blank[s].add(L)
    for (L, v), slugs in mi.items():
        if len(slugs) > 1:
            for s in slugs:
                blank[s].add(L)

    for slug, (f, a) in files.items():
        t, m = a.get('title') or {}, a.get('metaDescription') or {}
        et = (t.get('en') or '').strip().lower()
        for L, v in list(t.items()):
            if L != 'en' and v and (len(v.strip()) < 10 or v.strip().lower() == et):
                blank[slug].add(L)
        for L, v in list(m.items()):
            if L != 'en' and v and len(v.strip()) < 25:
                blank[slug].add(L)

    md_fixed = 0
    for slug, (f, a) in files.items():
        ch = False
        for sec in a.get('sections') or []:
            b = sec.get('body') or {}
            for L, v in list(b.items()):
                if not isinstance(v, str):
                    continue
                nv = re.sub(r'(?m)^\s*#{2,4}\s*[^\n]*\n?', '', v)
                nv = re.sub(r'#{2,4}\s+', '', nv)
                nv = re.sub(r'\*\*([^*\n]+)\*\*', r'\1', nv)
                nv = re.sub(r'(?m)^\s*\*\s+', '- ', nv)
                nv = re.sub(r'\n{3,}', '\n\n', nv)
                if nv != v:
                    b[L] = nv
                    ch = True
        if ch:
            md_fixed += 1

    print(f'清空异常/串台字段的文章 {len(blank)} 篇；正文 markdown 处理 {md_fixed} 篇', flush=True)
    if apply:
        for slug, langs in blank.items():
            f, a = files[slug]
            for L in langs:
                a['title'].pop(L, None)
                a.setdefault('metaDescription', {}).pop(L, None)
        for slug, (f, a) in files.items():
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(a, fh, ensure_ascii=False, indent=2)
                fh.write('\n')
        print('APPLIED')


if __name__ == '__main__':
    main()
