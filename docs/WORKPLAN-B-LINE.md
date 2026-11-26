# B 线工作排期（owner：今日头条分析线）

> **本文件是本线唯一排期，任何对话接手 B 区都从这里开始。**
> A 线（seo-geo-main）的排期是 `docs/SEO-GEO-WORKPLAN.md`，分区清单是 `docs/seo-geo-main-owned-40-2026-1125.csv`。
> 本文件不覆盖 A 区，也不修改 A 线的排期文件。

---

## 0. 现状快照（2026-11-25 23:55 CST）

| 项 | 值 |
|---|---|
| 半译欠账 | **约 340 节 / 58 篇 / 4,900 英文词**（口径命中里含出处刊名与术语括注，需人工分三类） |
| 语种分布 | ja 1,695 / ru 1,240 / hi 857 / zh 796 / ar 657 |
| 分区 | A 区 39 篇（不碰）｜B 区 225 篇（本线） |
| 闸门 | `content_gate.py` 的 `body_lang_gate` 已上线（增量拦截，基线 = origin/main） |
| 已清完的篇章 | 16 篇（见 `docs/T9-REPORT-B-2026-1125.md` §1、§5） |
| 推送 | 本线**只 commit 不 push**；`~/AgentOps/bin/content-push.sh` 在北京 00:00 统一推 |

口径（务必用这个，别用"拉丁词总数"）：剥 HTML 标签 → 按非 ASCII 字符切段 → 只算连续 ≥4 个非代码英文词。

### 0.1 FAQ 语种覆盖快照（2026-11-25 23:55 CST，全部 `faq_audit.py` 实跑）

| 项 | 值 |
|---|---|
| FAQ 文章 / 问答条数 | 257 篇 / 959 条 |
| 有语种缺口的文章 | **220 篇**（B 区 190｜A 区 30） |
| **zh** | **B 区 0 篇（本轮已清零，补 101 篇 / 361 条）**；全库剩 13 篇，全在 A 区名单，归 seo-geo-main |
| 其余语种（B 区篇数） | hi 189 ／ ru 179 ／ es 178 ／ fr 177 ／ de 177 ／ pt 176 ／ ar 174 ／ ja 163 |
| 问句异常 | 0 条 |
| 本轮提交 | 102 个 `content(T9b)` 提交，全部单文件、全部在 B 区 slug；未 push |

- 下一轮起 B 区只剩 8 个语种，按缺口量从 hi 开始，一个语种按本轮"10 批 × 10 篇"的并行节奏约 50 分钟收口。
- 存量隐患（**已收口，见 §0.2**）：14 篇共用的"五项预防措施"中文答案已于 11-26 拆写为各篇专属版本。

### 0.2 两项遗留收口（2026-11-26 00:20 CST，全部实跑）

| 项 | 值 |
|---|---|
| 14 篇共用答案 | 拆写完成：221–259 字（均值 249）、中文占比 71–80%，五条要点齐、切入点按篇不同；顺带修 14 条"英文标题直插中文问句"的脏问句 |
| 去重指标 | 12 字片段跨页重合 11 处、10 字 30 处（剔除 SGS/BV/Intertek/ISO 9001 后）；拆写前是 14/14 逐字相同 |
| rivets 乱码 | `CherryMAX or Av奈 rivets` → `CherryMAX or Avdel rivets`（`ebc0187d`，单行，残留 0；中文侧未动） |
| 提交 | **26 个单文件提交**（14 篇 25 个 + rivets 1 个），含"初版 → 润色"两层；只 commit 未 push |
| 闸门 | `content_gate --slug` 14/14 通过；`check_item <slug> 2` 14/14 OK；`check_zh` 全库 97 → 84 FAIL（零新增）；`faq_audit --brief` 缺口 220 篇 / 问句异常 0 |
| 语种键集合 | 基准 `5e89e009` 逐条对比：14 篇 + rivets 全部 SAME，无丢键 |
| 下一批同类对象 | 这 14 篇 FAQ 第 1、3 条（失效模式 / 失效成本）同属模板：中文直插英文标题，答案里是跨页复用的"60% 以上""28 万–1,150 万美元"模板数字，共 28 条，按"一篇一答案"重写（数字不可沿用，改定性表述） |
| 经验 | 130 拆写去重判据 / 131 FAQ 问句与答案同改 / 132 乱码品牌词定名（本线预约 130–134，本次用 130–132） |

