#!/usr/bin/env python3
"""统一品牌实体写法：Tradego / Tradego-Fasteners → TradeGo Fasteners。

GEO 视角：同一个实体在语料里出现多种写法，答案引擎无法把"Tradego-Fasteners"
和站内 Organization 的 "TradeGo Fasteners" 归一到同一实体，等于白给一次提及。
SEO 视角：品牌拼写不一致会分散品牌词的匹配信号。

规则：
  - `Tradego-Fasteners` / `Tradego Fasteners` / `TRADEGO FASTENERS` → `TradeGo Fasteners`
  - 单独出现的 `Tradego` → `TradeGo`
  - **URL / href / src 里的不改**（域名 tradego-fasteners.com 是真地址，改了就是坏链）
默认 dry-run。

用法：python3 scripts/fix-brand-case.py [--apply] [--slug S]
"""
import argparse, glob, json, os, re

PAT_MULTI = re.compile(r'(?<![A-Za-z])(?:Tradego|TRADEGO|tradego)[-\s](?:Fasteners|FASTENERS|fasteners)(?![A-Za-z])')
PAT_SOLO = re.compile(r'(?<![A-Za-z])Tradego(?![A-Za-z])')
PAT_ASSEMBLED = re.compile(r'(?<![A-Za-z])TradeGo[-]?Fasteners(?![A-Za-z])')
URLISH = re.compile(r'(https?://|www\.|href=|src=|tradego-fasteners\.com)')


def fix_text(s):
    """按空白切成 token，逐个替换；含 URL 标记的 token 整段跳过。"""
    n = 0
    out = []
    for tok in re.split(r'(\s+)', s):
        if any(m in tok for m in ('://', '/en/', 'href=', 'src=', 'tradego-fasteners.com')):
            out.append(tok)
            continue
        t2, k = PAT_MULTI.subn('TradeGo Fasteners', tok)
        t2, k3 = PAT_ASSEMBLED.subn('TradeGo Fasteners', t2)
        t2, k2 = PAT_SOLO.subn('TradeGo', t2)
        n += k + k2 + k3
        out.append(t2)
    return ''.join(out), n


def walk(node):
    """递归处理 JSON 里的所有字符串，返回替换数。"""
    n = 0
    if isinstance(node, str):
        new, k = fix_text(node)
        return new, k
    if isinstance(node, list):
        out = []
        for x in node:
            x2, k = walk(x)
            out.append(x2)
            n += k
        return out, n
    if isinstance(node, dict):
        out = {}
        for kk, v in node.items():
            v2, k = walk(v)
            out[kk] = v2
            n += k
        return out, n
    return node, 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--slug')
    args = ap.parse_args()
    files = [f'content/articles/{args.slug}.json'] if args.slug else sorted(glob.glob('content/articles/*.json'))
    n_art = n_rep = 0
    for p in files:
        a = json.load(open(p, encoding='utf-8'))
        new, k = walk(a)
        if k:
            n_art += 1
            n_rep += k
            print('  %-56s %d 处' % (os.path.basename(p), k))
            if args.apply:
                new['updated'] = '2026-11-25'
                json.dump(new, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
                open(p, 'a', encoding='utf-8').write('\n')
    print('%s：%d 篇 / %d 处' % ('已落盘' if args.apply else 'DRY-RUN', n_art, n_rep))


if __name__ == '__main__':
    main()
