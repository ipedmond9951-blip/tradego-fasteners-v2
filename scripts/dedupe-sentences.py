#!/usr/bin/env python3
"""删掉同篇同语种里重复出现的整句（模板/复制粘贴的常见痕迹）。

与 dedupe-body.py 的分工：
- dedupe-body 只删「整块 <p> 纯文本完全相同」的重复段落；
- 本脚本处理「句子在另一段里又被抄了一遍」——只按文本节点切句，不动标签，
  所以不会出现标签断掉；已经跨标签的句子检测不到，保守放过。

判据：同一篇同一语种内，某句（去空白/小写后前 100 字符）第二次及以后出现时删掉；
单句长度 ≥40 字符；删完整节纯文本低于 300 字符则整节跳过（避免把节删空）。
默认 dry-run。

用法：python3 scripts/dedupe-sentences.py [--apply] [--slug S] [--top N]
"""
import argparse, glob, json, re, subprocess, sys

TAG_OR_TEXT = re.compile(r'(<[^>]+>)')
SENT = re.compile(r'(?<=[.!?。！？؛])(?=\s)')
SKIP_IF_DIRTY = True


def norm(s):
    return re.sub(r'\s+', ' ', s).strip().lower()


def key_of(s):
    return norm(s)[:100]


def clean_text(t, seen):
    """在一个纯文本片段里删重复句；返回 (新文本, 删掉的句子数)。"""
    parts = SENT.split(t)
    out = []
    dropped = 0
    for p in parts:
        s = p.strip()
        if len(s) >= 40 and key_of(s) in seen:
            dropped += 1
            continue  # 整句连同后面的空白一起丢掉
        if len(s) >= 40:
            seen.add(key_of(s))
        out.append(p)
    return ''.join(out), dropped


EMPTY_BLOCK = re.compile(r'<(p|div|section)[^>]*>(?:\s|<br\s*/?>)*</\1>', re.I)


def dedupe_body(body, seen):
    dropped = 0
    pieces = TAG_OR_TEXT.split(body)
    out = []
    for piece in pieces:
        if TAG_OR_TEXT.fullmatch(piece) or not piece:
            out.append(piece)
            continue
        new, d = clean_text(piece, seen)
        dropped += d
        new = re.sub(r'[ \t]{2,}', ' ', new)
        out.append(new)
    text = ''.join(out)
    text = EMPTY_BLOCK.sub('', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text, dropped


def plain_len(body):
    return len(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body)).strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--slug')
    ap.add_argument('--top', type=int, default=8)
    args = ap.parse_args()
    files = [f'content/articles/{args.slug}.json'] if args.slug else sorted(glob.glob('content/articles/*.json'))
    dirty = set()
    if SKIP_IF_DIRTY:
        out = subprocess.run(['git', 'status', '--porcelain', '--', 'content/articles'],
                             capture_output=True, text=True).stdout
        dirty = {line[3:].strip() for line in out.splitlines() if line.strip()}
    rows = []
    for p in files:
        if p in dirty:
            continue
        a = json.load(open(p, encoding='utf-8'))
        en_words_before = len(re.sub(r'<[^>]+>', ' ', ''.join((x.get('body') or {}).get('en') or '' for x in a.get('sections') or [])).split())
        seen_per_lang = {}
        total = 0
        for s in a.get('sections') or []:
            for lang, body in list((s.get('body') or {}).items()):
                if not isinstance(body, str) or not body:
                    continue
                seen = seen_per_lang.setdefault(lang, set())
                new, d = dedupe_body(body, seen)
                if d and plain_len(new) >= 300:
                    s['body'][lang] = new
                    total += d
        en_words_after = len(re.sub(r'<[^>]+>', ' ', ''.join((x.get('body') or {}).get('en') or '' for x in a.get('sections') or [])).split())
        # 不把原本达标的英文正文删到门槛以下（避免把干净页变成 body-size WARN）
        if en_words_before >= 1600 and en_words_after < 1600:
            continue
        if total:
            rows.append((a['slug'], total, p, a))
    rows.sort(key=lambda r: -r[1])
    print('待删重复句 %d 处，涉及 %d 篇' % (sum(r[1] for r in rows), len(rows)))
    for slug, n, _, _ in rows[:args.top]:
        print('  %-56s %d' % (slug, n))
    if not args.apply:
        print('DRY-RUN（加 --apply 落盘）')
        return
    for slug, n, p, a in rows:
        json.dump(a, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('已落盘：%d 篇 / %d 处' % (len(rows), sum(r[1] for r in rows)))


if __name__ == '__main__':
    main()
