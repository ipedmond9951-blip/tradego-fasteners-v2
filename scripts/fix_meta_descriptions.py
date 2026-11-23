#!/usr/bin/env python3
"""
修 meta description（2026-11-23 审计）：

问题 1：en 版 description / metaDescription 是"正文前 150 字"机械切出来的，被链接
注入残渣污染后只剩半句 + 标签垃圾（如 "Complete guide to" / "Deep-dive into Africa's
$4.2 billion"），SERP 摘要不可用。→ 用文章自身正文（已清过残渣）重建。

问题 2：部分文章 metaDescription 只有 en/zh，其余 8 语种缺失，SERP 会回退到英文。
这些文章的 description[locale] 本身是原生文案 → 直接用该语种正文摘要落成 meta。

用法：python3 scripts/fix_meta_descriptions.py [--dry-run]
"""
import json
import glob
import re
import sys

LANGS = ['en', 'zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']
CJK = {'zh', 'ja'}
TAG = re.compile(r'<[^>]+>')
WS = re.compile(r'\s+')
# 在 . ! ? 。 之后断句，但避开小数/缩略/域名
SENT = re.compile(r'(?<=[.!?。])\s+')
ENTITIES = (('&nbsp;', ' '), ('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>'),
            ('&quot;', '"'), ('&#39;', "'"), ('&mdash;', '—'), ('&ndash;', '–'))
STOP_TAIL = {'to', 'for', 'of', 'in', 'with', 'and', 'the', 'from', 'on', 'at', 'by', 'a', 'an'}


def clean(text: str) -> str:
    text = TAG.sub(' ', text)
    text = re.sub(r'(\b[A-Za-z0-9])-\s+(?=[A-Za-z0-9])', r'\1-', text)   # "J- bolts" → "J-bolts"
    for a, b in ENTITIES:
        text = text.replace(a, b)
    return WS.sub(' ', text).strip()


def clamp(text: str, lang: str, limit: int = 158) -> str:
    text = clean(text)
    if len(text) <= limit:
        return text
    out = ''
    for chunk in SENT.split(text):
        if len(out) + len(chunk) + 1 > limit:
            break
        out = (out + ' ' + chunk).strip()
    if not out:
        out = text[:limit].rsplit(' ', 1)[0] if lang not in CJK else text[:limit]
    return out.rstrip(' ,;:—-').strip()


def prose(article: dict) -> str:
    chunks = []
    for sec in article.get('sections', []) or []:
        b = sec.get('body') or {}
        t = b.get('en') if isinstance(b, dict) else b
        if isinstance(t, str) and t.strip():
            piece = clean(t).rstrip(' ,;:')
            if not re.search(r'[.!?。]$', piece):
                piece += '.'
            chunks.append(piece)
    return ' '.join(chunks)


def first_sentences(text: str, limit: int = 158) -> str:
    parts = [p.strip() for p in SENT.split(text) if p.strip()]
    out = ''
    for p in parts:
        if len(out) + len(p) > limit and out:
            break
        out = (out + ' ' + p).strip()
        if len(out) >= limit - 30:
            break
    return out


def build_en(article: dict, old_meta: str) -> str:
    body = prose(article)
    if not body:
        return ''
    lead = first_sentences(body)
    old = clean(old_meta)
    # 旧值是"半句话钩子"（如 Deep-dive into Africa's $4.2 billion）→ 拼回新句
    if 25 <= len(old) <= 90 and not re.search(r'[.!?]$', old):
        last_word = old.split()[-1].lower().strip(':,')
        if last_word not in STOP_TAIL:
            candidate = f"{old}: {lead}"
            if len(candidate) <= 168:
                return clamp(candidate, 'en')
    return clamp(lead or body, 'en')


def main() -> None:
    dry = '--dry-run' in sys.argv
    stats = {'en_rebuilt': 0, 'fill': 0, 'files': 0}
    report = []
    for path in sorted(glob.glob('content/articles/*.json')):
        with open(path, encoding='utf-8') as f:
            art = json.load(f)
        md = art.setdefault('metaDescription', {})
        de = art.setdefault('description', {})
        touched = False

        cur = md.get('en') or ''
        broken = len(clean(cur)) < 110 or not re.search(r'[.!?]$', clean(cur))
        if broken:
            new = build_en(art, cur)
            if new:
                md['en'] = new
                if len(clean(de.get('en') or '')) < 110:
                    de['en'] = new
                stats['en_rebuilt'] += 1
                touched = True
                report.append(('en', art['slug'], new))

        for L in LANGS:
            if L == 'en':
                continue
            if not (md.get(L) or '').strip():
                src = (de.get(L) or '').strip()
                if len(clean(src)) < 60:              # 原生摘要太短就退到英文，但记一笔
                    src = de.get('en') or ''
                if not src:
                    continue
                md[L] = clamp(src, L)
                stats['fill'] += 1
                touched = True

        if touched:
            stats['files'] += 1
            if not dry:
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(art, f, ensure_ascii=False, indent=2)
                    f.write('\n')

    print('DRY' if dry else 'APPLIED', stats)
    for L, slug, txt in report[:10]:
        print(f'  [{L}] {slug} :: {txt}')


if __name__ == '__main__':
    main()
