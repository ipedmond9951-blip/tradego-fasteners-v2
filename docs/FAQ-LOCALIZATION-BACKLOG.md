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
- 第三轮细分：英文串里**没有谓语动词**的归为 `label` 档（"相关资源"里的 high-tensile bolts / anchor bolts 这类产品名列表），不计入 english 硬指标。口径变为 english 23 / script 116 / label 204，剩下 23 处是真·整句英文，涉及 12 篇。

## 新发现：本地语正文大量是"一句话摘要"（2026-11-26 深夜）

新脚本 `scripts/check-body-len.py`（本地正文去标签字符数 / 英文同节字符数，<55% 视为不完整，中日阈值 45%）扫出 **3732 处、涉及 274 篇**。抽查证实不是截断，而是本地化管线**只写了一句摘要**：

- `rwanda-construction-fastener-market-2026` §3 英文 1411 字，ja 只有「正しいファスナーの選択には、現地の建築慣行、気候、物流の理解が必要です。」（36 字）
- `kenya-east-africa-fastener-distribution-hub` §0 英文 945 字，zh 只有一句导语

所以"9 语种 100% 已本地化"这个口径要改成"每节都有本地语文本，但多数是摘要级"。这解释了之前 FAQ 覆盖率低的同源问题：管线优先保"有文本"，不保"文本等量"。

处置口径（建议）：
1. 新增文章禁止摘要级本地化——`content_gate.py` 增补"本地正文 < 英文 55%"即 BLOCK。
2. 存量按市场优先级逐篇扩写，优先 zh/ja（中文买家与日本买家是可转化受众），其次 pt/fr（非洲葡语区/法语区）。
3. 扩写前不要删摘要，避免出现空小节。

## 认证表述合规清理（2026-11-26）

口径：TradeGo 目前**没有** ISO 9001 / CE / SABS 认证，任何"我方已认证"的说法都要改成"按标准制造 + 随批 EN 10204 3.1 材质证明 + 可按需安排第三方验货"；"客户/供应商须持有某认证"这类对外要求不在清理范围。

`scripts/fix-cert-claims.py`（默认报告，`--apply` 落盘）本轮改了 **85 处 / 30 余篇**：
- CTA 模板：`ISO/EN/ASTM certified` → `built to ISO, EN and ASTM standards, with batch-level mill test certificates`（八语种同步）
- `DIN, GB, and SABS certified products` → 按尺寸标准制造 + 材质证明
- 供应商页描述里的 `SABS认证产品` / `INNOQ认证支持` / `加纳标准局认证产品` → "可按 X 要求供货，随批提供检验文件"
- `author.credentials` 归一到岗位描述（**151 篇**）：`ISO 9001 Certified Export Specialist`、`ISO 9001 Lead Auditor`、`CSCP`、`FIATA Diploma` 这类查不到实证的头衔全部换成"fastener sourcing / quality-documentation specialist"等中性表述。

留待下一轮：正文里仍有少量"供应商须持 ISO 9001"的正常叙述（属要求，不是声称），以及 `china-iso-9001-fastener-manufacturer-directory` 这类"名录"文的行业科普表述。

## 本地语完整度分档与索引策略（2026-11-26）

不再用"字符长度比"单一判据（中文天然比英文短一半，会把正常译文判成摘要）。改为**小节完整度**：某小节本地语字符数 × 语种系数（zh 2.0 / ja 1.6 / 其他 1.0）达到英文同节 50%，即算"该节译完"；页面完整度 = 译完小节占可译小节的比例。

- `src/lib/articles.ts` 新增 `localeSectionShare()` / `isThinForLocale()`；`detail` 页 `generateMetadata` 与 `sitemap.xml` 同口径。
- **完整度 <20%**（基本只有一句摘要）：该语种页面 `robots:noindex, follow`，并从 sitemap 摘除。当前 266 个 URL（zh 111、ja 37、hi 32、ar 21、es 19、de 13、ru 12、fr 11、pt 10），占 2511 个文章的 10.6%。
- **20%–80%**：保留索引，进 `content/locale-backlog.json` 排队扩写，扩到 80% 以上自动变为"完整页面"。
- `scripts/build-locale-backlog.py` 生成队列（当前 568 条，含每篇需要补的小节序号）。
- `scripts/oneoff-zim-supplier-zh.py`：`zimbabwe-fastener-supplier`（津巴布韦供应商落地页）zh 四节整节扩写，从 2% 提到 75%，是队列里第一个完成项。

