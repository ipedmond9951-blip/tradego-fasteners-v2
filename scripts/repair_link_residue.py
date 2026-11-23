#!/usr/bin/env python3
"""
清掉文章 JSON 里的链接注入残渣（2026-11-23）。

根因：scripts/add-internal-links.js 不幂等 —— 它把关键词包成
`<a href="..." class="text-primary-600 ...">keyword</a>`，第二天再跑时关键词
落在已有 <a> 内部，于是叠成 `<a X><a Y>keyword</a></a>`；反复跑 + 段落截断后
就留下 `<a href="/products" class="..."><a href="/products"` 这类半截垃圾。
摘要字段是把正文前 150 字切出来的，所以 description / metaDescription 一并污染。

本脚本只做"去残渣"，不改写任何句子：
  1. 折叠相邻的重复 <a ...>（保留真正包住文字的那一层）
  2. 折叠相邻的重复 </a>
  3. 无配对的 </a> 删掉；没闭合的 <a ...> 删掉（身后文字保留）
  4. 结构性坏到无法配对的字段，退化为"只留文字、剥掉所有锚"
文案长度必须守恒：修复后单词数不得少于修复前（只允许减少标签）。

用法：python3 scripts/repair_link_residue.py [--dry-run]
"""
import json
import glob
import re
import sys
import collections

LANGS = ['en', 'zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']

OPEN_TAG = re.compile(r'<a\b[^>]*?>', re.I)
OPEN_TAIL = re.compile(r'<a\b[^>]*?$', re.I)
CLOSE_TAG = re.compile(r'</a\s*>', re.I)
WELL_FORMED = re.compile(r'<a\b[^>]*?>(?:<[^a/][^>]*?>|</?(?!a\b)[^>]*?>)*?[^<]*?</a\s*>', re.I)
FLAT_ANCHOR = re.compile(r'<a\b[^>]*?>[^<]*</a\s*>', re.I)
TAIL_JUNK = re.compile(r'\ba>\s*["\u201d]?\s*>', re.I)
OK_TAG = re.compile(
    r'</?(?:p|b|strong|em|i|u|ul|li|ol|br|hr|h[1-6]|span|div|blockquote|table|thead|tbody|tr|td|th|sup|sub)\b[^>]*?>',
    re.I)
MULTISPACE = re.compile(r'[ \t]{2,}')
WS = re.compile(r'\s+')
WORDS = re.compile(r'\w+')


def collapse_nested(s: str) -> str:
    for _ in range(8):
        new = re.sub(r'(<a\b[^>]*?>)\s*(?=<a\b)', '', s, flags=re.I)
        new = re.sub(r'(</a\s*>)\s*(?=</a)', '', new, flags=re.I)
        if new == s:
            break
        s = new
    return s


def balance(s: str) -> str:
    """删掉无配对的 </a> 与永远闭合不上的 <a ...>。"""
    events = [(m.start(), m.end(), 'open') for m in OPEN_TAG.finditer(s)]
    events += [(m.start(), m.end(), 'close') for m in CLOSE_TAG.finditer(s)]
    events.sort()
    stack, drop = [], []
    for st, en, kind in events:
        if kind == 'open':
            stack.append((st, en))
        elif stack:
            stack.pop()
        else:
            drop.append((st, en))
    drop.extend(stack)
    if not drop:
        return s
    out, last = [], 0
    for st, en in sorted(drop):
        if st < last:
            continue
        out.append(s[last:st])
        last = en
    out.append(s[last:])
    return ''.join(out)


def clean_outside_tags(s: str) -> str:
    """只清理标签**外面**的属性残片（`class="..."`、`href="..."`、裸 `"`），
    标签内部的合法属性保持不动。"""
    out, last = [], 0
    for m in re.finditer(r'<[^>]*>', s):
        seg = s[last:m.start()]
        seg = re.sub(r'"?\s*(?:class|href|target|rel)="[^"]*"\s*>?\s*', ' ', seg, flags=re.I)
        seg = re.sub(r'\ba\s+href\s*=?\s*', ' ', seg, flags=re.I)
        seg = re.sub(r'="/[^\s"]*', ' ', seg)
        out.append(seg)
        out.append(m.group(0))
        last = m.end()
    seg = s[last:]
    seg = re.sub(r'"?\s*(?:class|href|target|rel)="[^"]*"\s*>?\s*', ' ', seg, flags=re.I)
    seg = re.sub(r'\ba\s+href\s*=?\s*', ' ', seg, flags=re.I)
    seg = re.sub(r'="/[^\s"]*', ' ', seg)
    out.append(seg)
    return ''.join(out)


