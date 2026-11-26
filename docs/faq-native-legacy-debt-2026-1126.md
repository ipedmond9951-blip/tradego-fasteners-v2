# 存量 FAQ 技术债清单（R-T9j 轮汇总 · 2026-11-26）

- 汇总范围：R-T9j 各 B 线在补写过程中登记的「别线存量不合格」与「英文源文缺陷」；不含本轮各线自写且已通过判据的条目。
- 事实口径：所有实测值取自各线登记台账与仓库现网 JSON；未通过判据的存量条目本轮一律不覆盖。
- 处置三类：`交 A 线（源文问题）`、`下一轮 B 线补写（R-T9k）`、`需确认归属`。
- 判据基准：es/fr/de/pt 答案 120–450、问句 8–70、语言纯度 ≥0.55；ja 答案 120–450、问句 8–70、假名+汉字 ≥60%、平假名 ≥5；hi 天城文占比 ≥55%、无连续 ≥5 拉丁词。

## §1 概览（语种 × 缺陷类型，计数为侧次；同一条目命中多类分别计入）

| 语种 | 答案超长 >450 | 答案过短 <120 | 问句超长 >70 | 语言纯度不足 | 含中文简体专用字 | 夹异种文字/拉丁整句 | 含金额/折扣/百分比 | 源文占位句 | 源文错位/残缺/重复 | 侧次小计 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| es | 6 | 14 | 15 | 6 | — | 1 | — | — | — | 42 |
| fr | 19 | 15 | 34 | 7 | — | — | 9 | — | — | 84 |
| de | 15 | 6 | 12 | 4 | — | — | 3 | — | — | 40 |
| pt | 25 | 16 | 23 | 7 | — | — | — | — | — | 71 |
| ja | — | 10 | — | 5 | 14 | — | — | — | — | 29 |
| hi | — | — | — | — | — | 226 | — | — | — | 226 |
| ru | — | — | — | — | — | — | — | — | — | 0 |
| **合计** | **65** | **61** | **84** | **29** | **14** | **227** | **12** | **22** | **5** | **519** |

> ru 线本轮未留下逐篇存量不合格台账；其剩余缺口计入 §4 冻结篇目（ru 30 条），缺陷类型待下一轮扫描后归入上表。

## §2 逐语种明细表

列：篇目 slug ｜ 语种 ｜ 条目 ｜ 缺陷类型 ｜ 实测值 ｜ 来源线 ｜ 建议处置。

