#!/usr/bin/env python3
"""faq-apply.py —— 把人工/其它来源的 FAQ 译文落盘（不依赖写作通道）。

通道（llm_client）断了时，由 Agent 自己译好、按 {"slug":{"items":[{q:{lang:..},a:{lang:..}}]}} 落成 JSON，
再用本脚本校验并写入，避免手写 python 片段改错文件。

校验规则：每篇非空 FAQ 条数必须与 items 条数完全一致，任一不匹配即整篇跳过（不猜顺序）。
用法：
  python3 scripts/faq-apply.py /tmp/faq.json
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lang_guard  # noqa: E402


def _reason(lang, v, en):
    """写入口语言校验：值必须命中目标语种书写系统，且不得回吐中文。"""
    return lang_guard.reason(lang, v, en)


def main(path):
    patch = json.load(open(path, encoding="utf-8"))
    ok, bad = 0, []
    for slug, p in patch.items():
        f = os.path.join(ROOT, "content/articles", f"{slug}.json")
        if not os.path.exists(f):
            bad.append(f"{slug}: 文件不存在"); continue
        d = json.load(open(f, encoding="utf-8"))
        written = 0
        # 先跨 section 收集非空 FAQ（一篇文章的 FAQ 可能分散在多个 section）
        allitems = []
        for sec in d.get("sections", []):
            items = sec.get("faqItems") or []
            if not items:
                continue
            if p.get("drop_empty"):
                items = [it for it in items if ((it.get("q") or {}).get("en") or "").strip()]
                sec["faqItems"] = items
            allitems.append((sec, items))
        flat = [it for _, items in allitems for it in items]
        if len(flat) != len(p["items"]):
            bad.append(f"{slug}: 条数不符（文件 {len(flat)} / 译文 {len(p['items'])}）")
            continue
        idx = 0
        dropped = []
        for _sec, items in allitems:
            for it in items:
                t = p["items"][idx]; idx += 1
                for fld in ("q", "a"):
                    for lang, v in (t.get(fld) or {}).items():
                        if lang == "en":
                            it.setdefault(fld, {})[lang] = v.strip()
                            written += 1
                            continue
                        en_ref = ((it.get(fld) or {}).get("en") or "").strip()
                        why = _reason(lang, v, en_ref)
                        if why:
                            dropped.append(f"{slug} {fld}.{lang} {why}")
                            continue
                        it.setdefault(fld, {})[lang] = v.strip()
                        written += 1
        if dropped:
            print(f"   ⚠️  丢弃 {len(dropped)} 个不合格值：" + "; ".join(dropped[:5]))
        json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        open(f, "a").write("\n")
        print(f"✅ {slug}: 写入 {written} 条")
        ok += 1
    print(f"\n落盘 {ok} 篇" + (f"，跳过 {len(bad)} 篇：" if bad else ""))
    for b in bad:
        print("  ✗", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