判断依据：薄页面本来就排不上，留着只占抓取预算、拉低站点质量信号；但只摘"几乎没有内容"的 10%，摘要级（20–80%）不动索引，避免误伤还有长尾排名的页面。

## 整字段错语种的定向重写（2026-11-26）

体检脚本抓到的是"字段级别语言错了"而不是"没译"：同一篇文章里 de 段是印地语、es 段是德语、pt 段内容是另一个港口。这类内容对 SEO 是负资产（hreflang 与正文不符），必须按英文原文重写，不能机翻整篇。

已修：
- `libya-tripoli-construction-fastener-sourcing`：de §2/§4/§5（原为印地语、阿拉伯语）、es §2（内容错位成物流段）§4/§5（原为印地语且写的是洛美港）、pt §4（原为德语且写的是拉各斯）§5（原为印地语/洛美）全部按英文重写；§1 标题"认证等级"改为"按 ISO 898-1 的性能等级"。
- `togo-lome-port-fastener-import-procedure`：es §0 原为阿拉伯语写的阿布贾（尼日利亚）标准，重写为洛美港进口流程概述。

修完 `check-body-lang.py` 的 script 档从 116 降到 104（英文 18、label 16 未动）。剩余 script 违规按"整字段 → 该语种重写；零星混杂 → 局部替换"处理。

**注意**：这类错语种不是翻译管线"漏译"，而是历史批处理把别的文章的译文按位置粘贴过来（洛美港、拉各斯、阿布贾三篇互相串）。修复时必须以 slug 与英文正文为准重写，不能沿用现有本地语文本。

## 本地语正文里的中文污染（2026-11-25 第三轮）

**症状**：es/fr/pt/de/ru/ar/hi 正文里出现中文，两种形态：
- **成段**：本地化管线把中文段落整段追加到正文尾部（伪翻译 filler）。测得 9 篇 37 段，最重的是 `fastener-lubrication-thread-locking-guide` 的葡语（6 节 22 段）、`africa-solar-energy-fastener-procurement-guide` 葡语（§1/§3/§4）。
- **词级**：专名与术语没跟着翻译，例如 `坦桑尼亚`、`塞内加尔`、`埃及`、`采购`、`扁冲铆钉`、`南海镀锌`、`母材`（常见"本地语正确译名 + 中文注释"的重复）。共 124 个字段。

**处置原则（重要教训）**：不要整段删。第一版脚本按"段落中文字符 ≥10 且拉丁词 ≤8"整段删除，结果 `kenya-infrastructure-fastener-demand` 的阿拉伯语 §4 少了"Factor 3"，编号从 1、2 直接跳到 4——丢内容且结构断裂。**正确做法是逐段翻译**：重复句才删（且要确认重复），独有信息必须译。

**落地工具**
- `scripts/check-cjk-in-local.py`：体检脚本（只报告）。判据"段内中文 ≥10 字且中文占非空白字符 ≥50% → 成段；否则词级"。已接入 `vercel-audit.sh` 第 11 项（只报数，不阻断部署）。
- `scripts/fix-cjk-tokens.py`：词级安全替换（国名 8 个 × 8 语种、采购、第三方、扁冲铆钉、南海镀锌、母材、模板标签"相关资源："），外加中文标点与 `comprasB2B` 这类粘连的空格修正。可重跑。
- `scripts/oneoff-lub-pt.py`／`scripts/oneoff-solar-pt.py`：两篇葡语成段中文的逐段翻译（fail-closed，每条必须命中一次）。

**结果**：成段中文 9 篇 37 段 → **0**；正文语种体检 `english 18 / label 14 / script 78`（此前 87）；`content_gate` 完全干净 161 篇（61%）、0 BLOCK；扩写队列 586 → **607**（中文填充段被清掉后，之前被虚抬的"完整度"回落，这正是"9 语种 100% 已本地化"从未成立的证据）。

**剩余**：词级残留 119 个字段（句子级残片，逐词替换会造病句，必须按语种整句改写）。

## 词级中文残留清零（2026-11-25 第四轮）

上一轮把成段中文清到 0，但还剩 **124 个字段**是"中文词顶替本地语词"：管线把中文词塞进本地语句子、替换掉原词，留下半截词干。典型形态：

