# A/B 两线边界共识（2026-11-26 生效）

> 适用：TradeGo 内容站（本仓库 `/Users/zhangming/workspace/tradego-fasteners-v2`）FAQ 多语种补齐的两条并行线。
> 本文件由 B 线（`今日头条分析`，T9i 轮）起草，**两线都要读**；任何后续改动在本文件末尾「变更记录」登记，不改正文既有条款编号。

## 1. 两线是什么

| | A 线 | B 线 |
|---|---|---|
| 代号/owner | `seo-geo-main`（写锁 owner 即此串） | `今日头条分析`（写锁 owner 即此串） |
| 负责范围 | **A 区 39 篇逐篇精修**：正文、meta、FAQ、各语种补到 ≥3 条可渲染；量具/审计/部署（`scripts/geo_audit.py`、`vercel-*.sh`、部署预算） | **非 A 区文章按语种整批扫尾（T8）+ 非英语种口径统一**：一篇一个语种的批量补齐、去模板化、语种外壳清理、长度与问句判据 |
| 抽样口径 | **按 GSC 曝光挑单篇**，逐篇补到每个语种 ≥3 条可渲染问答 | **按语种挑整批**，按英文量装箱、10 篇/批、并发上限按轮指定（T9i 为 3） |
| 提交前缀 | `content(T0c)` / `content(T14)` / `content(T15)` / `content(T16)` / `content(T17)` | `content(T9x)` / `feat(T9i-*)` / `fix(T9i-*)` / `fix(T9h-*)` |
| 留痕文档 | `docs/SEO-GEO-WORKPLAN.md`（§9 看板、§10.5 第二程）、`docs/SEO-GEO-STRATEGY.md`、`docs/SEO-GEO-WORKPLAN-2026-1126.md` | `docs/T9-REPORT-B-2026-1125.md`（§14 起）、`docs/WORKPLAN-B-LINE.md`（§0.5 起）、`docs/FAQ-LOCALIZATION-BACKLOG.md` |
| 共用且必须错号 | `docs/CONTENT-CONTRACT.md`（经验编号）、`docs/faq-native-gap-2026-1125.csv` | 同左 |

## 2. 区域名单的唯一来源

- **A 区 = `docs/seo-geo-main-owned-40-2026-1125.csv` 的 `slug` 列**，共 39 条（该 CSV 只有 `slug,impressions,clicks,owner` 四列；取名单**只读 `slug` 列**，不要把其它列当 slug）。
- **B 区 = `content/articles/*.json` 中不在上述 39 条里的全部**。当前实测：总篇 **279**、A 区 **39**、B 区 **240**。
- 名单变更只能改这份 CSV 并在本文件登记；**不许口头扩区**。

## 3. 防撞规则（写死，违反即以本文件为准回退）

**R1 语种幂等（最高优先级）**：补任何语种之前，**逐篇逐语种**检查 `faqItems[*].q[locale]` / `faqItems[*].a[locale]`：
- 已有值 → **跳过，绝不覆盖**。哪怕判断对方写得不好（机翻腔、长度不够、口径有问题），也不改。
- 只有 `q` 或只有 `a` 一侧缺失 → **只补缺的那一侧**，已有那侧原样保留。
- 两侧都缺 → 按本线规范写。
- 判定"缺"的统一口径：`'<locale>' not in q or '<locale>' not in a`（空字符串视为缺）。

**R2 质量意见只登记不改**：发现对方已写的值不合格（伪翻译、语种外壳、认证口径违规、拉丁整句、套话），**只在各自报告与 CSV 里点名登记**（B 线登 `docs/T9-REPORT-B-2026-1125.md` 的"遗留"节；A 线登 `docs/SEO-GEO-WORKPLAN.md` 的遗留节），由该语种当前 owner 线自己改。**不许"顺手修"**。

**R3 谁后补谁让位**：同一篇同一语种，先写好的一笔为准；后到的线即使先读到旧值，也要先跑 R1 再决定，发现已有值即让位。冲突不可用"我以为对方要重写"为理由覆盖。