### 0.3 hi 补齐收口 + 下一语种排序（2026-11-26 01:45 CST，全部实跑）

| 项 | 值 |
|---|---|
| hi 完成 | **193 篇 / 728 条**（冻结名单 190 篇 / 713 条 + 收尾新文章 3 篇 / 15 条）；**198 个单文件提交**（5 篇措辞/长度修订二次提交） |
| hi 闸门 | `check_hi.py` 193/193 OK；`content_gate --slug` 193/193「没有新增 BLOCK」；`faq_audit --brief` FAQ 257 / 缺口 **211** / 问句异常 0；normalize 清掉假 hi **0 条** |
| hi 质量 | a.hi 长度 min 110 / 中位 258 / max 450；天城文占比 71%–100%；连续拉丁词 ≤3 |
| 中文去模板化 | 14 篇 × 第 1、3 条 = **28 条**，字数 164–237、中文占比 85–92%，模板数字零残留，12 字跨页重合 **0 处**；`check_item` 42/42 OK；第 2 条逐字节未动 |
| 提交 | 本轮 **212 个提交全部单文件**（198 hi + 14 `fix(zh-faq)`），未 push；撞 `.git/index.lock` 6 次全部 2 秒重试通过 |
| 键集合 | 基准 `b50884e6` → HEAD：190 篇 **0 处删键**，新增 q.hi 705 / a.hi 700 槽位（余 8/13 为存量） |
| 跨页重复 | 12 字窗口 ≥5 条 802 处 = 术语共用（`गैल्वनाइज़्ड`/`स्पेसिफिकेशन`）；词级 6-gram ≥15 条 **0 处**、≥10 条 2 处（合规认证句）→ 模板级复用为零 |
| 口径修正 | hi 补齐按"q 或 a 缺"扫（`missing_locales` 只认 q，少算 1 篇）；`faq_audit` 只认 257 篇（FAQ 标题非 FAQ 命名的文章不计），全站实扫 279 篇；批次名单会过期，收尾必须全站重扫（经验 148/151） |
| B 区剩余（按缺口篇数） | **ru 179 > es 178 > fr 177 = de 177 > pt 176 > ar 174 > ja 163**，合计语种-篇缺口 **1224**（上轮 1413，减掉的 189 即 hi） |
| 下一轮建议 | **先 ru**（西里尔判据 U+0400–U+04FF，可直接复用 `check_hi.py` 改字符集，normalize 判据同构，10 篇/批、5 并发）；**ar 单独立规**（RTL + `؟` 问号判据要扩）；ja/de/fr/pt/es 可合并一轮低风险跨语种批次 |
| 经验 | 148 q+a 双判缺口 / 149 normalize 删伪翻译 + 整文件回写验 drift / 150 天城文不能用中文字窗口判重 / 151 FAQ 口径差 + 批次过期重扫 / 152 五并发单文件提交纪律（133–147 已被 A 线占用，本线原预约 135–139 让出） |


### 0.4 ru 补齐收口 + 判据修正 + 去模板化（2026-11-26 05:30 CST，全部实跑）

