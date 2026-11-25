# 内容契约：怎么用（日常手册）

给写文章的人（包括 AI）看的一页纸。检查器是 `scripts/content_contract.py`，它只判断"文章 JSON 里的字段对不对"，不判断"内容讲得对不对"。

## 三条命令

```bash
python3 scripts/content_contract.py --slug <slug>   # 写/改完一篇，先跑这个
python3 scripts/content_contract.py                 # 全量体检，看趋势
python3 scripts/content_contract_backlog.py         # 生成待办清单 docs/content-contract-backlog.md
```

退出码：0 干净、1 有 BLOCK、2 路径问题。可以用来串进任何脚本。

## 两种问题，两种处理

**BLOCK = 页面会露馅，必须修**
- 正文里有 `Content coming soon` / `lorem ipsum` / `todo:`
- 标题、描述、元描述照抄英文，或本地化字段里夹着 4 个以上连续英文词
- 某语种字段整个是空的
- ar/ru/hi/zh 字段几乎没有该语言文字（英文粘错槽位）
- 配图路径指向不存在的文件、`updated` 早于 `date`、缺中文正文

**WARN = 不影响上线，按排期修**
- `imageAlt` 直接复用英文（SEO 收益有限）
- 缺 `faq` 字段（GEO 结构化问答缺失）
- 正文体量偏薄（英文 <1600 词）、标题/描述长度越界

## 存量与新内容分开管

存量问题冻结在 `content/contract-baseline.json`（99 篇）。**门禁只对基线之外的新增问题负责**，所以不会因为历史欠账卡住发布。

```bash
python3 scripts/content_contract.py --write-baseline content/contract-baseline.json  # 修完一批，收窄一次
```

基线文件必须放在 `content/` 或 `docs/`，不能放 `logs/`（`logs/` 被 gitignore）。

## 修存量的四个工具

```bash
python3 scripts/fix_content_contract.py meta      # 用本语种 title+desc 重组被英文污染的元描述
python3 scripts/fix_content_contract.py extract   # 元描述/描述没素材时，改用本语种正文首句
python3 scripts/fix_content_contract.py zh-strip  # 剥掉"内容即将发布"开头、去掉重复段落
python3 scripts/fix_content_contract.py date / image
python3 scripts/fill_body_zh.py patch.json --apply # 补中文正文（≥120 汉字质量闸）
```

全部默认 dry-run，加 `--apply` 才落盘；`--only <slug>` 只处理一篇。

## 门禁

`.githooks/pre-commit` 自动对**本次改动的文章**跑 `--baseline`，有新 BLOCK 就拒绝提交。绕过：`CONTENT_CONTRACT_SKIP=1 git commit ...`。

## 边界（别指望它做这些）

- 不判断技术内容正确性（等级对应、标准编号对不对，靠人）
- 不判断行情数字真假（价格、产量这类给区间即可，不必逐条标来源）
- 不判断文风、可读性、是否机翻腔——`i18n-mixed` 只能发现"英文没翻译干净"

## 判定口径备忘（第三轮）

- "英文混入"只统计**被空格/标点直接相连**的英文词，并列的标准号（`DIN、ANSI、GB`）不算混入；正文里夹整句英文仍会命中。
- 机翻提示（`i18n-copy` WARN）只在长文本（≥12 词）且与英文重合 >85% 时给出，短描述和型号标题不再刷屏。
- 每轮修完立刻 `python3 scripts/content_contract.py --write-baseline content/contract-baseline.json` 收口，否则门禁会拦下正常改动。

## 怎么让它自己跑起来（三层，按顺序兜底）

1. **会话内主动跑**——`AGENTS.md` 的 `content-contract` 段 + `seo-ai-pipeline` 技能的「自动执行」节都写死了：动过 `content/articles/*.json` 就先 `content_gate.py`、改完再跑一次，不需要用户开口。
2. **提交时强制拦**——`.githooks/pre-commit` 对本次改动涉及的 slug 逐个校验，新增 BLOCK 直接 exit 1。
3. **每日巡检**——launchd `com.agentops.content-contract`，每天 08:35（Asia/Shanghai）跑全量，报告落 `~/AgentOps/reports/content/<日期>.txt`，有新增 BLOCK 弹桌面通知。

