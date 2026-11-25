#!/usr/bin/env python3
"""删掉同篇正文里整段重复的 <p> 块（AI 引擎最常过滤的模板特征）。

只处理「整块纯文本完全相同」的重复段落，保留第一处、删除后续；不做句子级手术，
所以不会把半句话切掉。默认 dry-run。

用法：python3 scripts/dedupe-body.py [--apply] [--slug S]
"""
import argparse, glob, json, re

P = re.compile(r'(<p[^>]*>.*?</p>)', re.I | re.S)
TAG = re.compile(r'<[^>]+>')


def plain(block):
    return re.sub(r'\s+', ' ', TAG.sub(' ', block)).strip()


def dedupe(text, seen):
    out, dropped = [], []
    for chunk in P.split(text):
        if P.fullmatch(chunk):
            key = plain(chunk)
            if len(key) >= 60 and key in seen:
                dropped.append(key[:90])
                continue
            seen.add(key)
        out.append(chunk)
    return ''.join(out), dropped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--slug')
    args = ap.parse_args()
    files = [f'content/articles/{args.slug}.json'] if args.slug else sorted(glob.glob('content/articles/*.json'))
    n_art = n_block = 0
    for p in files:
        a = json.load(open(p))
        changed = False
        seen_by_lang = {}
        for s in a['sections']:
            for lang, body in (s.get('body') or {}).items():
                if not isinstance(body, str):
                    continue
                new, dropped = dedupe(body, seen_by_lang.setdefault(lang, set()))
                if dropped:
                    n_block += len(dropped)
                    for bad in ('<p><p', '</p></strong>'):
                        if bad in new:            # 结构自检：标签反转/嵌套错位一律拒绝落盘
                            raise SystemExit('HTML 异常 %s %s: %s' % (a['slug'], lang, bad))
                    s['body'][lang] = new
                    changed = True
        if changed:
            n_art += 1
            if args.apply:
                json.dump(a, open(p, 'w'), ensure_ascii=False, indent=2)
                open(p, 'a').write('\n')
    print('%s：%d 篇、删除重复段落 %d 块' % ('已落盘' if args.apply else 'DRY-RUN', n_art, n_block))


if __name__ == '__main__':
    main()
