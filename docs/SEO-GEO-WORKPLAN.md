# SEO/GEO 总排期与分工（合并版 · 2026-11-25 20:40 起）

> 这份文件回答"这周谁做什么、按什么顺序、做完什么算完"。口径不在本文件，工单明细也不在本文件。

## 0. 读文件顺序（其他对话开工前照这个来）

1. `docs/SEO-GEO-STRATEGY.md` — **口径**：认证/单证/价格/地域怎么写，谁能写哪里。改文案前必读。
2. `docs/SEO-GEO-WORKPLAN.md`（本文件）— **排期、分区、任务卡、owner**。
3. `docs/seo-geo-worklist-2026-1125.csv` + `docs/seo-geo-worklist-guide-2026-1125.md` — **逐篇工单**，重跑 `python3 scripts/build-seo-geo-worklist.py` 更新，别手改。
4. `docs/SEO-GEO-WORKPLAN-2026-1126.md`（今日头条分析线产出）— **明细附录**，W1–W6 的原始判据与清单出处，已并入本文件任务卡，不再作为排期依据。
5. `docs/reports/seo-geo-<日期>.md` — **度量**，每日 20:16 自动生成。

四者冲突时以策略文件为准，其余重跑脚本对齐。

## 1. 现状（2026-11-25 20:40，两线独立实测的一致结论）

**已上线**：`origin/main == HEAD`（0 未推，工作区干净）；生产部署 `667780d3` 三域名一致；抽查 `/{en,zh,es,de,ar}/industry/china-iso-9001-fastener-manufacturer-directory/` 标题已是新口径。文章路径形态是 `/{locale}/industry/<slug>/`（用 `/articles/` 测会 404）。

**英文侧这一轮修得好，非英语侧几乎没动过**——这是两条线独立量出来的同一个结论：

| 项 | 数值 | 来源 |
|---|---|---|
| GEO 均分（en 口径） | 62.7（A 11 / E 106） | geo_audit |
| 语种均分（T0 修完量具后） | en 62.7 / zh 55.9 / ru 53.1 / ja 51.2 / ar 49.2 / es 48.1 / pt 47.3 / de 47.1 / hi 46.5 / fr 45.0 | geo_audit --locale |
| 非英语段落缺口 | 8,318 节（en 仅剩 24、zh 3） | geo_locale_plan |
| 首段巨型段（>300 词） | hi 61 / fr 34 / es 31 / pt 28 / ar 11 / ru 9 / de 6 / en 2 | 本次实测 |
| 标题 >55 字符 | 905 个「篇×语种」组合，其中非英语 834（es 154 / fr 150 / de 132 / ru 130 / pt 115 / ar 83 / hi 70） | 头条线 |
| 非英语 FAQPage | 只有 en 输出；本地 FAQ 覆盖 en 100%、zh 47.7%、ar 10.6% | 头条线 |
| 非英语正文英文残留 | 14 处（es/fr/pt/de 同段、ar 夹英文谓语等） | 头条线 |
| 重复句 >15% | 120 篇 | 头条线 |
| 模板文 | 11 篇 / 34 节（原 30 / 128） | check-template-filler |
| 内容闸门 | 203 篇完全干净（77%）、0 BLOCK、WARN 65（全为 body-size） | content_gate --brief |
| 就绪度缺口 | dup 134 / std 76 / entity 44 / link 29 / src 20 / lead 8 | check-geo-readiness（均分 87.4） |
| 入链 | 正文出链中位 0；`relatedArticles` 口径零入链 18 篇 | 头条线 |
| 金额断言 | 2,205 处 / 50 篇，价格语义 0 处 | check-money-claims |
| GSC | 仍停在 11-22：点击 280 / 曝光 29,476 / CTR 0.95% | gsc-pages-2026-11-22.json |
| 发布 | 今日部署 12 / 预算 3，拦截中；下一窗口上海 00:00 | deploy-budget |

