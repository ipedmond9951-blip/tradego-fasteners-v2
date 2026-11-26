# GSC 内容层对齐 · B 线 R-T9l 整改方案（一轮做完版）

- 轮次：**R-T9l**（B 线 owner「今日头条分析」）
- 仓库：`/Users/zhangming/workspace/tradego-fasteners-v2`（分支 `main`，**只 commit 不 push**）
- 起点 HEAD：`8bbedfa5`；本轮结束时本地领先 origin（夜间 `~/AgentOps/bin/content-push.sh` 北京 00:00 统一推，`scripts/vercel-promote.sh` 仍是唯一上线入口）
- 依据：Google Search Central 官方文档（`google-search-central` 技能 references）+ `docs/CONTENT-CONTRACT.md`（认证/单证/产地四铁律）
- 扫描面：全库 **279 篇**（A 线 39 篇 + redirect 存根 15 篇另计）× **10 语种**（en/zh/es/fr/de/pt/ru/ja/hi/ar）

## §0 结论先行

1. **价值定位先纠偏**：本线所有多语种 FAQ 工作，目的是**本地语种页面完整度 + AI 摘要取材**，不是 FAQ 富结果。FAQ 富结果自 **2026-05-07 起已在 Google 搜索全站停用**，FAQPage 文档 2026-06 下线，官方**不要求移除**、保留无害。本轮已把旧口径（"只对政府和医疗开放""补 FAQ schema 争富结果"）从本线文档里彻底纠正。
2. **滚动期纪律**：December 2026 core update 自 **2026-11-24** 起仍在滚动。本轮只做**合规与技术修复**，不含任何"排名/流量提升"预期，也不做效果归因；任何效果结论一律等更新结束 + GSC 数据满两周。
3. **五组扫描 = 五个真实链路问题**：① FAQ 口径旧文档在指挥返工（2 处已改）；② 旧重复判据「≈15 次才报」抓不到整段共用（判据升级后 B 区 127 组/624 篇次）；③ 语言一致性按可见文字判后暴露出 ar 111 / ja 268 / hi 253 / zh 64 / ru 33 条（官方 S9）；④ 存量债按"侧次 + 阈值 + 语种"重算才对得上账（超长 843、短答 1046、残留 257）；⑤ 内容层技术项 5 项里 3 项合规、2 项交 A 线。
4. **本轮做功**：把 **B 区可改队列清到 0**（跨篇重复 rewrite 0、ar 三组 0、title>70 B 区 0、写锁 0 残留），存量债按语种清了 **809 侧次 / 190 篇次**（超长 241、短答 406、英文残留 162，逐条比对口径），并**零新增 BLOCK**（279 篇全量 `content_gate`）。同时新增 6 份台账 CSV + 1 份残留分类 CSV，让剩余量变成**可数、可派、可复跑**的名单，而不是"还有一堆"。
5. **未做完的部分已量化**：ja/hi/zh/ru 拉丁残留 264 条（其中 128 行卡在他线持锁的 19 个冲突 slug）、超长 B 区 187 条、短答 B 区 600 条、金额类 439 条待源文金额线、107 篇合规红点里 B 区 96 篇待用户拍板。这些都是下一轮的起量依据（§5）。

### 0.1 验收八项（实测数字）