- `pt se嵌入式 sinkamento` → `para um embutimento limpo`
- `ru наиболее часто指定ывается` → `чаще всего указывается`
- `ar غسالات نجمة القفل الخارجية锁定垫圈 الخارجي` → `غسالات نجمة القفل الخارجية`
- `hi कंक्रीट और मश鲁मरी` → `कंक्रीट और मशीनरी`
- `es <strong>吞吐量 del Puerto de Mombasa` → `<strong>Tráfico del Puerto de Mombasa`

**修法**：不做通用词表（粘连位置千奇百怪，通用替换必造病句），改成一张**逐条手工表** `scripts/fix-cjk-words.py`（语种 + 原片段 + 改正片段，两轮共 120 条规则）。跑法：先报告，再 `--apply`，未命中只告警（同一条可能已被别的轮次改过）。

**结果**：非中文语种字段里的中文 **124 → 0**；正文语种体检 `english 14 / label 14 / script 68`（上轮 18/14/78）；`content_gate` 完全干净 **172 篇（65%）**、0 BLOCK；schema 279 篇全绿；`check-claims.py` 通过。

**顺带**：`southern-africa-fastener-market-southafrica-botswana` §5（SABS/SANS 标准 + 南非矿业要求）的 es/fr/pt/de 四个语种整段还是英文，已按英文原文重写（zh 也从 151 字摘要补成整节），脚本 `oneoff-southern-s5.py`；7 处成句中/日/韩文（肯尼亚仓储、南非出货检验、哈拉雷成本段等）用 `oneoff-stray-cjk-batch.py` 逐段改写。

**副作用要盯**：扩写队列 607 → **641**。中文填充段和错误语种被清掉后，之前虚抬的"完整度"回落——每修一次污染，队列就会涨一截，这是真实缺口的显形，不是回归。

## 外语 token 侵入清零（2026-11-25 第五轮）

第四轮把「中文」清干净了，但体检脚本的 `script` 档还挂着 **68 个字段**：这回不是中文，是**别的外语词顶进了本地语句子中间**——俄语词塞进日语正文（`ドキュメントдокументация`）、韩语词塞进日语（`제품을 보호했습니다`）、印地语塞进葡语（`नीचे अक्सर पूछे जाने वाले प्रश्न देखें`）、阿拉伯语塞进西语（整节正文都是阿拉伯语）。

**三层处理**：

1. **字形归一**（`scripts/fix-ja-simplified.py`）：日文正文里混了大量简体汉字（场/质/单/购/费/规/运/应/标/产/级/设/确/现/资/压/实/关/优…），这些字与日文汉字是逐字同义映射，按 140 字表替换 **114 个字段 / 286 字**，零风险。
2. **词级表**（`scripts/fix-script-tokens.py`）：120 条「语种 + 外文片段 → 本地语词」，替换 **147 处 / 43 篇**。
3. **整字段重写**：两篇法语 §0 被俄语词块串起来（`tanzania-sgr-railway`、`threaded-rod-applications-guide`）；突尼斯篇 es §0 整节是阿拉伯语且**内容还是另一篇（的黎波里风险管控）**——顺带修掉内容串篇；卡萨布兰卡 pt §3 整节是俄语词块串联。这四节按英文原文重写，脚本 `oneoff-fr-cyr-two.py`、`oneoff-es-pt-wholefield.py`，都带关键事实断言。

**结果**：`check-body-lang.py` 的 `script` 档 **68 → 0**；`content_gate` 完全干净 **182 篇（69%）**（上轮 172/65%）；schema 279 篇全绿；扩写队列 641 → **657**。

**教训**：日语正文是「中文机翻 + 特异词替换」的混血件，外文 token 只是最表层；简体字形和中文词（`港口`/`价格`/`提前`/`涂层`）是下一层，需要词表而不是字表——已经在 `fix-ja-simplified.py` 里留了字表，词表待建。

## 日语正文三层清污收口（2026-11-25 第六轮）

第五轮把 `script` 档打到 0，但那是**体检阈值下的 0**——新写的 `scripts/check-ja-clean.py` 换四个维度重扫，日语正文立刻暴露 **85 个外文 token / 70 个字段**。教训记牢：**档位判 0 ≠ 真干净**，阈值会漏掉「1〜3 个 token」这种轻污染。

四层由浅到深：