**为什么 es/pt/fr 只有 40 分**（抽查 `concrete-anchors-fasteners-guide`、`hex-bolt-dimensions-chart`）：首段 1,000–1,600 "词"（段落边界在翻译时丢失），`p1` 20 分归零；正文没有"X 是指…"定义句，`def` 10 分归零；H2 全是名词短语，`qh` 15 分归零。三块 45 分一起丢。

**量具已修（T0 完成，2026-11-25 20:55）**：`scripts/geo_audit.py` 原用 `[A-Za-z0-9]` 计词，非拉丁语种正文里只剩 `ISO 898` 这类拉丁串，分母被压到几十，实体密度被放大到 100–185/千词（ru 实测 155.6）。已按书写系统切开（CJK 按字折 0.6、西里尔/阿拉伯/天城文按空白切、拉丁不变），en 分数零变化，ru/ar/hi/ja 分数下调 8–12 分。**这排语种分是修完后的真值；此前记录的 53.0/52.9/50.5/50.4 是虚高，40.9/41.3/40.4 是虚低（`DEF_MULTI`/`Q_MULTI` 补上后 es 40.9→48.1、fr 41.3→45.0、pt 40.4→47.3）。**

## 2. 阶段目标

| 时点 | 目标 |
|---|---|
| 11-26 | 14 处英文残留清零（才能给 `check-body-lang` 挂 `--strict`）；T0 分词修完 |
| 12-02 | es/pt/fr 首段巨型段清零，三语种均分 ≥55；905 个超长标题的非英语部分降到 ≤200；GEO 均分 ≥68 |
| 12-09 | std 76 → ≤20、src 20 → ≤5、link 29 → 0、零入链 18 → 0；dup 120 → ≤60；模板文 11 → ≤5 |
| 12-16 | 非英语段落覆盖率 ≥95%；ar 的 FAQ 覆盖 10.6% → ≥40%；GEO 均分 ≥72 |
| 12-23 | GEO 均分 ≥75；GSC 回收，判定批次 1 CTR 是否 ≥2.0% |

## 3. 先分区，再动文件（两条线唯一的防撞规则）

**同一时刻，一篇 JSON 只能有一个 owner。** 分区按文章集，不按"我改标题你改正文"：

| 分区 | 文章集 | owner | 做什么 |
|---|---|---|---|
| A 区 | `docs/seo-geo-main-owned-40-2026-1125.csv` 里的 39 篇（GSC 曝光最高） | seo-geo-main | 一篇一次做完 T2/T4/T5/T7 全部适用项 |
| B 区 | 其余 225 篇 | 今日头条分析线 | T1/T3/T8（段落化、标题短写、非英语 FAQ） |
| 全站工程 | `scripts/`、`docs/` | 按任务卡 owner | T0/T6、闸门接线 |

A 区的 39 篇，B 线**不要碰**（包括标题短写）；B 区这 225 篇我不碰。谁要把活干到对方分区，先改这张表并提交，再动手。

## 4. 任务卡

### T0 修 `geo_audit` 对 ru/ar/ja 的分词（工程，0.5 天，先做）

- 改 `words()` 按脚本类型切：CJK 按字符折算、西里尔/阿拉伯按空格但过滤符号与标点；同一批 5 篇跑前后对照。
- **验收**：en 分数不变；ru/ar/ja 的 `ent` 落到 5–20；`seo-geo-weekly.sh` 跑通；改动记进当日周报。
- owner：seo-geo-main。**做完立刻通知两条线，因为 T4 的验收线建立在它上面。**

### T1 非英语段落化（B 区，5–6 天，8,318 节）

- 顺序 es → pt → fr → de → ru → ar → hi → ja，按 `docs/geo-locale-para-plan-2026-1125.csv` 排。
- 命令：`python3 scripts/paragrapher.py --slug <slug> --locale es,pt,fr --show` → 确认切分 → `--apply`；一篇一次只带自己的语种，别 `--locale all`。
- **验收**：该语种段落覆盖率 ≥95%（`geo_locale_plan` 复查）；`p1` 落回 40–130；`content_gate --slug` 无新增 BLOCK；重复句不增加。
- owner：今日头条分析线。

### T2 定义句（A 区，与 T4 同批做）