一条命令入口：

```bash
python3 scripts/content_gate.py          # 体检 + 新增 BLOCK 判定（exit 1 表示有新增）
python3 scripts/content_gate.py --brief  # 只打一行结论
python3 scripts/content_gate.py --fix    # 先自动修 meta/extract/date/image，再体检
python3 scripts/content_gate.py --slug X # 单篇
```

技能文件在平台侧可能被还原，仓库内留了副本 `docs/skills/seo-ai-pipeline.SKILL.md`，恢复时直接覆盖回去即可。

<!-- deploy trigger: FAQ 渲染修复上线 2026-11-25 -->

## 部署后必做（2026-11-25 起）

`git push` 只产生部署，不会自动切换生产域名。每次推送后：

1. `bash scripts/vercel-promote.sh` 看最新 READY 部署与域名指向是否一致；
2. `bash scripts/vercel-promote.sh --apply` 把域名指过去；
3. 抽检一篇文章页，确认 `FAQPage` 与正文在位。

日常兜底已并入 `~/AgentOps/bin/content_audit.sh`（每天 08:35），无需手动记得。

## 经验沉淀（2026-11-25，本轮整改）

这一轮把 BLOCK 从 151 清零、清掉 316 处不合规认证自述、补了几十篇正文，过程中暴露的问题比修掉的问题更值得记：

1. **校验器要按"数据真实来源"判，不能按字段外形判。** FAQ 的正文由 `faqItems` 按语种渲染，`body.zh` 空着是正常的；按 body 判定会造出假 BLOCK（当轮 2 篇）。同理，任何"模板生成"的字段都不该进手写校验。
2. **批量写入必须验编码。** U+FFFD 是丢字的物证，json 依然合法、字段依然非空，只有渲染出来才看得见。现已升级为 `encoding` BLOCK，扫描全库无残留。
3. **补正文别凭字数感。** 手写中文段落实测比目标少 30~40% 汉字（英文同理），所以补写一律走 `scripts/append_body.py` 回显计数，不够就再补一轮。
4. **幂等键要稳，且语种必须显式。** 脚本按首 30 字判重，重复推送自动 skip；漏传 `--lang en` 会把英文段塞进中文正文，直接换成 `lang-leak` 问题。
5. **批量改表述只能做短语级替换。** 整句模板替换会改到 `heading` 与 HTML 结构，一次写坏多语种标题，只能整目录回滚重来。
6. **push 不等于上线。** Git 部署只更新 `git-main` 别名，生产域名要 `vercel-promote.sh --apply`；预算闸门按 Asia/Shanghai 计，CANCELED 记录延迟生成，prune 要跑第二次。
7. **提交分批。** 单次 161 个文件的提交会触发批量改动告警，也容易卷进别处窗口的半个改动。

