#!/usr/bin/env python3
"""fix-label-embeds.py —— 把"本地化字段里嵌着英文主题标签"的标签换成本地化标题。

由来：多篇新文章的本地化是按模板生成的，标题位/正文位塞进了英文主题标签
（如 "Fastener Quality Control: Inspection Procedures and Acceptance Criteria"），
渲染出来就是英文字符串，check-body-lang.py 会判成 english 级泄漏。

判据：同一英文串（>=4 词）在该文的本地化字段里出现 >=3 次，且各语种都有本地化标题。
动作：把该英文串替换成该语种的 `title`；标题位保留原样即可，正文位读起来是"主语"。

用法：
  python3 fix-label-embeds.py            # 只报告
  python3 fix-label-embeds.py --apply    # 落盘
"""
import argparse, glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
LANGS = ["zh", "es", "fr", "pt", "de", "ja", "ru", "ar", "hi"]
RUN = re.compile(r"[A-Za-z][A-Za-z0-9 ,:&'\-]{15,}[A-Za-z0-9]")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    changed_files, changed_fields = 0, 0
    missing = []
    for p in sorted(glob.glob(os.path.join(ART, "*.json"))):
        d = json.load(open(p, encoding="utf-8"))
        t = d.get("title") or {}
        if not (t.get("en") or "").strip():
            continue
        counts = {}
        for s in d.get("sections", []):
            for fld in ("heading", "body"):
                for lg, v in (s.get(fld) or {}).items():
                    if lg == "en" or not isinstance(v, str):
                        continue
                    for m in RUN.findall(v):
                        m = m.strip()
                        if len(m.split()) >= 4 and "/" not in m:
                            counts[m] = counts.get(m, 0) + 1
        if not counts:
            continue
        # 只动"像标题"的英文串：与英文标题词重叠 >=60% 且长度接近。
        # 宁可漏修，也不能把正文里的普通英文句子替换成标题。
        title_en = (t.get("en") or "").strip()
        tw = set(re.findall(r"[a-z0-9]+", title_en.lower()))
        best, best_n = None, 0
        for m, c in counts.items():
            if c < 2 or len(m.split()) < 4:
                continue
            mw = set(re.findall(r"[a-z0-9]+", m.lower()))
            if not mw or not tw:
                continue
            jac = len(mw & tw) / len(mw | tw)
            if jac >= 0.6 and len(m) >= 0.7 * len(title_en):
                if c > best_n or (c == best_n and len(m) > len(best or "")):
                    best, best_n = m, c
        if not best:
            continue
        label, n = best, best_n
        # 每个语种都要有本地化标题（不能等于英文标题），否则跳过该语种
        missing = [lg for lg in LANGS if not (t.get(lg) or "").strip() or (t.get(lg) or "") == t.get("en")]
        fixed = 0
        for s in d.get("sections", []):
            for fld in ("heading", "body"):
                for lg, v in (s.get(fld) or {}).items():
                    if lg == "en" or lg in missing or not isinstance(v, str):
                        continue
                    if label in v:
                        s[fld][lg] = v.replace(label, t[lg].strip())
                        fixed += 1
        if fixed:
            changed_files += 1
            changed_fields += fixed
            print(f"{'✅' if a.apply else '待改'} {os.path.basename(p)[:-5]}: {fixed} 处 ← {label[:60]}")
            if a.apply:
                json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
                open(p, "a").write("\n")
    print(f"\n{'已替换' if a.apply else '待替换'} {changed_fields} 处，涉及 {changed_files} 篇")
    if missing:
        print("（有语种缺本地化标题，已跳过这些语种）")


if __name__ == "__main__":
    sys.exit(main())