### 2.1 fr（法语存量台账 75 侧 + 合规观察 9 条）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `anchor-bolts-foundation-guide` | fr | q/a | A | #1 长度 710（要求 120–450）；#2 长度 707（要求 120–450）；#3 长度 721（要求 120–450）；#4 长度 736（要求 120–450）；#5 长度 724（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `bolt-markings-identify-grade` | fr | q/a | A | #1 长度 786（要求 120–450）；#2 长度 764（要求 120–450）；#3 长度 690（要求 120–450）；#4 长度 709（要求 120–450）；#5 长度 769（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `botswana-fastener-supplier` | fr | q/a | A | #1 长度 907（要求 120–450）；#2 长度 874（要求 120–450）；#3 长度 809（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `egypt-cairo-construction-fastener-wholesale` | fr | q | C | #4 长度 84（要求 8–70）；#5 长度 112（要求 8–70）；#6 长度 76（要求 8–70）；#7 长度 78（要求 8–70）；#8 长度 111（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `kenya-fastener-market-guide` | fr | q/a | B | #5 长度 46（要求 120–450）；#6 长度 30（要求 120–450）；#7 长度 37（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `kenya-fastener-market-guide` | fr | q | C | #7 长度 79（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `kenya-infrastructure-fastener-demand` | fr | q/a | A/D | #2 语言纯度 0.50（<0.55）；#3 语言纯度 0.55（<0.55）；#4 长度 513（要求 120–450）；#4 语言纯度 0.42（<0.55） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `kenya-infrastructure-fastener-demand` | fr | q | C | #1 长度 84（要求 8–70）；#2 长度 87（要求 8–70）；#3 长度 103（要求 8–70）；#4 长度 105（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `morocco-casablanca-port-fastener-import-procedure` | fr | q | C | #6 长度 102（要求 8–70）；#7 长度 100（要求 8–70）；#9 长度 76（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `nigeria-fastener-market-guide` | fr | q/a | B/D | #5 长度 58（要求 120–450）；#5 语言纯度 0.49（<0.55）；#6 长度 41（要求 120–450）；#7 长度 44（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `nigeria-fastener-market-guide` | fr | q | C | #5 长度 72（要求 8–70）；#6 长度 71（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `rwanda-construction-fastener-market-2026` | fr | q/a | B | #5 长度 100（要求 120–450）；#6 长度 90（要求 120–450）；#7 长度 116（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `rwanda-construction-fastener-market-2026` | fr | q | C | #4 长度 93（要求 8–70）；#5 长度 72（要求 8–70）；#7 长度 82（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | fr | q/a | B/D | #1 语言纯度 0.42（<0.55）；#2 语言纯度 0.35（<0.55）；#6 长度 55（要求 120–450）；#7 长度 53（要求 120–450）；#8 长度 62（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | fr | q | C | #1 长度 73（要求 8–70）；#2 长度 73（要求 8–70）；#6 长度 76（要求 8–70）；#7 长度 106（要求 8–70）；#8 长度 88（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `stainless-steel-fasteners-africa` | fr | q/a | B/D | #5 长度 81（要求 120–450）；#6 长度 45（要求 120–450）；#7 长度 77（要求 120–450）；#7 语言纯度 0.53（<0.55） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `stainless-steel-fasteners-africa` | fr | q | C | #5 长度 91（要求 8–70）；#6 长度 80（要求 8–70）；#7 长度 97（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance` | fr | q | C | #1 长度 129（要求 8–70）；#2 长度 121（要求 8–70）；#4 长度 150（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | fr | q/a | A | #1 长度 550（要求 120–450）；#2 长度 639（要求 120–450）；#3 长度 623（要求 120–450）；#4 长度 717（要求 120–450）；#5 长度 751（要求 120–450） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | fr | q | C | #1 长度 100（要求 8–70）；#2 长度 92（要求 8–70）；#3 长度 114（要求 8–70）；#4 长度 97（要求 8–70）；#5 长度 98（要求 8–70） | fr 线 register.txt / verify_stock.txt | R-T9k |
| `ivory-coast-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Ivory Coast | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `cameroon-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Cameroon | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `ethiopia-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Ethiopia | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `tanzania-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Tanzania | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `algeria-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Algeria | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `morocco-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Morocco | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `senegal-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Senegal | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `senegal-fastener-market` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Senegal | fr 线 register.txt / verify_stock.txt | 需确认归属 |
| `egypt-fastener-market-complete-guide` | fr | #5 a | G | 存量含 USD 180M 及英文国名 Egypt | fr 线 register.txt / verify_stock.txt | 需确认归属 |

### 2.2 es（西班牙语存量台账，手工登记 27 行）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `anchor-bolts-foundation-guide` | es | #1–5 a | A | a.es 701 / 687 / 707 / 732 / 719（>450） | es 线 register.md | R-T9k |
| `bolt-markings-identify-grade` | es | #1–5 a | A | a.es 688 / 725 / 631 / 644 / 690（>450） | es 线 register.md | R-T9k |
| `bolt-markings-identify-grade` | es | #5 q | C | q.es 73（>70） | es 线 register.md | R-T9k |
| `botswana-fastener-supplier` | es | #1–3 a | A | a.es 841 / 818 / 786（>450） | es 线 register.md | R-T9k |
| `egypt-cairo-construction-fastener-wholesale` | es | #4–8 q | C | q.es 82 / 75 / 74 / 72 / 105（>70） | es 线 register.md | R-T9k |
| `egypt-cairo-construction-fastener-wholesale` | es | #6 a | F | 存量 es 混入英文词 undergoes | es 线 register.md | R-T9k |
| `fastener-selection-guide-african-construction` | es | #2–4 a | A | a.es 841 / 938 / 920（>450） | es 线 register.md | R-T9k |
| `kenya-fastener-market-guide` | es | #5 a | B | a.es 38（<120）；纯度 0.45 | es 线 register.md | R-T9k |
| `kenya-fastener-market-guide` | es | #6 q/a | C/B | q.es 72；a.es 41 | es 线 register.md | R-T9k |
| `kenya-fastener-market-guide` | es | #7 q/a | C/B/D | q.es 75；a.es 36；纯度 0.54 | es 线 register.md | R-T9k |
| `kenya-infrastructure-fastener-demand` | es | #1–4 q | C | q.es 82 / 79 / 111 / 101（>70） | es 线 register.md | R-T9k |
| `kenya-infrastructure-fastener-demand` | es | #4 a | A | a.es 588（>450） | es 线 register.md | R-T9k |
| `morocco-casablanca-port-fastener-import-procedure` | es | #6–9 q | C | q.es 123 / 98 / 78 / 92（>70） | es 线 register.md | R-T9k |
| `nigeria-fastener-market-guide` | es | #5 a | B/D | a.es 54（<120）；纯度 0.45 | es 线 register.md | R-T9k |
| `nigeria-fastener-market-guide` | es | #6 q/a | C/B | q.es 72；a.es 42 | es 线 register.md | R-T9k |
| `nigeria-fastener-market-guide` | es | #7 a | B/D | a.es 41；纯度 0.54 | es 线 register.md | R-T9k |
| `rwanda-construction-fastener-market-2026` | es | #4 q | C | q.es 96（>70） | es 线 register.md | R-T9k |
| `rwanda-construction-fastener-market-2026` | es | #6 a | B | a.es 95（<120） | es 线 register.md | R-T9k |
| `rwanda-construction-fastener-market-2026` | es | #7 q/a | C/B | q.es 72；a.es 113 | es 线 register.md | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | es | #2 a | D | 纯度 0.44（<0.55） | es 线 register.md | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | es | #6 a | B/D | a.es 51；纯度 0.34 | es 线 register.md | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | es | #7 q/a | C/B | q.es 90；a.es 61 | es 线 register.md | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | es | #8 q/a | C/B | q.es 76；a.es 55 | es 线 register.md | R-T9k |
| `stainless-steel-fasteners-africa` | es | #5 q/a | C/B | q.es 87；a.es 82 | es 线 register.md | R-T9k |
| `stainless-steel-fasteners-africa` | es | #6 q/a | C/B | q.es 78；a.es 84 | es 线 register.md | R-T9k |
| `stainless-steel-fasteners-africa` | es | #7 q/a | C/B/D | q.es 87；a.es 67；纯度 0.27 | es 线 register.md | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | es | #1–5 q/a | C/A | q.es 90/80/89/104/80；a.es 481/622/633/685/704 | es 线 register.md | R-T9k |

### 2.3 de（德语存量台账 31 行 + 金额观察 1 组）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `east-africa-construction-fastener-market` | de | #3 a | D | a.de 纯度 0.00（极短、全名词/缩写） | de 线 register.md / scratch/ledger.md | R-T9k |
| `east-africa-construction-fastener-market` | de | #1 a | G | 存量含具体金额 5.000–10.000 USD（源文 en 同款 LCL 门槛） | de 线 register.md / scratch/ledger.md | 需确认归属 |
| `east-africa-construction-fastener-market` | de | #2/#3 a | G | 存量交期 25–30/30–35/35–45 Tage；付款 T/T 30%–70%、Akkreditiv、Dokumente gegen Zahlung、Offenes Konto | de 线 register.md / scratch/ledger.md | 需确认归属 |
| `algeria-fastener-market-complete-guide` | de | #1 a | B | a.de 119（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `egypt-fastener-market-complete-guide` | de | #1 a | B | a.de 117（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `ivory-coast-fastener-market-complete-guide` | de | #2 q | C | q.de 71（>70） | de 线 register.md / scratch/ledger.md | R-T9k |
| `morocco-fastener-market-complete-guide` | de | #1 a | B | a.de 119（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `senegal-fastener-market` | de | #1 a | B | a.de 119（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `senegal-fastener-market-complete-guide` | de | #1 a | B | a.de 119（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `mozambique-fastener-market-case-study` | de | #1–3 a | A | a.de 938 / 783 / 865（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `republic-of-congo-fastener-supplier` | de | #1–3 a | A | a.de 957 / 909 / 973（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `zambia-copper-mining-fasteners-grade-selection-2026` | de | #2 q/a | C/A | q.de 71；a.de 973 | de 线 register.md / scratch/ledger.md | R-T9k |
| `zambia-copper-mining-fasteners-grade-selection-2026` | de | #3/#4 a | A | a.de 1003 / 928（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `ethiopia-industrial-park-fastener-supply` | de | #1/#2 a | A | a.de 893 / 911（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `ethiopia-industrial-park-fastener-supply` | de | #3 q/a | C/A | q.de 72；a.de 902 | de 线 register.md / scratch/ledger.md | R-T9k |
| `kenya-infrastructure-fastener-demand` | de | #1–3 q | C/D | q.de 80 纯度0.46；q.de 87 纯度0.44；q.de 102 纯度0.50 | de 线 register.md / scratch/ledger.md | R-T9k |
| `kenya-infrastructure-fastener-demand` | de | #4 q/a | C/A/D | q.de 91；a.de 507；纯度 0.29 | de 线 register.md / scratch/ledger.md | R-T9k |
| `carriage-bolts-guide` | de | #1–3 a | A | a.de 844 / 854 / 888（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `mozambique-lng-construction-fasteners-maputo` | de | #1/#2 q | C | q.de 72 / 73（>70） | de 线 register.md / scratch/ledger.md | R-T9k |
| `mozambique-lng-construction-fasteners-maputo` | de | #1–3 a | A | a.de 845 / 734 / 794（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `rwanda-construction-fastener-market-2026` | de | #4/#7 q | C | q.de 91 / 82（>70） | de 线 register.md / scratch/ledger.md | R-T9k |
| `rwanda-construction-fastener-market-2026` | de | #5/#6 a | B | a.de 65 / 85（<120） | de 线 register.md / scratch/ledger.md | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | de | #1–5 q/a | C/A | q.de 90–102；a.de 486–733（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `morocco-casablanca-port-fastener-import-procedure` | de | #6–9 q | C | q.de 75–118（>70） | de 线 register.md / scratch/ledger.md | R-T9k |
| `bolt-markings-identify-grade` | de | #1/#2 a | A | a.de 785 / 746（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `bolt-markings-identify-grade` | de | #3 q/a | C/A | q.de 72；a.de 695 | de 线 register.md / scratch/ledger.md | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | de | #2 a | D | 纯度 0.00 | de 线 register.md / scratch/ledger.md | R-T9k |
| `fastener-selection-guide-african-construction` | de | #3/#6 a | A | a.de 1007 / 958（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `fastener-selection-guide-african-construction` | de | #8 q/a | C/A | q.de 76；a.de 985 | de 线 register.md / scratch/ledger.md | R-T9k |
| `egypt-cairo-construction-fastener-wholesale` | de | #4–8 q | C | q.de 75 / 86 / 80 / 74 / 115（>70） | de 线 register.md / scratch/ledger.md | R-T9k |
| `anchor-bolts-foundation-guide` | de | #1–3 a | A | a.de 731 / 745 / 721（>450） | de 线 register.md / scratch/ledger.md | R-T9k |
| `algeria / egypt / morocco / senegal complete-guide 系列` | de | #1 a | G | 存量含 180 Millionen USD 与 8–9% Wachstum（源文 en 同款 $180M / 8–9%） | de 线 register.md / scratch/ledger.md | 需确认归属 |

### 2.4 pt（葡萄牙语存量台账 70 侧）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `anchor-bolts-foundation-guide` | pt | q/a | A | #1 长度 698（要求 120–450）；#2 长度 642（要求 120–450）；#3 长度 697（要求 120–450）；#4 长度 732（要求 120–450）；#5 长度 681（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `bolt-markings-identify-grade` | pt | q/a | A | #1 长度 683（要求 120–450）；#2 长度 669（要求 120–450）；#3 长度 616（要求 120–450）；#4 长度 645（要求 120–450）；#5 长度 682（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `botswana-fastener-supplier` | pt | q/a | A | #1 长度 827（要求 120–450）；#2 长度 819（要求 120–450）；#3 长度 756（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `egypt-cairo-construction-fastener-wholesale` | pt | q | C | #4 长度 75（要求 8–70）；#5 长度 99（要求 8–70）；#8 长度 109（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `fastener-selection-guide-african-construction` | pt | q/a | A | #2 长度 803（要求 120–450）；#3 长度 859（要求 120–450）；#4 长度 894（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `fastener-selection-guide-african-construction` | pt | q | C | #2 长度 72（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `kenya-fastener-market-guide` | pt | q/a | B/D | #5 长度 42（要求 120–450）；#5 语言纯度 0.46（<0.55）；#6 长度 43（要求 120–450）；#7 长度 36（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `kenya-infrastructure-fastener-demand` | pt | q/a | A/D | #2 语言纯度 0.51（<0.55）；#3 语言纯度 0.51（<0.55）；#4 长度 519（要求 120–450）；#4 语言纯度 0.52（<0.55） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `kenya-infrastructure-fastener-demand` | pt | q | C | #1 长度 84（要求 8–70）；#2 长度 79（要求 8–70）；#3 长度 92（要求 8–70）；#4 长度 95（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `mining-fasteners-africa` | pt | q/a | B/D | #5 长度 61（要求 120-450）；a.pt 语言纯度 0.54（<0.55） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `morocco-casablanca-port-fastener-import-procedure` | pt | q | C | #6 长度 102（要求 8–70）；#7 长度 96（要求 8–70）；#9 长度 75（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `nigeria-fastener-market-guide` | pt | q/a | B/D | #5 长度 52（要求 120–450）；#5 语言纯度 0.54（<0.55）；#6 长度 41（要求 120–450）；#7 长度 41（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `republic-of-congo-fastener-supplier` | pt | q/a | A | #1 长度 913（要求 120-450）；#2 长度 752（要求 120-450）；#3 长度 808（要求 120-450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `rwanda-construction-fastener-market-2026` | pt | q/a | B | #5 长度 86（要求 120–450）；#6 长度 102（要求 120–450）；#7 长度 104（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `rwanda-construction-fastener-market-2026` | pt | q | C | #4 长度 85（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `senegal-dakar-construction-fastener-wholesale` | pt | q | C | #5 长度 71（要求 8-70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | pt | q/a | B | #6 长度 47（要求 120–450）；#7 长度 57（要求 120–450）；#8 长度 51（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | pt | q | C | #7 长度 88（要求 8–70）；#8 长度 71（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `stainless-steel-fasteners-africa` | pt | q/a | B/D | #5 长度 81（要求 120–450）；#6 长度 40（要求 120–450）；#7 长度 68（要求 120–450）；#7 语言纯度 0.32（<0.55） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `stainless-steel-fasteners-africa` | pt | q | C | #5 长度 75（要求 8–70）；#6 长度 73（要求 8–70）；#7 长度 81（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | pt | q/a | A | #1 长度 509（要求 120–450）；#2 长度 654（要求 120–450）；#3 长度 605（要求 120–450）；#4 长度 670（要求 120–450）；#5 长度 693（要求 120–450） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | pt | q | C | #1 长度 88（要求 8–70）；#2 长度 79（要求 8–70）；#3 长度 89（要求 8–70）；#4 长度 98（要求 8–70）；#5 长度 77（要求 8–70） | pt 线 register-all.json / register-0608 / register-0912 | R-T9k |

### 2.5 ja（日语存量台账 29 侧）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `east-africa-construction-fastener-market` | ja | q/a | B/D | #1 长度 70（要求 120–450）；#2 长度 83（要求 120–450）；#3 长度 87（要求 120–450）；#3 假名+汉字占比 48%（<60%） | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `ethiopia-industrial-park-fastener-supply` | ja | q/a | E | #1 含中文简体专用字 国；#2 含中文简体专用字 会；#3 含中文简体专用字 国 | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `kenya-infrastructure-fastener-demand` | ja | q/a | B/D/E | #1 长度 119（要求 120–450）；#2 假名+汉字占比 50%（<60%）；#3 假名+汉字占比 58%（<60%）；#3 含中文简体专用字 前；#4 假名+汉字占比 41%（<60%） | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `morocco-casablanca-port-fastener-import-procedure` | ja | q/a | E | #6 含中文简体专用字 号；#7 含中文简体专用字 国；#10 含中文简体专用字 会 | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `rwanda-construction-fastener-market-2026` | ja | q/a | B/E | #4 长度 73（要求 120–450）；#5 长度 35（要求 120–450）；#5 含中文简体专用字 国时长；#6 长度 62（要求 120–450）；#7 长度 57（要求 120–450） | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `southern-africa-fastener-market-southafrica-botswana` | ja | q/a | B/D/E | #1 长度 83（要求 120–450）；#1 含中文简体专用字 国；#2 长度 87（要求 120–450）；#2 假名+汉字占比 48%（<60%）；#2 含中文简体专用字 前 | ja 线 verify5_stock.txt / report-ja.json | R-T9k |
| `zimbabwe-bolts-screws-b2b-construction-exports-2026` | ja | q/a | E | #2 含中文简体专用字 国；#3 含中文简体专用字 前国；#4 含中文简体专用字 号；#5 含中文简体专用字 前国 | ja 线 verify5_stock.txt / report-ja.json | R-T9k |

### 2.6 hi（印地语存量 45 篇，226 侧：q 126 / a 100）

| slug | 语种 | 条目 | 缺陷 | 实测值 | 来源线 | 建议处置 |
|---|---|---|---|---|---|---|
| `africa-railway-modernization-fastener-demand` | hi | q 3 / a 2 | F | #1.q(24%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #3.q(25%,低占比/夹拉丁整句); #3.a(28%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `africa-solar-energy-fastener-procurement-guide` | hi | q 3 / a 3 | F | #1.q(28%,低占比/夹拉丁整句); #1.a(40%,低占比/夹拉丁整句); #2.q(26%,低占比/夹拉丁整句); #2.a(32%,低占比/夹拉丁整句); #3.q(31%,低占比/夹拉丁整句); #3.a(22%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `agricultural-machinery-fastener-guide` | hi | q 2 / a 0 | F | #1.q(53%,低占比); #3.q(48%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `angola-construction-boom-fastener-demand` | hi | q 3 / a 2 | F | #1.q(25%,低占比/夹拉丁整句); #1.a(45%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #3.q(26%,低占比/夹拉丁整句); #3.a(29%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `automotive-fastener-grade-comparison` | hi | q 3 / a 2 | F | #1.q(27%,低占比/夹拉丁整句); #1.a(47%,低占比/夹拉丁整句); #2.q(31%,低占比/夹拉丁整句); #3.q(28%,低占比/夹拉丁整句); #3.a(31%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `concrete-anchors-selection-guide` | hi | q 1 / a 0 | F | #2.q(45%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `construction-building-self-tapping-screws-tco-analysis-joint-stiffness` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `construction-building-self-tapping-screws-tco-analysis-uv-degradation` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(35%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `dr-congo-drc-mining-fastener-market` | hi | q 3 / a 2 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(52%,低占比/夹拉丁整句); #2.q(34%,低占比/夹拉丁整句); #3.q(32%,低占比/夹拉丁整句); #3.a(34%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-cost-reduction-china-vs-turkey` | hi | q 3 / a 2 | F | #1.q(33%,低占比/夹拉丁整句); #1.a(46%,低占比/夹拉丁整句); #2.q(31%,低占比/夹拉丁整句); #3.q(37%,低占比/夹拉丁整句); #3.a(24%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-failure-analysis-case-studies` | hi | q 3 / a 2 | F | #1.q(27%,低占比/夹拉丁整句); #1.a(48%,低占比/夹拉丁整句); #2.q(31%,低占比/夹拉丁整句); #3.q(28%,低占比/夹拉丁整句); #3.a(31%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-lubrication-thread-locking-guide` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-packaging-export-requirements` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-preload-torque-calculation-methods` | hi | q 3 / a 2 | F | #1.q(34%,低占比/夹拉丁整句); #1.a(47%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(38%,低占比/夹拉丁整句); #3.a(25%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-quality-certification-comparison` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-quality-control-inspection-procedures` | hi | q 3 / a 3 | F | #1.q(32%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(36%,低占比/夹拉丁整句); #3.q(35%,低占比/夹拉丁整句); #3.a(24%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-selection-guide-african-construction` | hi | q 1 / a 0 | F | #6.q(54%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `fastener-warehouse-management-best-practices` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `food-beverage-fastener-hygiene-standards` | hi | q 3 / a 2 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(51%,低占比/夹拉丁整句); #2.q(34%,低占比/夹拉丁整句); #3.q(31%,低占比/夹拉丁整句); #3.a(34%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `green-building-fastener-requirements` | hi | q 3 / a 2 | F | #1.q(25%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #3.q(26%,低占比/夹拉丁整句); #3.a(29%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `harare-fastener-distributor-supplier-guide` | hi | q 0 / a 1 | F | #9.a(53%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `high-strength-bolting-structural-steel` | hi | q 3 / a 3 | F | #1.q(32%,低占比/夹拉丁整句); #1.a(45%,低占比/夹拉丁整句); #2.q(30%,低占比/夹拉丁整句); #2.a(36%,低占比/夹拉丁整句); #3.q(36%,低占比/夹拉丁整句); #3.a(24%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `kenya-east-africa-fastener-distribution-hub` | hi | q 3 / a 2 | F | #1.q(23%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(27%,低占比/夹拉丁整句); #3.q(24%,低占比/夹拉丁整句); #3.a(27%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `marine-grade-fastener-selection-guide` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(33%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `mozambique-fastener-import-market-guide` | hi | q 3 / a 2 | F | #1.q(26%,低占比/夹拉丁整句); #1.a(46%,低占比/夹拉丁整句); #2.q(30%,低占比/夹拉丁整句); #3.q(27%,低占比/夹拉丁整句); #3.a(30%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `precast-concrete-fastener-applications` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(35%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `railway-track-fastener-specifications` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `sleeve-anchors-buying-guide` | hi | q 2 / a 0 | F | #1.q(54%,低占比); #2.q(54%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `solar-panel-mounting-fastener-requirements` | hi | q 3 / a 2 | F | #1.q(29%,低占比/夹拉丁整句); #1.a(49%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(29%,低占比/夹拉丁整句); #3.a(32%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `south-africa-sabs-fastener-import-requirements` | hi | q 3 / a 2 | F | #1.q(33%,低占比/夹拉丁整句); #1.a(45%,低占比/夹拉丁整句); #2.q(30%,低占比/夹拉丁整句); #3.q(36%,低占比/夹拉丁整句); #3.a(24%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `tanzania-fastener-market-opportunities-2026` | hi | q 3 / a 2 | F | #1.q(28%,低占比/夹拉丁整句); #1.a(49%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(29%,低占比/夹拉丁整句); #3.a(32%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `wind-energy-fastener-requirements-2026` | hi | q 3 / a 2 | F | #1.q(28%,低占比/夹拉丁整句); #1.a(49%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(29%,低占比/夹拉丁整句); #3.a(32%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-anchor-bolts-lifecycle-cost-salt-spray` | hi | q 3 / a 2 | F | #1.q(35%,低占比/夹拉丁整句); #1.a(48%,低占比/夹拉丁整句); #2.q(33%,低占比/夹拉丁整句); #3.q(39%,低占比/夹拉丁整句); #3.a(25%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-flat-washers-standard-explainer-lead-time` | hi | q 3 / a 2 | F | #1.q(32%,低占比); #1.a(45%,低占比); #2.q(30%,低占比); #3.q(35%,低占比); #3.a(24%,低占比) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-lock-nuts-rfq-template-bolt-pattern` | hi | q 3 / a 2 | F | #1.q(34%,低占比/夹拉丁整句); #1.a(47%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(38%,低占比/夹拉丁整句); #3.a(25%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-lock-washers-tco-analysis-stress-cracking` | hi | q 3 / a 2 | F | #1.q(35%,低占比/夹拉丁整句); #1.a(48%,低占比/夹拉丁整句); #2.q(32%,低占比/夹拉丁整句); #3.q(38%,低占比/夹拉丁整句); #3.a(25%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-threaded-rods-supplier-evaluation-cost-optimization` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(33%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-u-bolts-spec-checklist-mill-cert-traceability` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(43%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(34%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zim-construction-u-bolts-supplier-evaluation-galvanic-corrosion` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(35%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-agricultural-fastener-requirements` | hi | q 3 / a 2 | F | #1.q(23%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(27%,低占比/夹拉丁整句); #3.q(24%,低占比/夹拉丁整句); #3.a(27%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-bulawayo-construction-hardware-supply` | hi | q 3 / a 2 | F | #1.q(24%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #3.q(25%,低占比/夹拉丁整句); #3.a(29%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-mining-fastener-grade-selection` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(33%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-road-bridge-rehabilitation-fastener-supply` | hi | q 3 / a 3 | F | #1.q(30%,低占比/夹拉丁整句); #1.a(42%,低占比/夹拉丁整句); #2.q(28%,低占比/夹拉丁整句); #2.a(34%,低占比/夹拉丁整句); #3.q(33%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-rural-electrification-fastener-specifications` | hi | q 3 / a 3 | F | #1.q(26%,低占比/夹拉丁整句); #1.a(37%,低占比/夹拉丁整句); #2.q(24%,低占比/夹拉丁整句); #2.a(29%,低占比/夹拉丁整句); #3.q(29%,低占比/夹拉丁整句); #3.a(20%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |
| `zimbabwe-warehousing-racking-fastener-safety` | hi | q 3 / a 3 | F | #1.q(31%,低占比/夹拉丁整句); #1.a(44%,低占比/夹拉丁整句); #2.q(29%,低占比/夹拉丁整句); #2.a(35%,低占比/夹拉丁整句); #3.q(35%,低占比/夹拉丁整句); #3.a(23%,低占比/夹拉丁整句) | hi 线 hi_inventory_by_article.json | R-T9k |

