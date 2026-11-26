# 任务与技能归口（2026-11-26 重整）

> 本文是「谁在跑什么、为什么留、怎么恢复」的唯一台账。以后新增 / 停用任何 launchd 任务或技能，先改这里再动手。

## 一、结论



1. **内容日产三件套已停用**：`seo-master` / `seo-pipeline-guardian` / `seo-pipeline-watcher`。理由：全站 279 篇、4,480 条未收录 vs 1,272 已索引，策略明确「不靠新增页面增长」；三通道（OpenClaw 网关 / Codex CLI /ai-router 18800）当日全挂，guardian `last exit 3`，产出需返工（76 分）。

2. **过期一次性任务已移除**：`com.tradego.push-cert-clean`（2026-11-25 08:06 单次触发，已过期，`runs=0`）。

3. **部署保留数已回到 3**：今日实际构建 4 次（超预算 1 次），`vercel-prune --apply` 删 1 条，二次复核 3 条。`vercel-audit` 的 `FAIL(2)` 是**真实告警**（当日 = 4、保留 = 4），不是脚本故障。

4. **新增周检 `com.tradego.weekly-audit`**：每周一 09:00（CST）出一份只读体检报告，检查项与处置动作见 `docs/WEEKLY-AUDIT-SPEC.md`。
5. **技能从 24 个收到 16 个**：8 个被取代 / 重叠的技能移入归档（只移动不删除），4 个 SEO 核心技能职责单一化并互相加指针。

## 二、任务台账（TradeGo / AgentOps 范围）



| 任务                                                          | 调度（本机 PST）                   | 作用                                    | 处置                                  |
| ----------------------------------------------------------- | ---------------------------- | ------------------------------------- | ----------------------------------- |
| com.tradego.seo-master                                      | 11:30 每日 = CST 03:30         | 日产 1 篇（选题→写→审→配图→commit→deploy-flush） | **停用**，plist 归档                     |
| com.tradego.seo-pipeline-guardian                           | 12:00 每日 = CST 04:00         | 当日未上线则诊断重跑 + minimax 兜底               | **停用**（exit 3 每日失败）                 |
| com.tradego.seo-pipeline-watcher                            | 1800s                        | 巡检 + Telegram + 自动重启                  | **停用**（监控对象已停）                      |
| com.tradego.push-cert-clean                                 | 11-25 08:06 单次               | 清推送证书                                 | **移除**（已过期）                         |
| com.tradego.deploy-flush                                    | 1800s                        | 按预算把 commit 推上线                       | 保留（唯一上线路径之一，配合 `vercel-promote.sh`） |
| com.tradego.boot-check                                      | 1800s                        | 开机补跑错过的日历任务                           | 保留（关机跨点会永久错过）                       |
| com.tradego.faq-l10n                                        | 600s                         | FAQ 多语种小批磨工（B 线在用）                    | 保留                                  |
| com.tradego.daily-publish                                   | 09:00                        | 队列文章发布（`content/queue`）               | 保留（改由人 / Agent 放队列，不自动写稿）           |
| com.tradego.ga4-monitor                                     | 900s                         | GA4 异常监控（流量看 GA4，不看 Web Analytics）    | 保留                                  |
| com.tradego.vercel-alert                                    | 1800s                        | 部署 / 额度告警                             | 保留                                  |
| com.tradego.vercel-audit                                    | 21600s                       | 每日合规审计（部署数 / 保留数 / CLI 直推）            | 保留（告警语义正确；08:30 看结果）                |
| com.tradego.weekly-audit | 周日 17:00 PST = 周一 09:00 CST | SEO/GEO 周检（GSC / 技术 / 内容 / GEO / 合规 / 预算） | **新装**（只读；规范 `docs/WEEKLY-AUDIT-SPEC.md`，产物 `docs/reports/weekly-<日期>.md`；退出码 0/1/2 = 无问题 / 有 P1 / 有 P0） |
| com.tradego.social.tick                                     | 每 10 分钟                      | 社媒发布队列                                | 保留                                  |
| com.tradego.social-link-check                               | 17:05                        | 社媒链接死链检查                              | 保留                                  |
| com.tradego.ai-news-local                                   | 每小时 :10                      | 行业资讯                                  | 保留                                  |
| com.tradego.daily-leads-local                               | 每小时 :05                      | 线索日补量                                 | 保留                                  |
| com.agentops.daily / content-contract / content-push / i18n | 16:30 / 16:35 / 600s / 17:10 | AgentOps 巡检与内容契约审计                    | 保留                                  |

