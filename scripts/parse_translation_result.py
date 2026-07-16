#!/usr/bin/env python3
"""Parse AI response for translation result. Usage: python3 parse_translation_result.py <raw_file> <out_file>"""
import sys, json, re

raw_file = sys.argv[1]
out_file = sys.argv[2]

try:
    with open(raw_file) as f:
        text = f.read()
except Exception as e:
    print(f"[error] cannot read {raw_file}: {e}", file=sys.stderr)
    sys.exit(2)

text = re.sub(r'```(?:json)?', '', text)
m = re.search(r'\{[\s\S]*\}', text)
if not m:
    print(f"[error] no JSON match in {raw_file}", file=sys.stderr)
    print(f"[debug] text last 200: {repr(text[-200:])}", file=sys.stderr)
    sys.exit(1)

try:
    d = json.loads(m.group(0))
except Exception as e:
    print(f"[error] JSON parse error: {e}", file=sys.stderr)
    sys.exit(1)

if 'translations' not in d:
    # 2026-07-16 fix: v2 batch 格式 - 顶层直接是 lang key ({"es":[...], "ar":[...]})
    # 检查是否每个顶层 key 都是已知 lang, 且 value 是 list of {idx, translation}
    LANGS = {'es','ar','fr','pt','ru','ja','de','hi'}
    is_batch_format = all(k in LANGS for k in d.keys()) and \
                      all(isinstance(v, list) for v in d.values())
    if is_batch_format:
        # wrap 成 translations 格式给 merge_batch 用
        d_wrapped = {'translations': d}
        with open(out_file, 'w') as f:
            json.dump(d_wrapped, f, ensure_ascii=False)
        total = sum(len(v) for v in d.values())
        print(f"[ok] parsed batch format {len(d)} langs / {total} translations -> {out_file}")
        sys.exit(0)
    print(f"[error] no 'translations' key and not batch format. Got: {list(d.keys())}", file=sys.stderr)
    sys.exit(1)

with open(out_file, 'w') as f:
    json.dump(d, f, ensure_ascii=False)

n = len(d['translations'])
print(f"[ok] parsed {n} translations -> {out_file}")
sys.exit(0)