**R4 写锁必领必释**：改任何 `content/articles/<slug>.json` 前，
`python3 scripts/article-claim.py claim <slug> <owner>`（TTL 30 分钟）；
退出码 1（被他人持有）→ **跳过该篇并在报告登记"被持锁未动"**，禁止硬上、禁止删锁文件；
commit 成功后 `python3 scripts/article-claim.py release <slug> <owner>`；
收尾 `python3 scripts/article-claim.py list` 自查名下无残留锁。

**R5 在途文件不碰**：对方工作区里有未提交改动（`git status --short` 显示 ` M`）的文章，本方一律不读改写、**不 `restore` / 不 `checkout` / 不 `stash`**，只登记"待对方提交后补"。判定以开工那一刻的 `git status --short` 为准，跑批中途新出现的 ` M` 同样让位。

**R6 一次一笔、单文件、只 commit**：`git add <单个文件> && git commit ... -- <同一文件>`，同一条命令；只 commit 不 push（夜间 `~/AgentOps/bin/content-push.sh` 北京 00:00 统一推）；不 `add -A`、不 `commit -a`、不 `rebase`/`reset`/`amend` 别人提交；撞 `.git/index.lock` 只等 2 秒重试，**不许删锁**。

**R7 语种键集合只增不删**：任何一轮改动后，逐篇 `q`/`a` 的 locale 键集合不得比改动前少（用 `scripts` 里的键集合比对或 `t9b` 的 keyset_diff 工具核）。

**R8 号段预约**：动 `docs/CONTENT-CONTRACT.md` 的经验编号前，先 `grep -nE '^1[0-9][0-9]\. |^2[0-9][0-9]\. ' docs/CONTENT-CONTRACT.md` 取当前最大号，按 N 条预约并在提交信息里写明号段；**两线不得混号、不得插号**。

## 4. 已发生的越界与冲突（2026-11-26 事实核对，供两线复盘）

以 `3795d946..HEAD`（A 线第二程起点至今）为窗，A 线 `content(T14/T15/T16/T17)` 提交 **78 笔**，其中 **26 笔落在 B 区 20 个篇目**上：

- 语种补位型（后续 B 线补该篇其它语种时必须按 R1 跳过已补语种）：
  - `fd5cd932` `botswana-fastener-supplier` 补 ja
  - `28552f1f` `botswana-construction-boom-fastener-import` 补 ja
  - `b5c2da88` / `1abec7ed` `south-africa-fastener-market-guide`
  - `635b5189` / `690e7820` `zimbabwe-construction-fastener-market`
  - `89121e7f` / `738ae384` `construction-fastener-standards-comparison`
  - `c1a4cb1c` `mozambique-fastener-import-market-guide`、`348e71a1` `mozambique-fastener-market-case-study`、`b6d51d24` `mozambique-lng-construction-fasteners-maputo`
  - `5342ca88` `zimbabwe-agricultural-fastener-requirements`、`93526589` `zimbabwe-fastener-supplier`
  - `2ad1b50d` `zambia-fastener-market-case-study`、`39a55308` `benin-cotonou-fastener-wholesale-market`、`2b9b32f3` `angola-construction-boom-fastener-demand`
  - `8b7e3e7c` `uganda-construction-fastener-market-2026`（T15 label 残留）
  - `93f412ca` `timber-screws-construction-guide`、`1b3a2283` `self-tapping-sheet-metal-screws`、`368d4c5d` `lag-screws-timber-connections`、`65b1d1fb` `fender-washers-simplate-washers`（T15 label 残留）
