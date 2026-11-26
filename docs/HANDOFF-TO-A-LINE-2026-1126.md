# 交接单：B 线登记、待 A 线处理（2026-11-26）

> 来源：B 线（owner `今日头条分析`）R-T9i / R-T9j 两轮登记。**B 线一律只登记、不改对方内容**（R2），下列条目均**未改动**，请 A 线按篇处置。
> 明细文件：`t9i/ar-foreign-issues.csv`（别线 ar 不合格逐条）、`t9i/ar-baseline-issues.csv`（基线 27 篇 66 条）。

## 1. 别线补的阿语（ar）两类系统性缺陷

| 类 | 症状 | 规模 | 判据 |
|---|---|---|---|
| ① 问句内嵌英文标题 | `q.ar` 直接把整篇英文标题塞进阿语问句，长度 90–135 字符（上线判据上限 70），阿语字母占比 24–35% | 累计 40+ 条，明细见 `t9i/ar-foreign-issues.csv` | `t9i/check_ar.py`（`q.ar` 8–70 字符、以 `؟` 结尾） |
| ② 答案超长 | `a.ar` 466–737 字符（判据上限 450），部分是两三段合并 | 累计 60+ 条 | `check_ar.py`（`a.ar` 120–450） |

典型篇目：`marine-fasteners-guide`（a.ar 515–614）、`stainless-steel-bolts-africa-guide`（688–731）、`timber-screws-construction-guide`（645–678）、`bolt-markings-identify-grade`（a.ar 468–591 + q.ar 82）、`anchor-bolts-foundation-guide`（a.ar 508–554）、`zimbabwe-bolts-screws-b2b-construction-exports-2026`（a.ar 466–538 + q.ar 82）、`rwanda-construction-fastener-market-2026` #5–7（a.ar 80–104 过短）、`rwanda-construction-fastener-standards` #6（a.ar 夹 `Rwanda Standards Board (RSB)` 连续拉丁词）。

**复用建议**：A 线直接把 `t9i/check_ar.py <slug>...` 挂进自己的批次自检（退出码 1=有 FAIL），按"先压 q 再压 a"的顺序逐篇修。

## 2. 英文源文（`a.en` / `q.en`）的 7 处结构问题

| 篇目 | 位置 | 问题 |
|---|---|---|
| `structural-heavy-duty-bolts-building-guide` | #2 | 英文答案夹中文"刺客螺栓" |
| `zimbabwe-fastener-supplier` | #5 | "Blanket, Que operators" 语义残缺 |
| `anchor-bolts-suppliers-africa` | #2–#4 | en 问答错位（问句与答案不对应） |
| `malawi-fastener-market-case-study` | #9 | en 答案在 "…and matching washers and nuts for the" 处截断 |
| `morocco-casablanca-fastener-distribution-guide` | #1–5 与 #6–10 | 两组事实重复 |
| `fastener-selection-guide-african-construction` | 全篇 | 实际 8 条 FAQ，旧盘只识别到 4 条（量具侧问题） |

> B 线补该语种时**按现有 en 事实翻译、不补数字**；上述截断/错位处若被 B 线遇到，只按上下文保守补写，不编造截断后的规格。

| `kenya-east-africa-fastener-distribution-hub`、`dr-congo-drc-mining-fastener-market`、`mozambique-fastener-import-market-guide`、`zimbabwe-bulawayo-construction-hardware-supply`、`automotive-fastener-grade-comparison`、`angola-construction-boom-fastener-demand`、`solar-panel-mounting-fastener-requirements`、`zimbabwe-agricultural-fastener-requirements`、`tanzania-fastener-market-opportunities-2026`、`green-building-fastener-requirements`、`wind-energy-fastener-requirements-2026`、`food-beverage-fastener-hygiene-standards`、`africa-railway-modernization-fastener-demand`、`fastener-failure-analysis-case-studies` | 各篇 section[1] 第 2 条 | **14 篇共用同一条英文答案**（"Five prevention measures: 1) Specify ISO 9001 certification, 2) Third-party inspection, 3) Independent lab testing, 4) Specification alignment, 5) Training."）。九语种翻译后形成 14×N 的整段重复答案（详见 §5） |