| # | 验收项 | 结果 | 证据 |
|---|---|---|---|
| ① | S1 口径 grep 残留 = 0 | **通过**：本线 doc/`scripts`/`content` 命中只剩更正段与硬约束本身；跨线 1 处（`src/i18n/zh.json:112`"供 Google 富摘要展示"）交 A 线 | 见 §3.1、交接单 §10.1 |
| ② | S2「≥3 篇整段重复」在 B 区归 0 | **通过**：`dup_paragraph.py` 收尾 B 区 rewrite = **0 组**；余 90 组全部 `registered` 并注明原因（en 源文 31 / ar 21 / 样板导航与引导句 38） | `docs/gsc-dup-paragraph-2026-1126.csv`（129 行，`ec4408c4` 后补注 `dc67f2a1`） |
| ③ | S3 B 区跨文字残留归 0，CSV 带 A 区分因 | **部分达成**：ar 三组 B 区 **0/0/0**；ja/hi/zh/ru 拉丁残留收尾 **86/83/62/33**（判据口径见 §1.2），逐条分类入 `docs/gsc-lang-residual-b-2026-1126.csv`：`prose_residue` 135（可 clean 6 组合 7 行，其余 128 行卡 19 个冲突 slug）/ `mixed_residue` 34（专名嵌句，口径保留）/ `proper_noun` 0。未归零部分已按 slug 级量化，非"无限遗留" | 同左 CSV + `gsc-lang-consistency-*.csv`（含 A 区 135 行分因） |
| ④ | S4 清理篇数/条数 + 剩余清单 | **通过**：超长 fixed **241 条/19 篇**（余 B 187 pending）、短答 fixed **406 条/135 篇**（余 B 600）、英文残留 fixed **162 条/36 篇**（余 B 88）；三类均"起点快照 vs 当前磁盘逐条比对"，明细见台账 CSV | `$T9L/final_account.py` 输出、`gsc-longanswer-*`、`gsc-shortanswer-enresidue-*` |
| ⑤ | 279 篇 `content_gate` 全绿 | **通过**：`完全干净 219 (83%) / 只 WARN 45 (17%) / 有 BLOCK 0`，`新增 BLOCK: 0 篇`，`✅ 闸门通过`，EXIT=0 | `logs/content-contract-latest.json` |
| ⑥ | 各语种判据全量回归 0 新增 | **通过**：B 区 240 篇全量回归，**新增 FAIL 条目 = 0**；FAIL 篇数全部下降（zh 192→126、ja 79→52、hi 42→15、es/fr/de/pt 92→85） | `check_zh/check_ja/check_hi/check_latin` 起点快照 vs 当前对比 |
| ⑦ | 语种键只增不删 | **通过**：279 篇逐篇对比起点，**丢失语种键 0**；`a.en/q.en` 逐字对比**改动 0**（经验 210 的事故未复发） | `$T9L/final_account.py`/键集比对脚本 |
| ⑧ | 提交全单文件、写锁无残留 | **通过**：本轮 `T9l-*` 前缀提交 **376 笔**（lang 168 / debt 145 / dup 60 / s1 2 / s2 1），**多文件提交 0 笔**；`article-claim.py list` 收尾为空；A 区 39 篇命中 **0** 篇；`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`、`src/**` 本线未碰（其中 `docs/SEO-GEO-STRATEGY.md` 一笔改动来自 seo 线自己的提交，非本线） | `git log 8bbedfa5..HEAD`、`git status` |

## §1 五组扫描取证（抽样面 / 命中数 / A-B 分因 / CSV）