- 正文/措辞型（B 区篇目的 en 正文或单证段被 A 线改写）：`3465c972` `botswana-fastener-supplier` en 正文补写、`00694b48` `nylon-nuts-bolts-guide` 补 en 正文、`339f3f88` `nylon-nuts-bolts-guide` 单证措辞、`cc474702` `concrete-screws-anchors-guide`。
- 结论：**按本文件新口径，A 线的合法范围是 A 区 39 篇**；上述 20 个 B 区篇目属历史越界，**不回滚**（已提交内容按 R3 视为有效，B 线后续只做 R1 跳过），但**从 2026-11-26 起不得再发生**。A 线如需再补某篇非 A 区文章，先在本文件变更记录登记"借调 slug + 语种"。

其余在途冲突（B 线 T9i 开工实测）：
- 5 篇 ` M` 未提交（别线在途）：`africa-fastener-market-opportunities-2026`、`agricultural-machinery-fastener-guide`、`china-fasteners-zimbabwe-procurement-guide`、`ghana-fastener-market-guide`、`mozambique-hardware-supplier`。B 线本轮按 R5 全部不碰，其中 3 篇（`africa-fastener-market-opportunities-2026` 7 条 / `china-fasteners-zimbabwe-procurement-guide` 6 条 / `ghana-fastener-market-guide` 7 条）的 **ru 缺口 20 条**登记为"待对方提交后补"。
- 经验号段：B 线 T9h 用 163–167，A 线第二程已用 **168–175**；B 线 T9i 顺延预约 **176–180**。
- A 线自持写锁（实测 `self-drilling-screws-selection-guide` 生效中）：B 线批次名单里若出现，按 R4 跳过。

## 5. 口径统一（两线一致，不各自定义）

- 语种清单固定 10 个：`en, zh, es, fr, de, pt, ru, ja, hi, ar`。
- "可渲染" = 该条 `q`/`a` 两侧都有该语种非空值，且 `scripts/normalize-faq-i18n.py --apply` 后不被删（阿语/俄语/印地语要有足够本语种字母占比）。
- 量具以 A 线 `3795d946` 之后为准（`geo_audit.py` 的 `fq` 可渲染过滤 + `q_ok` 问句校验）；B 线**不再沿用更早的宽松口径**，报告中"满分篇/可渲染篇"一律标注量具版本。
- 合规四铁律（任何语种、任何线）：①认证只写"按 SABS 1195/DIN/ISO 标准生产"或"证书按订单要求提供"，不得写已持有/不持有；②单证以站内 `/documents` 页为准；③不写具体单价/折扣数字，只讲报价结构；④地域只写 China（各语种本地写法，阿语 `الصين`、俄语 `Китай`、印地语 `चीन`），禁写俄罗斯/省份。
- 判据脚本各线自持但互相引用：A 线 `scripts/geo_audit.py`、`scripts/check-body-lang`、`scripts/content_gate.py`、`scripts/faq_audit.py`；B 线 `scripts/faq_audit.py`、`scripts/content_gate.py` + 语种自检（`check_ru.py` / `check_hi.py` / `check_ar.py`）。

**R9 工具共享**：A 线量具改了判据（如上 `fq`/`q_ok`），必须在 `docs/SEO-GEO-WORKPLAN.md` §10.4/§10.5 写明口径与 commit，B 线按其最新口径出报告，不得各算一套数。

## 6. 变更记录

- 2026-11-26（B 线 T9i 轮起草）：建立 R1–R9；登记 A 线在 B 区的 20 个历史越界篇目与 26 笔提交；登记 5 篇在途文件与 3 篇 ru 缺口（20 条）；号段 168–175 已被 A 线占用，B 线顺延 176–180。
- 2026-11-26（seo-geo-main 借调，红线合规）：经 R 线登记借调两篇，原因：用户实测命中合规红线（①PVoC 段写"上海"办公/发货地且列 USD 费用档位；②正文/Faq 出现"必须从通过 ISO 9001:2015 认证的制造商处采购"的持证越界表述）。借调 slug：`ghana-building-materials`、`angola-lng-project-fastener-procurement`；借调人 `seo-geo-main`；仅改红线句及其同语种同义越界句，不动其他字段；commit 号回填于本条第二笔登记（见下）。