对应工具：`scripts/content_contract.py`（含 `encoding`）、`scripts/append_body.py`（新增）、`scripts/vercel-promote.sh`、`scripts/vercel-prune.sh`。
8. **校验器本身会被"写坏"，而且坏得很安静。** 一次并线把认证检查插进 `except` 分支、后面紧跟 `return`，其余检查全成死代码：脚本正常退出、全库显示"完全干净 272 篇"，实际什么都没查。现在加了 `scripts/contract_selftest.py`（4 个反向用例：占位句/undefined/日期倒挂/乱码必须被抓）并挂进 `pre-commit`，脚本被写坏时提交直接拦下。**经验：任何一个"全绿"的结论，先确认它是不是还在检查。**
9. **地域口径要机器兜住，不能靠自觉。** 对外只写 China，具体省市（潍坊/山东/Weifang/Shandong 及阿拉伯、俄、印地写法）不得与公司或工厂绑定；批量把地址换成 China 之后还要查"中国中国""China (China)"这类替换残句。已加入 `geo-leak` / `geo-dup` 两类 BLOCK，并有反向用例覆盖——因为这一类错误一旦上线，等于把采购地址写在了客户面前。
10. **标签写坏要当 BLOCK，不是排版小事。** 批量拼接段落时出现过 `</p><<p>`，JSON 合法、字符数不变，页面却会多出一个空段。已并入 `dirty-text`：出现 `<<p>` 或 `<p><p>` 直接拦。
11. **长段落别一次写到底，写到一半容易断。** 本轮一篇英文末段写成 `...grades, coatings c</p>`，句子被截断，JSON 仍然合法、校验也过得去。补救靠事后通读，成本高；做法是每段控制在 120–180 词之内，写完立刻回读一次。断句类的补救口令：搜句尾异常（以单个字母或 `c</p>` 这种收尾）。
12. **截断可以机器查，而且不只在正文里。** 第 11 条的口头"通读"现已落成 `truncated` 检查（`.body.` 且长度 >80，段落以单个字母收尾即 BLOCK），并加了反向用例；同一轮它在 `washer-types-applications-guide` 抓到 `TradeGo offers a`，人工抽查又在 `socket-head-cap-screws-guide` 的 `description.en` 与 `metaDescription.en` 抓到同一段被截断成 `...cylindrical head featuring a`——说明**同一段文案如果同时写进 description 和 metaDescription，截断会一起出现，修的时候要分别给长度**（现为 186/158 字符，仍在 title 与 meta 区间内）。标题类字段（table cell、heading）的单字母收尾多为正常缩写（西语 `... y`、`factor K`、`U`/`L`），所以规则只覆盖正文，其余靠抽查。
13. **`git add <目录>` 会吞掉并行窗口的在途改动。** 本轮一次 `git add content/articles` 把 108 篇别人的未提交改动卷进自己的提交（回看时只看到 135 行 insertion，很容易误以为是自己写的）。恢复办法是 `git reset --soft HEAD~1` + `git restore --staged .`，再按显式路径提交。**规则：只 `git add` 自己这轮真正改过的文件名，禁止整目录 add；提交命令里也带上 `-- <paths>`。**
14. **额度触顶时不要等在手边。** 当日真实构建 8/3 触顶后，`pre-push` 会拒绝，本地只能继续攒改动。已加 `~/AgentOps/bin/content-push.sh` + `com.agentops.content-push`（launchd 每 10 分钟唤醒，只在 Asia/Shanghai 00 点窗口动作，当日成功后写 marker）：先跑契约与自检，BLOCK>0 或自检不过就**不推**，通过才 `git push` → `vercel-promote.sh --apply` → 审计，并在桌面通知结果。这样夜间窗口自动放行，白天不占构建预算。
对应工具：`scripts/contract_selftest.py`（7 个反向用例）、`~/AgentOps/bin/content-push.sh`。
15. **价格类文章不许写具体数字。** `m10-galvanized-bolt-fob-china-price` 的标题就叫「2026 FOB 价格」，但没有真实报价数据时，写数字等于把页面变成不可追溯的价格承诺。做法是把章节改成结构说明：报价由基价、镀锌加价、包装、内陆运输、单证构成；价格由钢、锌、能源三类输入驱动；比较必须同规格、同 Incoterm、同包装。这样既保住页面意图，也不违反"不得虚构事实"。**规则：没有可核来源的金额、比例、期限，一律用结构性描述替代，或直接不写。**
16. **并行窗口的 `index.lock` 只能等，不能删。** 提交时撞上锁，正确处置是 `ps aux | grep git` 确认没有进程、等十几秒、再重试；直接删锁可能打断另一个窗口正在写索引。另有窗口把我的文章卷进它自己的提交（`e5c67da6`），内容与计数都正确、归属不同——这种情况不必改写历史，确认文件已入库即可。
17. **章节少的页面，单段要写得长才算数。** 国家/市场类页面往往只有 3 个正文小节（其余是 FAQ），本轮 `ghana`、`zambia`、`drc` 三篇都出现了同一模式：按"每节两段"写，第一轮只到 1330–1367 词，第二轮补足仍在 1569–1583 徘徊，最后都要再加 40–60 词的收尾段。**规则：正文小节 ≤4 个时，每段按 130–160 词写；写完立刻统计，不靠"感觉写得够多"。**
18. **重复内容要按"整句共用率"量，不能按 3-gram 相似度。** 先用 3-gram 词袋算 Jaccard，结果 13,081 对文章"近重复"（0.85–0.94），完全是噪声——紧固件技术文共享大量通用短语。换成**整句（>60 字符）逐字出现、且在全库 ≥50 篇中都出现**的口径后，信号立刻清晰：`timber-fasteners-guide` 16/19 句是共用句（0.842）、`mining-fasteners-africa` 20/24（0.833），全库 172 篇共用句占比 >15%。对应工具：`scripts/dup_audit.py`（`--top/--min-docs/--json`，只报告不阻塞，避免影响并行窗口）。**经验：相似度指标要先验证噪声底，再决定是否升级为闸门。**
19. **短模板页的"高共用率"是双重问题，删尾段解决不了。** 共用句集中在老式"列表体 + 通用合规尾段"文章：正文只有 600–800 词，通用尾段占比自然升高。直接删掉尾段会让字数跌破 1600，所以正确做法是**把整篇列表体正文重写成 prose**（保留 heading，逐节 3–4 段、每段 130–160 词），字数与原创度一起解决。本轮 `timber-fasteners-guide` 614→1607 词、`mining-fasteners-africa` 809→1600 词，共用率分别从 0.842/0.833 掉出榜首。
20. **同国家的两篇页要按"意图"分工，不要按"关键词"分工。** `republic-of-congo-fastener-supplier` 与 `congo-brazzaville-fastener` 三个 H2 里有两个逐字相同（Shipping to Republic of Congo / Fastener Products for Congo）。本轮不改 10 语种 heading（改动面太大），改的是正文角度：前者走**采购与供应商资格**（资质、单证、付款与备货、黑角备货、索赔），后者走**用途与选型**（油气/木材/港口/钾盐/建筑各自的规格、铁路段约束、寄样配货）。两篇现有 1641/1626 词。**遗留待决：这对页面的 heading 层仍是近似重复，若要彻底解决需重写一侧 heading（10 语种 × 4 节）或做 canonical/redirect 合并，属结构性决策，交用户拍板。**
21. **`<<p>` 这类标签写坏会在重写时复发，不要靠记性。** 本轮批量重写 `solar-mounting-hex-bolt-solution-guide` 时又写出一个 `<<p>`，被 `dirty-text` 在单篇校验时就拦下（`--slug` 一眼可见）。**操作习惯：每篇写完先跑 `--slug` 单篇校验，再继续下一篇；不要攒到最后统一跑全库，否则定位成本高一个量级。**
22. **重写要按榜单滚动做，榜单会自己变。** `dup_audit.py --top 6` 每修完一批，榜首就换一批（timber/mining → bolt-types/bolt-tightening → fastener-standards/machine-screws）。原因是共用率是**比例**：一篇词数一长，通用尾段的占比自动下降。所以每次开工先跑一次榜单，从当前第一名往下做，比按主题挑效率高得多。
23. **整篇重写比"补段"更能同时解决两个指标。** 补段只加词数，不改共用句；重写（保留 heading、把列表体换成 prose、每节 3–4 段）一次把词数与原创度都处理掉。本轮 `bolt-types-applications-guide` 730→1611 词、`bolt-tightening-torque-guide` 613→1615、`fastener-standards-din-iso-astm-comparison` 705→1619、`machine-screws-specifications` 555→1694，四篇共用率全部掉出榜首。**代价是字数估算更松：重写后常在 1400 左右，必须按 1.15 倍写完再补 2–3 段。**
24. **价目表类页面是"编造价格"的高危区，整改必须连中文一起改。** `self-drilling-tek-screws-price-list` 的标题写着「Price List: China FOB 2026」，正文里是十几行 `#10 x 1" (4.2 x 25mm): $12-16/100pcs` 这类数字，而且原有的 HTML 已被替换脚本写坏（`washers="text-primary-600…"` 混进正文）。这类数字没有可核来源，等于把页面变成不可追溯的价格承诺，整改做法是：标题从「Price List」改成「Quote Structure」，正文换成**报价构成的五层说明**（线材与成型 / 表面处理与涂层等级 / 配件与包装 / 运费与单证 / 数量与付款条件），并明确「页面上任何固定数字只是某一周的切片，不是可成交价」。**中文 `body.zh` 里同样的数字必须同步删除**——只改英文是最常见的漏改，因为校验器对中文只查字数。
25. **同一篇文章的不同语言版本会各自"老化"，要按内容而不是按字段查。** 第 24 条那篇改完后中文仍是旧价目表，词数、结构、编码全部合法，只有读一遍才看得见。所以重写一篇时，`body.en` 与 `body.zh` 要一起读、一起改；尤其"列表体"段落，中文往往是英文的直译复制，英文换了角度而中文没换，就是新的假翻译。
26. **成对孪生页的正确工序是"先对照，再定角度，最后动正文"。** `senegal-fastener-market` 与 `ivory-coast-fastener-market-complete-guide` 不是"相似"，是同一篇换了国名：4 个小节标题逐字相同、词数 142/137/136/132 对 142/138/137/133。处理工序固定为三步——① 先打印两篇的 heading 与各节词数做对照，确认是不是结构性孪生；② 给两篇各定一个**互不重叠的叙事主轴**（塞内加尔=达喀尔半岛与进口单证、渔业与食品加工、非正规渠道与箱标；科特迪瓦=阿比让转口枢纽，服务布基纳法索与马里，转口单证与"两边界外的买家"）；③ 只改正文，heading 与 slug 不动（改动面小、不影响既有内链）。改完两篇通风检 `dup_audit`，看是否双双掉出榜单。
27. **城市页的角度要从"当地经济结构"里长出来，不能套国家页模板。** `durban-fastener-supplier` 原本是通用国家页的翻版，改写角度定成**港口经济**：清关、仓储、集装箱周转带来的维修型需求，气候（亚热带湿度 + 海盐）决定的涂层下限，以及"规格在别的省、货从德班过"这一层转手风险。同理 `lagos-industrial-fasteners` 走的是**分销层级与庭院等待**（同一颗螺栓到工地前易手三次、箱标比价格重要）。**规则：写城市页先问"这座城市的钱是怎么赚的"，答案就是正文主轴。**

