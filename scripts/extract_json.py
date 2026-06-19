#!/usr/bin/env python3
"""Extract the LARGEST valid JSON object or array from stdin.

Usage: cat ai_output.txt | python3 extract_json.py
Prints the JSON to stdout. Exits 0 if found, 1 if not.

Strategy:
- Find ALL balanced JSON candidates (object or array)
- Try each as-is; if it parses, also try it AFTER applying LLM error fixes
- Pick the LARGEST valid one (deepest nesting = full outline, not just a section)

Handles:
- Markdown code fences: ```json\n{...}\n```
- Common LLM errors (single quotes via balanced replacement, trailing commas, unescaped newlines/tabs)
- Prefers outermost (largest) JSON
"""
import json
import re
import sys


def find_json_objects(text: str):
    """Yield candidate JSON substrings by scanning for balanced braces/brackets."""
    candidates = []
    for opener, closer in [('{', '}'), ('[', ']')]:
        i = 0
        while i < len(text):
            j = text.find(opener, i)
            if j == -1:
                break
            depth = 0
            k = j
            in_string = False
            escape = False
            while k < len(text):
                c = text[k]
                if escape:
                    escape = False
                elif c == '\\':
                    escape = True
                elif c == '"':
                    in_string = not in_string
                elif not in_string:
                    if c == opener:
                        depth += 1
                    elif c == closer:
                        depth -= 1
                        if depth == 0:
                            candidates.append((j, k+1, text[j:k+1]))
                            break
                k += 1
            i = j + 1
    return candidates


def fix_common_llm_errors(text: str) -> str:
    """Try to fix common LLM JSON output errors.

    1. Remove trailing commas before } or ]
    2. Escape unescaped newlines/tabs inside strings
    """
    # 1. Trailing commas: ,} or ,]
    text = re.sub(r',(\s*[}\]])', r'\1', text)

    # 2. Escape unescaped newlines/tabs inside strings
    result = []
    i = 0
    in_string = False
    escape = False
    while i < len(text):
        c = text[i]
        if escape:
            result.append(c)
            escape = False
        elif c == '\\':
            result.append(c)
            escape = True
        elif c == '"':
            result.append(c)
            in_string = not in_string
        elif in_string and c == '\n':
            result.append('\\n')
        elif in_string and c == '\r':
            result.append('\\r')
        elif in_string and c == '\t':
            result.append('\\t')
        else:
            result.append(c)
        i += 1
    return ''.join(result)


def try_parse(text: str):
    """Try to parse text as JSON, return obj or None."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def score_candidate(obj) -> int:
    """Score a parsed JSON object. Higher = more likely the desired outline.

    Outline should have: title, sections, faqs, dataSources.
    """
    if not isinstance(obj, dict):
        return 0
    score = 0
    if 'title' in obj:
        score += 5
    if 'sections' in obj and isinstance(obj['sections'], list):
        score += 10 + min(len(obj['sections']), 10)
    if 'faqs' in obj and isinstance(obj['faqs'], list):
        score += 5 + min(len(obj['faqs']), 5)
    if 'dataSources' in obj and isinstance(obj['dataSources'], list):
        score += 5 + min(len(obj['dataSources']), 5)
    return score


def main():
    text = sys.stdin.read()
    if not text.strip():
        sys.exit(1)

    # Strip markdown code fences
    fenced = re.search(r'```(?:json)?\s*\n(.*?)\n```', text, re.DOTALL)
    if fenced:
        text_to_scan = fenced.group(1)
    else:
        text_to_scan = text

    # Collect all candidates
    candidates = find_json_objects(text_to_scan)
    if not candidates:
        # Apply LLM error fixes and retry
        fixed_text = fix_common_llm_errors(text_to_scan)
        candidates = find_json_objects(fixed_text)

    # Try each candidate; pick the one with highest score
    best = None
    best_score = 0
    for start, end, cand in candidates:
        obj = try_parse(cand)
        if obj is None:
            fixed_cand = fix_common_llm_errors(cand)
            obj = try_parse(fixed_cand)
        if obj is None:
            continue
        s = score_candidate(obj)
        if s > best_score:
            best_score = s
            best = obj

    if best is not None:
        json.dump(best, sys.stdout, ensure_ascii=False)
        sys.exit(0)

    sys.exit(1)


if __name__ == '__main__':
    main()