1. **字形**：简体汉字→日文汉字，114 字段 / 286 字（`fix-ja-simplified.py`，140 字对照表）。
2. **中文词**：港口/价格/成本/因此/以及/客户/批次/涂层…→ 港/価格/コスト/したがって/および/顧客/ロット/コーティング，**79 处 / 25 篇**（`fix-ja-chinese-words.py`，40 条词表）。
3. **中文虚词与搭配**：这些/有什么区别/请求/过程中/可靠性/必需的/采購 → これらの/違いは何ですか/要請/過程で/信頼性/必須/調達，**25+ 处**；赞比亚案例 §5 里整整一段中文公司介绍，按英文原文整段重写为日语。
4. **句子级外文**：管线把韩语、俄语动词形态直接塞进日语句子（`~을 유지하여`、`~합니다`、`~때때로`、`~협력`），句子结构已坏，只能整句重写——**81 处 / 36 篇**（`oneoff-ja-pass3.py`，SENT 整句 + TOK 片段两类作业，含 HTML 锚点的句子只做片段替换以免丢标签）。

**副作用（必须记住）**：整句重写的新句若自带 `<p>`，会和原句边界的 `<p>` 撞成 `<p><p>`，或把段落的 `</p>` 吃掉——`content_gate` 的 `dirty-text` 立刻 BLOCK。这轮踩了 3 次，修法是重写后统一扫一遍 `<p><p>` / 缺 `</p>` 的段落。

**结果**：`check-ja-clean.py` 四维全 0（简体字形 0、中文词 0、中文虚词 0、外文 token 0）；`content_gate` 完全干净 **199 篇（75%）**、0 BLOCK；schema 279 全绿；扩写队列 700 → **711**。审计新增第 12 项（日语洁净度，只报数不阻断）。

## 第一个「整语种补齐」样板：农机篇西语（2026-11-25）

清污清到后面，问题从「脏」变成「薄」。挑 `agricultural-machinery-fastener-guide` 做样板：英文 7 节 3000 字上下，西语只有 400–500 字摘要（coverage 0%），完整度判定直接判薄 → noindex + 摘 sitemap。做法是**逐节整段翻译英文**（不新增事实、数字全部与英文对齐、保留 `<a>` 锚点与「Recursos relacionados」链接块），分两批写完 7 节，西语 coverage 从 0% 到出队列。

顺手挖出一个系统性 404：这篇英文正文里有 21 处 `href="/products/{'name': 'Hex Bolts', 'slug': 'hex-bolts', ...}"`——产品卡的模板占位符对象被当成字符串塞进了 href，前端渲染出来全是坏链（10 个语种 × 出现次数）。新增 `scripts/fix-broken-links.py`（按 slug 改写成 `/en/products/<slug>`，默认 dry-run、`--apply` 落盘），21 处清完，并顺手扫了 `href="{' / [object / undefined / javascript:` 这几类，全库 0 处。

**可复用的补齐规矩**：
1. 只翻英文已有内容，不自己造事实；数字、标准号、MPa、HRC、FOB 价区间逐条对齐。
2. 每节写完就断言「无中文字符、无 `<p><p>`」，避免历史那两次标签事故重演。
3. 一次只补一个语种的一篇，补完立刻 `build-locale-backlog.py` 看这条是否出队，出队才算真的补完（章节覆盖率是按节算的，少一节就还是 0）。

## 同篇第二个语种：农机篇法语（2026-11-25）

西语补完后，接着把同一篇的法语补齐（fr 原来也是 400 字左右摘要、coverage 0%）。做法与西语完全一致：英文 7 节逐节整段翻译，分两批落盘（第 0/1/2/3 节、第 4/5/6 节），数字与规格全部对齐（ISO 898-1 的 8.8/10.9/12.9 与 800/1 000/1 200 MPa、A2-70/A4-80 的 700/800 MPa、33–39 HRC、FOB 1,80–3,20 USD/kg ≈ 1 500–2 600 USD/t、交期 3–6 周 / OEM 12–16 周）。法语 coverage 从 0% 出队。

**一条可复用判断**：同一篇多语种补齐时，英文原文只需要读一次，按「语种 × 批次」落盘最省事；每批写完立刻 `check-body-lang.py --slug <slug>` 自检（英文残留 / 其他文种 token / 无谓语标签），别只在最后统一体检——最后体检时已经很难判断是哪一批带进来的。

## 并发窗口把整文件写回旧快照，会静默清掉别人刚写的语种（2026-11-25 事故与处置）

