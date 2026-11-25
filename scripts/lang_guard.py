#!/usr/bin/env python3
"""lang_guard.py —— 多语种写入口的统一语言校验（所有机器译文落盘前都过这一层）

为什么单独抽出来：写作通道会限流（429），限流后模型偶尔把"翻译"回吐成中文或
其它语种。这类值非空、也不等于 en，会绕过渲染层的 native-only 判定，直接显示在
阿拉伯语/印地语等页面上。所以校验必须放在**写入口**，而不是只靠事后巡检。

用法：
    from lang_guard import ok, reason, LANGS

    good, why = ok("ar", value, en_text)
    if not good:
        print(f"丢弃：{why}")
"""
import re

LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]

HAN = re.compile(r"[\u4e00-\u9fff]")
KANA_HAN = re.compile(r"[\u3040-\u30ff\u4e00-\u9fff]")
ARABIC = re.compile(r"[\u0600-\u06ff]")
CYRILLIC = re.compile(r"[\u0400-\u04ff]")
DEVANAGARI = re.compile(r"[\u0900-\u097f]")

# 有独立书写系统的语种：值必须命中对应字符集
SCRIPTS = {"ar": ARABIC, "ru": CYRILLIC, "hi": DEVANAGARI, "ja": KANA_HAN, "zh": HAN}
# 拉丁字母语种：命中任何异种文字都算污染
FOREIGN = re.compile(r"[\u4e00-\u9fff\u3040-\u30ff\u0600-\u06ff\u0400-\u04ff\u0900-\u097f]")
# 这些语种里出现汉字是明确的错语种回吐（ja 除外，日文本来就有汉字）
NO_HAN = ["es", "fr", "pt", "de", "ar", "ru", "hi"]


def reason(lang, v, en=""):
    """返回不可用原因；可用则返回 None。"""
    v = (v or "").strip()
    en = (en or "").strip()
    if not v:
        return "empty"
    if en and v == en:
        return "same-as-en"
    if "{topic}" in v:
        return "placeholder"
    rx = SCRIPTS.get(lang)
    if rx and not rx.search(v):
        return "wrong-script"
    if lang in NO_HAN and HAN.search(v):
        return "chinese-leaked"
    if lang not in SCRIPTS and FOREIGN.search(v):
        return "foreign-script"
    return None


def ok(lang, v, en=""):
    """(bool, reason) 便捷封装。"""
    why = reason(lang, v, en)
    return (why is None, why)


def filter_items(items, fields=("q", "a")):
    """从 patch 结构里剔掉不合格的值（原地修改），返回被丢弃的列表。"""
    dropped = []
    for it in items:
        for fld in fields:
            d = it.get(fld) or {}
            en = (d.get("en") or "").strip()
            for lang in list(d.keys()):
                if lang == "en":
                    continue
                why = reason(lang, d.get(lang) if isinstance(d.get(lang), str) else "", en)
                if why:
                    dropped.append((fld, lang, why, (d.get(lang) or "")[:40]))
                    del d[lang]
    return dropped


if __name__ == "__main__":
    import json, sys
    sample = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {"ar": "这是中文", "en": "Which anchor?"}
    for k, v in sample.items():
        if k == "en":
            continue
        print(k, ok(k, v, sample.get("en", "")))
