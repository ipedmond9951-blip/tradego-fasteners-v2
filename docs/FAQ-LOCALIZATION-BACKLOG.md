# FAQ 多语种本地化 backlog（自动生成）

生成时间：2026-11-24 19:32　　重新生成：`python3 scripts/check-i18n-leakage.py --fix-list`

## 口径

- 判据：`sections[].faqItems[].q/a` 的 per-locale 字典里，非英文语种与 `en` 完全相同（ja/zh/ar/ru/hi 额外判书写系统）
- 目标：每种语言写原生问答，不允许英文原文混入（内容契约，见 docs/VERCEL-OPS.md 与 seo-ai-pipeline 技能）
- 修法建议：按文章分批，每批 20 篇，走 i18n 单段翻译通道（`i18n-minimax-section-translation` 规避 3 分钟超时）；先 es/de/fr/pt（拉丁语系可直接机翻+人工校对术语），再 ar/ru/hi/ja/zh

## 当前统计

```
扫描文章: 279
英文泄漏条目（按语种）:
  ar  1031
  hi  971
  pt  917
  ru  917
  de  917
  es  915
  fr  915
  ja  910
  zh  734
受影响文章: 169
   108 fastener-packaging-shipping-guide.json
   104 concrete-anchors-fasteners-guide.json
   104 roofing-screws-epdm-washer-guide.json
   104 thread-types-guide-metric-imperial.json
   104 zinc-plated-vs-black-phosphate-screws.json
   104 nylon-nuts-bolts-guide.json
   104 flat-washers-vs-spring-washers.json
   104 fastener-corrosion-resistance-guide.json
   104 carriage-bolts-specifications.json
   104 construction-fastener-standards-comparison.json
    96 china-fasteners-zimbabwe-procurement-guide.json
    90 bolt-types-applications-guide.json
    90 fastener-storage-handling-guide.json
    90 drc-diamond-mining-fasteners.json
    90 automotive-fasteners-guide.json
    90 rivets-blind-rivets-guide.json
    90 bolt-tightening-torque-guide.json
    90 bulk-fastener-ordering-strategies.json
    90 timber-fasteners-guide.json
    90 congo-brazzaville-fastener.json
```

## 已修样例

- `drywall-screws-complete-guide`：ja/zh 已补原生译文（2026-11-25），其余 8 语种待补