西语、法语整篇补完之后，再去看同一篇：`es` 从 3 658 字回落到 468 字、`fr` 从 3 745 落到 240 字、德语第 0–3 节也退回摘要——**不是 git 回滚，是另一个窗口用内存里那份旧 JSON 整文件写回**（它同时在补 pt/hi，读文件的时间早于我的提交，落盘时间晚于我的提交，于是把我的字段清掉、把它新写的 pt/hi 留下）。

处置不靠猜：`git show HEAD:<file>` 落一份快照，按**字段长度**逐节比对 HEAD 与工作区，只把「HEAD 更长」的 `es`/`fr`/`de` 字段回填（18 处），pt/hi 保留工作区的新版本。回填后 `content_gate` 立刻回到 0 BLOCK。

**规矩（比这次的补丁更重要）**：多个窗口并行改同一篇 JSON 时，脚本必须**先读最新的文件再落盘**，且只改自己负责的 `sections[i].body[lang]` 字段；不要「读出整篇 → 在内存里改 → 整篇写回」，那就是拿一个可能已过期的快照覆盖别人的成果。判定是否被覆盖最省事的信号就是字段长度突变。

## 价格段落去数字化：同一篇 5 个语种一起改（2026-11-25）

按 `docs/CONTENT-CONTRACT.md` 第 15/24 条（无可核来源的金额一律换成报价结构），把农机篇里两处价格数字全部改成结构说明：
- 拖拉机节：删掉 6 行「按吨计价」清单（Class 8.8 / 10.9 / 12.9、镀锌加价、锌镍加价、316 不锈钢），改为「报价构成五层 + 价格驱动三项（钢、锌、能源）+ 可比口径（同规格、同 Incoterm、同包装）」，并以「给出尺寸/等级/涂层/数量/包装/Incoterm 才出可核报价」收口。
- 采购节：删掉 MOQ 与阶梯价、FOB 每公斤/每吨金额，改为「起订量随工装占用与批量议定、价格阶梯跟批量与工艺成本、FOB 每批按当期钢锌能源价重算」。
- 语种：`en` / `es` / `fr` / `pt` / `hi` 五处全部一起改（`scripts/oneoff-price-de-digit.py`，幂等，无金额即跳过），德语本来就是结构写法，`zh`/`ru`/`ar`/`ja` 的摘要是纯文字、无金额。

**并新增全库体检** `scripts/check-money-claims.py`（只读、退出码恒 0，按「价格语义上下文」与「其他」两档计数），接进 `vercel-audit.sh` **第 13 项**（`AUDIT_MONEY` 开关，只报数）。首跑结果：**金额断言 2 619 处 / 61 篇，其中价格语义上下文 415 处**，榜首是 `drywall-screws-bulk-price-africa-procurement`（63）、`china-fastener-supplier-price-list-guide`（56）、`self-drilling-tek-screws-price-list`（44）——这三篇标题本身就带 price/price-list，是最该先处理的。

## 价格页去数字化：三篇 price / price-list 篇的处理（2026-11-25）

按内容契约第 15/24 条，把价格语义最重的三篇一起处理：`drywall-screws-bulk-price-africa-procurement`、`china-fastener-supplier-price-list-guide`、`self-drilling-tek-screws-price-list`。做法标准化成两步脚本：

1. `scripts/price_structure.py` —— **10 语种共用的一套「报价结构」文案**（报价由基价/表面处理与涂层/包装与配件/内陆到港/海运与单证/数量与付款构成；驱动因素是钢、锌、能源、运价；写死的数字只是某一周的切片；比较必须同规格、同 Incoterm、同包装；给参数才出可核报价）。
2. `scripts/strip-price-figures.py` —— 删掉「含金额的整句或整条列表项」，在删除位置插入对应语种的结构段，**fail-closed**：处理后仍有金额残留、或新长度低于原文 55%、或一处都没删掉，整篇不改并打 ⚠️ 跳过。

结果：三篇共删 **130 处**金额，全库金额断言 2 619 → 2 428，价格语义上下文 415 → 252；`content_gate` 完全干净 214 → **223 篇（84%）**，0 BLOCK。

