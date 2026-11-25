# SEO/GEO 总排期与分工（2026-11-25 起 30 天）

> 这份文件回答"这周谁做什么、按什么顺序、做完什么算完"。它不重复口径，也不重复工单明细。

## 0. 读文件顺序（其他对话开工前照这个来）

1. `docs/SEO-GEO-STRATEGY.md` — **口径**：认证/单证/价格/地域怎么写，谁能写哪里，验收闸门。改文案前必读。
2. `docs/seo-geo-worklist-2026-1125.csv` + `docs/seo-geo-worklist-guide-2026-1125.md` — **工单**：一篇一行，`batch`/`issues`/`actions`。重跑 `python3 scripts/build-seo-geo-worklist.py` 即更新，别手改。
3. 本文件 — **排期与分工**：批次先后、任务卡、owner、窗口、交付物。
4. `docs/reports/seo-geo-<日期>.md` — **度量**：每天 20:16 由 `bash scripts/seo-geo-weekly.sh` 自动生成。

四者冲突时，以策略文件为准，其余三个重跑脚本对齐，不要手工调数字。

## 1. 今天实测的现状（2026-11-25 20:20 CST，线上）

**已确认上线**：`origin/main == HEAD`（0 未推）、工作区干净；`https://www.tradego-fasteners.com/{en,zh,es,de,ar}/industry/china-iso-9001-fastener-manufacturer-directory/` 已返回新标题（en `China Fastener Suppliers: Certification by Order`）。批次 1 的 13 个 snippet 目标全部落地。sitemap 4,092 条，279 篇（264 篇计入 GEO 评分）。

**GEO 均分按语种（这是本次最关键的发现）**

| 语种 | 均分 | A 90+ | E <60 | 说明 |
|---|---|---|---|---|
| en | 62.7 | 11 | 106 | 基线，改进中 |
| ru | 53.0 | 2 | 158 | 分数偏高，疑分词口径失真（见 T0） |
| ar | 52.9 | 0 | 159 | |
| zh | 51.0 | 2 | 190 | 节覆盖不足叠加 |
| ja | 50.5 | 0 | 191 | |
| hi | 50.4 | 2 | 202 | 首段巨型段最多（61 篇） |
| de | 43.3 | 0 | 249 | |
| fr | 41.3 | 0 | 247 | |
| es | 40.9 | 0 | 248 | |
| pt | 40.4 | 0 | 250 | |

**为什么 es/pt/fr 只有 40 分**：抽查 `concrete-anchors-fasteners-guide`、`hex-bolt-dimensions-chart`，这三个语种的首段是 1,000–1,600 "词" 的巨型段（`p1` 权重 20 直接归零），正文没有"X 是指…"定义句（`def` 10 分归零），H2 全是名词短语（`qh` 15 分归零）。翻译把段落边界丢了，不是内容不够。首段 >300 词的篇数：hi 61、fr 34、es 31、pt 28、ar 11、ru 9、de 6、en 2、zh 0、ja 0。

**其他缺口（`check-geo-readiness.py`，均分 87.4）**：dup 134 / std 76 / entity 44 / link 29 / src 20 / lead 8 / fresh 5。

**内容与合规**：`geo_audit` echo 141 篇、实体密度 <2 共 63 篇、FAQ 不足 3 条 0 篇；模板文 11 篇 / 34 节（原 30 / 128）；`content_gate --brief` 203 篇完全干净（77%）、0 BLOCK；`check-claims` 与 `check-cert-claims` 通过；金额断言 2,205 处但价格语义 0 处。

**发布**：今日部署 12 / 预算 3，`deploy-budget.sh` 拦截中。**下一窗口是上海 00:00 的 launchd push + `vercel-promote.sh`**。今天所有内容改动已上线，新一轮改动要等这个窗口。

**数据**：GSC 最新仍是 `gsc-pages-2026-11-22.json`（点击 280 / 曝光 29,476 / CTR 0.95%）。批次 1 的 CTR 效果要等 3–14 天，且需要重新导出才能验收。

## 2. 阶段目标

| 时点 | 目标 |
|---|---|
| 12-02（W1 末） | es/pt/fr 首段巨型段清零；三语种均分 ≥55；echo 141 → ≤100；部署回到 ≤3 次/天 |
| 12-09（W2 末） | std 76 → ≤20、src 20 → ≤5、link 29 → 0；dup 134 → ≤60；模板文 11 → ≤5 |
| 12-16（W3 末） | zh 节覆盖 27 → ≥80 篇满覆盖；新文 3 篇/周稳定产出 |
| 12-23（W4 末） | GEO 全站均分 ≥75（en 基线口径）；GSC 回收一次，判定批次 1 CTR 是否达标（≥2.0%） |

## 3. 任务卡（按顺序做，别插队）

