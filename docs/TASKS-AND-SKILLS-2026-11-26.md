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
| com.tradego.lead-alert | 120s | 官网留资分钟级兜底：读生产 runtime logs 抓 `=== NEW INQUIRY ===`，站内 Telegram 已推成功的不重复；同时把线索写本地 `logs/leads-archive.jsonl` 台账、并直连 TradeBrain Postgres `customer_leads`（source=`tradego_website`，`json_id`=lead id 去重） | **新装**（`scripts/lead-instant-alert.py`，`--backfill` 可补历史；内部 QA 线索不入库） |
| com.tradego.vercel-audit                                    | 21600s                       | 每日合规审计（部署数 / 保留数 / CLI 直推）            | 保留（告警语义正确；08:30 看结果）                |
| com.tradego.vercel-mail-watch | 600s | push 后盯 120 分钟：Vercel API 判部署状态 + Gmail 读 vercel.com 告警邮件，异常写日志并发 Telegram | **新装**（`scripts/vercel-mail-watch.py`，由 `deploy-flush.sh` 登记；规则见 `docs/VERCEL-OPS.md`） |
| com.tradego.weekly-audit | 周日 17:00 PST = 周一 09:00 CST | SEO/GEO 周检（GSC / 技术 / 内容 / GEO / 合规 / 预算） | **新装**（只读；规范 `docs/WEEKLY-AUDIT-SPEC.md`，产物 `docs/reports/weekly-<日期>.md`；退出码 0/1/2 = 无问题 / 有 P1 / 有 P0） |
| com.tradego.social.tick                                     | 每 10 分钟                      | 社媒发布队列                                | 保留                                  |
| com.tradego.social-link-check                               | 17:05                        | 社媒链接死链检查                              | 保留                                  |
| com.tradego.ai-news-local                                   | 每小时 :10                      | 行业资讯                                  | 保留                                  |
| com.tradego.daily-leads-local                               | 每小时 :05                      | 线索日补量                                 | 保留                                  |
| com.agentops.daily / content-contract / content-push / i18n | 16:30 / 16:35 / 600s / 17:10 | AgentOps 巡检与内容契约审计                    | 保留                                  |
| com.tradebrain.inbox-digest | 16:00 每日 PST = 北京次日 08:00 | Gmail 收件箱每日只读摘要（不标已读 / 不删邮件，与 reply-watcher 职责不重叠） | 保留；脚本 `/Users/zhangming/Projects/tradebrain-v2/server/scripts/inbox-digest.js`，产物 `~/AgentOps/reports/inbox-digest/YYYY-MM-DD.md`，日志 `/Users/zhangming/Projects/tradebrain-v2/server/logs/inbox-digest.{out,err}.log` |

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
| `tradego-inquiry-response`                                                                   | **客户询价闭环**：发现询盘 → 摘自动序列 → 规格/价格核对 → 报价邮件 → Resend 发送 → 回写 CRM；含 Afrimash 案例与 6 条踩坑 | 新增 2026-11-26          |

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

* 2026-11-26 已修：`ai.telegram-minimax.plist`（`StandardErrorPath` 的 `</string>` 误写）与 `com.glance.dashboard.plist`（`&&` 未转义），`plutil -lint` 均 OK；**未 bootstrap**（不主动起服务），原文件备份在 `/tmp/*.plist.bak`。
* 认证「自述持证」句已清零并建基线（`content/cert-claims-baseline.json`），复核记录见 `docs/CERT-CLAIMS-REVIEW-2026-1126.md`；新增命中仍会被周检捕获。

## 六、11-26 夜间补记（23:10 CST）