## 3. 归属待确认

- `drc-diamond-mining-fasteners`：不在 A 区 39 篇 CSV 里，`git status` 长期为 ` M`（疑似别线整文重排中），B 线未碰。请 A 线确认归属：若归 A 线，B 线本轮不再等它；若归 B 线，请对方提交后通知，B 线下轮补 ar 12 条。

## 4. 保护名单（B 线两轮均未碰，等对方提交后再补）

`africa-fastener-market-opportunities-2026`（ar 7 / ru 7）、`china-fasteners-zimbabwe-procurement-guide`（ar 6 / ru 6）、`ghana-fastener-market-guide`（ar 7 / ru 7）。

## 5. 跨篇整段答案重复（源文缺陷，九语种同源）

- 上述 14 篇在 `content/articles/*.json` 的 `sections[1].faqItems[1]` 共用同一条 `a.en`。各语种按条翻译后，同一段落在语料库中重复出现 14 次（实测，B 区 240 篇范围内）：

| 语种 | 该段重复次数 | ≥2 重复长答组数 | 最大单组重复 |
|---|---|---|---|
| es / fr / de / pt / ja / hi / en | 14 | es 11 / fr 6 / de 9 / pt 6 / ja 5 / hi 4 / en 13 | 14 |
| zh / ru | 2（本轮未重写这两篇，旧译只有 2 处） | zh 9 / ru 5 | 2 |

- 另一处：`de` 的 "Zuverlässige Lieferanten finden sich über folgende Wege…" 重复 9 次（同源同段）。
- 处置建议：**交 A 线**按各篇主题分篇改写这 5 条预防措施，B 线下一轮按新 en 重译这 14 篇 × 9 语种；本轮不动（属在途源文）。
- 说明：6-gram ≥15 的去重判据抓不到这一条（14 < 15），已用"整段逐字相同"补查，结论如上。

## 6. R-T9l S2 跨篇重复段落（2026-11-26，B 线首批整改 + 剩余登记）

- 判据脚本：`t9l/dup_paragraph.py`（不进仓库 scripts/）。归一化＝去 HTML 标签 → 实体解码 → 全角/半角与中英标点归一 → 合并空白；文字与数字原样保留（数字不同即不同段）。分组键 `(语种, 归一文本)`，同一段落出现在 **≥3 篇** 即 FAIL，语种间分开统计；指纹 sha1 前 12 位。
- 明细：`docs/gsc-dup-paragraph-2026-1126.csv`（列：fingerprint,locale,kind,articles,item_nos,slug_list,text_head,zone,action）。
- 扫描面：**279 篇 × 10 语种**，41205 个 FAQ 答案/正文段落单元。

### 6.1 A 区登记（42 组 / 225 篇次，owned-40，B 线未碰）
按语种组数：en 11、ar 6、ja 5、fr 4、es 3、ru 3、pt 3、zh 3、hi 2、de 2。详见 CSV `zone=A` 行。

### 6.2 B 区只登记（87 组 / 1275 篇次）
- **en 31 组 / ar 21 组**：非本轮 B 线语种（en 源文归 A 线；ar 归别线，见 §1）。
- **结构性样板导航段**（FAQ 引导句、相关产品链接、WhatsApp 联系方式、占位预告）：其余 fr/ja/pt/de/ru/hi/es 组，属页面固定导航，不按内容重复整改。
- **FAQ 答案 1 组**：de "Zuverlässige Lieferanten finden sich über folgende Wege…"（9 篇，同源源文缺陷，见 §5）。

### 6.3 B 区剩余待改写（127 组 / 624 篇次 / 63 篇，本轮未清完）
- **案例研究模板段：106 组 / 516 篇次 / 14 篇**。14 篇共用 5 个失效案例的「背景 / 根本原因 / 实验室验证 / 财务影响 / 经验教训」译文模板，跨 hi/zh/ja/es/fr/ru/de；en 案例段已带本篇主题与失效模式，译文 collapsed 成通用模板。需按各篇 en 案例事实逐篇重译，不得沿用模板句。
- **采购建议样板段：21 组 / 108 篇次**。zh/es/de/pt/ru 的 TCO、区域标准、B2B 预防路径、危险信号、报价结构等通用句，散在产品/市场指南正文，需改写为本篇主题表述。

