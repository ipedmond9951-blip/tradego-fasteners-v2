# 内容契约待办清单

生成时间：2026-11-24 19:46　来源：`logs/content-contract-latest.json`

校验口径：1 篇文章，0 篇有 BLOCK，1 篇只有 WARN。 BLOCK 修完即可从基线摘除；WARN 按项目排期处理。


## FAQ 缺失或过短（GEO 结构化问答）（2 处 / 1 篇）

- `south-africa-fasteners-china-import-guide`：缺 faq 字段（GEO 结构化问答缺失，建议补）；FAQ 仅 0 条（建议 ≥3）

## 正文体量偏薄（历史资产）（2 处 / 1 篇）

- `south-africa-fasteners-china-import-guide`：英文正文 607 词 < 门槛 1600（历史资产，按 WARN 计）；中文正文 437 汉字，偏薄

---

推进方式：
1. 中文段落用 `scripts/fill_body_zh.py` 写入（带质量闸，≥120 汉字，或数字表按 ≥50 汉字+200 字符放行）。
2. 元描述/描述用 `scripts/fix_content_contract.py extract` 先从本语种正文重建；重建不出来的留人工。
3. 每修一批就 `python3 scripts/content_contract.py --write-baseline content/contract-baseline.json` 收窄基线。