| 项 | 值 |
|---|---|
| ru 完成 | **180 篇 / 663 条**（冻结名单 178 篇 / 655 条 + 自写样板 2 篇 / 8 条），18 批、5 并发、跑完即补派；本轮 ru 相关**单文件提交 246 个**，未 push |
| ru 闸门 | `check_ru.py` 逐批全 [OK]；`content_gate --slug` **220 / 220「没有新增 BLOCK」**；normalize 清掉假 ru **0 条**；q.ru 8–70 字符、a.ru 120–450 字符、西里尔 73%–99% |
| B 区 ru 缺口 | **3 篇 / 20 条**（`africa-fastener-market-opportunities-2026` 7、`china-fasteners-zimbabwe-procurement-guide` 6、`ghana-fastener-market-guide` 7）——这 3 篇被别线在途改动，本轮跳过，等文件干净后补一批；全库 ru 覆盖 **918 / 1063 条**（A 区 33 篇 125 条仍归 A 线） |
| `faq_audit` 修正 | `faq_sections()` 改"section 带 `faqItems` 即算"，**FAQ 文章 257 → 279**（与独立遍历一致），docstring 写明口径变更；`--brief` 279 / 缺口 **220** / 问句异常 **0**；`--csv` 重生成（279 行） |
| 口径影响 | B 区缺篇全量重算：**ru 180**(旧 179) / fr 180 / es 179 / de 179 / pt 179 / ar 176 / ja 165，合计 **1061**；全站 ru 36 / de 213 / es 204 / fr 204 / pt 203 / ar 201 / ja 193 / hi 35 |
| 去模板化 | 40 篇 / 120 条（A 13 篇 39 条 + B 13 篇 39 条 + D 14 篇 42 条）+ botswana 11 槽重写；**词级 6-gram：≥15 条 0 处**（首轮 16 处）、10–14 条 1 处（认证口径句 `сертификаты предоставляются по запросу к заказу`，合规模板允许） |
| hi 补丁 | `lock-nuts-flange-nuts-vibration-proof-guide` #2 的 a.hi 115 → **253** 字符（补采购判断句 + 落地动作，不加数字）；另发现全库 **19 条** a.hi <120（6 条占位句直译 + 13 条事实短答），列下轮 hi 润色 |
| 键集合 | 基准 `b50884e6` → HEAD，206 篇比对：180 篇有变化、**丢失键 0**（1336 条 diff 行全部 `-[]`） |
| 下一轮排序 | **ar 单独一轮**（176 篇，RTL/`؟` 判据 + 禁他语种混入，样板 2 篇、并发 3）→ **es/fr/de/pt 合并一轮**（179/180/179/179，拉丁同族，每批按 ×4 语种重新装箱成 6–8 篇）→ **ja 单独收尾**（165 篇）→ 那 3 篇在途补齐（20 条） |
| 经验 | 163 俄语外壳双判（西里尔占比 + 拉丁串，normalize 挡不住哈萨克占位/英文壳）/ 164 非中文语种只认词级 6-gram / 165 stub 只能贴主题重写 / 166 `faq_audit` 按 faqItems 识别 / 167 `create_agent` 的 subtask 偶发不落要 `send_message` 补发（本轮预约 163–167，落笔前 grep 确认 162 为最大号） |

---

## 1. 五条铁律（接手的人先背这五条）

1. **不进 A 区。** 先查 `docs/seo-geo-main-owned-40-2026-1125.csv`，命中即放手，并在报告里点名给 A 线。
2. **整段替换，不按前缀/后缀切。** 原段是"半句本地语 + 半句英文"时，按句首切必留残句，且自动检查全绿查不出来（经验 74/75）。
3. **一篇一锁，一次做完整篇。** `article-claim.py claim <slug> 今日头条分析`（TTL 30 分钟）→ 该篇**所有**非拉丁语种节一起改 → 提交 → `release`。别按清单条数打勾（经验 71）。
4. **三条口径不破：** 认证只写"按 SABS 1195/DIN/ISO 生产"或"证书按订单要求提供"；单证以站内 `/documents` 页为准；地域只写 China（含非拉丁写法），批量替换后查"中国中国"这类残句。
5. **不整目录提交。** 工作区常有 A 线在途文件（`next.config.ts`、`docs/SEO-GEO-WORKPLAN.md`、`scripts/vercel-*.sh`、部分 `content/articles/*.json`）；只 `git add <具体路径>` + `git commit -- <同一路径>`。

---

## 2. 推进顺序（按 backlog 头部往下，不跳）