剩余按语种（组数 / 篇次）：

| 语种 | 组数 | 篇次 |
|---|---|---|
| zh | 25 | 166 |
| hi | 21 | 107 |
| es | 21 | 66 |
| ru | 14 | 68 |
| ja | 14 | 88 |
| fr | 13 | 65 |
| de | 16 | 52 |
| pt | 3 | 12 |

案例模板 14 篇：`africa-railway-modernization-fastener-demand`、`angola-construction-boom-fastener-demand`、`automotive-fastener-grade-comparison`、`dr-congo-drc-mining-fastener-market`、`fastener-failure-analysis-case-studies`、`food-beverage-fastener-hygiene-standards`、`green-building-fastener-requirements`、`kenya-east-africa-fastener-distribution-hub`、`mozambique-fastener-import-market-guide`、`solar-panel-mounting-fastener-requirements`、`tanzania-fastener-market-opportunities-2026`、`wind-energy-fastener-requirements-2026`、`zimbabwe-agricultural-fastener-requirements`、`zimbabwe-bulawayo-construction-hardware-supply`。

### 6.4 本轮已整改（6 篇，均 zh；单文件 commit，闸门均 ✅）

| slug | 改写组 | 段落数 | commit |
|---|---|---|---|
| nigeria-fastener-market-guide | 3（TCO 总拥有 / 标准化规格 / 报价结构） | 4 | 8afbb40b |
| kenya-fastener-market-guide | 1（标准化规格） | 1 | 1a8135d7 |
| u-bolts-pipe-clamps-guide | 2（标准化规格 / TCO 总体） | 5 | d649b4df |
| fastener-common-problems-solutions | 1（TCO 总体） | 3 | dc0f190d |
| fastener-standards-din-iso-astm-comparison | 1（TCO 总体） | 2 | 054bdcd7 |
| imperial-metric-hex-nut-export-guide | 1（TCO 总体） | 2 | c49b0b23 |

- 改动均在正文 body，FAQ 问答未动；每篇提交前 `content_gate.py --slug` 输出「✅ 闸门通过：没有新增 BLOCK」。
- zh 无专用正文判据（check_zh 只校 FAQ），正文按结构自检：无 U+FFFD、无异种文字、汉字占比正常、无英文整句。

## 7. R-T9l S4b `a.en` 占位句登记（2026-11-26，源文缺陷，交 A 线；B 线未改 en）

- 判据：`a.en` 为 “See the detailed analysis above for specifications, applications, and best practices for …” 一类占位导航句，本身不含本篇可取材的事实；九语种 FAQ 译文随之无事实可依。
- 明细：`docs/gsc-shortanswer-enresidue-2026-1126.csv` 中 `metric=en_placeholder` 行，共 **22 条，均为各篇 `#1`**。
- 处置：请 A 线按本篇正文补齐 `a.en` 事实后，B 线下一轮再据新 en 重译各语种；本轮 B 线对这些条目只登记，**不改 en、不改其译文**。
- 22 篇：`china-fastener-supplier-price-list-guide`、`china-hex-nuts-manufacturer`、`drywall-screws-bulk-price-africa-procurement`、`fastener-applications-construction-solar-telecom`、`fastener-common-problems-solutions`、`fastener-cost-analysis-template`、`fastener-quality-inspection-guide`、`fastener-selection-guide-african-construction`、`fastener-standards-din-iso-astm-comparison`、`fastener-supplier-verification-checklist`、`kenya-fastener-market-case-study`、`kenya-fastener-market-guide`、`m10-galvanized-bolt-fob-china-price`、`malawi-fastener-market-case-study`、`mining-fasteners-africa`、`nigeria-fastener-market-guide`、`self-drilling-tek-screws-price-list`、`solar-panel-mounting-fasteners-africa`、`south-africa-fastener-market-case-study`、`south-africa-fastener-market-guide`、`stainless-steel-fasteners-africa`、`zambia-fastener-market-case-study`。

