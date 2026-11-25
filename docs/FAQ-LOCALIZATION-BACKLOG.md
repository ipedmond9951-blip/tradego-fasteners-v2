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

## 系统性整改：从源头止漏（2026-11-25）

不再靠逐条翻译去追欠账，改成三层治理：

1. **渲染层 native-only**（`src/app/[locale]/industry/[slug]/page.tsx`）：新增 `nativeText()`——该语种值与 `en` 逐字相同即视为缺失；ja/zh/ar/ru/hi 另要求命中书写系统。FAQ 折叠块与 `FAQPage` JSON-LD 都只输出原生问答，没有原生译文就不渲染、不进 schema。效果：任何页面都不再露英文问答，且不再给搜索引擎喂"语言不符"的结构化数据。
2. **数据归一化** `scripts/normalize-faq-i18n.py`：把"非英文语种=英文原文"的伪翻译直接删掉（零信息损失）。全站待清理 9177 条 / 192 篇；已接进 `content_gate.py`（查哪篇就清哪篇）和 `.githooks/pre-push`（清本次改动过的文章），跟着编辑自动收敛，避免一次性大 diff 撞上内容流水线的在途改动。低峰期可一次跑完：`python3 scripts/normalize-faq-i18n.py --apply`。
3. **判据纠正** `scripts/check-i18n-leakage.py`：区分"英文泄漏"（值为英文，算违规，`--strict` exit 1）与"未本地化"（值缺失，页面不展示，只统计覆盖度）。这样闸门只拦真泄漏，不会把"还没翻译"当成失败。

配套：模板问答检测 `scripts/check-faq-boilerplate.py` + 替换器 `scripts/faq-replace-boilerplate.py`，批量译文落盘 `scripts/faq-apply.py`。

## 收口结果（2026-11-25 12:40 CST）

模板问答和伪翻译两条欠账同时清零：

1. **模板问答归零**：`python3 scripts/check-faq-boilerplate.py` → 受影响文章 0 篇、待替换条目 0 条。51 篇一次性替换完成（清掉的模板条目数逐步下降，尾部几篇只删 0–1 条，脚本会按"删多少补多少"自然收敛，不再硬凑 3 条）。新增问答全部为 en + zh，且一问一答限定在本篇题材（管道/矿山/木结构/光伏/清关/证书各不相同）。
2. **英文泄漏归零**：`python3 scripts/check-i18n-leakage.py` → "✅ 未发现英文泄漏"。`normalize-faq-i18n.py --apply` 一次清掉 5956 条伪翻译 / 144 篇；剩余德语、阿语等语种属"未本地化"（值缺失，页面不渲染，只计覆盖度 14651 条）。
3. **校验全过**：`check-article-schema.sh` 279 篇全过；144 篇改动逐篇跑 `content_gate.py --slug` 均"完全干净 0 (0%)"。
4. **现状口径**：en/zh/ja 三语问答完整（累计 60 篇手译/自译），其余语种由 `com.tradego.faq-l10n`（600s 一轮）在通道可用时补；通道 429 时按 `logs/faq-l10n-needs-agent.txt` 自译补位。

部署：本地领先 origin/main 6 个提交，当日构建预算 3/3 已用尽，进 09:00 或 17:00 窗口由 `deploy-flush.sh` 自动推，无需手工。

## pt/fr 批次（2026-11-25 13:10 CST）

- pt 5 篇 25 条：`angola-lng-project-fastener-procurement`、`mozambique-fastener-market-case-study`、`mozambique-hardware-supplier`、`mozambique-lng-construction-fasteners-maputo`、`mozambique-lng-construction-fasteners-standards`
- fr 6 篇 26 条：`senegal-dakar-construction-fastener-wholesale`、`ivory-coast-abidjan-port-fastener-tariff`、`togo-lome-port-fastener-import-procedure`、`madagascar-antananarivo-fastener-sourcing`、`benin-cotonou-fastener-wholesale-market`、`congo-brazzaville-fastener`
- 覆盖率：pt 215→240 条、fr 216→243 条（es 221、de 220、ru 214、ar 104、hi 184、ja 282、zh 512）
- 顺手修两处坏问答：贝拉冷链篇的占位问句（"What are the key considerations for…"）与 Maputo LNG 篇"整段当成问句"的条目，后者拆成两个真问题。
- 仍缺 pt/fr 的候选：`republic-of-congo-fastener-supplier`(5)、`drc-diamond-mining-fasteners`(7)、`drc-mining-concession-fastener-logistics`(3)、`mozambique-*` 已补完。

## 北非 ar 批次（2026-11-25 23:10 PST / 11-26 15:10 CST）

- `algeria-algiers-oil-gas-fastener-specifications`(5)、`egypt-suez-canal-industrial-fastener-tariff`(5)、`tunisia-mediterranean-fastener-export-guide`(5)、`libya-tripoli-construction-fastener-sourcing`(3)，共 18 条阿语问答。
- 这 4 篇正文早已 100% 阿语化，只差 FAQ；补完后北非板块 ar 全部可渲染（FAQPage 同口径）。
- 现状勘误：正文（body）已 9 语种 100% 本地化（1674/1674），之前"14547 条未本地化"全部是 FAQ 条目，其中大部分本来就不渲染，只影响覆盖度统计，不影响页面质量。

## CTA 归一化（2026-11-26）