| 优先级 | 判据 | 动态取清单 |
|---|---|---|
| **P0′** | **FAQ 语种覆盖补齐（GEO 最大空白）** | `docs/faq-native-gap-2026-1125.csv`（220 篇缺口，B 区 190）。**zh 已于 11-25 23:55 全部清零**，下一语种 = hi（B 区 189 篇），再 ru 179 / es 178 / fr·de 177 / pt 176 / ar 174 / ja 163。注：`empty-sections-2026-1125.csv` 里 239 个空节已核验**全是 FAQ 引导句，无害**，不要派人补正文 |
| P0 | 单节 >40 英文词 | `python3 scripts/lang_mix_audit.py --min 40` |
| P1 | 20–40 词 | `--min 20` |
| P2 | <20 词（收尾） | 全量 CSV |

- **模板文优先**：对比表类模板（第 2 栏头塞英文合成产品名、单元格留 `Moderate`/`Low (uncoated)`/`4-6 weeks`）用 `scripts/fix_compare_template.py` 一条命令清 57 节，先 `--slug X --show` 看一篇再 `--apply`。
- 清单文件：`docs/lang-mix-backlog-2026-1125.csv`（列 `slug,section,lang,latin_words,chars,sample`，按词量降序）。
- **A 区 `tunisia-mediterranean-fastener-export-guide`（6 节 / 约 1.5k 词）永不在本线队列里**，它是全库最脏单篇，归 A 线。
- 每清完一篇，跑一次 `lang_mix_audit.py` 记新总数，写进本文件 §0 与 T9 报告，别靠嘴记。

---

## 3. 单篇作业流程（照抄即可）

```
# 1 领锁
python3 scripts/article-claim.py claim <slug> 今日头条分析

# 2 摸清该篇底数（不要只看清单里被点名的那一节）
python3 scripts/check-body-lang.py --slug <slug>
python3 scripts/lang_mix_audit.py | grep <slug>

# 3 读原文，先判结构再翻
python3 -c "import json;d=json.load(open('content/articles/<slug>.json'));print(len(d['sections']));print(d['sections'][N]['body']['<lang>'])"
```

- 结构有毛病的**先重构再译**：内容串到别的节（成本塞进供应商节）、两节逐字重复、碎 `<br/>` 列表。译完再改结构等于翻两遍（经验 72）。
- 重写必须是**整节整段纯目标语言**，`<p>` 分段；标准号/牌号/单位/内链原样保留；不新增报价数字，不把认证写成已持有。
- 段落化与半译修复**合并成一次动作**（T1 的段落化不要再单独碰同一节）。

```
# 4 验收 → 5 提交
python3 scripts/check-body-lang.py --slug <slug>      # 期望 english 0 / script 0
python3 scripts/content_gate.py --slug <slug>          # 期望"闸门通过"
git add content/articles/<slug>.json
git commit -m "content(T9b): <篇> <语种>§N 重写" -- content/articles/<slug>.json
python3 scripts/article-claim.py release <slug> 今日头条分析

# 回写一律走 json_rewrite，按 git HEAD 缩进落盘（否则整文件重排）
python3 -c "import sys;sys.path.insert(0,'scripts');import json_rewrite as jr;d=jr.load(p);...;jr.dump_same(p,d)"
```

提交前**打印接缝**：`print(body[i-160:i+60])` 看有没有残句或重复短句。

---

## 4. 验收链

- 单篇：`check-body-lang.py --slug` → `content_gate.py --slug`（含 `i18n_gate` + `body_lang_gate`）。
- 动了站点 UI 文案或 `public/llms.txt`：追加 `python3 scripts/check-claims.py`（`content_gate` 不覆盖这两处）。
- 批量收工（每 10 篇或每晚一次）：`content_gate.py --brief`、`check-template-filler.py`、`check-money-claims.py`、`check-geo-readiness.py`、`dup_audit.py --top 8`。
- `scripts/geo_audit.py` **归 A 线**，本线不改、不跑它的口径。

---

## 5. 与 A 线的接口

- 挂起未决（等用户拍板，已挂给 A 线）：① 非英语页缺本地 FAQ 时是否输出 FAQPage；② `page.tsx:40` 的 `slice(0,55)` 是否按语种调整。
- `docs/SEO-GEO-WORKPLAN.md` 属对方文件，**带未提交改动时不要碰、不要提交**。本线状态只写 `docs/T9-REPORT-B-2026-1125.md`。
- `docs/internal-link-plan-2026-1125.csv` 与排期引用的 `orphan-backlog-2026-1125.csv` 文件名不一致，未确认以哪个为准。