## 8. R-T9l S3 语言一致性扫描登记（2026-11-26，A 区只登记；B 线未改 A 文件）

- 判据：`$T9L/lang_consistency.py`；明细 `docs/gsc-lang-consistency-2026-1126.csv`（列 slug,locale,field,item_no,metric,value,zone,action）。
- 口径：`latin_sentence` 非拉丁语种连续 ≥4 拉丁词；`foreign_script` 夹目标语种外文字；`latin_title` 标题拉丁字符占比 >30%；ar 分组 `q_embed_en` / `a_over450`(>450) / `a_under120`(<120) 为 raw 长度。
- **A 区 `a_over450`（ar 答案超长）：122 条 / 35 篇**，B 线本轮未触，请 A 线压缩到 120–450、事实数字不动：

  - `agricultural-machinery-fastener-guide`：3 条 s2#1(560), s2#2(485), s2#3(485)
  - `anchor-bolts-selection-guide`：3 条 s6#1(771), s6#2(758), s6#3(803)
  - `angola-lng-project-fastener-procurement`：9 条 s7#1(602), s7#2(541), s7#3(523), s7#4(490), s7#5(535), s7#6(513), s7#7(503), s7#8(530), s7#9(483)
  - `bolt-grade-markings-guide`：3 条 s7#1(605), s7#2(718), s7#3(697)
  - `bolt-tightening-torque-guide`：5 条 s4#1(623), s4#2(671), s4#3(598), s4#4(642), s4#5(657)
  - `china-iso-9001-fastener-manufacturer-directory`：3 条 s7#1(638), s7#2(700), s7#3(624)
  - `china-zimbabwe-fastener-shipping-container-guide`：3 条 s5#1(781), s5#2(997), s5#3(1234)
  - `concrete-anchors-fasteners-guide`：3 条 s3#1(568), s3#2(550), s3#3(627)
  - `congo-brazzaville-fastener`：5 条 s4#1(795), s4#2(627), s4#3(653), s4#4(604), s4#5(563)
  - `conveyor-belt-fasteners`：3 条 s6#1(589), s6#2(715), s6#3(710)
  - `drywall-screws-complete-guide`：4 条 s8#1(495), s8#2(555), s8#3(522), s8#4(511)
  - `fastener-corrosion-resistance-guide`：3 条 s4#1(697), s4#2(735), s4#3(757)
  - `flat-washers-vs-spring-washers`：3 条 s3#1(779), s3#2(767), s3#3(744)
  - `ghana-tema-port-fastener-import-procedure`：3 条 s6#1(767), s6#2(751), s6#3(746)
  - `harare-fastener-distributor-supplier-guide`：3 条 s1#1(811), s3#1(751), s7#4(680)
  - `hex-bolt-dimensions-chart`：3 条 s7#1(642), s7#2(591), s7#3(623)
  - `high-strength-bolts-8-8-10-9-12-9-grade-guide`：3 条 s6#1(520), s6#2(677), s6#3(688)
  - `high-tensile-bolts-grade-guide`：3 条 s6#1(581), s6#2(547), s6#3(536)
  - `high-tensile-structural-bolts-guide`：3 条 s7#1(729), s7#2(694), s7#3(823)
  - `ibr-roofing-nails-installation-guide`：3 条 s9#1(729), s9#2(600), s9#3(675)
  - `ivory-coast-abidjan-port-fastener-tariff`：3 条 s7#1(682), s7#2(721), s7#3(727)
  - `libya-tripoli-construction-fastener-sourcing`：3 条 s7#1(666), s7#2(689), s7#3(747)
  - `marine-outdoor-corrosion-resistant-bolts-guide`：3 条 s6#1(742), s6#2(727), s6#3(755)
  - `nuts-bolts-glossary-terminology`：4 条 s6#1(608), s6#2(592), s6#3(515), s6#4(566)
  - `rwanda-construction-fastener-standards`：3 条 s7#6(534), s7#7(507), s7#8(519)
  - `self-drilling-screws-selection-guide`：4 条 s8#1(779), s8#2(718), s8#3(754), s8#4(718)
  - `self-tapping-screws-complete-classification-guide`：3 条 s7#1(590), s7#2(487), s7#3(587)
  - `telecom-tower-fasteners`：3 条 s6#1(635), s6#2(604), s6#3(678)
  - `threaded-rod-studding-guide`：3 条 s6#1(697), s6#2(714), s6#3(660)
  - `togo-lome-port-fastener-import-procedure`：3 条 s7#1(679), s7#2(647), s7#3(633)
  - `tunisia-mediterranean-fastener-export-guide`：5 条 s7#1(717), s7#2(771), s7#3(730), s7#4(763), s7#5(883)
  - `washer-types-applications-guide`：3 条 s5#1(591), s5#2(533), s5#3(546)
  - `zambia-fastener-supplier`：3 条 s4#2(583), s4#3(599), s4#5(666)
  - `zimbabwe-import-duty-fastener-tariff-2026`：5 条 s7#1(524), s7#2(530), s7#3(816), s7#4(777), s7#5(994)
  - `zinc-plated-vs-black-phosphate-screws`：3 条 s3#1(714), s3#2(720), s4#1(712)

