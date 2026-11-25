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