---

## 6. 每日节律

1. 开工先 `git status -sb`：确认在途文件里没有别人的改动要误提交。
2. `lang_mix_audit.py` 取当前总数，与本文件 §0 对齐（差太多说明有人动过库）。
3. 按 §2 顺序做 3–5 篇，逐篇走 §3，别攒着不提交。
4. 23:50 前收工：该 commit 的 commit 完，`git status` 只剩 A 线在途文件。
5. 00:00 `content-push.sh` 推送；次日先看 `~/AgentOps/logs/content-push.{out,err}.log` 和 08:30 的 Vercel 审计结果，再决定是否新开一批。

---

## 7. 经验索引（`docs/CONTENT-CONTRACT.md`）

70 半译要靠 token 比例量 / 71 修一篇要看全篇 / 72 先重构再译 / 73 闸门写增量 / 74 验拼接缝 / 75 按连续英文串量 / 76 字段语言别写错（script 计数会抓）/ 77 半译节多半是"混排+碎列表"一次收成段落 / 78 回写别引重复标签。

### 0.5 T9i 轮（2026-11-26）收口后的排期与不变量

**本轮做了什么**：落 A/B 边界共识 `docs/LINE-DIVISION-2026-1126.md`（R1–R9）；3 篇 ru 缺口按在途登记未碰；B 区 hi 短答 14 条 / 11 篇回补到 317–448 字符；B 区 ar 从 **212 篇 / 757 条** 收到 **4 篇**（全为在途阻塞）；交期答句 17 篇去模板化（6-gram ≥15 由 4 处归零）；六项终验全跑完；经验 176–180；CSV 重生成。

**当前缺口（CSV 口径，`docs/faq-native-gap-2026-1125.csv`）**

- 全库：`{zh:19, ru:58, ar:26, es:189, fr:189, de:214, pt:190, ja:192, hi:58}`（FAQ 文章 279、有缺口 223、问句异常 0）
- B 区（非 A 区 39）：`{es:171, fr:172, de:180, pt:172, ja:164, ru:24, ar:4, zh:15, hi:22}`

**下一轮顺序（建议不变）**

1. **先等 4 篇解阻塞**：`africa-fastener-market-opportunities-2026`（ar 7 / ru 7）、`china-fasteners-zimbabwe-procurement-guide`（6/6）、`ghana-fastener-market-guide`（7/7）三篇保护名单 + `drc-diamond-mining-fasteners`（ar 12，归属待确认）。判据：`git status` 变干净 + 已提交后才动，**不 restore、不 checkout**。
2. **ru 收尾**（B 区 24 篇，其中 20 条集中在上述 3 篇）+ **zh 15 篇 + hi 22 篇**，可合成一轮 3 语种小批。
3. **es/fr/de/pt**：B 区 171/172/180/172，四语种同族可合并一轮，每批 6–8 篇（4 语种 ×N 条）。
4. **ja 单独收尾**：B 区 164 篇，日文句法自成一套，放最后。

**硬不变量（每批开工先核）**

- 写锁 owner：B 线 = `今日头条分析`；**同 owner 可能有并行会话**，幂等按**逐条**判（经验 177）。
- 每批：claim → 重读磁盘 → 写 → 判据脚本 → `content_gate --slug` → 单文件 `add`+`commit` 同行 → release；撞 `.git/index.lock` 只等 2 秒重试，**不许删锁**（stale 由 organizer `mv` 留档，经验 176）。
- 只 commit 不 push；A 区 39 篇与别线在途文件（` M`）一律不 `add`、不改、不 restore。
- 交期/付款/MOQ 三类模板句按篇轮换句式，数字不动（经验 180），批量写完必跑 `dedupe_*`。
- 经验号段先 `grep` 再预约：本轮已占 **176–180**，下一轮从 **181** 起。

