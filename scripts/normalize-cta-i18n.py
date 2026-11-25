#!/usr/bin/env python3
"""normalize-cta-i18n.py — 清掉 CTA 里的伪翻译（与 en 逐字相同 / 语种字符集不符 / 残留占位符）

背景（2026-11-26）：
渲染层已经按 native-only 回落本地化通用 CTA（page.tsx 的 ctaNative()），页面上不会再露英文按钮。
但数据层还留着几百条 "ar/ru/hi = 英文原文" 的副本，会让 check-i18n-leakage.py 的 CTA 遥测一直挂着，
也让后面想统计"真实本地化覆盖"的人分不清。删掉这些伪值等于把数据和渲染口径对齐：删完输出不变，
文件更干净。

判据与 FAQ 归一化保持一致：
  - 该语种值 == en  → 伪翻译，删
  - ar/ru/hi 用对应字符集、ja/zh 用 CJK 校验，不符 → 错语种占位，删
  - 值里含 {topic} → 不可用占位符，非 en 一律删
  - en 永不改；其它语种的真译文一律不动

用法：
  python3 scripts/normalize-cta-i18n.py            # 只报告
  python3 scripts/normalize-cta-i18n.py --apply    # 落盘
  python3 scripts/normalize-cta-i18n.py --paths a.json,b.json   # 只处理指定文件
"""
import argparse
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
FIELDS = ("text", "buttonText")

SCRIPTS = {
    "ar": re.compile(r"[\u0600-\u06ff]"),
    "ru": re.compile(r"[\u0400-\u04ff]"),
    "hi": re.compile(r"[\u0900-\u097f]"),
    "ja": re.compile(r"[\u3040-\u30ff\u4e00-\u9fff]"),
    "zh": re.compile(r"[\u4e00-\u9fff]"),
}


def why_drop(lang, value, en):
    v = value.strip()
    if not v:
        return "empty"
    if v == en:
        return "same-as-en"
    if "{topic}" in v:
        return "placeholder"
    rx = SCRIPTS.get(lang)
    if rx and not rx.search(v):
        return "wrong-script"
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--paths", default="")
    args = ap.parse_args()

    if args.paths:
        files = [p.strip() if os.path.isabs(p.strip()) else os.path.join(ART, os.path.basename(p.strip()))
                 for p in args.paths.split(",") if p.strip()]
    else:
        files = sorted(glob.glob(os.path.join(ART, "*.json")))

    total = 0
    per_reason = {}
    touched = 0
    for f in files:
        try:
            d = json.load(open(f, encoding="utf-8"))
        except Exception:
            continue
        cta = d.get("cta")
        if not isinstance(cta, dict):
            continue
        changed = False
        for field in FIELDS:
            vals = cta.get(field)
            if not isinstance(vals, dict):
                continue
            en = (vals.get("en") or "").strip()
            for lang in list(vals.keys()):
                if lang == "en":
                    continue
                reason = why_drop(lang, vals[lang] if isinstance(vals[lang], str) else "", en)
                if not reason:
                    continue
                # 只处理已知语种槽位，避免误删未来新增的字段
                if lang not in LANGS:
                    continue
                total += 1
                per_reason[reason] = per_reason.get(reason, 0) + 1
                del vals[lang]
                changed = True
        if changed:
            touched += 1
            if args.apply:
                json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
                open(f, "a").write("\n")

    print(f"{'已删除' if args.apply else '待删除'} CTA 伪翻译 {total} 处，涉及 {touched} 篇")
    for k, v in sorted(per_reason.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    if not args.apply:
        print("（只报告，未落盘；加 --apply 执行）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