| 组 | 抽样面 | 实测命中（B / A 分因） | 本轮已修 | 台账 CSV |
|---|---|---|---|---|
| **S1 FAQ 富结果口径** | 本线 7 个 doc + `scripts/` + `content/articles/*.json`（279）+ `src/i18n/*.json`；词 `FAQ 富结果｜富摘要｜rich result｜Rich Result｜FAQPage｜FAQ schema` | 需改 **2**（`CONTENT-CONTRACT` 189 条、`CONTENT-SEO-AUDIT` 239 行）；只登记 **1**（`src/i18n/zh.json:112`） | 2（`c8c06523`、`172dd4f1`） | 本线 grep 残留 0；跨线 1 条 → 交接单 §10.1 |
| **S2 跨篇重复段落** | 279 篇 × 10 语种 = **41,264 个** FAQ 答案/正文段落单元 | 归一化整段 ≥3 篇共用：**B 90 组 / 1,291 篇次**（起点 B 127 组 / 624 篇次）、**A 39 组 / 222 篇次**（起点 A 42 / 225） | 53 篇 / 60 笔 `T9l-dup`；B 区 rewrite 队列 **127→0 组** | `docs/gsc-dup-paragraph-2026-1126.csv`（129 行：B 90 / A 39，全 registered + `note` 写明原因） |
| **S3 语言一致性** | 279 篇 ×9 语种 × `title/description/metaDescription/q/a`；另 10 语种 title 全量 2,640 条 | ar 三组：`q.ar` 嵌英文 **111→0**（B 36→0）、`a.ar`>450 **229→122**（B 全清，A 区 122 只登记）、`a.ar`<120 **20→0**；latín 整句收尾 B 区 ja **86** / hi **83** / zh **62** / ru **33** / ar **2**；`foreign_script` B 区零星（ja 14 / zh 8 / ar 4 / es 6 / de 5 / hi 5 / pt 4 / fr 3）；title>70 **23→1**（B 22 全清，余 1 条 A 区 ru 75） | 89 篇 / 168 笔 `T9l-lang` | `docs/gsc-lang-consistency-2026-1126.csv`、`docs/gsc-lang-consistency-ruja-2026-1126.csv`、`docs/gsc-title-length-2026-1126.csv`（2,640 行）、`docs/gsc-lang-residual-b-2026-1126.csv`（169 行分类） |
| **S4 存量技术债** | 279 篇 ×8 语种（`zh/es/fr/de/pt/ja/hi/ru`；en 源文、ar 另一路）`a.<loc>` 长度与英文残留 | 超长 >450：起点 **843 侧次（A 445 / B 398）**；短答 <120：起点 **1,046（A 55 / B 991）**；英文残留：起点 **257（A 7 / B 250）**；`a.en` 占位句 **22** | 超长 fixed **241 条/19 篇**、短答 fixed **406 条/135 篇**、残留 fixed **162 条/36 篇** | `docs/gsc-longanswer-2026-1126.csv`、`docs/gsc-shortanswer-enresidue-2026-1126.csv` |
| **S5 内容层技术项** | 只读代码 + 离线复算 279 篇 ×10 语种 | ① x-default 已有（合规 0 待改）② title>70 = 23（B 22）③ 文章页 lastmod 用真实更新日（合规）④ 误加 nosnippet 0 处、设计性 noindex **246 篇×语种**（B 230 / A 16）⑤ `og:url` 尾斜杠不一致（观察） | ② 22 条已改（计入 S3）；③④⑤ 只登记 | `$T9L/s5-title-over70.csv`、`$T9L/s5-locale-noindex.csv`、`$T9L/scan_s5_index.py` |

### 1.1 与上一轮/中途数字的对账（差在哪）

| 指标 | 旧/中途数 | 本轮收尾数 | 差异原因（口径） |
|---|---|---|---|
| FAQ 富结果口径 | 189 条写"只对政府/医疗开放" | 2026-05-07 全站停用 | 官方 2023-08-08 收紧 → 2026-05-07 全站停用；旧文档未跟 |
| 跨篇重复 | 旧判据 6-gram ≥15 次"≈15 次才报" | 归一化整段 ≥3 篇 | 滑窗判据查"片段复用"，整段判据查"模板搬运"，两条并存（经验 207） |
| `q.ar` 嵌英文 | A 线 109 | 本线 **111** | A 线按"长度 + 阿语占比"筛，本线按**连续 ≥4 拉丁词**筛；另有 `q.ar`>70 字符口径 16 条（B 13）。三种判据都对，引用必须写口径 |
| `a.ar`>450 | A 线 136 | **229** | A 线是旧快照/顶层条目计数；本线含 section 内重复副本，去标签 225、去重 221（B 99） |
| 超长答案 >450 | 中途 S4a 扫描 **912 侧次** | 起点快照复算 **843**（A 445 / B 398） | 中途扫描时工作树已含他线未提交的 11 个脏文件改动；以 `8bbedfa5` 快照复算的数字为准（可复现） |
| 短答 <120 | 中途记 B 1,006 | 起点复算 **1,046**（A 55 / B 991） | 同上；另 ja 短答补齐时把 52 条 ja 拉进区间，属"先增后减"类 |
| S3 拉丁残留 | 中途 S3-ruja 记 ja 164 / hi 116 | 收尾 ja **86** / hi **83** | 收尾轮再清 111 条（26 篇），且判据按"连续 ≥4 拉丁词"统一；台账 169 行与扫描器 192/264 的差见 §1.2 |
| 残留分类 | `$T9L/backlog` 口述 161 条 | 重扫 **169** | 口述数与磁盘不一致时以重扫为准（经验 211） |