### 2.7 ru（俄语）

- 本轮未形成逐篇存量不合格台账；已登记信息仅限 §4 冻结篇目剩余缺口，无条目级实测值。

## §3 英文源文缺陷专表（交 A 线）

### 3.1 占位句 `See the detailed analysis above…`（22 篇，a.en 未承载事实，B 线只能从同篇正文/相邻条目取事实）

| slug | 位置 | 缺陷 | 建议处置 |
|---|---|---|---|
| `south-africa-fastener-market-case-study` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `zambia-fastener-market-case-study` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `mining-fasteners-africa` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-selection-guide-african-construction` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-common-problems-solutions` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `south-africa-fastener-market-guide` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-cost-analysis-template` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `china-hex-nuts-manufacturer` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-standards-din-iso-astm-comparison` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `drywall-screws-bulk-price-africa-procurement` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `solar-panel-mounting-fasteners-africa` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `m10-galvanized-bolt-fob-china-price` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `china-fastener-supplier-price-list-guide` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-supplier-verification-checklist` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-applications-construction-solar-telecom` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `malawi-fastener-market-case-study` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `nigeria-fastener-market-guide` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `kenya-fastener-market-case-study` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `kenya-fastener-market-guide` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `self-drilling-tek-screws-price-list` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `fastener-quality-inspection-guide` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |
| `stainless-steel-fasteners-africa` | a.en #1（占位条目） | 源文占位句，无答案事实 | 交 A 线（源文问题） |