**恢复方式**：`cp ~/Desktop/龙虾记忆/task-backups/2026-11-26/plists/<label>.plist.disabled ~/Library/LaunchAgents/<label>.plist && launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/<label>.plist`。

**判活**：看 `launchctl print gui/$(id -u)/<label>` 的 `runs` 与 `last exit code`，不看 `launchctl list`。

## 三、技能台账（SEO / GSC / 建站）

三层，各管一件事，不重复正文：



| 技能                                                                                           | 管什么                                                | 状态                     |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| `google-search-central`                                                                      | 官方规范原文（抓取 / 索引 / 呈现 / 专项）+ 口径变更时间线 + 官方渠道层         | 保留，规范层唯一入口             |
| `google-search-console`                                                                      | 后台报告怎么读（效果 / 索引 / 站点地图 / 增强 / CWV / 安全）+ 申诉通道      | 保留，报告层唯一入口             |
| `google-seo-master`                                                                          | 技术 SEO 概念与标记写法总览                                   | 保留，概念层指针               |
| `seo-geo-site-spec`                                                                          | **我们怎么做**：N1–N10 硬约束、新站蓝图、页面规格、i18n、内容质量、口径合规、整改闸门 | 保留，施工层唯一入口             |
| `gsc-master` / `gsc-cdp-verification` / `gsc-index-analysis`                                 | GSC 自动化提交、CDP 登录态、索引分因分析                           | 保留（脚本层，被 console 指针引用） |
| `seo-universal-author`                                                                       | 文章结构标准（已订正「9 语言」与「meta keywords」两条旧口径）             | 保留                     |
| `seo-subagent-article-generator` / `seo-deep-rewrite` / `seo-image-404-repair` / `seo-audit` | 批量写稿 SOP / 存量改写 / 图片 404 / 通用审计                    | 保留（存量批次用）              |

**归档（2026-11-26，可原样恢复）**：`google-search-developer`（2026-05 二手整理，被 central 取代）、`tradego-site-builder`（`vercel --prod --force`、`trailingSlash:false`、schema 挂错页、873 pages 过期）、`nextjs-vercel-seo`（Next.js 14 + 免费层 + `unoptimized` 绕 402 + CLI 部署）、`gsc-sitemap-auto` / `gsc-sitemap-submit` / `google-seo-auth`（三个重叠的提交脚本，收口到 gsc-master）、`seo-triple-review-pipeline`（对应已停的日产流水线）、`seo-engine`（2024 入门整理，仅龙虾记忆侧存在）。

归档位置：`~/Desktop/龙虾记忆/task-backups/2026-11-26/skills/<name>/`，同时已从 `~/.agents/skills`、`龙虾记忆/skills`、豆包 `user_skills` 三处移除。

## 四、以后怎么加任务 / 技能（归口规则）



1. 一个目的只允许一个任务；同类先查本表，别新建第三个。

2. 新增任务必须：plist 先备份、日志落到 `logs/<name>/`、失败要能被 `vercel-audit` 或告警通道看见。

3. 任何任务不得绕过 `scripts/vercel-promote.sh` 与 `deploy-budget.sh`；日构建 ≤3、保留 ≤3。

4. 技能改动必须三处镜像（`~/.agents/skills`、豆包 `user_skills`、`龙虾记忆/skills`）并核 md5；Keywords 用半角逗号分隔，禁用顿号。

5. 建新站或整改先读 `seo-geo-site-spec`，再动代码。

## 五、遗留



* 今日 3 次预算已用尽，本轮改动（含批次 A/B）仍待明日一次 push 上线。

* `vercel-audit` 今日 `FAIL(2)` 已通过 prune 解除保留数问题，但「当日 = 4」会随日期翻页归零。

* 107 篇存量合规红点、29 篇孤儿、P2-1 跨语种 FAQPage 未动。