### 1.2 判据口径差异（两个扫描器为何数不同）

- `lang_consistency_ruja.py`（ru/ja/zh/hi）：按 `(语种, 句内连续 ≥4 拉丁词)` 计，拉丁语种与 en 对照作基线，**含 title/description/metaDescription**；收尾输出 ja 86 / hi 83 / zh 62 / ru 33。
- `lang_consistency.py scan`（ar 主线 + 9 语种交叉）：同一句子按"数字/符号断开即重置"的 token 流计数，且把 `foreign_script`（混入非目标文字系统）单列；收尾输出 latin_sentence B 区 ja 68 / hi 75 / zh 33 / ru 15。
- 两者差 10–20% 属 tokenization 与字段覆盖差异，**不是谁错**：引用 ja/hi/zh/ru 残留量用 ruja 口径（含 meta 字段、更严），ar 三组用 `lang_consistency.py`（`ar-groups` 子命令）。经验 211 已写成硬约束：台账首行必须写"阈值 / 语种 / 去重规则 / 统计单位"。

## §2 分级清单（六列：症状 / 官方依据 / 改法 / 责任人 / 验证命令 / 上线后复核点）

### P0（影响内容质量判定，本轮清到 0 或给出显式剩余）

| 症状 | 官方依据 | 改法 | 责任人 | 验证命令 | 上线后复核点 |
|---|---|---|---|---|---|
| **跨篇整段逐字重复**（归一化 ≥3 篇共用同段，语种分开计）起点 B 127 组/624 篇次，收尾 rewrite **0 组** | Search Essentials 垃圾内容政策「滥用规模化内容」：批量生成/自动转换/拼贴无附加价值（`fundamentals.md` 77–79，R8） | 贴本篇市场与项目事实重写，同语种跨篇必须各异，数字不动；en 源文与 ar 语种不动 | B 线（A 区 39 组只登记） | `python3 $T9L/dup_paragraph.py` → B 区 rewrite=0；`docs/gsc-dup-paragraph-2026-1126.csv` | 抽 5 组原命中段，确认各篇表述不同且事实未变 |
| **非目标语拉丁整句/拉丁转写标题**（收尾 B 区 ja 86 / hi 83 / zh 62 / ru 33 / ar 2 + `foreign_script` 零星） | 官方按页面可见内容判语言，不读 `lang`／hreflang；避免原文译文并列（specialty S9） | 改写为目标语原生表述；技术专名/标准号/尺寸等级可保留 ≤3 词 | B 线（A 区 135 行只登记） | `python3 $T9L/lang_consistency_ruja.py` / `lang_consistency.py ar-groups` + `check_ja/check_hi/check_zh/check_latin` | 抽 10 个命中页，看可见正文语种与 `inLanguage`、hreflang 一致 |
| **FAQ 口径把「富结果/富摘要」当目标**（2 处旧文档已改） | FAQ 富结果 2026-05-07 全站停用、文档下线、官方不要求移除 | 口径统一为「本地语种页面完整度 + AI 摘要取材」，写进 `docs/CONTENT-CONTRACT.md` 硬约束段 | B 线（`src/i18n` 1 条交 A 线） | `grep -rn "FAQ 富结果｜富摘要｜rich result" docs/CONTENT-CONTRACT.md`（只应出现在更正段/硬约束） | 文档层不复现旧口径；不再为补 schema 立案 |

### P1（存量债，本轮按语种清了一部分，剩余进下一轮名单）