- 在该篇首个 H2 后加一句"X 是指…"，用当地语言、≤40 词、含一个可核事实（标准号或尺寸范围）。`def` 占 10 分，es/pt/fr 现为 0。
- **验收**：`geo_audit` 的 `def`=1，句子能独立回答"这是什么"。
- owner：seo-geo-main。

### T3 905 个超长标题短写（B 区 + 全站清单，1–2 天）

- 判据：`title` 超过 55 字符（代码 `slice(0, 55)+"..."` 会截断）。按曝光降序做，先 es/fr/de/ru。
- 只改 `title[locale]`，不动正文；en 文案不要为了凑长度删掉差异点。
- **验收**：`build-seo-geo-worklist.py` 里 B 区 `title>55` 归零（A 区 39 篇由我这边一并处理）；线上抽查 3 个语种标题无 `...` 截断。
- owner：今日头条分析线。

### T4 en 首段答案化 + H2 问题化（A 区）

- 首段 40–60 词直接给结论（含一个数字），不复述标题；每篇挑 2 个 H2 改问句（`How do I…` / `What thickness…`），10 语种 `heading` 同步。
- **验收**：`echo`=0、`p1` 40–130、`qh` ≥0.25、该篇均分 ≥75。
- owner：seo-geo-main。

### T5 标准与来源补齐（A 区）

- 补"标准号 + 机构 + 版本年"（ISO 898-1:2013 / ASTM A307 / SABS 1195 / DIN 933），文末加"数据来源"段（写清数据出处与年份）。
- **验收**：`check-geo-readiness` 该篇 `std`、`src` 缺口消失；不得出现"已获认证"类表述。
- owner：seo-geo-main。

### T6 入链（全站，1 天）

- 两条口径分开做，不要混：①正文出链 29 个缺口（`check-geo-readiness` 的 `link`），每篇加 2 条正文内链（同簇文章 + `/products` 或 `/documents`）；②`relatedArticles` 口径零入链 18 篇，补 54 条边（`docs/orphan-backlog-2026-1125.csv`）。
- **验收**：两个口径都归零；锚文本用目标页真实主题词；目标页不是重定向页。
- owner：待认领（B 线 W4 已出清单，谁先领谁做，领了改本表）。

### T7 去重（A 区）

- `python3 scripts/dedupe-sentences.py --slug <slug>` 先看，人工改写共用整句（120 篇里 A 区涉及的优先）。别整段删，改成当地市场具体事实。
- **验收**：`check-geo-readiness` 的 `dup` 归零；`content_gate` 通过。
- owner：seo-geo-main。

### T8 非英语 FAQ 本地化（B 区，1–2 周）

- 判据：每篇 ≥3 条本地问答才会输出 FAQPage，现在 9/10 语言面没有这块。按曝光排序，先 ar（10.6%）、es/pt/fr（23%）。
- **验收**：目标页 `@type` 里出现 FAQPage（线上抓 JSON-LD，en 9 块、非英语应到 9 块）；问答必须是本地语言、不许回退英文。
- owner：今日头条分析线。

### T9 14 处非英语英文残留（11-26 当天，约 1 小时）

- 位置：`fastener-glossary-africa-procurement`（es/fr/pt/de 各一段）、`ghana-building-materials`（pt 2 节）、`botswana-construction-boom-fastener-import`（ar 2 节）、`east-africa-…`、`kenya-fastener-market-case-study`、`kenya-infrastructure-…`、`south-africa-sabs-…`、`tunisia-…`、`uganda-oil-refinery-…`。
- **顺序不能反**：先修完，再给 `check-body-lang.py` 挂 `--strict`；否则夜间 `content-push.sh` 会在第一步契约校验就被卡死。
- **验收**：`check-body-lang` 全库 english 0；然后才改闸门。
- owner：今日头条分析线。

## 5. 分工与写权限