### 3.2 问答错位 / 残缺 / 重复

| slug | 条目 | 实测问题 | 建议处置 |
|---|---|---|---|
| `anchor-bolts-suppliers-africa` | #2 | Q「标准交期到非洲主要港口？」与 A「随货含 MTC/Mill Test Report、尺寸…」问答错位 | 交 A 线（源文问题） |
| `anchor-bolts-suppliers-africa` | #3 | Q「热带/沿海/沙漠/工业选哪种镀层？」与 A「自有工装可做定制 J/L 螺栓…」问答错位 | 交 A 线（源文问题） |
| `anchor-bolts-suppliers-africa` | #4 | A 与 #3 同为定制工装描述（#3/#4 答案重复） | 交 A 线（源文问题） |
| `uganda-oil-refinery-fastener-requirements` | #1/#3/#5 | a.en 前缀残缺：`cts?` / `ion?` / `nda?` 碎片粘连在答案开头 | 交 A 线（源文问题） |
| `mozambique-lng-construction-fasteners-maputo` | #7–#10 | #7–#10 的 Q/A 与 #3–#6 逐字重复（L43 钢号、直发 Matola、A4-80、TEU 产能四条各重复一次） | 交 A 线（源文问题） |

### 3.3 英文正文夹带 CJK 残字