| 症状 | 官方依据 | 改法 | 责任人 | 验证命令 | 上线后复核点 |
|---|---|---|---|---|---|
| **FAQ 答案超长 >450**：起点 843 侧次（A 445 / B 398），本轮 fixed 241 条/19 篇，余 B **187** pending（es 38 / fr 37 / de 23 / pt 32 / ru 26 / hi 10 / ja 1 / zh 1 口径差异见台账） | Search Essentials「有用内容」与精简表达；长不等于有用（`fundamentals.md` R5/R6） | 压到 120–450，保留 `a.en` 全部要点与数字 | B 线（A 区 539 只登记） | `python3 $T9L/final_account.py`；`docs/gsc-longanswer-2026-1126.csv` | 抽 10 页确认仍逐点回答、无删事实 |
| **FAQ 答案过短 <120**：起点 1,046（A 55 / B 991），fixed 406 条/135 篇，余 B **600**（zh 322 / ja 187 / de 34 / fr 34 / es 33 / pt 26 / ru 19 / hi 5） | 同上（薄内容）+ R8（机器直译无价值） | 按 `a.en` 要点补写成段，不加数字；zh 按汉字 ≥55% + 130–180 字 | B 线 | 同上 | 抽 10 页看答案成段、非空话 |
| **非英语种英文残留**：起点 257（B 250），fixed 162 条/36 篇，余 B **88**（ja 37 / zh 32 / hi 27 / ru 1） | S9（可见内容判语言）+ R8 | 改写为目标语原生表述 | B 线 | `check_latin.py --locale es,fr,de,pt` + 目标语判据 | 抽样页面无成句英文 |
| **`a.en` 占位句 22 条**（"See the detailed analysis above…"） | 源文薄内容 + R8 | 补实 `a.en`（源文层） | A 线（本线不改 en） | `docs/gsc-shortanswer-enresidue-2026-1126.csv`（`metric=en_placeholder`） | 上线后源文无占位句 |
| **title >70 字符**：23 条（ru 16 / de 3 / es 1 / fr 1 / pt 1 / hi 1） | 标题与页面语种一致；避免 SERP 截断丢词 | content JSON 侧压到 ≤70，保留语种词/材质/MOQ/交期词 | B 线（A 区 1 条只登记） | `docs/gsc-title-length-2026-1126.csv`（收尾 >70 = 1 条 A 区） | 抽 10 条 SERP 标题不截断、关键词在首位 |
| **本地语正文完整度 <20% → 设计性 `noindex` 且不进 sitemap**（246 个"篇×语种"页，B 230 / A 16，涉 87 篇） | R16（sitemap 只列可索引页）；薄内容不占抓取预算 | **不改代码**：评估"扩写正文 vs 收缩索引范围" | A 线（技术判断）+ B 线（扩写排期） | `python3 $T9L/scan_s5_index.py`；`$T9L/s5-locale-noindex.csv` | 上线后 GSC 已收录数与该名单差集 |
| **sitemap 静态/产品/市场/标准/分类页 `lastmod` 共用构建时刻**（A 线 H6，1,702 条） | R16：`lastmod` 必须真实反映重大更新 | 按各自真实更新日输出；**文章页已合规，不要改** | A 线 | 只读 `src/app/sitemap.xml/route.ts` L40–114 | 抓 sitemap 抽 5 条，`lastmod` 各不相同 |

### P2（观察项，不改代码）

| 症状 | 官方依据 | 改法 | 责任人 | 验证命令 | 上线后复核点 |
|---|---|---|---|---|---|
| `og:url` 无尾斜杠而 `canonical` 有尾斜杠 | canonical 自引用一致性（R18/R19） | 统一尾斜杠（模板一处） | A 线 | 只读 `page.tsx` L73 vs L71 | 抽样页面 og:url 与 canonical 同形 |
| `src/i18n/zh.json:112`「供 Google 富摘要展示」 | S1 同口径 | 改文案为「供搜索引擎理解内容」 | A 线 | `grep -n "富摘要" src/i18n/zh.json` | 上线后 grep 0 |
| 桌面备份 `google-search-central` 技能 md5 漂移（`5bc19545…` vs 工作区 `19284a7b…`） | 判据来源唯一性 | 同步副本或废弃桌面副本 | 用户 / A 线 | `md5` 三处 `SKILL.md` | 三处 md5 一致 |

