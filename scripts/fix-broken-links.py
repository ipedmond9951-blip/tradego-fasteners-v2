#!/usr/bin/env python3
"""清理正文里被模板占位符搞坏的链接：href="/products/{'name': ...}"。
占位符对象被当成字符串塞进 href，前端渲染出 404 链接。按 slug 改写成 /en/products/<slug>。
默认 dry-run，--apply 落盘。
"""
import json, glob, re, sys

PAT = re.compile(r'href="/products/\{[^}]*\'slug\': \'([a-z0-9-]+)\'[^}]*\}"')

def main():
    apply = '--apply' in sys.argv
    total = 0
    for path in sorted(glob.glob('content/articles/*.json')):
        a = json.load(open(path))
        hit = 0
        for s in a.get('sections', []):
            for key in ('heading', 'body'):
                d = s.get(key)
                if not isinstance(d, dict):
                    continue
                for lang, text in list(d.items()):
                    if not isinstance(text, str):
                        continue
                    new, n = PAT.subn(lambda m: 'href="/en/products/%s"' % m.group(1), text)
                    if n:
                        d[lang] = new
                        hit += n
        if hit:
            total += hit
            print('%s: %d' % (path, hit))
            if apply:
                open(path, 'w').write(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
    print('共 %d 处%s' % (total, '' if apply else '（dry-run，加 --apply 落盘）'))

if __name__ == '__main__':
    main()