**这轮踩到的四个坑（都不是脚本本身的问题，是清洗的边界问题）**：
1. **正则漏了中文金额**：`18-22美元/K盒` 里的「美元」不在 `USD/$/€` 名单里，中文整表原封不动——第一次跑完中文还是价格表。补齐 `美元|美金|元|RMB|CNY|MAD` 后才发现，中文是唯一没被清到的语种。
2. **删了数字，留下小标题**：`FOB Shanghai Prices (USD per 1000 pieces):`、`#6 x 1-5/8" Fine Thread (W):` 这类「只剩冒号」的行会留在原地，成为悬浮的空标题。收口脚本按「短行 + 以冒号结尾 + 含币种 / 以 # 开头」清掉，并把紧邻结构段前的冒号改句号。
3. **整段被清空 → 触发「缺中文正文」BLOCK**：某篇中文小节本体就是一张价格表，逐行删完变空。处置是从 HEAD 取回原文、保留非价格句、再补写该小节专属的中文结构段（起订量 / 价格驱动 / 样品单各写一段，不复用同一段模板）。
4. **切句要按语言来**：中文、日文用 `。`，印地语用 `।`，阿拉伯语用 `؟`。上一轮按 `. ` 切句把一个印地语小节从 3 214 字腰斩到 1 647 字，这轮统一改成 `(?<=[.。।؟])`。

**规律再确认一次**：每清一批金额，扩写队列就涨一截（739 → **786**）。金额和伪翻译一样，都在虚抬「完整度」，清掉之后真实缺口才显形。

### 价格去数字化第三批：金额清零与三类分拣（db47abe6）

- **金额正则补中文币种**：`[\d,.]+\s?元` 抓不到「1,200美元」「R1,240万兰特」「380奈拉」。补成 `[\d,.]+ ?(?:万 ?)?(?:USD|EUR|RMB|CNY|MAD|美元|美金|兰特|奈拉|卢比|港元)` 后，全库金额从 2 216 涨到 **2 294**——**数字变高不是变坏，是之前看不见的中文金额被看见了**。strip 与 check 两个脚本的正则要同步改，否则体检口径不一致。
- **不能一律套报价结构**，按小节分三类：`STRUCT` 价格小节（原位插结构段）、`PLAIN` 税费示例/物流费（删金额 + 追加「只讲算法」句）、`CASE` 案例成效（整字段换成手写段落，保留准时率/不合格率/认证通过率等非金额指标，金额改「两位数百分比量级、以当批报价为准」）。
- **句子切分必须要求标点后有空白**：`(?<=[.。])` 会把 `99.2%` 切成 `99.` + `2%`，删掉前半句后整段从数字中间开始（本轮真把 zambia/SA 的英文成效段切坏了）。改成 `(?<=[。！？।؟])|(?<=[.;])\s+`。
- **孤儿小标题清理只能作用于本轮改过的字段**：对整篇做「短行+冒号」清洗，会把 `Major Markets:`、`Free Zone:` 这类正常小标题一起删掉（nigeria 一篇 46 个字段被误伤，已 revert 重做）。正确姿势是先把本轮改动的 section id 列出来，只在这些 section 上清。
- **fail-closed 触发多的字段要手写**：案例成效、物流费、中文纯价格表这三类，脚本命中率低于一半，硬改必然腰斩；直接整段手写 10 语种更省事也更可控。
- 收口数据：价格语义上下文 **415 → 0**，全库金额 2 619 → **2 218 处 / 51 篇**，content_gate 完全干净 **227 篇（86%）**、0 BLOCK；扩写队列 787 → **901**（清完金额，真实语种缺口又露出来）。

### 翻译前的第一道闸：模板填充物检测（668ea647）

- 扩写队列 901 条时先抽样看英文原文，发现大量小节是生成器模板：`A project in the fastener industry encountered quality / manufacturing defect issues…`、`Standards-based procurement requires continuous learning…`、同一段话在同一字段里重复两遍、案例里没有任何真实项目/规格/时间。
- 新增 `scripts/check-template-filler.py`：三条判据（模板句指纹 / 同字段长句重复 ≥40 字 / 未替换占位符），按小节打分，≥50% 判为「模板文」。结果 **37 篇 / 156 节**命中，`africa-railway-modernization-fastener-demand` 属其中最典型的一篇（英文 5/7 节是模板）。
- `build-locale-backlog.py` 改为跳过模板文（`logs/template-filler.json` 缺失时现跑检测，`logs/` 不入库）：队列 **901 → 604**。**不先做这道闸，翻译等于把垃圾 ×10 语种复制一遍，还把队列数字做得很"努力"。**
- 本批同时把 `fastener-coating-systems-guide` 的中文整篇补齐（6 节 500-1600 字），顺手删掉英文里的模板尾巴（采购框架段/标准学习段/比价方法论段），只译有信息量的部分。