- 渲染层 `ctaNative()` 已 native-only 回落 `uiCopy.articleCta`；数据层同步清理：`scripts/normalize-cta-i18n.py`（默认只报告，`--apply` 落盘）。
- 首次清理 190 篇 2156 处：与 en 逐字相同 2119、含 `{topic}` 占位符 33、罗马字转写 3（俄语/印地语/日语写成拼音，直接删）、空值 1。
- 只删"伪值"，真译文一律保留（zh 的 CTA 文案、各语种真本地化按钮全部留下），删除后页面输出不变。
- `.githooks/pre-push` 加了只报告不写盘的 CTA 巡检，避免 pre-push 把工作区弄脏；超阈值时开机提示。
- 校验：`check-article-schema.sh` 279 篇全绿、`content_gate.py` 0 BLOCK、`check-i18n-leakage.py` ✅ 且 CTA 遥测归零。

## 写入口语言校验（2026-11-26，根因修复）

- 现象：农业机械篇 ar/ru/hi 的 FAQ 槽位里的中文，前一天已清空并提交，第二天又回来了。
- 根因：`scripts/faq-l10n-batch.py`（launchd `com.tradego.faq-l10n` 每轮跑）把模型返回当"译文"直接写回，**没有校验书写系统**；通道被限流后模型偶尔回吐中文，这些值非空且 ≠ en，绕过 native-only 判定，会直接渲染到阿拉伯语页。
- 修法：新增 `valid(lang, v, en)`——非空、≠en、书写系统匹配目标语种、非中文目标不得含汉字；不达标逐条丢弃并打印 `⚠️ 丢弃错语种/异常译文`，不再整批写入。
- 兜底扩面：`normalize-faq-i18n.py` 原来只判"== en"与 ar/ru/hi/ja/zh 的书写系统，现在拉丁语种（es/fr/pt/de）夹汉字/阿语/西里尔同样剔除；本轮清 78 条脏值、13 篇（含 `senegal-fastener-market` 的 "Pour trouver… 可以考虑:" 混血句）。
- 验证：`check-i18n-leakage.py` 恢复 ✅；`check-article-schema.sh` 279 篇全绿；`content_gate.py` 0 BLOCK。

## ar 技术指南批次（2026-11-26）

- 5 篇全球通用技术页面补阿语问答 24 条：`bolt-markings-identify-grade`(5)、`anchor-bolts-foundation-guide`(5)、`roofing-screws-epdm-washer-guide`(5)、`nylon-nuts-bolts-guide`(5)、`zinc-plated-vs-galvanized`(4)，全部 Agent 自译（通道 429 期间不依赖外部写作链）。
- 顺手删 5 条通用套话问答（"What are Technical Guide and how are they used?" 及配套"essential components in construction and manufacturing"答案），涉及 5 篇；这类问答会进 FAQPage 结构化数据，属低质信号。

## 正文语种污染体检（2026-11-26，新指标）

`scripts/check-body-lang.py` 补上了正文体（`sections[].heading/body`）的语种体检——之前只有 FAQ 有硬指标，正文一直是盲区。分三档：

- `english`：非英文语种的正文里整句/半句还是英文（渲染出来就是英文段落），最伤信任；
- `script`：夹着另一种书写系统（日文页夹中文/韩文、葡语页夹中文、德语页夹阿语），多为机器翻译串语种；
- `noise`：只夹 1–9 个外文字符，术语残留，仅提示。

首轮结果：**english 239 处 / script 116 处**，涉及 104 篇。两轮机械修复后 english 降到 139：

- 174 处是"本地化字段里嵌着英文标题原文"，直接换成该语种的 `title`（3 篇：`zimbabwe-rural-electrification-fastener-specifications`、`nigeria-lagos-fastener-import-wholesale-guide`、`zimbabwe-road-bridge-rehabilitation-fastener-supply`）。
- 301 处（4 篇：润滑/包装/预紧力/高强螺栓）是嵌着英文主题标签，按 heading 位（无冠词名词短语）与 body 位（带冠词主语）分别换成九语本地化表达。

剩余 139 english + 116 script 属"段落级未翻译/半句混合"，无法机械替换，只能逐段重译；`check-body-lang.py --slug <slug>` 可看单篇明细，`--json` 供批量任务取数。

## 正文污染第二轮（2026-11-26 晚）

- 判定器收紧：`check-body-lang.py` 原来只看"拉丁词占比 + 2 个英文功能词"，把德语里的英文机构名（"… eine Genehmigung des Department of Trade and Industry"）误判成整句英文；改为用 200 词英文常见词表要求**密度 ≥45%**。收紧后英文句子检出更准，存量数字随之从 139 变成 227（多出来的是此前漏掉的真泄漏）。
- 新脚本 `scripts/fix-label-embeds.py`：只替换"与英文标题词重叠 ≥60% 且长度接近"的英文串（即模板化本地化留下的标题位标签），避免误把普通英文句子换成标题。首轮 18 篇 702 处。曾用"出现次数最多"当判据，结果把 `See frequently asked questions below` 也当成标签（4555 处），已废弃该判据并在脚本里注明原因。
- 整段重译：`african-ftz-fastener-import-procedures` 的 ar §2–§6、ja §2、ru §2 全文重写（原译文混入英语、印尼语 `sebagai ambang batas`、韩语 `혜택/되어야`），该篇现在 english/script 均为 0，内容闸门 100% 干净。
