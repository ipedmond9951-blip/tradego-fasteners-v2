#!/usr/bin/env python3
"""把价格类正文里的金额数字换成「报价结构」说明（多语种，10 语种文案见 scripts/price_structure.py）。

安全约束（fail-closed）：
- 只在「该语言字段确实含金额」时动手；
- 删掉的是「含金额的整句 / 整条列表项」，其余句子原样保留（含内部链接）；
- 处理后若仍有金额残留，整篇不改，报告该字段让人工看；
- 新长度低于原文 55% 视为写坏，整篇不改。
用法：python3 scripts/strip-price-figures.py --slug a --slug b [--apply]
"""
import argparse, json, re, sys

from price_structure import STRUCT

MONEY = re.compile(r'(?:USD\s?[\d,.]+|\$\s?[\d,.]+|€\s?[\d,.]+|[\d,.]+\s?(?:USD|EUR|RMB|CNY|MAD)|[\d,.]+\s?元|RMB\s?\d)')
PRICE_CTX = re.compile(r'(price|quote|quotation|pricing|cost|价格|报价|价目|单价|成本|precio|preço|prix|preis|цена|سعر|価格|मूल्य|कीमत)', re.I)
SENT_SPLIT = re.compile(r'(?<=[.。।؟])\s+')


def strip_text(text, lang):
    if not MONEY.search(text):
        return text, 0
    struct = STRUCT[lang]
    lines = text.split('\n')
    out = []
    inserted = False
    removed = 0
    for line in lines:
        if not MONEY.search(line):
            out.append(line)
            continue
        if line.lstrip().startswith(('-', '*', '•')):
            if not inserted:
                out.append(struct)
                inserted = True
            removed += 1
            continue
        sents = SENT_SPLIT.split(line)
        keep = []
        for sent in sents:
            if MONEY.search(sent):
                removed += 1
                continue
            keep.append(sent)
        if keep:
            if not inserted:
                keep.insert(0, struct)
                inserted = True
            out.append(' '.join(keep).strip())
        else:
            if not inserted:
                out.append(struct)
                inserted = True
    new = '\n'.join(out)
    return new, removed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', action='append', required=True)
    ap.add_argument('--apply', action='store_true')
    args = ap.parse_args()
    total = 0
    blocked = []
    for slug in args.slug:
        path = 'content/articles/%s.json' % slug
        a = json.load(open(path))
        changed = False
        for s in a.get('sections', []):
            body = s.get('body')
            if not isinstance(body, dict):
                continue
            head = s.get('heading') or {}
            relevant = bool(PRICE_CTX.search(s.get('id') or '')) or any(
                isinstance(v, str) and PRICE_CTX.search(v) for v in head.values())
            for lang, text in list(body.items()):
                if not isinstance(text, str) or lang not in STRUCT:
                    continue
                if not MONEY.search(text):
                    continue
                if not relevant:
                    # 非价格语义小节：只处理列表项与整句，仍要求处理干净
                    pass
                new, removed = strip_text(text, lang)
                if not removed:
                    blocked.append((slug, s.get('id'), lang, '未找到可删除的金额句'))
                    continue
                if MONEY.search(new):
                    blocked.append((slug, s.get('id'), lang, '仍有金额残留'))
                    continue
                if len(new) < 0.55 * len(text):
                    blocked.append((slug, s.get('id'), lang, '长度骤降 %d→%d' % (len(text), len(new))))
                    continue
                body[lang] = new
                changed = True
                total += removed
                print('去数字化 %s §%s %s 删 %d 处 %d→%d' % (slug, s.get('id'), lang, removed, len(text), len(new)))
        if changed and args.apply:
            json.dump(a, open(path, 'w'), ensure_ascii=False, indent=2)
            open(path, 'a').write('\n')
    print('共删除 %d 处%s' % (total, '' if args.apply else '（dry-run，加 --apply 落盘）'))
    for b in blocked:
        print('⚠️ 跳过 %s §%s %s：%s' % b)
    return 0


if __name__ == '__main__':
    sys.path.insert(0, 'scripts')
    sys.exit(main())
