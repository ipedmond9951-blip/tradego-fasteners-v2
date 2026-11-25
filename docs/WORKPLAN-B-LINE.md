# B 线工作排期（owner：今日头条分析线）

> **本文件是本线唯一排期，任何对话接手 B 区都从这里开始。**
> A 线（seo-geo-main）的排期是 `docs/SEO-GEO-WORKPLAN.md`，分区清单是 `docs/seo-geo-main-owned-40-2026-1125.csv`。
> 本文件不覆盖 A 区，也不修改 A 线的排期文件。

---

## 0. 现状快照（2026-11-25 20:50 CST）

| 项 | 值 |
|---|---|
| 半译欠账 | **391 节 / 65 篇 / 5,950 英文词** |
| 语种分布 | ja 1,772 / ru 1,507 / zh 930 / hi 889 / ar 852 |
| 分区 | A 区 39 篇（不碰）｜B 区 225 篇（本线） |
| 闸门 | `content_gate.py` 的 `body_lang_gate` 已上线（增量拦截，基线 = origin/main） |
| 已清完的篇章 | 12 篇（见 `docs/T9-REPORT-B-2026-1125.md` §1） |
| 推送 | 本线**只 commit 不 push**；`~/AgentOps/bin/content-push.sh` 在北京 00:00 统一推 |

口径（务必用这个，别用"拉丁词总数"）：剥 HTML 标签 → 按非 ASCII 字符切段 → 只算连续 ≥4 个非代码英文词。

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
| P0 | 单节 >40 英文词 | `python3 scripts/lang_mix_audit.py --min 40` |
| P1 | 20–40 词 | `--min 20` |
| P2 | <20 词（收尾） | 全量 CSV |

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