## §3 本轮已执行项（逐条带 commit 与终值）

> 全部为**单文件**提交、未 push；每条改动都过了 `content_gate` 单篇闸门，收尾再跑全量。今日部署预算 3/3 已用尽，本批随明早 `deploy-flush` 一次上车。

### 3.1 S1 口径纠偏（2 笔）

| commit | 文件 | 终值 |
|---|---|---|
| `c8c06523` | `docs/CONTENT-CONTRACT.md` | 新增「口径硬约束」段：189 条"FAQ 富结果只对政府和医疗开放"→ **2026-05-07 全站停用、官方不要求移除**；价值定位锁定「页面完整度 + AI 摘要取材」；验收不看 Rich Results Test |
| `172dd4f1` | `docs/CONTENT-SEO-AUDIT.md` | 239 行「Add FAQ schema to article pages」加更正注记，不再作为建议执行 |

### 3.2 S2 跨篇重复段落（60 笔 / 53 篇）

- 判据：`$T9L/dup_paragraph.py`（归一化去标签/实体/全半角与中英标点、合并空白，**数字原样**；按 `(语种, 归一文本)` 分组，**≥3 篇即 FAIL**，语种分开计；指纹 sha1 前 12）。
- 重灾两篇：`green-building-fastener-requirements`（97 组 / 113 段，7 语种）`2f498499`、`mozambique-fastener-import-market-guide` `47d9a9c6`。
- 其余：`fastener-failure-analysis-case-studies` `5a782c4c`、`dr-congo-drc-mining-fastener-market` `fe4fa3ea`、`angola-construction-boom-fastener-demand` `56f2e768` 等 51 篇。
- 终值：**B 区 rewrite 队列 127→0 组**；剩余 90 组全部 `registered`（en 源文 31 / ar 21 / 样板导航与引导句 38；其中 1 组 pt 报价构成段因涉金额留 G 类线统一处置）。

### 3.3 S3 语言一致性（168 笔 / 89 篇）

- **ar**：`q.ar` 嵌英文 36→0、`a.ar`>450 B 区全清、`a.ar`<120 20→0（A 区三类均为 0）；14 篇。
- **ja/hi 拉丁整句**：分批清零 241 条（第一批 202 条/27 篇、第二批 39 条/7 篇、收尾 111 条/26 篇），均按 `a.en` 要点整段重写成原生答案，数字结论保留，专名只留缩写与等级号。
- **zh/ru**：zh 补写与去残留、ru 3 条；`title`>70 22 条 B 区全部压到 ≤70（含 tanzania 五语种合一笔 `fb597b31`）。
- **事故与修复（重要）**：一次 blob 驱动批量补丁把 `egypt-*` 10 组（20 条）`a.en` 覆盖成日语（ja 与 en 同文触发）；已从父提交逐键恢复 en、保留 ja 译文（`438420c9`，20+/20-，其余 9 语种零改动）。收尾复核：279 篇 `a.en/q.en` 逐字改动 **0**。

### 3.4 S4 存量技术债（145 笔 / 119 篇）

- 超长 >450：fixed **241 条 / 19 篇**（语言分布 de 26、pt 63、fr 64、es 64、ru 16、hi 6、ja 1、zh 1），余 B 187 pending（zambia-copper 26、ethiopia-industrial-park 42 等体量大篇留整批闭环）。
- 短答 <120：fixed **406 条 / 135 篇**（zh 328、ja 52、es 7、pt 8、fr 8、de 2、ru 1；含 R2 线 zh lane 83 篇 265 条与 S4b 半份 74 篇 191 条中的可 clean 部分）。
- 英文残留：fixed **162 条 / 36 篇**（ja 79、hi 73、zh 10）。
- 台账由 `$T9L/final_account.py` 用"起点快照 vs 当前磁盘**逐条**比对"生成（不是行数相减），三类合计 **809 侧次 / 190 篇次**。

### 3.5 台账与交接文件