| slug | 位置 | 实测问题 | 建议处置 |
|---|---|---|---|
| `structural-heavy-duty-bolts-building-guide` | #2 a.en | 夹带简体中文「刺客螺栓」（其余为英文） | 交 A 线（源文问题） |
| `full-thread-half-thread-coarse-fine-thread-guide` | #2 a.en | 夹带简体中文「母材」两处（其余为英文） | 交 A 线（源文问题） |

### 3.4 源文含金额 / 费率 / 折扣 / 税率（B 线译时已剔除，源文仍待 A 线核口径）

| slug | 条目 | 实测问题 | 建议处置 |
|---|---|---|---|
| `payment-terms-international-fastener-trade` | — | en 含 L/C 费用与起付额（$ 金额、费率）；B 线译时金额与费率剔除，仅留付款结构 | 需确认归属 |
| `fastener-export-china-to-africa-guide` | — | en 含集装箱美元运价、港口操作费、关税比例、landed 倍数；译时仅留成本构成公式 | 需确认归属 |
| `fastener-negotiation-supplier-china` | #1 | en 含 $5,000 金额与 15–40% 折扣率；译时剔除金额与百分比 | 需确认归属 |
| `fastener-negotiation-supplier-china` | #3 | en 提 ISO 9001:2015 factory certificate；译时改为合规文件/MTR/第三方检验口径 | 需确认归属 |
| `zimbabwe-fastener-market-case-study` | #2 | en 含 40% 关税 + 15% IVA；译时保留 HS 7318 与申报 IDN，税率中性化 | 需确认归属 |
| `m10-galvanized-bolt-fob-china-price` | #3 | en 含 20% barateza；译时剔除百分比 | 需确认归属 |
| `bulk-fastener-ordering-strategies` | #2 | en 含 $10,000/ano；译时剔除金额，保留 volume/caixa 口径 | 需确认归属 |
| `bulk-fastener-ordering-strategies` | #5 | en 含 5–10% desconto；译时剔除百分比 | 需确认归属 |
| `mombasa-port-fasteners` | #2 | en 含 25% 进口关税 + 16% IVA；译时中性化税率，保留 HS 与 CIF 申报口径 | 需确认归属 |

