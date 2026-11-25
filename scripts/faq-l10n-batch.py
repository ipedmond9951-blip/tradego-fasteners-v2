#!/usr/bin/env python3
"""faq-l10n-batch.py —— 批量把 faqItems 的英文原文翻成各语种原生问答。

背景：169 篇文章的 faqItems 在 9 个语种里都填着英文原文（约 9000 条），
渲染后非英文页面露出英文，违反内容契约。本脚本按文章分批，逐条机翻+术语约束，
写回 content/articles/<slug>.json，进度落 logs/faq-l10n-progress.json。

用法：
  python3 scripts/faq-l10n-batch.py --langs ja --batch 10
  python3 scripts/faq-l10n-batch.py --slug drywall-screws-complete-guide --langs ja,zh
  python3 scripts/faq-l10n-batch.py --langs ja --batch 20 --dry-run
"""
import argparse, glob, json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import llm_client  # noqa: E402

PROGRESS = os.path.join(ROOT, "logs", "faq-l10n-progress.json")
LANGS = {"zh": "简体中文", "ja": "日本語", "es": "Español", "fr": "Français", "pt": "Português",
         "ar": "العربية", "ru": "Русский", "de": "Deutsch", "hi": "हिन्दी"}
CJK = re.compile(r"[ぁ-んァ-ヶ一-龠]")
ARABIC = re.compile(r"[\u0600-\u06FF]")
CYRILLIC = re.compile(r"[\u0400-\u04FF]")
DEVANAGARI = re.compile(r"[\u0900-\u097F]")
SCRIPTS = {"ja": CJK, "zh": CJK, "ar": ARABIC, "ru": CYRILLIC, "hi": DEVANAGARI}

GLOSSARY = """术语（英文→日/中）：
drywall screw=石膏ボード用ビス/石膏板螺钉; drywall=石膏ボード/石膏板; stud=下地（スタッド）/龙骨;
joist=根太/托梁; head=頭部/螺帽头部; thread=ねじ山/螺牙; coarse thread=粗ねじ/粗牙; fine thread=細ねじ/细牙;
shear strength=せん断強度/抗剪强度; holding power=保持力/握钉力; stripping=ねじ山の崩れ/螺牙打滑;
code-compliant=法規適合/符合规范; AHJ=所轄建築行政/当地建筑主管部门; gauge=ゲージ/规格号;
zinc plating=亜鉛めっき/镀锌; EPDM washer=EPDMワッシャー/EPDM垫圈."""

def enof(it, field="q"):
    d = it.get(field) or {}
    v = (d.get("en") or "").strip()
    if v: return v
    for k, x in d.items():
        if k != "en" and isinstance(x, str) and x.strip():
            return x.strip()
    return ""

def needs(value, en, lang):
    v = (value or "").strip()
    if not v:
        return True
    if v == en.strip():
        return True
    rx = SCRIPTS.get(lang)
    return bool(rx) and not rx.search(v)

def translate(lang, items):
    payload = [{"q": enof(it, "q"), "a": enof(it, "a")} for it in items]
    prompt = f"""你是{LANGS[lang]}母语的紧固件行业技术编辑。把下面英文 FAQ 译成{LANGS[lang]}原生问答。
要求：术语准确、语气专业、句子自然，不要直译腔；保留数字与单位（如 4×8、12"、32 screws）。
{GLOSSARY}
只输出 JSON 数组，形如 [{{"q":"...","a":"..."}}]，条数和顺序与输入一致，不要任何解释。
输入：{json.dumps(payload, ensure_ascii=False)}"""
    for attempt in range(2):
        out = llm_client.generate(prompt)
        m = re.search(r"\[[\s\S]*\]", out)
        if not m:
            time.sleep(2); continue
        try:
            arr = json.loads(m.group(0))
        except Exception:
            time.sleep(2); continue
        if len(arr) == len(items) and all(isinstance(x, dict) and x.get("q") and x.get("a") for x in arr):
            return arr
        time.sleep(2)
    return None

def load_progress():
    try:
        return json.load(open(PROGRESS))
    except Exception:
        return {}

def save_progress(p):
    os.makedirs(os.path.dirname(PROGRESS), exist_ok=True)
    json.dump(p, open(PROGRESS, "w"), ensure_ascii=False, indent=1)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", default="ja")
    ap.add_argument("--batch", type=int, default=10)
    ap.add_argument("--slug", default="")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    langs = [x.strip() for x in a.langs.split(",") if x.strip()]
    prog = load_progress()

    files = sorted(glob.glob(os.path.join(ROOT, "content/articles/*.json")))
    if a.slug:
        files = [f for f in files if os.path.basename(f) == a.slug + ".json"]
    else:
        # 优先处理泄漏最多的文章
        cand = []
        for f in files:
            try: d = json.load(open(f))
            except Exception: continue
            n = 0
            for sec in d.get("sections", []):
                for it in (sec.get("faqItems") or []):
                    for lang in langs:
                        if enof(it) and needs((it.get("q") or {}).get(lang), enof(it), lang): n += 1
            if n: cand.append((n, f))
        cand.sort(reverse=True)
        files = [f for _, f in cand][: a.batch]

    done_slugs, wrote = [], 0
    for f in files:
        slug = os.path.basename(f)[:-5]
        d = json.load(open(f))
        changed = False
        for sec in d.get("sections", []):
            items = [it for it in (sec.get("faqItems") or [])]
            for lang in langs:
                todo = [it for it in items
                        if enof(it) and needs((it.get("q") or {}).get(lang), enof(it), lang)]
                if not todo: continue
                if a.dry_run:
                    print(f"[dry] {slug} {lang} 待译 {len(todo)} 条"); continue
                arr = translate(lang, todo)
                if not arr:
                    print(f"⚠️  {slug} {lang} 翻译失败（跳过，下次重试）"); continue
                for it, t in zip(todo, arr):
                    it["q"][lang] = str(t["q"]).strip()
                    it["a"][lang] = str(t["a"]).strip()
                changed = True
                print(f"   {slug} {lang} 写入 {len(arr)} 条")
        if changed and not a.dry_run:
            json.dump(d, open(f, "w"), ensure_ascii=False, indent=2)
            open(f, "a").write("\n")
            wrote += 1
            done_slugs.append(slug)
            prog.setdefault("done", {})[slug] = {"langs": langs, "at": time.strftime("%F %T")}
            save_progress(prog)
    print(f"\n完成文章 {wrote} 篇：{', '.join(done_slugs) if done_slugs else '-'}")

if __name__ == "__main__":
    main()