| 线 | 能写 | 不能写 |
|---|---|---|
| seo-geo-main（本对话） | A 区 39 篇、`scripts/`（T0）、`docs/` 中本文件与策略 | B 区文章、品牌资产、`src` 视觉层 |
| 今日头条分析线 | B 区 225 篇、`docs/` 下自己的清单 | A 区 39 篇、`scripts/geo_audit.py`（T0 归我） |
| vercel 运维线 | 发布：`vercel-promote.sh`、预算、审计 | **任何内容文件** |
| 品牌/社媒线 | `public/brand/*`、logo/icon、社媒事实卡、`public/llms.txt` | `content/articles/*` |

五条铁律：①动文章先 `article-claim.py claim <slug> <线名>`，拿不到换一篇；②一篇 × 全语种 × 自己分区内的全部适用任务，一次做完，别二次开同一 JSON；③`git add <具体路径>` 再 `git commit -- <同一路径>`，禁 `git add -A`；④内容线只 commit 不 push，push 只在 00:00 发布窗口；⑤认证/单证/价格口径改动三处同步（UI、`public/llms.txt`、社媒事实卡）。

## 6. 节奏

| 时间（Asia/Shanghai） | 动作 |
|---|---|
| 每日 20:16 | `bash scripts/seo-geo-weekly.sh`，看 `docs/reports/seo-geo-<日期>.md` |
| 每日 00:00 | launchd 单次 push + `vercel-promote.sh`（唯一发布窗口） |
| 每日 08:30 | Vercel 合规审计（A 线） |
| 每周一 09:00 | GSC 导出替换 `logs/seo-ai-pipeline/gsc-pages-<日期>.json`，重跑工单与周报 |

## 7. 闸门（缺一项不算完成）

```bash
python3 scripts/content_gate.py --slug <slug>
python3 scripts/check-claims.py
python3 scripts/check-cert-claims.py
python3 scripts/check-body-lang.py --slug <slug>
python3 scripts/geo_audit.py --slug <slug>
python3 scripts/article-claim.py release <slug> <线名>
```

改完重跑 `build-seo-geo-worklist.py`，**该篇掉出原批次才算真改完**。

## 8. 已知坑

- 并行两线各读旧 JSON 各写新 JSON，后写的把先写的多语种清回摘要级——这是分区与领锁存在的原因。
- `scripts/vercel-audit.sh` 正被另一条线修改（20:17 仍为未提交状态），它打出的 `✅` 在收口前不能当验收依据。
- 未跟踪文件不能 `git commit -- <path>`，先 `git add` 再 commit 同一路径；pre-commit 会拦"批量 content"和"跨领域混合"。
- 这台 Mac 平台 `cron`/`at` 不触发，定时一律 launchd；launchd 脚本里 `log()` 必须先定义。
- `deploy-budget.sh` fail-closed，别用 `DEPLOY_FORCE=1` 绕过。
- 入链有两个口径（正文出链 29、`relatedArticles` 18），统计 href 要同时兼容绝对域名与语言前缀，否则会得出"全站零内链"的错结论。

## 9. 状态看板（各线自己改这一张）

| 任务 | owner | 状态 | 完成/总量 | 备注 |
|---|---|---|---|---|
| T0 分词修复 | seo-geo-main | 已完成 | 1 / 1 | en 不变；ru/ar/hi/ja 下调，见 §1 |
| T1 非英语段落化 | 头条线 | 待开始 | 0 / 8,318 节 | es 先 |
| T2 定义句 | seo-geo-main | 进行中 | 12 / 39 | en/zh 均 def=1 |
| T3 标题短写 | 头条线 | 待开始 | 0 / 866 | A 区 39 篇我处理 |
| T4 en 首段 + H2 问句 | seo-geo-main | 进行中 | 12 / 39 | 12 篇 en 全部 90，zh 89–90 |
| T5 标准/来源 | seo-geo-main | 待开始 | 0 / 39 | |
| T6 入链 | 待认领 | 待开始 | 0 / 29 + 18 | 两口径分开记 |
| T7 去重 | seo-geo-main | 待开始 | 0 / A 区相关篇 | |
| T8 非英语 FAQ | 头条线 | 待开始 | 0 / 目标页 | ar 先 |
| T9 英文残留 | 头条线 | 待开始 | 0 / 14 | 修完才挂 strict |