## §4 已冻结 / 未处理篇目与其剩余缺口

> 下列篇目为本轮在途 ` M` 脏文件或跳过篇，本轮 B 线未改写。本轮冻结集合各语种剩余缺口合计（台账口径）：es 16、fr 34、de 27、pt 41、ru 30、hi 10；ja 为本次现网扫描值（下列 5 篇 ja 均已齐，缺口 0）。逐篇缺口为现网扫描实测。

| slug | FAQ 条目 | es | fr | de | pt | ru | hi | ja | 备注 |
|---|---:|---|---|---|---|---|---|---|---|
| `africa-fastener-market-opportunities-2026` | 7 条 | es 7/7 | fr 7/7 | — | pt 7/7 | ru 7/7 | — | ja 0 | 冻结（在途脏文件） |
| `china-fasteners-zimbabwe-procurement-guide` | 6 条 | — | fr 6/6 | de 6/6 | pt 6/6 | ru 6/6 | — | ja 0 | 冻结（在途脏文件） |
| `ghana-fastener-market-guide` | 7 条 | — | fr 7/7 | de 7/7 | pt 7/7 | ru 7/7 | — | ja 0 | 冻结（在途脏文件） |
| `drc-diamond-mining-fasteners` | 12 条 | — | — | de 5/5 | pt 12/12 | ru 5/5 | hi 5/5 | ja 0 | 冻结（在途脏文件） |
| `malawi-fastener-market-case-study` | 9 条 | es 9/9 | fr 9/9 | de 9/9 | pt 9/9 | ru 5/5 | hi 5/5 | ja 0 | 中途变脏，跳过登记 |

- 其余在途脏文件（本轮未纳入冻结清单、亦未改写）：`agricultural-machinery-fastener-guide`、`anchor-bolts-selection-guide`、`bolt-tightening-torque-guide`、`mozambique-hardware-supplier`、`rwanda-construction-fastener-standards`。

## 附：判定为「需确认归属」的篇目

- `ivory-coast-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Ivory Coast
- `cameroon-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Cameroon
- `ethiopia-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Ethiopia
- `tanzania-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Tanzania
- `algeria-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Algeria
- `morocco-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Morocco
- `senegal-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Senegal
- `senegal-fastener-market`（fr，#5 a）：存量含 USD 180M 及英文国名 Senegal
- `egypt-fastener-market-complete-guide`（fr，#5 a）：存量含 USD 180M 及英文国名 Egypt
- `algeria / egypt / morocco / senegal complete-guide 系列`（de，#1 a）：存量含 180 Millionen USD 与 8–9% Wachstum（源文 en 同款 $180M / 8–9%）
- `fastener-negotiation-supplier-china`（de/pt/fr，#1）：源文 $5,000 / 15–40% 折扣，译文是否同步剔除待归属确认