| 文件 | 行数 | 说明 |
|---|---|---|
| `docs/gsc-dup-paragraph-2026-1126.csv` | 129 | B 90 / A 39，全 registered + note |
| `docs/gsc-lang-consistency-2026-1126.csv` | 506 | ar 主线 9 语种，fixed 307 / registered 199；A 区 135 行分因 |
| `docs/gsc-lang-consistency-ruja-2026-1126.csv` | 275 | ru/ja/zh/hi 收尾口径，B 区 264 / A 区 10 |
| `docs/gsc-lang-residual-b-2026-1126.csv` | 169 | B 区 ja/hi 残留逐条分类（prose 135 / mixed 34 / proper 0） |
| `docs/gsc-title-length-2026-1126.csv` | 2,640 | >70 收尾 1 条（A 区 ru 75） |
| `docs/gsc-longanswer-2026-1126.csv` | 967 | fixed 241 / pending 187（B）/ registered 539（A） |
| `docs/gsc-shortanswer-enresidue-2026-1126.csv` | 1,088 | fixed 406 / registered 660 / en_placeholder 22 |
| `docs/HANDOFF-TO-A-LINE-2026-1126.md` | §1–§10 | 本轮新增 §10（技术层 + A 区内容 + 107 篇红点 B 区分因） |

## §4 交 A 线项（技术层 + A 区内容 + 107 篇合规红点的 B 区分因）

> 全部写入 `docs/HANDOFF-TO-A-LINE-2026-1126.md` **§10**（本轮只登记，不替 A 线动手）。

### 4.1 技术层（只读取证，未改代码）

1. **sitemap `lastmod`（H6，1,702 条）不覆盖文章页**：`src/app/sitemap.xml/route.ts` L69–71 文章条目用 `getFreshness(slug)?.modified || article.updated || article.date`（真实更新日）；L40–114 的静态/产品/市场/标准/分类页仍 `lastmod: now`。→ 修 H6 只改那几类，别顺手把文章页刷成构建时间。附带预期：本轮批量改动会让大量 `modified` 集中在 11-25/26，上线后 GSC 侧出现"全站同日更新"属预期。
2. **246 个"篇×语种"页设计性 `noindex` 且不进 sitemap**（B 230 / A 16；zh 62 / ja 41 / ar 36 / hi 35 / es 16 / ru 16 / de 15 / pt 13 / fr 12；涉 87 篇）：`isThinForLocale` 以"本地正文 share <20%"判定，`isThinArticle`(<300 词) 命中 0 篇。要动只有两条路——扩写正文（内容工程）或收缩索引范围（策略），**代码侧不建议改阈值**。
3. **`og:url` 无尾斜杠 vs `canonical` 有尾斜杠**（`page.tsx` L73 vs L71）：统一即可。
4. **`src/i18n/zh.json:112`** 文案「供 Google 富摘要展示」：按 S1 口径改。
5. **桌面技能副本漂移**：`~/Desktop/龙虾记忆/skills/google-search-central/SKILL.md` md5 `5bc19545…` ≠ 工作区/`~/.agents` `19284a7b…`；引用以工作区为准，建议同步或废弃。

### 4.2 A 区内容（39 篇，只登记）

- S2 跨篇重复：A 区 **39 组 / 222 篇次**（含 14 篇共用 `a.en`）。
- S3 语言：A 区 `latin_sentence` 10 行、`foreign_script` 1 行（`harare-fastener-distributor-supplier-guide` ru 夹汉字）、`latin_title` 0；ar 三组的 A 区 `a.ar`>450 **122 条**只登记。
- S4 债：A 区超长 **539 条**（起点 445，经他线改动后上升）、短答 60 条、残留 9 条，本轮未碰。
- `a.en` 占位句 22 条（源文层，B/A 区均有）。

### 4.3 107 篇合规红点里属 B 区的部分（只算数，不替 A 线清）

