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

## 工具与执行（2026-11-25）

- **字段真相**：页面渲染读 `faqItems[].q/a`（`localizedText(item.q, locale)`），`question/answer` 是历史空壳（700 条里有 5 条 q/a 本身全空，会渲染成空折叠块，已顺手清掉）。翻译只往 `q/a` 写。
- **批量器** `scripts/faq-l10n-batch.py`：按泄漏条数选篇 → 每篇每语种一次调用 → 术语表约束（石膏ボード/下地/根太、石膏板螺钉/龙骨/托梁）→ 严格校验"条数=输入、q/a 非空"，不合格重试一次后跳过；进度落 `logs/faq-l10n-progress.json`，可断点续跑。`--dry-run` 只统计不落盘。
- **后台磨工** `scripts/faq-l10n-daemon.sh` + launchd `com.tradego.faq-l10n`（600 秒一次，默认每轮 3 篇 × 9 语种）。通道是免费池限额，只能小步慢跑；通道全忙时脚本 exit 3 不落盘，等下一轮。
- **定向闸门**：`content_gate.py` 新增 i18n 检查——给了 `--slug` 就查这篇，否则查 `origin/main..HEAD` 里改过的 article；命中泄漏即 exit 1。存量 169 篇不堵全站，只保证"新改的文章不再带英文原文"。
- **通道实测**：zai 撞 429 冷却 15 分钟；grok-4.3 每 10 分钟 3 次、每天 60 次；openrouter 直连 401 不可用。按 8 次/10 分钟、每次 12 条估算 ≈ 3000 条/天，9000 条约 3 天磨完。

## 通道断了谁补：Agent 自译路径（2026-11-25）

- 写作通道被限额/429 卡住时，不再等：由 Agent（我）直接译，用 `scripts/faq-apply.py` 落盘。
- 落盘格式：`{"slug": {"items": [{"q": {"zh": "...", "ja": "..."}, "a": {...}}]}}`。脚本会**逐篇校验条数与文件内非空 FAQ 完全一致**，不一致整篇跳过、不猜顺序（防止错位）。
- 已落地样例（zh+ja 各 3 条）：`torque-tensioning-critical-fasteners`、`solar-panel-mounting-fasteners`、`lag-screws-timber-connections`、`stainless-steel-fasteners-304-316`。
- 通道失败时 `faq-l10n-batch.py` 会把待办清单写到 `logs/faq-l10n-needs-agent.txt`，下一次会话按清单自译，不靠记忆。
- 仍缺的语种（es/fr/pt/de/ru/ar/hi）优先交给通道磨；Agent 自译只做"补位"，不替代批量。

## 部署节奏（同日确定）

- `scripts/deploy-window.sh`：只在 `09:00-11:00 / 17:00-19:00`（Asia/Shanghai）允许真构建，其余时间 `deploy-flush.sh` 攒提交不开工；紧急用 `DEPLOY_WINDOW_FORCE=1`。
- 目的：日均真实构建压在 3 次以内，不和内容流水线抢额度；提交不会丢，到窗口自动上线。