### 0.6 R-T9k 轮入口与顺序（2026-11-26 收口后）

**当前 B 区缺口（磁盘实跑）**：ru 30 / ar 32 / es 16 / fr 34 / de 27 / pt 41 / ja 21 / hi 10 / zh 0，合计 **211 条**；存量技术债 **519 侧次**（清单 `docs/faq-native-legacy-debt-2026-1126.md`）。

**建议顺序**

1. **先吃 5 篇冻结/在途**（等 A 线答复、`git status` 干净后再动，不 restore/checkout）：`africa-fastener-market-opportunities-2026` 7 条（ru/ar/es/fr/pt）、`china-fasteners-zimbabwe-procurement-guide` 6 条（ru/ar/fr/de/pt）、`ghana-fastener-market-guide` 7 条（ru/ar/fr/de/pt）、`drc-diamond-mining-fasteners` 12 条（ru 5 / ar 12 / de 5 / pt 12 / hi 5，归属待确认）、`malawi-fastener-market-case-study` 9 条（ru 5 / es 9 / fr 9 / de 9 / pt 9 / hi 5，ja 0）。
2. **malawi 各语种补齐**：es 9 / fr 9 / de 9 / pt 9 / ru 5 / hi 5；ja 按下轮扫描结果定（当前 0 缺口）。
3. **存量技术债分批**：按遗留债清单分类，先"答案超长 >450"（65 侧次）再"答案 <120"（61）；其后问句超长 84、纯度不足 29、简体专用字 14、异种文字/拉丁整句 227、金额/折扣/百分比 12、源文占位 22、源文错位/残缺/重复 5；hi 226 侧次多为口径收紧后暴露，非上一轮写坏。
4. **ja 产地口径统一**：把「出荷元・供給元・海外」改写为「中国を出荷元とする」类表述；涉及条数未逐条统计，开工前先扫描 ja 答案定位。
5. **pt/ja 去重新增项改写**：pt 2 处 ≥15 占位句回显片段；ja 144 处礼貌收尾套话 8-gram，按多套尾句轮换拆解。

**硬不变量**：沿用 §0.5——写锁 owner `今日头条分析`、逐条幂等、单文件提交、只 commit 不 push、不碰 A 区 39 篇与 ` M` 在途文件；经验号段本轮已占至 **202**，R-T9k 从 **203** 起。

### 0.7 R-T9l 轮收口与 R-T9m 入口（2026-11-26）

**本轮做法（一轮做完）**：按 GSC 官方口径先扫描出数（五组、7 份台账 CSV）→ 再按 P0/P1/P2 分级整改 → 收尾全量复跑。方案正文 `docs/GSC-CONTENT-REMEDIATION-B-2026-1126.md`，执行细节 `docs/T9-REPORT-B-2026-1125.md` §16，交 A 线项 `docs/HANDOFF-TO-A-LINE-2026-1126.md` §10。

**收口状态**：起点 `8bbedfa5`；本轮 `T9l-*` 提交 376 笔（lang 168 / debt 145 / dup 60 / s1 2 / s2 1），涉及 185 篇；全部单文件、全部过 `content_gate`、全部未 push；写锁收尾为空；A 区 39 篇交集 0。

**B 区可改队列已清零**：跨篇重复 rewrite（127→0 组）、ar 三组（111/229/20→0/0/0，A 区 a>450 122 只登记）、title>70（B 22→0，余 1 条 A 区 ru 75）。

**存量债（起点快照 vs 当前逐条比对）**：fixed 超长 241 / 短答 406 / 残留 162，合计 **809 侧次 / 190 篇次**；剩余超长 B 187、短答 B 600、残留 B 88。

**R-T9m 建议顺序**

