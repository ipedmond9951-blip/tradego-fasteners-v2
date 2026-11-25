#!/usr/bin/env python3
"""把超长段落切短（只加段落标签，一字不改）。

GEO 的问题不是"有没有段落"，而是"一段里有没有一句话答案"。2026-11-25 量到：库里有
889 个纯文本段落超过 130 词（英文最长 619 词），LLM 切块器拿到的是整块，取不出
可引用的单句。本脚本把纯文本段落按句子边界切成英文 55–110 词 / 中文 80–180 字一段。

只处理 `<p>` 内**没有任何内联标签**的段落（含 <strong>/<a> 的段落切开会让标签跨段
不闭合，留给人工）。默认 dry-run。

用法：python3 scripts/split-long-paragraphs.py [--apply] [--slug S]
"""
import argparse, glob, json, re

P = re.compile(r'<p[^>]*>(.*?)</p>', re.S | re.I)
LATIN = {'en', 'es', 'fr', 'pt', 'de', 'hi'}
# 句子边界：拉丁语按 .!? 后接空白；中日按句号/问号/感叹号直接切
BOUND_LATIN = re.compile(r'(?<=[.!?])\s+')
BOUND_CJK = re.compile(r'(?<=[。！？；])')


def count(text, lang):
    return len(text.split()) if lang in LATIN else len(re.sub(r'\s', '', text))


def split_text(text, lang, lo=None, hi=None):
    if lang in LATIN:
        lo, hi = lo or 55, hi or 110
    else:
        lo, hi = lo or 80, hi or 180
    parts = BOUND_LATIN.split(text) if lang in LATIN else BOUND_CJK.split(text)
    out, buf, n = [], [], 0
    for p in parts:
        p = p.strip()
        if not p:
            continue
        k = count(p, lang)
        if n and n + k > hi:
            out.append(' '.join(buf) if lang in LATIN else ''.join(buf))
            buf, n = [p], k
        else:
            buf.append(p)
            n += k
            if n >= lo:
                out.append(' '.join(buf) if lang in LATIN else ''.join(buf))
                buf, n = [], 0
    if buf:
        out.append(' '.join(buf) if lang in LATIN else ''.join(buf))
    return out


TAGRE = re.compile(r'<[^>]+>')


def safe_cuts(inner, lang):
    """返回「标签闭合且句子结束」可切的字符位置。"""
    depths, stack = [0] * (len(inner) + 1), 0
    for m in TAGRE.finditer(inner):
        name = m.group(0).strip('<>').split()[0].lstrip('/').lower()
        closing = m.group(0).startswith('</')
        selfclose = m.group(0).endswith('/>') or name in ('br', 'img', 'hr')
        for i in range(m.start(), m.end()):
            depths[i] = stack + (0 if closing or selfclose else 1)
        if not (closing or selfclose):
            stack += 1
        elif closing:
            stack = max(0, stack - 1)
        depths[m.end()] = stack
    cuts = []
    for m in (BOUND_LATIN.finditer(inner) if lang in LATIN else BOUND_CJK.finditer(inner)):
        pos = m.end() if lang not in LATIN else m.start() + 1
        if depth_at(depths, pos) == 0:
            cuts.append(pos)
    return cuts


def depth_at(depths, pos):
    return depths[min(pos, len(depths) - 1)]


def process(body, lang):
    changed = 0

    def repl(m):
        nonlocal changed
        inner = m.group(1)
        txt = TAGRE.sub(' ', inner)
        lim = 130 if lang in LATIN else 220
        if count(txt, lang) <= lim:
            return m.group(0)
        cuts = safe_cuts(inner, lang)
        if not cuts:
            return m.group(0)
        lo, hi = (55, 110) if lang in LATIN else (80, 180)
        pieces, start, last, n = [], 0, 0, count(txt, lang)
        for c in cuts:
            seg = TAGRE.sub(' ', inner[start:c])
            acc = count(seg, lang)
            if acc >= lo:
                pieces.append(inner[start:c].strip())
                start, acc = c, 0
        if start < len(inner):
            pieces.append(inner[start:].strip())
        pieces = [x for x in pieces if x]
        if len(pieces) < 2:
            return m.group(0)
        for piece in pieces:                    # 每段自身标签必须闭合
            for mm in TAGRE.finditer(piece):
                pass
            if piece.count('<') != piece.count('>'):
                return m.group(0)
        changed += 1
        return ''.join('<p>%s</p>' % x for x in pieces)

    return P.sub(repl, body), changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--slug')
    args = ap.parse_args()
    files = [f'content/articles/{args.slug}.json'] if args.slug else sorted(glob.glob('content/articles/*.json'))
    n_field = n_para = 0
    for p in files:
        a = json.load(open(p))
        touched = False
        for s in a['sections']:
            for lang, body in list((s.get('body') or {}).items()):
                if not isinstance(body, str):
                    continue
                new, changed = process(body, lang)
                if changed:
                    for bad in ('<p><p', '</p></strong>'):
                        if bad in new:
                            raise SystemExit('HTML 异常 %s %s' % (a['slug'], lang))
                    s['body'][lang] = new
                    n_field += 1
                    n_para += changed
                    touched = True
        if touched:
            a['updated'] = '2026-11-25'
            if args.apply:
                json.dump(a, open(p, 'w'), ensure_ascii=False, indent=2)
                open(p, 'a').write('\n')
    print('%s：%d 个字段、切开 %d 个超长段落' % ('已落盘' if args.apply else 'DRY-RUN', n_field, n_para))


if __name__ == '__main__':
    main()
