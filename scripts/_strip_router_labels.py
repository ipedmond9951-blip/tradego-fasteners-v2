#!/usr/bin/env python3
"""剥掉 ai-router 浏览器通道给回复套的平台标签 / UI 文本 / 提问回显.

用法: python3 _strip_router_labels.py [prompt_file]   (正文从 stdin 读)
"""
import re
import sys

DROP_PREFIX = re.compile(r"^(Gemini|ChatGPT|Grok|Doubao|豆包|DeepSeek)\s*说$", re.IGNORECASE)
DROP_TRAIL = re.compile(
    r"^(Fast|Fast模式|思考中|(?:\w+)\s*已完成回复|已完成回复|DL Hardware)$", re.IGNORECASE
)
# ai-router / ai-guard 的运行日志、浏览器 UI 文本, 一律丢掉
NOISE = re.compile(
    r"^\[(gemini|grok|chatgpt|doubao|deepseek|send|tab|page|ai-guard|gemini-guard)"
    r"[^\]]*\]"
    r"|^=+.*=+$"
    r"|^🤔|^📍|^你$|^你说|^展开$|^收起$|^复制$|^编辑$|^重新生成$"
    r"|^与\s*\w+\s*对话$|^New$|^自动$|^Pro$|^Plus$"
    r"|其回答未必正确|AI 工具"
    r"|^https?://\S+$"
    r"|ai-guard|cooldown|duplicate_prompt|verify 失败|输入验证失败",
    re.IGNORECASE,
)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def main() -> None:
    prompt_lines: set[str] = set()
    if len(sys.argv) > 1:
        try:
            with open(sys.argv[1], encoding="utf-8") as fh:
                for line in fh.read().splitlines():
                    key = norm(line)
                    if len(key) >= 12:
                        prompt_lines.add(key)
        except OSError:
            pass

    raw = sys.stdin.read()
    lines = []
    for ln in raw.splitlines():
        key = norm(ln)
        if not key or NOISE.search(key):
            continue
        lines.append(ln.rstrip())

    # 平台会把提问原样回显在回答前面; 只剥"连续 ≥2 行都等于提问"的开头块,
    # 逐行删会误伤正文 (大纲 prompt 里本身带 JSON 示例), 所以按块处理.
    run = 0
    for ln in lines:
        if norm(ln) in prompt_lines:
            run += 1
        else:
            break
    if run >= 2 and run < len(lines):
        lines = lines[run:]

    changed = True
    while changed and lines:
        changed = False
        if DROP_PREFIX.match(lines[0].strip()):
            lines.pop(0)
            changed = True
        if lines and DROP_TRAIL.match(lines[-1].strip()):
            lines.pop()
            changed = True
    sys.stdout.write("\n".join(lines).strip())


if __name__ == "__main__":
    main()