1. **先清"可 clean"残留 7 行**（6 个篇-语种组合：`africa-railway-modernization-fastener-demand` ja 2、`gaskets-specialty-washers-high-temp-guide` ja meta、`marine-fasteners-guide` ja meta、`non-standard-special-shape-screws-custom-guide` ja meta、`rwanda-construction-fastener-market-2026` hi a#9、`zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance` ja a#1）。
2. **再解 19 个冲突 slug 的锁**（128 行 `prose_residue` 卡在这里）：按 `docs/gsc-lang-residual-b-2026-1126.csv` 的 `slug` 汇总，逐篇与持锁线打招呼后再动，禁硬上他线 ` M`。
3. **超长 pending 187**：`zambia-copper`(26)、`ethiopia-industrial-park`(42)、`zimbabwe-b2b`(29) 按 15 条/批闭环，单篇超 30 条拆两轮；其余按语种 es/fr/pt 为主。
4. **短答 600 条**：先定 **zh 下限口径**（现 120 字符；470 条"紧凑中文"落在 80–120）——放宽到汉字 ≥80 还是 130–180 需用户拍板，定了再批量补写。
5. **金额/百分比 439 条**：等 G 类源文金额线统一口径，**不在内容层就地改**，避免半改再制造纠缠。
6. **合规红点 B 区 96 篇**：认证（64 篇/132 行）→ 地名（2/2）→ 金额（44/44），顺序不可倒；认证文案只写「按 SABS 1195/DIN/ISO 生产」或「证书按订单要求提供」，改完跑 `scripts/check-claims.py`。
7. **设计性 noindex 246 个"篇×语种"页**：等 A 线技术判断（扩写 vs 收缩索引），扩写优先级 zh 62 / ja 41 / ar 36 / hi 35。

**硬不变量（延续）**：写锁 owner `今日头条分析`（TTL 30 分钟）；`git add <单文件> && git commit -F <msg文件> -- <单文件>`，禁 `-F -`、禁 `add -A/-a`、**禁共享索引下 `--amend`**、禁 reset/rebase/restore/stash；只 commit 不 push；不碰 A 区 39 篇、`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`、`src/**`、他线 ` M` 在途文件；批量改写只按 `(slug, section, item, locale)` 精确写键并断言 `en` 未变（经验 210）。

**经验号段**：本轮占 **207–211**（已写入 `docs/CONTENT-CONTRACT.md`）；R-T9m 开工前先 `grep` 复核最大号，从 **212** 起。

### 0.8 R-T9m 轮收口与 R-T9n 入口（2026-11-26）

**本轮用户拍板三口径（生效，不再回问）**：① zh 短答下限 = 汉字 ≥80 且总字符 ≤450；② 红点顺序 认证 → 地名 → 金额，金额只改"我方报价口吻"（行情/项目数字保留 + 注口径与时间）；③ A 区一律不碰（含 A 线跨区补进 B 区的 `ar`）。

**收口状态**：起点 `a9f4c356`；本轮 `T9m-*` 提交全部单文件 pathspec、全部过 `content_gate`、全部未 push。执行细节 `docs/T9-REPORT-B-2026-1125.md` §17，跨线通道 `docs/TWO-LINE-SYNC-2026-1126.md`（`c95433c0`）。

**九项验收（`$T9M/verify9.py` 一键复跑）**：见 §17-8 表。达不到零的项已给逐条剩余清单与阻塞原因（核心阻塞是 5 篇工作区长期未提交的在途文件）。

**R-T9n 建议顺序**

1. **先解 5 篇在途文件**（`africa-fastener-market-opportunities-2026`、`china-fasteners-zimbabwe-procurement-guide`、`drc-diamond-mining-fasteners`、`ghana-fastener-market-guide`、`malawi-fastener-market-case-study`）：先在 `TWO-LINE-SYNC` §3 与 A 线确认归属；**确认无主后**按「备份 patch → 校验 `content_gate`/`check-claims` → 单文件 commit 或 revert 后重做」三选一，禁直接 `git checkout --`。这 5 篇一解，超长 19 / 短答 55 / 拉丁 3 / 占位 1 条债随之清零。
2. **body 整段散文 17 单元**：按语种整段重译（事实、数字、`[n]` 引用、href 全保留）。清单 `$T9M/batch3-body-r4-residual-list.csv`。
3. **ar 认证口径 96 篇 / 172 处**：归 ar owner 线，本线只在 `TWO-LINE-SYNC` §2 催办。
4. **翻译缺口**：`rwanda-construction-fastener-market-2026` hi/zh、`mozambique-lng-...-maputo` sec4 zh/ja/hi —— 由补译线补齐后再核认证/金额口径，本线不补造数字。
5. **金额尾项**：仅剩 ar（登记）；`uruguay` 类新篇若上线，金额口径照 §17-4 三分法执行。

