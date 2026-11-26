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
