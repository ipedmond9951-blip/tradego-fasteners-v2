# R-T9r 执行计划（2026-11-27）

> 写入 10:40 CST（段一只读阶段）；提交随 11:30 解除冻结统一落盘。基线 HEAD `0305aa98`（§10）。
> 三段：08:05–08:55 只沟通+只读 → 09:00–11:30 停写只监控 → 11:30–19:00 开工、19:00 收口、19:30 冻结。

## 0. 时点与实际时钟的偏差（必须记）

用户口径"现在 08:05"，但机器实测开工时已是 **10:06 CST**（PST 18:06）。段一（沟通+只读）已整体落在 A 线 09:00–11:00 构建窗口内，因此段一执行时**本来就没有 content 写入**，冻结承诺未被破坏；段二相应压缩为 10:06–11:30 只监控。

## 1. 段一只读盘点结果（两份，全部只读，未写 content、未 commit content）

| 口径 | 覆盖 | 均分 | 说明 |
|---|---|---|---|
| `check-geo-readiness` | 279 篇 | 90.5 | 含 A 区 39 / B 区 240 |
| `geo_audit` | 264 篇 | 84.2 | 差额 15 篇是 `redirectTo` 占位页（`score=null`） |

**五类缺口（实测与基线完全一致）**

| 类型 | 全库 | A 区 | **B 区** |
|---|---:|---:|---:|
| dup | 122 | 15 | **107** |
| entity | 75 | 7 | **68** |
| std | 34 | 1 | **33** |
| link | 24 | 10 | **14** |
| src | 20 | 1 | **19** |

分因主力（篇次，一篇可命中副因）：dup = 模板段 120 / 段落级复用 35 / 同字段长句重复 18；entity = 无人名机构名 70 / 无地名港口名 31 / 无型号族 26；std = 只写标准族 21 / 无标准号 13；link = 内链 0 条 14 / 1–2 条 10 / 锚粘连 5；src = 无来源句 18 / 有句无口径 2。

**关键安全边界**：`words_en < 1600` 的 15 篇**全是 redirect 占位页**，存活页 0 篇跌破；全库 words_en min 628（占位）/ 中位 1709。→ 删重复句目前**没有跌破 1600 的存量风险**，但本轮删句仍须先算余量。

**qh / FAQ 剩余**：B 区实问小标题 <2 的 **206 篇**；en FAQ 均长 <80 词的 **161 篇**（`faq_n=0` 为 0，B 区每篇都有 3–12 条 FAQ，只需补长不需新建）。

**复用槽**：上一轮台账 147 轻度槽，同口径复算 **126**（T9q 后文本变化所致）；抽检 20 槽（seed `20261127`）→ **整段复用 5 槽（25%）**，单句偶合 15。

**§8.4 九篇**：仅 `malawi-fastener-market-case-study` 工作树有他线未提交改动（本轮不动），其余 8 篇可排。

**A 线归属核验（按 `git show` 实测，不照抄 §9.5）**：heading/FAQ 已被 A 线改过的 11 篇（含 `solar-mounting-hex-bolt-solution-guide`、`tanzania-dar-es-salaam-port-fastener-import-procedure`、`gaskets-specialty-washers-high-temp-guide`），本轮 qh/FAQ 包一律剔除；仅 body 被 A 线重排的不受影响。

## 2. 段三工作包（5 包，56 篇，互斥，按优先级切好）

清单文件（绝对路径，派活时逐篇照此，不得自行扩包）：
`/Users/zhangming/Library/Application Support/Doubao/Profile 1/.doubao/agent_mode/workspace/.sessions/38456435872094466/agents/o_000i3yyv8sa/t9r/{w1_dup,w2_entity_std,w3_link_src,w4_qh_faq,w5_84_reuse}.csv`

