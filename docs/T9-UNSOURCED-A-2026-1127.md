# T9t-A A 区「无源统计数」分诊台账（2026-11-27）

## 0. 范围与取数口径

- **A 区**：`docs/seo-geo-main-owned-40-2026-1125.csv` 39 个 slug（`owner=seo-geo-main`）。
- **取数命令**：`python3 scripts/check-unsourced-stats.py --json`（locale=en，尺子版本同 §20.4 六类豁免）。
- **逐条明细**：`docs/t9t-a-unsourced-2026-1127.csv`，列 `slug,locale,section,stat,sentence,class,action,suggestion`。
- **分类口径沿用** §19.2 / §20.4，不另立名词：
  - `ops_fact`：可公开核对的运作/流程/工程事实（航线时效、整柜载重、检验抽样、工程性能比例、自有评分卡权重、付款条款比例）。
  - `statutory`：法定费率（关税、VAT、附加税、保险比例、罚则倍数），章节内已锚定税则/法规。
  - `para_sourced`：同段已有来源线索或句内署名机构/报告，段落级归属。
  - `true_unsourced`：真正的市场/规模/份额/自夸预测数字，且无有效出处。
- **动作口径**：`keep`（保留并写明不需新增出处的理由）/ `qualify`（改定性表述，CSV 内附替换文案）/ `cite`（保留数字但须补出处，注明出处级别）。
- **只读**：本轮未改 `content/articles/**`、未改 `scripts/**`，未 push。

## 1. 实测对账（与任务书「31 处」的差异，先讲清）

任务书背景称 A 区有 31 个 item 带 `unsourced>0`；**实测当前 `--json`：A 区 39 篇 `unsourced` 全部为 0**（全站 1192 处统计数 / 无源 135 处 / 75 篇，无源篇与 A 区交集为空）。

原因：§19.3 与后续 T9t-A/T9t-A-N4 提交已把 A 区上一轮的无源市场数清掉，脚本把剩余命中分进 `ops / statutory / para_sourced` 三个豁免桶「另计不吞」。为做到可追溯，本轮把**豁免桶内的命中逐条人工复判**，而不是只看脚本 `unsourced` 字段：

| 脚本桶 | 入册条数 | 人工复判后归入 |
| --- | --- | --- |
| `ops`（运作/工程/自有口径） | 56 | `ops_fact` 56（其中 0 条翻为 true） |
| `statutory`（法定费率） | 71 | `statutory` 52、`ops_fact` 10、`true_unsourced` 9 |
| `para_sourced`（段落已归属） | 30 | `para_sourced` 15、`ops_fact` 4、`true_unsourced` 5、`qualify` 模板句 6 |
| **合计入册** | **157** | 见下 |

> 说明：脚本正则存在两类已知漏判/误判（与 §20.4 两条漏判同类）：① 等级号 `Level 2/Level 1`、材料成分 `2.0–2.5%` 被统计正则扫中；② 章节锚定把非税率句误判进 statutory。人工复判已逐条纠正，纠正理由写在 CSV 的 `suggestion` 列。

## 2. 四类计数（人工复判后，157 条）

| 分类 | 条数 | 占比 | 动作分布 |
| --- | --- | --- | --- |
| `ops_fact` | 70 | 44.6% | keep 70 |
| `statutory` | 52 | 33.1% | keep 52 |
| `para_sourced` | 15 | 9.6% | keep 9、qualify 6（模板句） |
| `true_unsourced` | 20 | 12.7% | qualify 20 |
| **合计** | **157** | 100% | keep 131 / qualify 26 / cite 0 |

- **必须修（qualify）**：26 条 = true_unsourced 20 + 跨篇复用模板句 6。
- **合规保留（keep）**：131 条。
- **cite 待补出处**：0 条（A 区未出现「数字应保留但确需外部来源」的档位；港口产能类两处按 §19.3 togo-lome 前例直接改定性，不走 cite）。

### 2.1 按 slug 计数 Top 10

| # | 处数 | 分类（ops/stat/para/true） | slug |
| --- | --- | --- | --- |
| 1 | 16 | 6 / 9 / 0 / 1 | `ghana-tema-port-fastener-import-procedure` |
| 2 | 16 | 0 / 16 / 0 / 0 | `zimbabwe-import-duty-fastener-tariff-2026` |
| 3 | 14 | 7 / 4 / 0 / 3 | `fastener-supply-chain-africa-beira-corridor` |
| 4 | 12 | 1 / 9 / 2 / 0 | `togo-lome-port-fastener-import-procedure` |
| 5 | 10 | 5 / 0 / 2 / 3 | `angola-lng-project-fastener-procurement` |
| 6 | 9 | 5 / 2 / 0 / 2 | `libya-tripoli-construction-fastener-sourcing` |
| 7 | 8 | 7 / 0 / 1 / 0 | `china-iso-9001-fastener-manufacturer-directory` |
| 8 | 8 | 7 / 0 / 1 / 0 | `high-tensile-structural-bolts-guide` |
| 9 | 8 | 1 / 7 / 0 / 0 | `ivory-coast-abidjan-port-fastener-tariff` |
| 10 | 8 | 3 / 3 / 1 / 1 | `tunisia-mediterranean-fastener-export-guide` |