每张卡的 `owner` 是唯一写权人。别人想动同一篇，先看 §4。

### T0 修 GEO 评分器对 ru/ar/ja 的分词（0.5 天，工程类，先做）

- **为什么**：ru 的 `ent` 出现 155.6 这种值，说明 `scripts/geo_audit.py` 的 `words()` 按空格切词，对西里尔/阿拉伯/日文失真。不修就先别拿 ru/ar/ja 的分数当验收线。
- **怎么做**：改 `words()` 按脚本类型切（CJK 按字符×0.6、西里尔/阿拉伯按空格但过滤符号），改完对同一批 5 篇跑前后对照，输出记进 `docs/reports/`。
- **验收**：同一篇 en 分数不变；ru/ar/ja 的 `ent` 落到 5–20 的合理区间；`bash scripts/seo-geo-weekly.sh` 跑通。
- **owner**：seo-geo-main

### T1 本地化段落修复（W1 核心，约 93 篇 × 部分语种）

- **对象**：首段 >300 词的 es 31 / fr 34 / pt 28 篇，加 hi 61 篇（先做曝光高的 40 篇，按 `docs/geo-locale-para-plan-2026-1125.csv` 的顺序）。
- **怎么做**：
  ```bash
  python3 scripts/article-claim.py claim <slug> seo-geo-main
  python3 scripts/paragrapher.py --slug <slug> --locale es,fr,pt --show   # 先看切分结果
  python3 scripts/paragrapher.py --slug <slug> --locale es,fr,pt --apply  # 再落盘
  python3 scripts/geo_audit.py --slug <slug>
  python3 scripts/article-claim.py release <slug> seo-geo-main
  ```
- **注意**：`--apply` 只动指定语种，别带 `--locale all`；落盘后立刻对比其它语种 md5 未变。
- **验收**：该篇 es/pt/fr 的 `p1` 落在 40–130；语种均分上涨 ≥8 分；`content_gate --slug` 无新增 BLOCK。

### T2 补定义句（与 T1 同批做，别分两次动文件）

- **为什么**：`def` 占 10 分，es/pt/fr 几乎全为 0。
- **怎么做**：在该篇首个 H2 后加一句"X 是指……"，用当地语言、≤40 词，含一个可核事实（标准号或尺寸范围）。同一批语种一起写，避免二次开同一 JSON。
- **验收**：`geo_audit` 的 `def` = 1；句子能独立回答"这是什么"。

### T3 H2 问题化（W1 后半，先 40 篇高曝光）

- **为什么**：`qh` 占 15 分，全站 `qh` 普遍 0–0.14。
- **怎么做**：每篇挑 2 个 H2 改成问句（en `How do I choose…` / `What thickness…`；zh「怎么选…」「为什么…」），10 语种 `heading` 同步改，正文可不动。
- **验收**：`qh ≥ 0.25`；标题改动后 `check-body-lang --slug` 0 污染；关键词不堆砌。
- **owner**：头条分析线（它已在做模板文重写，顺手改 heading）

### T4 en 首段答案化（W1，21 篇）

- **对象**：`scripts/geo_audit.py --top` 里 echo=1 且曝光最高的 21 篇（ISO 9001 篇已完成）。
- **怎么做**：首段 40–60 词直接给结论（含一个数字），不复述标题；保留原文事实，不新增承诺。
- **验收**：`echo` 0，`p1` 40–130，均分 ≥75。

### T5 标准与来源补齐（W2，std 76 / src 20）

- **怎么做**：正文补"标准号 + 机构 + 版本年"（ISO 898-1:2013、ASTM A307、SABS 1195、DIN 933），文末加"数据来源"段（GSC/协会/海关公开数据，写清年份）。
- **验收**：`check-geo-readiness.py` 该篇 `std`、`src` 缺口消失；不得出现"已获认证"类表述。

### T6 入链（W2，link 29）

- **对象**：`docs/internal-link-plan-2026-1125.csv`、`docs/orphan-backlog-2026-1125.csv`。
- **怎么做**：每篇加 2 条入链：同簇文章 1 条 + `/products` 或 `/documents` 1 条，锚文本用目标页真实主题词。
- **验收**：该篇入链 ≥2；目标页不是重定向页。

### T7 去重（W2–W3，dup 134）

- **怎么做**：`python3 scripts/dedupe-sentences.py --slug <slug>` 先看，再人工改写重复整句（>15% 共用句的篇优先）。别整段删，改成当地市场的具体事实。
- **验收**：`check-geo-readiness` 的 `dup` 归零；`content_gate` 通过。

### T8 中文补齐 + 新文供给（W3）

- **zh**：27 → ≥80 篇满覆盖（节覆盖 ≥0.9），按曝光排序，先 `zh` 曝光前 40 篇。
- **新文**：每周 3 篇，只做三个簇（港口清关 / 标准选型 / 区域市场），每篇上线前 `geo_audit ≥70` 且 10 语种齐全。