- **A 区 `foreign_script`：10 条 / 4 篇**：
  - `agricultural-machinery-fastener-guide`：ja.a s4#1(1), zh.a s4#1(1), es.a s4#1(1)
  - `bolt-tightening-torque-guide`：ja.a s4#7(1), zh.a s4#7(1), es.a s4#7(1)
  - `fastener-corrosion-resistance-guide`：ja.a s4#3(2), zh.a s4#3(2)
  - `harare-fastener-distributor-supplier-guide`：ja.q s3#2(6), ru.a s5#1(3)

- **A 区 `latin_sentence`：2 条 / 2 篇**：
  - `harare-fastener-distributor-supplier-guide`：zh.a s7#1(run=4)
  - `rwanda-construction-fastener-standards`：ar.a s7#6(run=4)

- 注：A 区无 `q_embed_en`、无 `a_under120`、无 `latin_title` 命中。
- 工作树中 `anchor-bolts-selection-guide`、`bolt-tightening-torque-guide`、`rwanda-construction-fastener-standards` 等已有他线未提交改动，B 线未 stage、未覆盖。

## 9. R-T9l S2 第二轮分片整改（2026-11-26，B 线案例簇 + 采购样板段）

- 判据/脚本同 §6；明细以 `docs/gsc-dup-paragraph-2026-1126.csv` 最新重扫为准。
- 本轮 B 线可改语种（es/fr/de/pt/ja/hi/zh/ru）正文重复模板段就地改写为本篇主题表述；FAQ 问答未动；en/ar 未碰。每篇 `content_gate.py --slug` 闸门 ✅，单文件 commit。
- **本轮已整改（B 线，42 篇，48 笔 content(T9l-dup) commit；含同篇补提交/缩进修复）**：
  `africa-railway-modernization-fastener-demand`、`africa-solar-energy-fastener-procurement-guide`、`automotive-fastener-grade-comparison`、`bolt-types-applications-guide`、`buy-construction-fasteners-wholesale-china`、`carriage-bolts-guide`、`construction-building-self-tapping-screws-tco-analysis-joint-stiffness`、`construction-building-self-tapping-screws-tco-analysis-uv-degradation`、`fastener-glossary-africa-procurement`、`fastener-preload-torque-calculation-methods`、`fastener-quality-certification-comparison`、`fastener-supplier-verification-checklist`、`fastener-warehouse-management-best-practices`、`food-beverage-fastener-hygiene-standards`、`frp-grp-composite-fasteners`、`galvanized-vs-stainless-steel-fasteners`、`hex-nuts-selection-guide`、`high-strength-bolting-structural-steel`、`kenya-east-africa-fastener-distribution-hub`、`machine-screws-specifications`、`marine-grade-fastener-selection-guide`、`payment-terms-international-fastener-trade`、`self-tapping-sheet-metal-screws`、`solar-panel-mounting-fastener-requirements`、`south-africa-fastener-market-guide`、`south-africa-sabs-fastener-import-requirements`、`stainless-steel-bolts-africa-guide`、`stainless-steel-fasteners-africa`、`structural-steel-connection-fasteners`、`tanzania-fastener-market-opportunities-2026`、`timber-fasteners-guide`、`wind-energy-fastener-requirements-2026`、`zim-construction-anchor-bolts-lifecycle-cost-salt-spray`、`zim-construction-flat-washers-standard-explainer-lead-time`、`zim-construction-lock-nuts-rfq-template-bolt-pattern`、`zim-construction-lock-washers-tco-analysis-stress-cracking`、`zim-construction-threaded-rods-supplier-evaluation-cost-optimization`、`zim-construction-u-bolts-spec-checklist-mill-cert-traceability`、`zim-construction-u-bolts-supplier-evaluation-galvanic-corrosion`、`zimbabwe-agricultural-fastener-requirements`、`zimbabwe-bulawayo-construction-hardware-supply`、`zimbabwe-rural-electrification-fastener-specifications`。
