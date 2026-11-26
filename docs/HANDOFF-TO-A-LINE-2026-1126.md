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

## 3. 归属待确认

- `drc-diamond-mining-fasteners`：不在 A 区 39 篇 CSV 里，`git status` 长期为 ` M`（疑似别线整文重排中），B 线未碰。请 A 线确认归属：若归 A 线，B 线本轮不再等它；若归 B 线，请对方提交后通知，B 线下轮补 ar 12 条。

## 4. 保护名单（B 线两轮均未碰，等对方提交后再补）

`africa-fastener-market-opportunities-2026`（ar 7 / ru 7）、`china-fasteners-zimbabwe-procurement-guide`（ar 6 / ru 6）、`ghana-fastener-market-guide`（ar 7 / ru 7）。