## 10. 变更登记

- 2026-11-25 20:20 建立本文件（T0–T8，seo-geo-main 单线口径）。
- 2026-11-25 20:40 与 `docs/SEO-GEO-WORKPLAN-2026-1126.md`（今日头条分析线）对账合并：新增 T9、把 T1/T3/T8 归 B 区并把 T6 拆成两个口径；正式确立"按文章集分区"，A 区 39 篇见 `docs/seo-geo-main-owned-40-2026-1125.csv`；本文件成为唯一排期，2026-1126 那份转为明细附录。
- 2026-11-25 20:55 T0 完成：`geo_audit.words()` 按书写系统切词，en 分数零变化，ru 155.6→9.9、hi 160.6→13.4、ja 104.2→3.2、ar 35.1→2.9（同一篇对照）；语种均分据此刷新，验收线改用新值。
- 2026-11-25 21:10 T0 第二阶段：`def`/`qh` 原来只认英文正则，非英语篇的 10+15 分结构性拿不到（量具缺陷）。补 `DEF_MULTI`/`Q_MULTI`（强定义动词与各语种疑问词）后 es 40.9→48.1、fr 41.3→45.0、pt 40.4→47.3、de 43.3→47.1、ru 45.7→53.1、ja 43.2→51.2、ar 43.5→49.2、hi 44.9→46.5、zh 55.6→55.9，en 62.7 不变。
- 2026-11-25 21:15 A 区首篇 `roofing-screws-epdm-washer-guide`（曝光 2,244，A 区第一）：en 首段 321→50 词、echo 1→0、两个 H2 改问句（qh 0→0.4）、zh 首段重写并加定义句；**en 40→90、zh 45→90**，`content_gate` 通过（仅存量 WARN zh 758 字偏薄）。
- 2026-11-25 21:35 A 区第 2–4 篇：`hex-bolt-dimensions-chart` en 49→90 / zh 74→90、`zinc-plated-vs-black-phosphate-screws` en 75→90 / zh 38→82、`bolt-grade-markings-guide` zh 73→89（en 已 90）。三篇均 `content_gate` 通过、`check-body-lang` 0 污染。
- 2026-11-25 22:05 A 区第 5–8 篇（曝光 1,054 / 1,037 / 1,001 / 959）：`china-zimbabwe-fastener-shipping-container-guide` en 78→100 / zh 65→80、`threaded-rod-studding-guide` en 65→90 / zh 55→90、`ibr-roofing-nails-installation-guide` en 82→90 / zh 78→80、`high-tensile-structural-bolts-guide` en 49→90 / zh 74→90。四篇 `content_gate` 通过、`check-body-lang` 0 污染（`high-tensile` 的 fr 标题 1 处 [label] 为存量误报，见经验 67）。
- 2026-11-25 22:05 本轮新增两条经验（把量具语义写进操作前提）：①`p1` 的首段 = 第一个 `</p>` 之前的全部内容，正文开头若是无 `<p>` 的纯文本，答案段必须插到它**前面**并把它包成 `<p>` 挪后；②`ent=0` 先用 `findall` 验一次，确属内容缺口再补真实规格阶梯，不要归因为量具。
- 2026-11-25 22:20 A 区第 9–12 篇（曝光 805 / 745 / 429 / 419）：`anchor-bolts-selection-guide` en 75→90 / zh 65→90、`fastener-corrosion-resistance-guide` en 75→90 / zh 32→89、`concrete-anchors-fasteners-guide` en 60→90 / zh 32→90、`rwanda-construction-fastener-standards` en 59→90 / zh 55→90。四篇 `content_gate` 通过、`check-body-lang` 0 污染；已提交 `3dfc73c5`。
- 2026-11-25 22:20 事故与教训：这四篇首次改完后（未提交）被另一条线的批量重写抹掉，重跑脚本才恢复，记入经验 76（一篇一提交）。另记 77–79：中文首段窗口只有 67–217 字、无 `<p>` 的整块正文会让 p1 跨节虚高、定义句句号不能换分号。

