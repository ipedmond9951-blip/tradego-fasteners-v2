#!/usr/bin/env python3
"""normalize-faq-i18n.py —— 把"非英文语种其实是英文原文"的伪翻译从数据里清掉。

这些值不带任何信息（与 en 逐字相同），留着只会让后续脚本误判"已本地化"。
清掉后 HTML 不再出现英文问答（渲染层已加 native-only 判定），且文件更小。

用法：
  python3 scripts/normalize-faq-i18n.py --dry-run           # 全量统计
  python3 scripts/normalize-faq-i18n.py --apply             # 全量清理
  python3 scripts/normalize-faq-i18n.py --apply --paths a.json,b.json
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
SCRIPT = {
    "ja": re.compile(r"[\u3040-\u30ff\u4e00-\u9fff]"),
    "zh": re.compile(r"[\u3040-\u30ff\u4e00-\u9fff]"),
    "ar": re.compile(r"[\u0600-\u06FF]"),
    "ru": re.compile(r"[\u0400-\u04FF]"),
    "hi": re.compile(r"[\u0900-\u097F]"),
}


def clean_file(path, apply):
    d = json.load(open(path, encoding="utf-8"))
    removed = 0
    for sec in d.get("sections", []):
        for it in (sec.get("faqItems") or []):
            for fld in ("q", "a"):
                val = it.get(fld) or {}
                en = (val.get("en") or "").strip()
                if not en:
                    continue
                for lang in LANGS:
                    v = (val.get(lang) or "").strip()
                    if not v:
                        continue
                    bad = (v == en) or (lang in SCRIPT and not SCRIPT[lang].search(v))
                    if bad:
                        del val[lang]
                        removed += 1
    if apply and removed:
        json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        open(path, "a").write("\n")
    return removed


def main(apply, paths):
    files = paths or sorted(glob.glob(os.path.join(ROOT, "content/articles/*.json")))
    total, arts = 0, 0
    for f in files:
        n = clean_file(f, apply)
        if n:
            total += n; arts += 1
            if apply and len(files) < 20:
                print(f"  {os.path.basename(f)[:-5]}: 清除 {n} 条伪翻译")
    print(f"{'已清理' if apply else '待清理'}：{total} 条，涉及 {arts} 篇")
    return 0


if __name__ == "__main__":
    paths = []
    if "--paths" in sys.argv:
        paths = [x for x in sys.argv[sys.argv.index("--paths") + 1].split(",") if x]
        paths = [p if os.path.isabs(p) else os.path.join(ROOT, p) for p in paths]
    sys.exit(main("--apply" in sys.argv, paths))