> 技能正本 `docs/skills/seo-ai-pipeline.SKILL.md`，当前 md5 `fd7b9ca7d3c8004a61214cde842a4d78`；已装副本 `.user_skills/seo-ai-pipeline/SKILL.md` 与之逐字一致（平台同步会把它还原成旧版，恢复即 `cp` 覆盖后比对 md5）。
28. **同一产品的多篇页面要按"谁在哪个阶段用它"分工，不能按关键词分工。** `threaded-rods-fasteners-guide`、`threaded-rod-studding-guide` 与 `u-bolts-pipe-clamps-guide` 都是螺纹类，但读者不同：施工端关心安装、接长、预载语义（吊架拧紧≠结构预载）、切割后补涂；采购生产端关心棒材等级、轧制螺纹与切削螺纹的差别、标准长度与切料浪费、端部处理与包装；U 型螺栓关心的是半径与被夹持件匹配、现场消耗件节奏。三篇各写一次"谁在什么时候看这一页"，标题与 slug 都不动，正文自然不重复。**判断方法：如果两篇的章节标题有 3 个以上逐字相同，就别再想"改几个句子"，先给两篇各写一句"读者是谁、他此刻要决定什么"。**
29. **"补段"的边际词数会衰减，重写要按 1700 词下手。** 一篇重写到 1400 词后，每加一段两三句只涨 60–90 词，要到 1600 往往要加 6–8 段，反复校验十几次；反过来，一开始就按每节 3–4 段、每段 130–160 词写，基本一次到位。**规则：重写目标写 1700 词（留 100 词余量），并记住我校验器在 1599 词给 exit 0、1576 词给 WARN，边界值不要贴着门槛收工。**