- 清单 `docs/compliance-redspots-2026-1126.md` 表内 distinct **109 篇**（文档小结写"剩余 107"，与表内差 2，需 A 线对账）；按 `docs/seo-geo-main-owned-40-2026-1125.csv` 分因：**B 区 96 篇 / A 区 13 篇**。
- 分类（按行）：A1 认证持证 B 区 **64 篇 / 132 行**（A 区 6 篇 / 16 行）；B1 报价金额 B 区 **44 篇 / 44 行**（A 区 9 篇 / 9 行）；C1 我方地名 B 区 **2 篇 / 2 行**（A 区 0）。
- 处置顺序建议：认证（按四铁律改写为"按 SABS 1195/DIN/ISO 生产"或"证书按订单要求提供"）→ 地名 → 金额（须等 G 类源文金额线，避免半改）。

## §5 下一轮入口与纪律

### 5.0 收口状态

- 起点 `8bbedfa5` → 收尾 HEAD 见 `git log -1`；本轮 `T9l-*` 提交 **376 笔**，全部单文件、全部 `content_gate` 过闸、全部未 push。
- 写锁：收尾 `article-claim.py list` **为空**（本线无残留；他线锁未触碰）。
- 工作树：仅剩**他线**未提交脏文件（11 个 `M`，本线按约束未碰）。

### 5.1 纪律（硬）

1. **滚动期只做合规与技术修复**，不做效果归因；任何"排名/流量"结论等 core update 结束 + GSC 数据满两周。
2. **提交纪律**：`git add <单文件> && git commit -F <msg文件> -- <单文件>`；禁 `-F -`、禁 `add -A/-a`、禁 reset/rebase/restore/stash；**共享索引下禁 `--amend`**（本轮已发生一次 amend 卷入他线暂存，产生两条消息错配提交，未改写历史，登记为异常）。
3. **批量改写必须按 `(slug, section, item, locale)` 精确写键**，落地前断言 `git diff` 里 `en` 键逐字未变（经验 210）。
4. **台账首行写清阈值 / 语种 / 去重规则 / 统计单位（条目 vs 篇次 vs 侧次）**，否则两轮对不上账（经验 211）。
5. **不许再返工的清单**：FAQPage 富结果（已停用，不为它补 schema）、x-default（已有）、文章页 sitemap lastmod（已合规）。

### 5.2 下一轮起量（数字即名单）

| 队列 | 起量 | 阻塞点 | 建议 |
|---|---|---|---|
| ja/hi/zh/ru 拉丁残留 | 264 条（`prose_residue` 135 行） | **128 行卡 19 个冲突 slug**（他线持锁/脏文件）；可 clean 仅 6 组合 7 行 | 先清可 clean 7 行，再与 A 线对锁后成批清冲突 slug |
| 超长答案 pending | B 187 条 | zambia-copper(26)、ethiopia-industrial-park(42)、zimbabwe-b2b(29) 体量大 | 按 15 条/批闭环，单篇超 30 条的拆两轮 |
| 短答 | B 600 条（zh 322 为主） | zh 下限口径待定（现 120 字符；470 条"紧凑中文"落在 80–120） | 需用户拍板：zh 放宽到汉字 ≥80 或 130–180 字 |
| 金额/百分比类 | 439 条（ja 175 / zh 101 / hi 33 / es 33 / fr 32 / de 30 / pt 23 / ru 12） | 须等 G 类源文金额线 | 不在内容层就地改写，避免半改 |
| 合规红点 B 区 | 96 篇（认证 64 / 金额 44 / 地名 2，按行 178） | 待用户拍板处置顺序 | 认证→地名→金额 |
| 设计性 noindex | 246 篇×语种（B 230） | 需 A 线技术判断 | 扩写优先 zh/ja/ar/hi 四大户（62/41/36/35） |

### 5.3 可复用判据脚本（都在 `$T9L`）

`dup_paragraph.py`（跨篇整段重复）、`lang_consistency.py`（ar 三组 + 9 语种交叉）、`lang_consistency_ruja.py`（ru/ja/zh/hi 口径）、`check_latin.py`（es/fr/de/pt）、`check_zh.py`、`check_ja.py`、`check_hi.py`、`scan_longans.py`、`scan_shortans.py`、`scan_s5_index.py`、`final_account.py`（起点快照 vs 当前逐条对账）。