其余 21 篇共 74 条；另有 8 篇正文未命中统计正则（见 §5 异常）。

## 3. `true_unsourced` 逐条清单（20 条，12 篇）

判据：市场规模 / 增速 / 份额 / 价差 / 自夸业绩，句内与同段均无可核来源，N10「不写无出处百分比、不写市场规模装饰数字」正面命中。替换文案见 CSV `suggestion` 列。

| # | slug | sec | 数字 | 镜像 | 原句（截） | 处置 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | agricultural-machinery-fastener-guide | 6 | 10–20% | 7/10 | Ordering during off-peak periods (Q2–Q3) typically yields 10–20% better pricing… | qualify：季淡季议价改定性 |
| 2 | angola-lng-project-fastener-procurement | 5 | 15–25% | 10/10 | …reduces per-kilogram manufacturing costs by 15–25% through economies of scale… | qualify：集采降本改定性 |
| 3 | angola-lng-project-fastener-procurement | 5 | 3–8% | 10/10 | These services typically add 3–8% to procurement cost… | qualify：服务加价改定性 |
| 4 | angola-lng-project-fastener-procurement | 5 | 12% | 10/10 | 同上一句 3–8% 区间右端 | qualify：随 #3 一并改定性 |
| 5 | bolt-grade-markings-guide | 5 | 40% | 10/10 | Grade 4.6 bolts cost 40% less than 8.8… | qualify：价差改定性，只讲等级不可替代 |
| 6 | china-zimbabwe-fastener-shipping-container-guide | 0 | 65% | 10/10 | About 65% of the country's fastener imports land here… | qualify：线路份额改定性 |
| 7 | china-zimbabwe-fastener-shipping-container-guide | 1 | 1 million TEU | 10/10 | …reported annual capacity expansion targets of 1 million TEU. | qualify：按 togo-lome 前例改「百万 TEU 量级」，或补 CFM/DP World 官方报告 |
| 8 | china-zimbabwe-fastener-shipping-container-guide | 3 | 80% | 10/10 | Three issues cause 80% of clearance delays… | qualify：延误份额改「most」 |
| 9 | conveyor-belt-fasteners | 0 | 60–70% | 10/10 | …mechanical fasteners are used for 60-70% of splices in typical mining operations. | qualify：现场份额改定性 |
| 10 | fastener-supply-chain-africa-beira-corridor | 1 | 1 million TEU | 10/10 | The current 700,000 TEU expansion will bring total capacity to over 1 million TEU… | qualify：产能改「百万 TEU 量级」 |
| 11 | fastener-supply-chain-africa-beira-corridor | 5 | 95% | 10/10 | A 30-minute pre-shipment review…catches 95% of these issues. | qualify：自夸口径，改「flags most issues」 |
| 12 | fastener-supply-chain-africa-beira-corridor | 6 | 94% | 10/10 | …on-time delivery above 94% and zero rejected shipments… | qualify：自有业绩宣传，改「no rejected shipments on record」 |
| 13 | ghana-tema-port-fastener-import-procedure | 4 | 40–50 containers | 10/10 | A customer we supply has been importing 40-50 containers per year to Tema since 2019. | qualify：自有客户经营口径，改「regular repeat containers」（§19.3 同型已改） |
| 14 | hex-bolt-dimensions-chart | 0 | 3–8% | 10/10 | …wastes 3-8% of project fastener budgets on average… | qualify：采购损耗份额改定性 |
| 15 | libya-tripoli-construction-fastener-sourcing | 0 | <22% | 10/10 | …domestic Libyan steel fastener production covers less than 22% of the total… | qualify：本土供给份额改定性 |
| 16 | libya-tripoli-construction-fastener-sourcing | 1 | 68% RH | 10/10 | …year-round high relative humidity averaging 68%… | qualify：气候统计未锚气象来源，改定性 |
| 17 | mozambique-hardware-supplier | 0 | 60% | 9/10 | …roughly 60% of Zimbabwe's imports and 40% of Zambia's copper-belt supplies move through Beira… | qualify：过境份额改定性 |
| 18 | mozambique-hardware-supplier | 0 | 40% | 10/10 | 同上一句 | qualify：随 #17 一并改定性 |
| 19 | self-drilling-screws-selection-guide | 4 | 80% | 10/10 | Carbon steel with zinc plating covers 80% of applications. | qualify：应用份额改默认场景描述 |
| 20 | tunisia-mediterranean-fastener-export-guide | 2 | USD 2.5 billion | 10/10 | …roughly 300 automotive component firms generating approximately USD 2.5 billion in annual export revenue [25,26]. | qualify：市场规模装饰数；脚注编号与 dataSource 对不上（见 §5） |

**true_unsourced 按 slug 分布**：angola-lng 3、china-zimbabwe 3、beira-corridor 3、libya 2、mozambique 2；agricultural-machinery / bolt-grade / conveyor-belt / ghana-tema / hex-bolt-dimensions / self-drilling / tunisia 各 1。