* **GSC 快照补数**：`data/gsc-snapshot.json` 已覆盖为 2026-11-24 口径（点击 273 / 曝光 2.62 万 / CTR 1.0% / 均排名 13.1；已编入 1300、未编入 4050；站点地图 4101 成功），上版另存 `data/gsc-prev.json` 供周检环比。`data/` 在 `.gitignore` 内，仅本机生效，不随 push 走。
* **发信闸门上线**（TradeBrain `server/src/services/email-service.ts`，commit `9e044006`）：发信前拦 `noreply/notification/automated` 类本地名 + 建站/客服网关域名（webador、zohodesk、tawkto、wix、shopify、zendesk…）。9 条用例全过（`support@webador.fr` 拦、`sales@afrimash.com` 放行）；`tsc`+`npm run build` 通过，`com.tradebrain.server` 已 kickstart 生效，cron 运行正常。
* **上线包**：`98f3ad9f`（正文/FAQ 内链补尾斜杠）+ `606dedf5`、`caeba63e`（台账去重）共 3 个提交待推；本地 `deploy-preflight.sh` 体检通过（`next build` OK），当前不在部署窗口（09:00-11:00 / 17:00-19:00 CST）且今日预算 4/3，交由 `deploy-flush` 在下一个窗口自动推。
* **邮箱收口**：通知类（`category:updates`）、推广类（`category:promotions`）、AliExpress 营销与退信已归档，收件箱未读 382 → 35；客户线程（Afrimash、Electrosales、Ngagne、Anthropic/Vercel 账号告警）保留未动。

## 七、按规范做的一轮合规优化（11-27 00:20 CST）

依据 `seo-geo-site-spec` §N10 + `references/05-claims-compliance.md`（价格只讲结构、认证只写按标准生产、不写市场规模装饰数字）：

* **价格口径清零**：`harare-fastener-distributor-supplier-guide` 全文 11 个语种里的单件报价、每吨区间、整柜估算（合计 42 处价格语义金额）全部改写成「五层成本结构 + 按单询价」，含 FOB/海运/保险/关税/清关五层拆解与询价所需的五项信息；`check-money-claims.py` 价格语义从 42 → **0 处**。
* **认证口径清零**：`fastener-supply-chain-africa-beira-corridor`（ZH/JA）、`angola-lng-project-fastener-procurement`（ZH）三处「从持有 ISO 9001 认证的制造商采购 / 認証を取得している」改为「按 ISO 9001 质量管理体系生产」；`check-cert-claims.py` 待复核 **0 处**（基线跳过 21 处）。
* **删装饰数字**：PT 正文的全球市场规模（8.014 亿 / 11.199 亿 USD、CAGR）删除；英文补一段「询价五项信息」实质内容，使 EN 正文 1536 → **1611 词**，达 N5 的 1600 词底线。
* **闸门结果**：`content_gate` 0 BLOCK（218 干净 + 45 只 WARN）；`check-claims.py` src/llms.txt 无过界表述；`check-article-schema.sh` 279 篇全通过；`link-orphans.py` 孤儿仅剩 1 篇且无空闲宿主；`check-template-filler` 仅 2 篇命中阈值。
* **上线**：提交 `ee463244`，与前述 4 个提交合计 5 个待推，由 `deploy-flush` 在 09:00-11:00 窗口自动推。

## 八、正文结构一轮归一（11-27 00:45 CST，commit `298de142` + 本篇）

依据 `seo-geo-site-spec` §N6（首段 60-80 词直答）与 GEO 量具口径，对 279 篇正文做结构性修复。根因不是内容薄，是**正文 HTML 缺段落包裹**：`body` 字段大量以裸文本开头（`Set screws are headless screws…</p>`），渲染层 `dangerouslySetInnerHTML` 直接输出，裸文本落在 `<p>` 外，既无段距，也让 `geo_audit` 把整节当成一个「首段」，实测首段长度虚高到 200-370 词。