| 包 | 篇 | 干什么 | 硬规则 |
|---|---:|---|---|
| W1 dup | 12（全 75 分、1640–1857 词、dup+entity） | 删同字段重复长句 + **等量替换**（工艺细节/检验方法/装柜单证/失败模式） | 删前算余量，删后 en ≥1600 词；跌破则留原句并登记；只前插或段尾追加 |
| W2 entity+std | 16（含 4 篇 ≥3 类缺口：binding-wire / roofing-vs-ibr / plastic-anchors / asphalt-flash-band） | 补可核实实体（真实地名/港口/机构/型号族）与标准号 | 只用本篇或同篇 en 已有事实；不确定只写标准族（N10），不造编号 |
| W3 link+src | 10 | 补正文内链（≥3 条、本语种路径、锚文本不粘连类目与日期）；src 补"口径句" | 不加装饰数字；来源句只写"按公开市场数据/按订单实测"这类可核口径 |
| W4 qh+FAQ | 14（73–75 分，普遍 2.2k–2.6k 词） | 1–2 个实问问句小标题（只 `heading.en`+`heading.zh`）+ en FAQ 补到 80–95 词 | 已 ≥80 词的不动；套壳问句不算；九语种标题零改动 |
| W5 §8.4+复用+railway | 4 篇 §8.4 + 整段复用篇次 + 1 篇 railway | §8.4 按缺口补；复用只修"≥2 篇整段逐字相同"；railway 三条 FAQ 按红线重写 | 价格只讲结构不讲数字；引用量/交期一律去数字化 |

**总量上限（自己控，做不完留清单）**：55 篇总上限；18:20 CST 停止开新篇，19:00 交账，19:30 硬冻结。每包 agent 在 19:00 前把"已做完/未做完 + 原因"逐篇回报。

**每篇五道闸**：`content_gate --slug` → `check-claims.py` → `check-body-lang.py --slug` → `geo_audit --slug`（不降）→ 批次级 `check-geo-readiness`（dup/entity/std/link/src 只许降不许升）。

**提交纪律**：写锁 `article-claim.py claim <slug> 今日头条分析` / release；单文件 `git add <path> && git commit -m "…" -- <path>` 同一行；禁 `-F -`/`add -A`/reset/rebase/restore/stash/`--amend`；撞 `index.lock` 等 2 秒不删锁；**不 push**；不碰他线 37 个 ` M`；不写 `docs/`（统一由我收口）。

## 3. 段二监控口径（10:06–11:30）

- 每 20–30 分钟读一次 `~/AgentOps/logs/content-push.log` 尾部与 `ps` 里有无 `next build`/`npm run build`。
- 发现 push 失败 / BLOCK / 构建报 JSON 错 → 写进 §10 并**不自行重推**，等 A 线处理。
- A 线若在 §10 回"已上线"，立即开工（早于 11:30 也可以，但必须先确认无 `next build` 进程）。

## 4. 收口产出

`docs/geo-debt-b-2026-1127.csv`（列：`type,slug,region,metric_before,metric_after,fixed,left_tail,commit`）；报告 §22；排期 §0.13；经验 241–246（含"构建窗口内冻结写操作""删重复句必须配等量替换""来源句不加装饰数字"）。

## 5. 六项验收（19:30 前跑）

1. dup/entity/std/link/src 的 B 区数值改前改后（107/68/33/14/19 → ?）
2. qh 与 FAQ <80 词剩余数（206/161 → ?）
3. 279 篇 `content_gate --brief` 0 BLOCK
4. en ≥1600 词篇数不减
5. 语种键删除 0、`faqItems` 多语种改动 0
6. 提交全单文件、锁 0、19:30 冻结达成

## 6. 执行变更（10:50 CST 记）

1. **段三提前到 10:50 开工**：依据 §10.1「A 线回构建已完成即开工」+ §11.3① 实测（本地 build 4,586 页 exit 0、HEAD gate 262/264 BLOCK 0、尚未 push），且 `ps` 无 `next build` 进程在跑。19:00 收口、19:30 冻结不变。
2. **W5 去掉 railway 一项**：A 线已整条重写其三条 FAQ（`ab027be0`，十语种去数字，新增「不得回写第 19 条」）。W5 保留 §8.4 四篇 + 整段复用 ≤8 篇次。
3. **范围互斥**：五包篇目互斥，W5 额外受四个清单排重约束；`malawi-fastener-market-case-study`（他线脏文件）全程不动。
4. **新增下轮线索（A 线 §11.5 移交）**：全库 96 篇 / 182 条 FAQ 答案含具体金额或交期间隔（判据 USD+数字、$+数字、N-M weeks/days/tons、N-M%），B 区部分归 B 线，建议每轮 20 篇；本轮不进。