**硬不变量（延续 + 本轮新增）**：
- 写锁 owner `今日头条分析`（TTL 30 分钟）；`git add <单文件> && git commit -F <msg文件> -- <单文件>`；禁 `-F -`、`add -A/-a`、共享索引下 `--amend`、reset/rebase/restore/stash；只 commit 不 push。
- **新增：提交前必查暂存区**（`git diff --cached --name-only`，出现非本篇文件先 `git restore --staged <该文件>`）——`git commit -- <pathspec>` 并不能阻止索引里其它已暂存条目被一并提交（本轮 `72b63d9a` 事故根因）。
- 多批并行时，同一篇以 **claim 锁**为唯一排序器：领不到就登记 `held`，不硬写、不删锁、不代释放别线锁。
- 不碰 A 区 39 篇、`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`、`src/**`、他线 ` M` 在途文件。

**经验号段**：本轮占 **212–217**（已写入 `docs/CONTENT-CONTRACT.md`）；R-T9n 开工前先 `grep` 复核最大号，从 **218** 起。

### 0.9 R-T9n 轮收口与 R-T9a 入口（2026-11-26）

**收口状态**：起点 `95a87699`；本轮 `T9n-*`（ar/5files/trans/docs/CSV 全系列）98 笔单文件提交，全部本地未 push；累计 `a9f4c356..HEAD` **727 笔**。执行细节 `docs/T9-REPORT-B-2026-1125.md` §18；跨线通道 `docs/TWO-LINE-SYNC-2026-1126.md` §6-B（决议）+ §6-C（结果）。

**十项验收**：见 §18-6。超长 / 短答 / 占位 = 0，新增 BLOCK 0，键删除 0，锁 0；拉丁 13 全部 keep_proper。**B 区可清债归零**。

**跨线状态（A 线侧未闭合项）**
1. §6-B.5 五项回填：① 它所说"B 线 12 篇未提交"的 slug + `git status`；② C2 是否保留港口名（保留须给模板）；③ 减页 slug 清单；④ 需 B 线做的 B 区 body 改造清单；⑤ 4 篇已改篇目 diff 确认。
2. A 区 `ivory-coast-abidjan-port-fastener-tariff` 的 `cta/text.ar` 我方产品自证句，本轮已书面请 A 线改。
3. `china-hex-nuts-manufacturer` 的 `metaDescription.ar` 保留判断待 A 线确认（目录筛选语境，B 线不回写）。

**下一轮（R-T9a）建议顺序**
1. **body 改造**：只做 §6-B.5 第 4 项清单里的 B 区篇目；逐篇领锁、按区归属，A 区 39 篇不碰。清单未到就空转，不要自造范围。
2. **A 区 ar/CTA 登记项**：等 A 线改完后复核一遍（`china-iso-9001-*`、`beira-corridor`、`rwanda-construction-fastener-standards`、`ivory-coast`），只核不改。
3. **减页清单落地后的连锁**：清单发布 → 该篇 48 小时内不补语种；若已补，登记作废不删除（保留可回溯）。
4. **存量短译壳**：`rwanda-construction-fastener-market-2026` 其余章节、`mozambique-lng-construction-fasteners-standards` 的 zh/ja 仍为短译壳（本批外），按语种整段重译再收。

**硬不变量（延续）**：写锁 owner `今日头条分析`（TTL 30 分钟）必领必释；单文件 `git add <文件> && git commit -F <msg> -- <文件>` 同行；提交前查暂存区；禁 `-F -`、`add -A/-a`、reset/rebase/restore/stash、共享索引 `--amend`；只 commit 不 push；不碰 A 区 39 篇、`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`、`src/**`、他线 ` M`。

**经验号段**：本轮占 **218–223**；下一轮开工前 `grep` 复核最大号。