### 模板文重写（daf15de0、f42c2f2f）

- 重写配方（4 节，固定骨架）：①这一节解决什么工程问题、机制是什么；②标准与型号怎么选（挂具体标准号）；③失效证据与替代方案（按可靠性排序）；④采购怎么写规范、收货怎么验。FAQ 用"能不能互换"这类真问题收尾。
- 两篇样本：《平垫圈 vs 弹簧垫圈》（DIN 267-26 明确弹簧垫圈不作动载荷锁紧件、VDI 2230 同口径；ISO 7089/7090/7091/7092/7093/7094 硬度配对 200 HV vs 300 HV；涂层必须跟螺栓同体系）、《公制/英制螺纹》（M10=10.000 mm vs 3/8"=9.525 mm 的"差一点"陷阱、16 TPI=1.5875 mm 与 1.5 mm 只差 0.09 mm、6g/6H 与 2A/2B、6AZ 镀锌螺纹、量规而非卡尺）。
- **不写无源百分比**：凡是要给数字的地方，给标准限值（HV、µm、mm、TPI）或标准号，不给"提升 30%"这类没有出处的结论。
- 手写 HTML 的坑：`<p><strong>…</p></strong>` 嵌套写反不会触发闸门，但渲染会错。脚本里加 `assert '</p></strong>' not in text` 这类断言，比事后肉眼查便宜。
- 结果：模板文 37→**32 篇**，命中小节 156→**136 节**；扩写队列 604→641（重写后英文变长，本地语覆盖度相对下降，属正常）。

### GEO（生成式引擎）方向的第一轮结构性加固

GEO 和 SEO 的差别在于：SEO 求「被爬到、被排上」，GEO 求「被 AI 答案引擎整句取走」。取走的前提是页面里有**可切块、可核、可遍历**的东西，因此这一轮只做机器取用层面，不碰写作判断。

- 新增 `scripts/check-geo-readiness.py`（**结构性就绪度**，非写作分）：首段是否给答案（40–130 词、不复述标题、不先讲"本文介绍"）、标准锚点 ≥3、FAQ ≥3 且产出 FAQPage、正文站内链 ≥3、`dataSource` 至少一条带 url、`updated` 在 180 天内、品牌实体、同篇长句重复。均分从 **66.9 → 85.8**，85 分以上 **4 篇 → 197 篇**。
- 与 `scripts/geo_audit.py` 分工：后者管**写作维度**（首段词数/复述标题/问句标题占比/可核实体密度/FAQ 答案长度/定义句），前者管**结构维度**（内链/来源/时效/重复）。两个脚本都别当唯一标准；本轮实测结论是「标题是不是问句」区分度低（全库 91 篇有问句标题、最高占比 0.5），而 `faqItems` 已经直接产出 FAQPage JSON-LD，所以那一项只算加分项、不算缺口。
- 新增 `scripts/geo-enrich.py`：把**正文里已经真实出现的产品名**第一次出现处包成 `/en/products/<slug>` 站内链（只认 `src/lib/products.ts` 里存在的 65 个 slug，只替换纯文本节点，已在 `<a>` 里的、标题里的不碰），并把 `dataSource` 缺失的篇从仓库其他篇已核来源池里挑——**只有来源名里的标准号在本篇正文出现过才挂**（fail-closed）。一轮下来内链 **+138 处**、来源 **+48 条**，`link` 缺口 72→43、`src` 缺口 37→20。
- 新增 `scripts/dedupe-body.py`：删同篇**整块纯文本完全相同**的重复 `<p>`（保留第一处），不做句子级手术。结果删 **1143 块 / 83 篇**，模板文 32→**30 篇**。判决标准是「段落整块重复」，因为 AI 引擎过滤的正是这种复制粘贴特征；句子级相似不算，容易误删正当的总结句。
- 两个坑：①`<p></p>` 空段后面跟裸文本会造成「同一段出现两次」的 dup-para BLOCK（zambia 中文节实测），删重复时要连空段一起清；②去重后 `body-size` WARN 从 51 涨到 56 篇——删掉的本来就是靠重复凑长度的填充物，长度降到门槛以下说明这篇真正需要重写，不是回退理由。
- 现状：`content_gate` **211 篇完全干净（80%）、0 BLOCK**；`check-body-lang` / `check-ja-clean` / `check-claims` / schema 279 篇全绿。已知存量问题：463 个历史字段 `<p>` 开闭不平衡（HEAD 里就有，去重前后差异为 0，不在本轮范围）。

