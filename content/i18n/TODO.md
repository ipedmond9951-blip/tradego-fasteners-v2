# 文章正文本地化补齐清单（body / heading 十语）

生成方式：`python3 scripts/body_i18n.py status`（当前缺语种文章 126 篇，多数是 2026-11-23 批量生成的 buying guide 系列）。

## 处理流程（每篇）

1. `python3 scripts/body_i18n.py init <slug>` —— 生成 `content/i18n/<slug>.json` 草稿（只含 en 原文）
2. 在草稿里补 es / fr / pt / ar / ru / ja / de / hi 的 `heading` 与 `body`（豆包直写，不机器翻译）
3. `python3 scripts/body_i18n.py merge <slug>` —— 合并回 `content/articles/<slug>.json`（en/zh 永不覆盖）
4. `python3 scripts/body_i18n.py verify <slug>` —— 十语齐全 + 长度比 + 非拉丁语种字符集检查
5. `python3 scripts/content_audit.py` 复跑，然后 git push 触发部署

## 优先级（按商业价值）

第一批（产品采购指南，直连询盘）：
1. roofing-screws-buying-guide —— **已完成 es/fr/pt**（ar/ru/ja/de/hi 待补）
2. chemical-anchors-buying-guide
3. bolt-anchors-buying-guide
4. expansion-bolts-buying-guide
5. drywall-anchors-buying-guide
6. self-drilling / chipboard / coach screws 系列

第二批（市场与物流，支撑区域询盘）：
- tanzania-ibr-roofing-fasteners-dar-es-salaam（最新发布，目前仅 en/zh）
- kenya-mombasa-port-fastener-warehouse-guide
- nigeria-lekki-port-construction-fastener-logistics
- morocco-tangier-med-port-fastener-re-export
- egypt-suez-canal-industrial-fastener-tariff
- roofing-screws-vs-ibr-nails

第三批：2026-08 的 africa-* 系列与 2026-07 的 emergency 系列（低流量，最后补）

## 口径

- 译文按目标市场语言写，术语用当地工程习惯（es: correa/limahoya；fr: panne/noue；pt: terça/rincão；ar: مدادة/مزراب）
- 不塞英文原文；品牌名与标准号（TEK、EPDM、Ruspert、IBR、HDG、SANS、EN 14592）保持原样
- 单篇一次补 3–5 个语种，避免长输出截断

## 阶段化补齐策略（2026-11-24 起）
- 用户确认：先铺阶段一 `es/fr/pt/ar`（法语非洲、莫桑比克/安哥拉、北非阿语市场），再补 `ru/de/ja/hi`。
- 阶段一校验：`python3 scripts/body_i18n.py verify <slug> --phase1`（只查 en/zh/es/fr/pt/ar）。
- 一篇阶段一齐全即可 merge 上线，不必等十语；阶段二补齐时按同 slug 追加 `*.ru.json` 等草稿后再次 merge。
- 部署额度约束：每次 push 计 1 次 Vercel 部署（Hobby 100 次/天），多篇攒一批再推。