### 3.1 另列：6 条跨篇复用模板句（para_sourced 桶，建议 qualify）

同一句「检验成本占订单价值 0.1–0.3%、未检出故障损失 10–100 倍」在 6 篇复用（CONTENT-CONTRACT 经验 32 已认定为模板指纹）：
`bolt-tightening-torque-guide`、`china-iso-9001-fastener-manufacturer-directory`、`concrete-anchors-fasteners-guide`、`conveyor-belt-fasteners`、`high-tensile-structural-bolts-guide`、`zinc-plated-vs-black-phosphate-screws`。
建议统一改为定性：「Independent inspection costs a small fraction of order value, while undetected failures cost far more in claims and rework.」

## 4. 本轮建议先改的 5 条（按风险 × 镜像面排序）

| 序 | slug / 位置 | 数字 | 为什么先改 |
| --- | --- | --- | --- |
| 1 | `fastener-supply-chain-africa-beira-corridor` sec5 | 95% 问题被预审抓到 | 无出处自夸口径（§19.2 明列的「95% 差错被抓到」一类），N10 直接命中；10/10 语种镜像，信任风险最高，改一句定性全语种同步即可消解。 |
| 2 | `fastener-supply-chain-africa-beira-corridor` sec6 | 94% 准时率 / 200+ 柜 | 自有业绩宣传且无审计背书，与 #1 同篇同段带，合并一次改；10/10 镜像。 |
| 3 | `mozambique-hardware-supplier` sec0 | 60% / 40% 过境份额 | 区域市场份额无来源，属 AI 引擎最不愿引用的形态；9–10/10 镜像，句子短、替换面小。 |
| 4 | `china-zimbabwe-fastener-shipping-container-guide` sec0 + sec3 | 65% 线路份额、80% 延误份额 | 两条经验份额同在一篇，一次清掉；10/10 镜像，改「most / most of」即可。 |
| 5 | `tunisia-mediterranean-fastener-export-guide` sec2 | USD 2.5 billion 汽车出口额 | 市场规模装饰数 + 脚注 [25,26] 悬空（dataSource 仅 6 条，编号对不上），既是无源数字又是引用完整性瑕疵；先改定性，避免审计同时挑出两类问题。 |

> 其余 15 条 true_unsourced 与 6 条模板句列入下一批；`ghana-tema` 的 40–50 柜与 §19.3 已改客户口径同型，可随下一批顺手带。

## 5. 异常与遗留事项

1. **对账差异**：任务书「31 处 / 31 个 item」与实测 A 区 `unsourced=0` 不符；本台账以 `--json` 实测为准，把豁免桶一并复判入册（157 条）。若上游 31 处口径来自旧版脚本或另一 locale，需复跑确认。
2. **8 篇未命中统计正则**（无统计数入册）：`threaded-rod-studding-guide`、`fastener-corrosion-resistance-guide`、`drywall-screws-complete-guide`、`washer-types-applications-guide`、`flat-washers-vs-spring-washers`、`nuts-bolts-glossary-terminology`、`high-tensile-bolts-grade-guide`、`thread-types-guide-metric-imperial`。
3. **坏串**：`togo-lome-port-fastener-import-procedure` sec0 出现「over **1.a** containerised throughput」——百万 TEU 数字被截断成 `1.a`，建议下一批按定性句一并修复（与 11% 份额同段，[6] 归属保留）。
4. **悬空脚注**：`tunisia-mediterranean-fastener-export-guide` sec2 的 `[25,26]` 在该篇 `dataSource`（仅 6 条）中无对应编号；`harare` 的 6wResearch 归属只在 en/zh/ja/hi 等少数语种保留，其余语种缺来源表述，需在译文同步时补署名。
5. **镜像计数口径**：CSV「需 N/10 语种同步」按数字 token 在各语种 section 内是否出现做宽松匹配；数字形态随语种换算（阿拉伯数字 / 数词）可能漏配，改稿时须按句复核，不能只看 N 值。
6. **脚本漏判沿用**：`self-drilling` sec1「5x faster」、`ibr-roofing` sec0「12% year-over-year」等未被 STAT 正则扫中，本轮未入册；建议尺子后续补「倍数 / 同比增速」模式（与 §19.3 i18n 漏报、§20.4 两条漏判同列尺子待办）。
7. **工作树提醒**：`content/articles/washer-types-applications-guide.json` 在本轮开工前已是未提交脏文件（非本台账改动），后续并发写前先确认归属。

## 6. 复盘计数（自证对账）

- 入册总数 157 = ops_fact 70 + statutory 52 + para_sourced 15 + true_unsourced 20。
- 动作总数 157 = keep 131 + qualify 26 + cite 0。
- qualify 26 = true_unsourced 20 + 模板句 6。
- 报告口径：locale=en；section 为 0 基序号；数字原文取自脚本 STAT 命中 token；句子截到 200 字符内语义完整处。