### GEO 第二轮：段落粒度、无源数字、结构表述

- **超长段落切分**：新增 `scripts/split-long-paragraphs.py`（只插 `<p>`，一字不改）。判据是「段落纯文本 >130 词 / 中文 >220 字」，在**标签闭合且句子结束**的位置切（`<strong>` 跨段会让 HTML 断裂，所以用标签深度=0 做切点）。结果切开 **410 个段落 / 91 篇**，`geo_audit.py` 的 p1 指标口径下评分从 61.7 升到 62.3；词数逐篇核对，只有 60 篇因原文本缺空格在切点补了一个空格，语义无变化。
- **切分暴露的副作用**：原本藏在一个 `<p>` 里的重复句被切成两段后，`content_gate` 的 `dup-para` 立刻 BLOCK（china-hex-nuts / nigeria-market-guide 三处）。结论：**切段与去重必须一起做**，先切段再扫 dup-para，否则重复从"不可见"变成"可见"。
- **无源统计数字**：新增 `scripts/check-unsourced-stats.py`（默认只报告）。全库 198 篇有统计型数字 **1578 处无来源**（占 1743 处的 90%）。其中风险最高的是"市场规模/年增速/需求量预测"，`scripts/oneoff-stats-batch1.py` 把 9 处**完全无出处**的预测改成结构表述（"由项目清单、招标文件、进口记录决定"），带明确出处（6wResearch / AfDB / `[1]` 引用）的原样保留。改完 BLOCK 仍为 0。
- **判断口径**：`MPa / HV / µm / mm / TPI / °C` 这类工程限值不算"统计数字"，不参与无源判定——否则把标准参数也当谣言删，反而伤内容。


### 品牌实体与认证口径：两次「看似简单实则三层坑」

- **品牌写法统一**：全库实测不是策略里记的 148 处，而是 **185 处 / 7 篇**（`Tradego` 小写最普遍，另有 `Tradego-Fasteners` 7 处、`TradeGoFasteners` 1 处连写）。`Organization` 是 `TradeGo Fasteners`，同一实体多种写法会让 AI 引擎归不了档，属于 GEO 实体一致性问题。新增 `scripts/fix-brand-case.py`。
- 三个坑：①`re.I` 会把正确的 `TradeGo Fasteners` 一起匹配（dry-run 虚报 2216 处），必须大小写敏感；②`\b` 在 CJK 紧邻时不算词界（`ーTradego`），要用 ASCII 边界 `(?<![A-Za-z])…(?![A-Za-z])`；③**URL 保护不能"整段跳过"**——`href=` 与正文常在同一空白 token 串里，整段跳过会漏改，要按空白切成 token 逐个判（含 `://` `/en/` `href=` `src=` `tradego-fasteners.com` 的 token 才跳过）。收尾后残留 0。
- **认证体检**：`check-claims.py` 的 CERT 正则只认 `TradeGo … certified` 这种顺序，抓不到 `Certificado ISO 9001` / `ISO認証取得` 这类倒装。新增 `scripts/check-cert-claims.py`：先用"认证词 + 标准号"扫全库得 **3755 条**（全是主题词噪音），改成 **11 语种"自称持有"句式模板 + 允许写法白名单**（按订单/as requested/按标准生产/aligned）后降到 **38 条**，其中句子主语是 `TradeGo` 的只有 **2 条**，真需改 1 条（`offering ISO 898-1 certified concrete screws` → `produced to ISO 898-1 mechanical property requirements`）。
- **标题与内容错配也是一种合规风险**：`china-iso-9001-fastener-manufacturer-directory` 标题承诺"名录"，正文其实是选购指南、没有名录，且标题暗示"已通过 ISO 9001 的厂商"；改成 `China Fastener Quality Systems: ISO 9001 Guide 2026`（51 字符），既贴内容又不越认证红线。
- **口径**：认证类表述只允许两种写法——"按 SABS 1195 / DIN / ISO 生产"或"证书按订单要求提供"；产品级不得写 `certified`。
