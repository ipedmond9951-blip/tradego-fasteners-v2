#!/usr/bin/env python3
"""check-i18n-leakage.py —— 抓"非英文语种里其实是英文原文"的内容泄漏。

背景：faqItems 的 q/a 是 per-locale 字典，历史上只填了 en（或批量复制 en），
渲染时非英文页面就露出英文原文，违反"每种语言原生标题与描述"的内容契约。

用法：
  python3 scripts/check-i18n-leakage.py            # 全量扫描，输出统计
  python3 scripts/check-i18n-leakage.py --strict   # 有泄漏则 exit 1（给 CI/hook 用）
  python3 scripts/check-i18n-leakage.py --fix-list # 额外列出文件清单
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
STRICT = "--strict" in sys.argv
LISTS = "--fix-list" in sys.argv
PATHS = []
if "--paths" in sys.argv:
    PATHS = [x.strip() for x in sys.argv[sys.argv.index("--paths") + 1].split(",") if x.strip()]
QUIET = "--quiet" in sys.argv

CJK = re.compile(r"[ぁ-んァ-ヶ一-龠]")
ARABIC = re.compile(r"[\u0600-\u06FF]")
CYRILLIC = re.compile(r"[\u0400-\u04FF]")
DEVANAGARI = re.compile(r"[\u0900-\u097F]")

def has_script(lang, text):
    """粗略判断该字符串是否用了对应语言的书写系统。拉丁语系（es/fr/pt/de）无法靠字符判断。"""
    if lang == "ja": return bool(CJK.search(text))
    if lang == "zh": return bool(CJK.search(text))
    if lang == "ar": return bool(ARABIC.search(text))
    if lang == "ru": return bool(CYRILLIC.search(text))
    if lang == "hi": return bool(DEVANAGARI.search(text))
    return True  # es/fr/pt/de 退化为"与 en 完全相同"判据

def scan(path):
    try:
        d = json.load(open(path))
    except Exception:
        return None
    out = {}
    for sec in d.get("sections", []):
        for it in (sec.get("faqItems") or []):
            for field in ("q", "a"):
                val = it.get(field) or {}
                en = (val.get("en") or "").strip()
                if not en:
                    continue
                for lang in LANGS:
                    v = (val.get(lang) or "").strip()
                    same = v == en
                    if lang in ("ja", "zh", "ar", "ru", "hi"):
                        bad = same or not has_script(lang, v) if v else True
                    else:
                        bad = same
                    if bad:
                        out.setdefault(lang, 0)
                        out[lang] += 1
    return out

files = (PATHS if PATHS
         else sorted(glob.glob(os.path.join(ROOT, "content/articles/*.json"))))
total = {}
bad_files = []
for f in files:
    r = scan(f)
    if r:
        bad_files.append((os.path.basename(f), sum(r.values())))
        for k, v in r.items():
            total[k] = total.get(k, 0) + v

if PATHS and STRICT:
    # 定向模式：只报"这次动过的文章"里还剩多少泄漏，给 content_gate 当硬闸门用
    for f in files:
        r = scan(f) or {}
        n = sum(r.values())
        if n:
            print(f"⛔ i18n 泄漏 {os.path.basename(f)[:-5]}: " +
                  " ".join(f"{k}={v}" for k, v in sorted(r.items())))
    sys.exit(1 if total else 0)

print("扫描文章:", len(files))
if total:
    print("英文泄漏条目（按语种）:")
    for k, v in sorted(total.items(), key=lambda x: -x[1]):
        print(f"  {k:3} {v}")
    print("受影响文章:", len(bad_files))
    if LISTS:
        for n, c in sorted(bad_files, key=lambda x: -x[1])[:20]:
            print(f"  {c:4} {n}")
else:
    print("✅ 未发现英文泄漏")
sys.exit(1 if (STRICT and total) else 0)
