"""按 git HEAD 版本的缩进回写文章 JSON，避免整文件重排噪声（经验 68/79）。

用法：
    import json_rewrite as jr
    p = 'content/articles/<slug>.json'
    d = jr.load(p)
    ... 改字段 ...
    jr.dump_same(p, d)
"""
import json, re, subprocess


def _head_indent(path):
    try:
        out = subprocess.run(['git', 'show', 'HEAD:' + path], capture_output=True, text=True, check=True).stdout
        second = out.split('\n')[1]
    except Exception:
        with open(path, encoding='utf-8') as f:
            f.readline()
            second = f.readline()
    return max(1, len(re.match(r'\s*', second).group(0)))


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def dump_same(path, data):
    indent = _head_indent(path)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=indent) + '\n')
    return indent