- **未形成 commit、重复组随同组其他篇整改后降至 <3 阈值**（6 篇，工作树未留改动）：`fastener-negotiation-supplier-china`、`zimbabwe-warehousing-racking-fastener-safety`、`precast-concrete-fastener-applications`、`railway-track-fastener-specifications`、`zimbabwe-mining-fastener-grade-selection`、`zambia-fastener-market-case-study`。其残留段仅出现在 CSV 的 registered（样板导航/FAQ）行，无 rewrite 命中。
- 注：`dr-congo-drc-mining-fastener-market`、`fastener-failure-analysis-case-studies`、`green-building-fastener-requirements`、`mozambique-fastener-import-market-guide`、`angola-construction-boom-fastener-demand` 属另两个分片，B 线未改其内容。

### 9.1 第二轮只登记（rewrite 队列清零后保留的 3 组 / 16 篇次）

| 指纹 | 语种 | 组数 | 篇次 | 性质 / 处置 |
|---|---|---|---|---|
| 4237b9c474 | zh | 1 | 9 | FAQ 段内「相关产品页」导航链接段，样板导航，registered，不改链接 |
| 8df2ca6bc7 | es | 1 | 3 | FAQ 引导句样板导航，registered |
| 7e601fbf54 | pt | 1 | 4 | 报价构成长段（含材质/镀层/包装/运保/单证/批量与付款条件说明），合规敏感，B 线未改写，留待下一轮按 en 逐篇重写 |

- 7e601fbf54 成员：`anchor-bolts-suppliers-africa`、`south-africa-fastener-market-case-study`、`zambia-fastener-market-case-study`、`zimbabwe-construction-megaprojects-fastener-demand`。
- 4237b9c474 成员：`fastener-cost-reduction-china-vs-turkey`、`fastener-lubrication-thread-locking-guide`、`fastener-preload-torque-calculation-methods`、`fastener-quality-control-inspection-procedures`、`marine-grade-fastener-selection-guide`、`precast-concrete-fastener-applications`、`railway-track-fastener-specifications`、`south-africa-sabs-fastener-import-requirements`、`zimbabwe-mining-fastener-grade-selection`。
- 8df2ca6bc7 成员：`fastener-quality-control-iso9001`、`lag-screws-timber-connections`、`zimbabwe-construction-megaprojects-fastener-demand`。

### 9.2 重扫基线（2026-11-26 收尾）

- 扫描面 279 篇 × 10 语种，41209 单元；FAIL 组 B 90 组 / 1291 篇次、A 39 组 / 222 篇次，全部 action=registered；B 线可改语种 rewrite 队列 **0 组**。
- A 区 39 组仍归 A 线处置（见 §5、§6.1）；B 区 registered 含 en/ar 非本轮语种、样板导航、FAQ 同源段。