## 4. 分工与写权限

| 线 | 能写 | 不能写 | 交付物 |
|---|---|---|---|
| seo-geo-main（本对话） | `content/articles/*`（T1/T2/T4/T5/T8 认领的篇）、`scripts/*`、`docs/*` | 品牌资产、`src` 视觉层 | 任务卡完成记录 + 提交 |
| 头条分析线 | 模板文 11 篇、heading 改写（T3） | 别人已领锁的篇、`scripts` | 篇章重写提交 |
| vercel 运维线（A 线） | 只做发布：`vercel-promote.sh`、预算、审计 | **任何内容文件** | 部署台账、审计报告 |
| 品牌/社媒线 | `public/brand/*`、logo/icon、社媒事实卡、`public/llms.txt` | `content/articles/*` | 品牌资产与事实卡同步 |

**五条铁律**（违反一次就会重演整篇被覆盖的事故）：

1. 动文章先领锁 `python3 scripts/article-claim.py claim <slug> <线名>`，领不到换一篇。
2. 原子单位是「一篇 × 全部语种」，同一个 JSON 只开一次、只改自己负责的字段。
3. 只 `git add <具体路径>` 再 `git commit -- <同一路径>`；禁 `git add -A`、禁 `git add content`。
4. 内容线只 commit 不 push；push 只在发布线上海 00:00 窗口做一次。
5. 认证/单证/价格口径改动要三处同步：站点 UI、`public/llms.txt`、社媒事实卡。

## 5. 节奏

| 时间（Asia/Shanghai） | 动作 |
|---|---|
| 每日 20:16 | `bash scripts/seo-geo-weekly.sh` 生成当日体检，看 `docs/reports/seo-geo-<日期>.md` |
| 每日 08:30 | Vercel 合规审计（A 线），有问题先修再谈内容 |
| 每日 00:00 | launchd 单次 push + `vercel-promote.sh`（唯一发布窗口） |
| 每周一 09:00 | 从 GSC 导出上周数据，替换 `logs/seo-ai-pipeline/gsc-pages-<日期>.json`，重跑工单与周报，填周报第 7 节 |

## 6. 闸门（缺一项不算完成）

```bash
python3 scripts/content_gate.py --slug <slug>
python3 scripts/check-claims.py
python3 scripts/check-cert-claims.py
python3 scripts/check-body-lang.py --slug <slug>
python3 scripts/geo_audit.py --slug <slug>
python3 scripts/article-claim.py release <slug> <线名>
```

回到工单里重跑 `build-seo-geo-worklist.py`，**该篇掉出原批次才算真改完**。

## 7. 已知坑（都是踩过的）

- 并行两条线各读旧 JSON、各写新 JSON → 后写把先写的多语种清回摘要级。领锁 + 只改自己字段。
- 未跟踪文件不能 `git commit -- <path>`，先 `git add` 再 commit 同一路径。
- 仓库 pre-commit 会拦"批量 content 提交"和"跨领域混合提交"，一次提交只带一个领域。
- 这台 Mac 的平台 `cron`/`at` 不触发，定时一律用 launchd；launchd 脚本里 `log()` 必须先定义再调用。
- `deploy-budget.sh` fail-closed：读不到 Vercel 数据时直接拦，不要 `DEPLOY_FORCE=1` 绕过。
- `geo_audit` 对 ru/ar/ja 分词失真（T0 修完前别用它们的分数下结论）。

## 8. 状态看板（各线自己改这一张表，别另开文件）

| 任务 | owner | 状态 | 完成数/总数 | 备注 |
|---|---|---|---|---|
| T0 分词修复 | seo-geo-main | 待开始 | — | |
| T1 本地化段落 | seo-geo-main | 待开始 | 0 / 93 | 先 es31/fr34/pt28，后 hi40 |
| T2 定义句 | seo-geo-main | 待开始 | 0 / 93 | 与 T1 同批 |
| T3 H2 问题化 | 头条分析线 | 待开始 | 0 / 40 | |
| T4 en 首段答案化 | seo-geo-main | 进行中 | 1 / 21 | ISO 9001 篇已完成 |
| T5 标准/来源 | 待认领 | 待开始 | 0 / 96 | std76 + src20 |
| T6 入链 | 待认领 | 待开始 | 0 / 29 | |
| T7 去重 | 待认领 | 待开始 | 0 / 134 | |
| T8 zh 补齐 + 新文 | 待认领 | 待开始 | 27 / 80 | |

## 9. 变更登记

- 2026-11-25 20:20 建立本文件。数据取自当日 20:16 周报与语种抽查；确认全部在途改动已上线（`origin/main == HEAD`）。
