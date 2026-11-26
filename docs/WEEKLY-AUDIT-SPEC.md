# SEO/GEO 周检规范（weekly-audit）

> 一条任务、一周一次、只读。检查项、阈值、处置动作都写死在这里；脚本实现是 `scripts/weekly-audit.sh`，任务标签 `com.tradego.weekly-audit`。

## 一、什么时候跑、跑完在哪看

- **时间**：每周日 17:00（本机 PST）= **每周一 09:00（CST）**，开机错过由 `com.tradego.boot-check` 补跑。
- **产物**：`docs/reports/weekly-<日期>.md`，同时覆盖一份 `docs/reports/weekly-latest.md`；日志 `logs/weekly-audit/<日期>.log`。
- **退出码**：`0` 无问题、`1` 有 P1、`2` 有 P0。P0/P1 会弹 macOS 通知。
- **判活**：`launchctl print gui/$(id -u)/com.tradego.weekly-audit` 看 `runs` 与 `last exit code`。

## 二、检查什么（7 组）

| # | 组 | 检查内容 | 通过标准 | 红灯（P0） | 黄灯（P1） |
|---|---|---|---|---|---|
| 1 | GSC 读数 | 快照是否在 8 天内；索引数、未收录数、点击、展示、CTR、均排、sitemap 条数、结构化报错数 | 快照 ≤8 天且索引未明显下滑 | 快照缺失/过期 → 本项**无法评估**（不算 P0，但必须补数） | 索引周环比 −5% 以上；未收录 +10% 以上 |
| 2 | 站点技术 | 12 个代表页：HTTP 200、title ≤60、desc ≤155、canonical 自指、hreflang ≥10、robots 含 `max-image-preview:large`、无 meta keywords、JSON-LD 顶层类型对；`/industry/<slug>/` 无前缀必须 308 | 全部通过 | 任一项 FAIL | title 58–60、desc <70 字（接近边界） |
| 3 | 内容 | `content_gate --brief` 的 BLOCK 数、模板文占比、语种混排、金额断言、新鲜度 | BLOCK=0 | — | 出现任一 BLOCK；模板文 >10 篇 |
| 4 | GEO | `geo_audit` 均分与 Top5 弱项、`check-geo-readiness` 就绪度 | 均分 ≥75 | 均分 <60 | 均分 60–70 |
| 5 | 合规 | `check-claims`、`check-cert-claims`、`check-money-claims`：认证、价格、地域三类表述 | 全部通过，且无新增红点 | 出现「已持有 ISO/CE/SABS」类表述 | 存量红点未减、或新增价格/地域违规 |
| 6 | 上线与预算 | 未推提交数、工作区脏文件数、当日真实构建数、保留部署数、`vercel-audit` 连续失败次数 | 构建 ≤3/日、保留 ≤3、连续失败 0 | 保留 >3 或 CLI 直推 >0 | 未推提交 >200；脏文件 >20；连续失败 ≥2 |
| 7 | 行动清单 | 把上面所有 FAIL/WARN 汇总成 P0/P1/P2，并给定位命令 | — | — | — |

## 三、发现问题怎么办（处置矩阵）

| 级别 | 时限 | 谁做 | 具体动作 |
|---|---|---|---|
| **P0** | 当天 | 助手自动判断 + 直接修，修完汇报 | ① 站点 5xx/技术复核集体 FAIL：先查是「没上线」还是「上线回归」——`git log origin/main..HEAD` + Vercel 最新构建 sha；没上线就等预算，回归就回滚到上一部署（`vercel rollback`，不新增构建）。② 保留部署 >3：`bash scripts/vercel-prune.sh --apply`，20 秒后二次复核（CANCELED 记录会延迟生成）。③ 出现「已持有认证」表述：立即改回「按 SABS 1195/DIN/ISO 生产」或「证书按订单要求提供」，三处同步（站点 UI、`public/llms.txt`、社媒事实卡），再跑 `check-claims.py`。④ GEO <60：先补首段自证与实体密度，不动结构。 |
| **P1** | 本周内 | 助手排期改，改完重跑周检复验 | ① 标题/描述超长：按 `seo-geo-site-spec` 的 02 页面规格改模板，`clampDescription(155)`，改完跑 `tsc`。② 内容 BLOCK：按清单逐条修，`content_gate.py` 复验；改文章后再跑 `check-body-lang`。③ 未推提交 >200：并成一次上线包，走 `vercel-promote.sh`，一日只推一次。④ 索引下滑：先看 GSC 是「已提交未索引」还是「已索引被剔」，前者补内链/改薄页，后者查 canonical/重复。 |
| **P2** | 记录观察 | 只写进报告，不动作 | CTR 低、均排 13 名以后、模板文缓慢增加、GSC 快照 5–7 天未更新。连续两周同项 P2 → 升级 P1。 |

**红线（任何情况都不自动做）**：不改文章正文、不 push、不新增部署、不删 GSC 数据、不改 DNS、不动 `proxy.ts` 中间件、不关闭任何人的 task space。

## 四、特殊情形

1. **GSC 快照过期**：报告里标「无法评估」，并提示在会话中说「抓一次 GSC」，由助手用 Ego 浏览器取数后覆盖 `data/gsc-snapshot.json`（结构见该文件 `note`）；覆盖前把旧文件另存为 `data/gsc-prev.json`，周检会自动显示索引/未收录的环比。
2. **当天预算已被用尽**：技术复核 FAIL 但线上是旧构建时，不要改代码，先判「未上线」，等次日 00:00 后一次性推。
3. **B 线正在写内容**：周检只读，不会和写入冲突；但若 `git status` 显示大量 `content/articles/*.json` 为 M，属正常，报告里注明「B 线在写，不视为脏文件异常」。
4. **周检自身失败**（脚本报错/超时）：`last exit code` 非 0/1/2 时按故障处理，先看 `logs/weekly-audit/<日期>.log`；连续两周失败视为 P0。

## 五、维护

- 改阈值只改本文件 + `scripts/weekly-audit.sh` 里对应判断，两边必须一致。
- 新增检查项先加进本文件的表格，再加脚本，最后在 `docs/TASKS-AND-SKILLS-2026-11-26.md` 登记。
- 本任务与 `com.tradego.vercel-audit`（每 6 小时，只管 Vercel 合规）分工：Vercel 合规高频兜底，周检做全量 SEO/GEO。
