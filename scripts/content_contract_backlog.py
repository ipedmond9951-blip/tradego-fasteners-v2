#!/usr/bin/env python3
"""把内容契约报告整理成可分批推进的待办清单（markdown）。

用法：python3 scripts/content_contract_backlog.py [report.json] [-o out.md]
默认读 logs/content-contract-latest.json，写 docs/content-contract-backlog.md
"""
import json, os, sys, collections, datetime

LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    report = args[0] if args else "logs/content-contract-latest.json"
    out = "docs/content-contract-backlog.md"
    if "-o" in sys.argv:
        out = sys.argv[sys.argv.index("-o") + 1]
    r = json.load(open(report, encoding="utf-8"))
    arts = r["articles"]

    groups = collections.OrderedDict([
        ("中文正文占位（需补写真实中文段落）", []),
        ("英文夹带未清（本地化标题/描述/元描述需重写）", []),
        ("配图/结构/日期类", []),
    ])
    faq, body = [], []

    for a in arts:
        for i in a["block"]:
            c, m = i["check"], i["msg"]
            if c == "placeholder":
                groups["中文正文占位（需补写真实中文段落）"].append((a["slug"], m))
            elif c in ("i18n-copy", "i18n-mixed", "i18n-script", "i18n-missing", "lang-leak"):
                groups["英文夹带未清（本地化标题/描述/元描述需重写）"].append((a["slug"], m))
            else:
                groups["配图/结构/日期类"].append((a["slug"], m))
        for i in a["warn"]:
            if i["check"] == "faq":
                faq.append((a["slug"], i["msg"]))
            elif i["check"] == "body-size":
                body.append((a["slug"], i["msg"]))

    lines = [f"# 内容契约待办清单\n", f"生成时间：{datetime.datetime.now():%Y-%m-%d %H:%M}　来源：`{report}`\n",
             f"校验口径：{r['total']} 篇文章，{r['blocked']} 篇有 BLOCK，{r['warned']} 篇只有 WARN。"
             " BLOCK 修完即可从基线摘除；WARN 按项目排期处理。\n"]
    for title, items in groups.items():
        if not items:
            continue
        lines.append(f"\n## {title}（{len(items)} 处 / {len({s for s,_ in items})} 篇）\n")
        by_slug = collections.defaultdict(list)
        for s, m in items:
            by_slug[s].append(m)
        for s in sorted(by_slug):
            lines.append(f"- `{s}`：" + "；".join(by_slug[s])[:200])
    for title, items in (("FAQ 缺失或过短（GEO 结构化问答）", faq), ("正文体量偏薄（历史资产）", body)):
        if items:
            by_slug = collections.defaultdict(list)
            for s, m in items:
                by_slug[s].append(m)
            lines.append(f"\n## {title}（{len(items)} 处 / {len(by_slug)} 篇）\n")
            for s in sorted(by_slug):
                lines.append(f"- `{s}`：" + "；".join(by_slug[s]))

    lines.append("\n---\n\n推进方式：\n"
                 "1. 中文段落用 `scripts/fill_body_zh.py` 写入（带质量闸，≥120 汉字，或数字表按 ≥50 汉字+200 字符放行）。\n"
                 "2. 元描述/描述用 `scripts/fix_content_contract.py extract` 先从本语种正文重建；重建不出来的留人工。\n"
                 "3. 每修一批就 `python3 scripts/content_contract.py --write-baseline content/contract-baseline.json` 收窄基线。\n")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"写入 {out}：BLOCK {len([1 for g in groups.values() for _ in g])} 处，FAQ {len(faq)}，体量 {len(body)}")


if __name__ == "__main__":
    main()
