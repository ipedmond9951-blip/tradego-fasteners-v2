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

# 2026-07-18 19:32 总裁命令: 加 loose JSON parser (Gemini 输出 HTML 引号不转义 → 标准 json.loads fail)
# 策略: 找到 JSON 块, 在每个 string value 内部自动转义未转义的 " 字符
def escape_unescaped_quotes_in_json(json_text):
    """Walk through json_text char by char. Inside string values, escape unescaped quotes."""
    result = []
    in_string = False
    i = 0
    while i < len(json_text):
        c = json_text[i]
        if not in_string:
            result.append(c)
            if c == '"':
                in_string = True
        else:
            # We're inside a string
            if c == '\\':
                # Escape sequence: keep as-is
                result.append(c)
                if i + 1 < len(json_text):
                    result.append(json_text[i + 1])
                    i += 1
            elif c == '"':
                # Unescaped quote inside a string — check if this is end of string
                # Heuristic: if next non-whitespace char is one of , } ] : then it's end of string
                # Otherwise, treat as content (escape it)
                j = i + 1
                while j < len(json_text) and json_text[j] in ' \t\n\r':
                    j += 1
                if j >= len(json_text) or json_text[j] in ',}]:':
                    # End of string
                    result.append(c)
                    in_string = False
                else:
                    # Content (unescaped quote inside string)
                    result.append('\\"')
            else:
                result.append(c)
        i += 1
    return ''.join(result)

m = re.search(r'\{[\s\S]*\}', text)
if not m:
    print(f"[error] no JSON match in {raw_file}", file=sys.stderr)
    print(f"[debug] text last 200: {repr(text[-200:])}", file=sys.stderr)
    sys.exit(1)

raw_json = m.group(0)
# 2026-07-18 19:32: 先尝试标准 json.loads, 失败则用 loose parser
d = None
try:
    d = json.loads(raw_json)
except json.JSONDecodeError as first_err:
    # 标准 parse 失败, 尝试 loose parse
    fixed_json = escape_unescaped_quotes_in_json(raw_json)
    try:
        d = json.loads(fixed_json)
    except json.JSONDecodeError as e:
        print(f"[error] JSON parse error (loose too): {e}", file=sys.stderr)
        print(f"[debug] text last 200: {repr(raw_json[-200:])}", file=sys.stderr)
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
    # 2026-07-20 fix: 单段格式 (i18n-single-section-minimax.sh 用) - 顶层是 {"heading": "...", "body": "..."}
    # 这种情况 minimax 返的是单段翻译, wrap 成 translations 格式给 merge_sec 用
    if isinstance(d, dict) and ('heading' in d or 'body' in d):
        # 占位 lang 标记为 'sec' (merge 时识别)
        d_wrapped = {'translations': {'sec': d}}
        with open(out_file, 'w') as f:
            json.dump(d_wrapped, f, ensure_ascii=False)
        h_len = len(d.get('heading', ''))
        b_len = len(d.get('body', ''))
        print(f"[ok] parsed single-section format heading={h_len}c body={b_len}c -> {out_file}")
        sys.exit(0)
    print(f"[error] no 'translations' key and not batch format. Got: {list(d.keys())}", file=sys.stderr)
    sys.exit(1)

with open(out_file, 'w') as f:
    json.dump(d, f, ensure_ascii=False)

n = len(d['translations'])
print(f"[ok] parsed {n} translations -> {out_file}")
sys.exit(0)