* **段落包裹补全**：正文起始裸文本 7668 处、最后一个 `</p>` 之后的裸露尾文 1362 处，按句界/<p> 边界重新包成 `<p>`；跨 221 篇。修复后 `p1` 40-130 词的达标率 225/264 → **247/264**。
* **首段长度归一**：161 篇首段按句界拆分（>130 词）或与下一段合并（<40 词），拆分点落在 55-128 词且优先贴近 92 词，保证 N6 的「一个自然段直答」不被拆碎。
* **模板句清理**：命中指纹句 390 处、同字段重复长句 508 处，涉及 103 篇；清理会让 57 篇英文跌破 1600 词门槛，这 57 篇按「不把达标页降成薄页」原则回滚原文（清单见 `/tmp/regressed.txt`），模板句留给内容线重写时一并替换。
* **转义修复**：5 篇正文里 `\u5E95\u84DD\u87E0\u6876` 这类未解码转义改回汉字（`anchor-bolts-foundation-guide`、`ethiopia-industrial-park-fastener-supply`、`fastener-cost-analysis-template`、`southern-africa-fastener-market-southafrica-botswana`、`structural-steel-connection-fasteners`）。
* **定义句补齐**：`waterproof-coating-buying-guide`、`drc-mining-concession-fastener-logistics`、`zambia-copper-mining-fasteners-grade-selection-2026` 各补一句实体定义，`def=0` 清零。
* **量具结果**：`geo_audit` 均分 76.4 → **77.6**，≥80 分 97 → **98** 篇，<60 分 28 → **10** 篇；`p1` 达标 247/264；`def=0` **0** 篇。
* **闸门**：`content_gate` 0 新增 BLOCK、完全干净 238 → **251（95%）**；`check-article-schema.sh` 279 全通过；`check-claims.py` src/llms.txt 通过；`check-template-filler` 仍是原来的 2 篇（未降级、未动）。
* **仍未动的两块**（都要逐篇写，不能机械替换，交内容线）：`qh=0` **151 篇**（缺问句式小标题，占 15 分）、FAQ 答案均长 <80 词 **175 篇**（占 20 分）。这两块是剩下 60-79 分那 156 篇的主要缺口。
* **补闭合标签**：正文里 `<p>` 比 `</p>` 多 1 的 305 个字段（57 篇）在尾部补 `</p>`，把浏览器自动闭合改成显式闭合，段落边界与首段口径一致（commit `845137ba`）。补完后`geo_audit` 均分再升至 **77.7**、≥80 分 **99** 篇、`p1` 达标 **248/264**，`content_gate` 完全干净 **253（96%）**。
* **构建验证**：`npm run build` 本地全量通过（`✓ Compiled` + TS OK + 4586 个静态页全部生成，日志 `/tmp/build-check-1130.log`），确认 217 篇正文改动不会在远端构建阶段炸掉。

## 九、低分页逐篇补 Q 结构（11-27 01:40 CST，commit `d4b9ed72`）

上一轮把结构债清完后，剩下的分数缺口集中在两处量具维度：`qh=0`（没有问句式小标题）与 FAQ 答案均长不足 80 词。这两项机械替换会造出新的模板文，所以按「一篇一篇写」的方式做，本批 10 篇（当时分数 55-65 那批）。

* **问句小标题**：每篇把 1-2 个内容小节标题改成真问句（`qh` 0 → 0.25-0.40），en 与 zh 同步改写；其余语种标题保持原样，避免为凑分做九语种机器改写。
* **FAQ 扩写**：37 条答案从 20-52 词扩到 80-95 词，全部带标准号、尺寸、工艺或单证细节（ISO 898-1、ISO 1461、ISO 7042、ASTM A193 B7、DIN 125/571/9021、HS 7318、SONCAP、DU 等），不是拉长句子。
* **顺带修掉的结构债**：337 处正文以 `<a>`/`<strong>` 等内联标签起头的字段补 `<p>` 包裹（65 篇）——这类字段同样让量具把整节当首段；3 篇过长首段按句界拆分；`gaskets-specialty-washers-high-temp-guide` 首段补一句 gasket/washer 定义；10 篇 `updated` 刷到 2026-11-27（确实改过）。
* **结果**：`geo_audit` 均分 81.3 → **82.5**，≥80 分 135 篇，**<60 分 0 篇**，`p1` 达标 **263/264**；这 10 篇自身 55-65 → **80-90**。
* **闸门**：`content_gate` 0 新增 BLOCK、完全干净 **262（99%）**；`check-article-schema.sh` 279 通过；`check-claims.py` 通过；`check-money-claims` 价格语义 0、`check-cert-claims` 待复核 0；`check-body-lang` 抽检 0 处污染；`check-template-filler` 仍是原来 2 篇。
* **另一把尺子 `check-geo-readiness.py`**：均分 90.3，剩余缺口 dup=122（同字段重复长句）、entity=75、std=34、link=24、src=20、fresh=4、lead=3，14 篇落在 50-69 分。`dup` 不能盲删（会跌破 1600 词），必须配替换内容，列入下一批。