def strip_all_anchors(s: str) -> str:
    s = OPEN_TAIL.sub('', s)
    s = CLOSE_TAG.sub('', s)
    s = OPEN_TAG.sub('', s)
    s = re.sub(r'(?:\bclass|\bhref|\btarget|\brel)="[^"]*"\s*>?', '', s, flags=re.I)
    s = TAIL_JUNK.sub(' ', s)
    return s


def residue(s: str) -> bool:
    """去掉合法标签后，是否还残留锚/属性碎片。"""
    rest = FLAT_ANCHOR.sub(' ', s)
    rest = OK_TAG.sub(' ', rest)
    rest = OPEN_TAG.sub(' ', rest)
    rest = CLOSE_TAG.sub(' ', rest)
    rest = re.sub(r'(?:\bclass|\bhref|\btarget|\brel)="[^"]*"', '', rest, flags=re.I)
    return bool(re.search(r'<|/a>|\bhref=|\bclass=', rest, re.I))


def normalize_anchor_variants(s: str) -> str:
    """把各种被压坏的锚写法归一：`/a>`（丢了 `<`）、`< / a >`、`< a href`。"""
    s = re.sub(r'<\s*/\s*a\s*>', '</a>', s, flags=re.I)
    s = re.sub(r'(?<!<)/a\s*>', '</a>', s, flags=re.I)
    s = re.sub(r'<\s*a\s+', '<a ', s, flags=re.I)
    if '<a' in s or '</a' in s:
        s = s.replace('\\"', '"')              # 被转义的引号
    return s


def repair(s: str) -> str:
    if not isinstance(s, str) or '<' not in s and 'a>' not in s:
        return s
    if not re.search(r'<a\b|</a|/a>|href=|class="', s, re.I):
        return s
    t = normalize_anchor_variants(s)
    t = clean_outside_tags(t)
    t = OPEN_TAIL.sub('', t)
    t = collapse_nested(t)
    t = balance(t)
    if residue(t):
        t = strip_all_anchors(t)
        if residue(t):                       # 还有 < 之类，兜底清符号
            t = re.sub(r'<[^>]{0,120}>', ' ', t)
            t = re.sub(r'\s+/a>\s*', ' ', t)
    t = MULTISPACE.sub(' ', t).strip()
    return t


def word_count(s: str) -> int:
    return len(WORDS.findall(s or ''))


def fix_str(v: str, tag: str, stats, drops):
    if not isinstance(v, str):
        return v
    nv = repair(v)
    if nv == v:
        return v
    stats[tag] += 1
    if word_count(nv) < word_count(v):
        drops.append((tag, len(WORDS.findall(v)), len(WORDS.findall(nv))))
    return nv


def main() -> None:
    dry = '--dry-run' in sys.argv
    stats = collections.Counter()
    drops = []
    files_changed = 0
    samples = []
    bad_left = []
    for path in sorted(glob.glob('content/articles/*.json')):
        with open(path, encoding='utf-8') as f:
            art = json.load(f)
        dirty = False
        for sec in art.get('sections', []) or []:
            for fld in ('heading', 'body'):
                v = sec.get(fld)
                if isinstance(v, str):
                    nv = fix_str(v, fld, stats, drops)
                    dirty |= nv != v
                    sec[fld] = nv
                elif isinstance(v, dict):
                    for L, t in list(v.items()):
                        nv = fix_str(t, fld, stats, drops)
                        if nv != t:
                            if len(samples) < 5 and L == 'en':
                                samples.append((art['slug'], fld, t, nv))
                            v[L] = nv
                            dirty = True
        for fld in ('description', 'metaDescription', 'imageAlt', 'title'):
            v = art.get(fld)
            if isinstance(v, str):
                nv = fix_str(v, fld, stats, drops)
                dirty |= nv != v
                art[fld] = nv
            elif isinstance(v, dict):
                for L, t in list(v.items()):
                    nv = fix_str(t, fld, stats, drops)
                    if nv != t:
                        if len(samples) < 5 and L == 'en':
                            samples.append((art['slug'], fld, t, nv))
                        v[L] = nv
                        dirty = True
        # 复查
        for sec in art.get('sections', []) or []:
            b = sec.get('body')
            seq = [b] if isinstance(b, str) else (list(b.values()) if isinstance(b, dict) else [])
            for t in seq:
                if isinstance(t, str) and residue(t):
                    bad_left.append((art['slug'], t[:80]))
        if dirty:
            files_changed += 1
            if not dry:
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(art, f, ensure_ascii=False, indent=2)
                    f.write('\n')
    print('DRY' if dry else 'APPLIED', 'files', files_changed, dict(stats))
    print('词数下降的字段:', len(drops), drops[:5])
    print('仍残留:', len(bad_left), bad_left[:3])
    for s in samples:
        print('---', s[0], s[1])
        print('  BEFORE:', s[2][:180])
        print('  AFTER :', s[3][:180])


if __name__ == '__main__':
    main()
