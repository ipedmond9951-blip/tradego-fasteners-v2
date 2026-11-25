# TradeGo Vercel 运维规范

> 适用于**所有**操作这台仓库的人或代理（豆包 Agent、OpenClaw 管线、手工运维）。
> 版本 v1.0 · 2026-11-25 · 起因：11-24 全站 402（Fast Origin Transfer 198% 触发 Hobby fair-use 暂停）
> 配套可执行校验：`scripts/vercel-guard.sh`（本文档每一条红线都有对应检查）

---

## 0. 一句话规则

**上线只有一条路：`bash scripts/deploy-flush.sh`。**
任何其他形式的上线（`vercel --prod`、`vercel deploy`、`git push` 直推、后台 Redeploy、MCP 直调）都算违规，无论结果是否成功。

---

## 1. 账号与项目

| 项 | 值 |
|---|---|
| Vercel 团队 | `ipedmond9951-8331s-projects`（team_zpNihQv4m6nG8EPZqu079v8k） |
| 项目 | `tradego-fasteners`（prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ） |
| 仓库 | `~/workspace/tradego-fasteners-v2`（GitHub `ipedmond9951-blip/tradego-fasteners-v2`） |
| 主域 | `https://www.tradego-fasteners.com` |
| 计划 | **Pro**（2026-11-25 升级，用于解除 11-24 的额度暂停） |
| 登录 | `ipedmond9951@gmail.com`（CLI 已认证，token 在 `~/Library/Application Support/com.vercel.cli/auth.json`） |

**关于 MCP**：暂不接入 `https://mcp.vercel.com`。理由：MCP 授予的是授权人全部账号权限（含写操作），会绕开本规范的 push 闸门；现有 CLI + REST API 已覆盖部署、清理、额度查询。若将来确需接入，只允许只读查询用途，且不得用于触发部署。

---

## 2. 额度红线

升级 Pro 后不再"超限即停站"，但用量直接计费，**成本红线同样要守**。

| 资源 | Hobby 免费额度（对照） | 我们的目标 | 硬上限 |
|---|---|---|---|
| Fast Origin Transfer | 10 GB/月 | < 2 GB/月 | 5 GB/月 |
| Fast Data Transfer | 100 GB/月 | < 30 GB/月 | 50 GB/月 |
| Function Storage | 10 GB | < 100 MB | 500 MB |
| Deployment Storage | 10 GB | < 1 GB | 3 GB |
| ISR Reads | 1,000,000 | < 200K/月 | 500K/月 |
| Fluid Active CPU | 4 小时/月 | < 30 分钟/月 | 1 小时/月 |
| 单个 Lambda 包 | — | **≤ 5 MB** | 10 MB |
| 线上保留部署 | — | **3 条** | 3 条 |
| 每日 push | — | **≤ 1 次** | 1 次（事故修复另计） |

超出目标线不算违规，但必须在 `logs/vercel-usage-watch.md` 记一条原因与处理；超出硬上限视为事故，按第 6 节处置。

---

## 3. 发布流程（六步，缺一不可）

### 步骤 1 · 判定变更类型
- 内容类（`content/**`、`public/images/**`）：可批量，但**必须攒批**，一天最多 1 次上线
- 代码/配置类（`src/**`、`next.config.ts`、`scripts/**`）：一次 push 只做**一件事**（便于回滚）

### 步骤 2 · 本地门禁（不通过不许提交）
```bash
npx tsc --noEmit -p tsconfig.json          # 必须 0 错误
npx next build                              # 必须成功，页数与上次一致（当前 4424 页）
bash scripts/vercel-guard.sh --build        # 单函数 trace ≤5MB，预渲染路由 ≥4400
```

### 步骤 3 · 提交
- 提交信息格式：`type(scope): 一句话`，例如 `perf(vercel-quota): 函数包剔除 content/public`
- **禁止**把半成品 / 未验证改动混进同一次 push
- 提交前备份分支：`git branch backup/<改动名>-$(date +%Y%m%d)`

### 步骤 4 · 推送（唯一入口）
```bash
bash scripts/deploy-flush.sh        # 目录锁 → rebase → 预算闸门 → push → prune 到 3 条
```
脚本内已串起 `deploy-budget.sh`（查 Vercel API 真实当日部署数）与 `vercel-prune.sh`（保留 3 条）。
**不要**加 `--force`（那是事故通道，见第 6 节）。

### 步骤 5 · 上线验收
```bash
bash scripts/vercel-guard.sh --live
```
必须全部满足：
1. `deployments[0]` 的 commit sha **等于** 本地 HEAD
2. 状态 `READY`，`target = production`
3. 单个 Lambda **≤ 5 MB**
4. 抽查 `/en/`、`/ja/industry/drywall-screws-complete-guide/`、`/en/llms.txt` 均 200 且 `lang` 正确
5. 响应头保留 `s-maxage=86400` + `stale-while-revalidate=604800`
6. 页面 JSON-LD、canonical、hreflang 未被破坏

### 步骤 6 · 记录
- 部署台账：`logs/deploy-budget.json`（脚本自动写）
- 额度异动/事故：`logs/vercel-usage-watch.md`（人写）
- 删除部署前的档案：`logs/vercel-archive/`（prune 脚本自动留 JSON）

---

## 4. 禁止清单

| # | 禁止 | 为什么 |
|---|---|---|
| 1 | `vercel --prod` / `vercel deploy` 直推 | 绕开预算闸门与 prune，Hobby 时代就是这样把额度打爆的 |
| 2 | 直接 `git push` 上线 | 同上，pre-push 只做校验不做预算裁决 |
| 3 | 常规使用 `DEPLOY_FORCE=1` | 仅限事故修复，且必须在记录里写明原因 |
| 4 | 删除/收窄 CDN 缓存头（`s-maxage` / `swr`） | 回源激增，直接推高 FOT |
| 5 | middleware matcher 覆盖全站语种路径 | 每个请求都进函数，FOT + CPU 双爆 |
| 6 | 让 `content/**`、`public/images/**` 进函数包 | 单函数曾达 186MB，Function/Deployment Storage 双双爆表 |
| 7 | 一天 push 超过 1 次 / 保留超过 3 条部署 | 部署产物线性叠加，额度不可控 |
| 8 | 未经确认升级计划、接入 MCP、开图片优化器 | 计费与权限边界，须 Edmond 拍板 |
| 9 | 在 `vercel.json` 里加 `cleanUrls`/重写规则替代 `next.config` 重定向 | 两套路由规则会打架，历史 404 就是这样来的 |

---

## 5. 配置不变量（改任何配置前先读这节）

| 文件 | 必须存在的设置 | 作用 |
|---|---|---|
| `next.config.ts` | `outputFileTracingExcludes: { '*': ['public/images/**','public/videos/**','content/**'] }` | 单函数从 186MB 降到 2-4MB |
| `next.config.ts` | `trailingSlash: true` | 全站 URL 形态，改动影响 4400 页索引 |
| `next.config.ts` | `images.unoptimized: true` | 关掉计费图片优化器（走原始 `/images/*.jpg`） |
| `src/app/[locale]/*` 页面 | `export const dynamic = 'force-static'` + `revalidate = false` | 纯静态，CDN 直出，不产生 ISR Reads |
| 5 个动态路由 | `export const dynamicParams = false` | 未预生成 slug 走 404，不回源读磁盘 |
| `src/app/sitemap.xml/route.ts` | `force-static` + `revalidate = false` | 4322 条 sitemap 构建期生成一次 |
| `src/app/[locale]/llms.txt/route.ts` | `force-static` + `generateStaticParams` | 避免每请求进函数并自 fetch 回源 |

`scripts/vercel-guard.sh`（默认模式）会逐条检查上表前两项与 sitemap/llms 的静态声明，缺失即报错。

---

## 6. 应急手册

### 6.1 站点 402 / `DEPLOYMENT_DISABLED`
判断顺序（10 分钟内可定位）：
1. `curl -sI https://www.tradego-fasteners.com/en/ | grep -i x-vercel-error`
2. 查后台 Usage 页横幅文字：是 **Paused**（额度）还是 **Payment required**（欠费）
3. 额度类 → 看是哪一项：`dashboard/usage` 的 Overview 表，对照第 2 节红线
4. 欠费类 → 查 billing 与发票，联系 Edmond

处置：
- **立即停推**（暂停期间的新部署既不生效又继续吃存储）
- 额度类且为 FOT/CPU → 先确认相应治理是否已上线（sitemap 静态化、middleware 收窄、`outputFileTracingExcludes`）
- 决策顺序：**提支持工单 → 必要时临时升 Pro → 最后才考虑换托管**（换托管属于架构变更，必须 Edmond 批准）
- 全过程记入 `logs/vercel-usage-watch.md`，包含：触发项、百分比、暂停时间、处置动作、恢复时间

### 6.2 构建失败
1. `npx vercel inspect <url>` 看构建日志尾部；或直接 `bash scripts/vercel-audit.sh`，它会报出 `errorCode`
2. 本地复现：`rm -rf .next && npx next build`
3. **不要在线上反复重试**（每次都算一次部署）
4. 定位不了就 `git revert` 上一个提交再走一次发布流程

#### `function_creation_throttled`（函数创建被限流）
现象：构建跑到 `Deploying outputs...` 后报错，`errorCode = function_creation_throttled`，线上仍是旧 sha。
原因：短时间内创建了太多 Vercel Functions（每次部署都会重建全部函数 + 删除部署会销毁函数，一来一回就是一次函数 churn）。
处置：
1. **等 15–30 分钟**，让限流窗口过去
2. 只推 **1 次**（推一次就会重建函数），不要连环重试
3. 之后尽量把改动攒成一次发布；非构建类提交（docs/scripts）不会走到这一步

### 6.3 回滚
- 首选：`git revert <sha>` → 走正常发布会话（保留 3 条部署，旧版仍可切回）
- 紧急：Vercel 后台 Instant Rollback 到上一条 READY 部署（Pro 支持），事后仍须用 git revert 对齐代码
- 命令行等价（**已演练过，2026-11-25**）：`npx vercel rollback <deployment-id或url> --yes`
  - 它只切别名，不产生新部署、不重建函数，所以不占"每日 3 次构建"，也不违反"生产只能 git 部署"（这条约束管的是"造部署"，不管"指哪个部署"）
  - 演练结论：切换约 1 秒生效；用 `GET /v9/projects/{id}` 读 `targets.production.meta.githubCommitSha` 可以客观验证切到了哪一条；切回同样一条命令。演练耗时约 1 分钟，期间站点始终 200
  - 演练后要补跑 `vercel-prune.sh --apply`（回滚不会自动清旧记录，可能短暂 4 条）
- 备份分支：`git branch backup/...`，删除前确认 `logs/vercel-archive/` 有记录

### 6.4 额度即将超线
当 `deploy-budget.sh` 或 Usage 页显示超过第 2 节"目标"值时：
1. 当天停止一切非必要上线
2. 查 `deployments` 数量，超过 3 条立即 `bash scripts/vercel-prune.sh --apply`
3. 查最近 3 天 FOT 增量，若单日 > 500MB，优先怀疑：新加的动态路由、middleware 匹配面扩大、sitemap 被频繁抓取

---

## 7. 度量基线（2026-11-25 整改后，作为回归基准）

| 指标 | 值 |
|---|---|
| 单函数 Lambda | 2.03 MB（整改前 136.26 MB） |
| Functions Storage | 21 MB（整改前 10.56 GB） |
| Deployment Storage | 355 MB（整改前逼近 10 GB） |
| Fast Origin Transfer | 405 MB / 本周期 |
| ISR Reads | 51.49 K |
| 预渲染页数 | 4424 |
| sitemap URL | 4332 |

任何改动上线后偏离基准超过 3 倍，按事故排查。

---

### 图片优化（`next/image`）计费结论（2026-11-25 评估）

- 现状：10 个源文件使用 `next/image`；本周期 `image_transformation = 2` 次，成本可忽略（$0.59 总消耗里占不到 1 分钱）
- 结论：**不动**。改成 `images.unoptimized` 会丢掉 srcset/AVIF/按需尺寸，直接伤 CWV 与图片搜索，而站点首要目标是 SEO/GEO，不划算
- 重新评估的阈值：单周期 transformations **> 2 万次**，或图片相关成本 **> $2（约额度 10%）**，才值得讨论关掉或走自建 CDN

## 8. 工具速查

**新机器首次接入**（否则 pre-push 钩子不生效）：
```bash
cd ~/workspace/tradego-fasteners-v2
git config core.hooksPath .githooks     # 启用仓库内钩子
bash scripts/vercel-guard.sh            # 立刻跑一次，确认环境合规
```

| 命令 | 用途 |
|---|---|
| `bash scripts/deploy-flush.sh` | **唯一上线入口**（锁 → rebase → 预算 → push → prune） |
| `bash scripts/deploy-status.sh` | 看最新 READY 部署与是否在构建 |
| `bash scripts/deploy-budget.sh` | 查今日部署数是否超预算（只读不拦） |
| `bash scripts/vercel-prune.sh --apply` | 保留 3 条，其余删除（删除前自动归档） |
| `bash scripts/vercel-guard.sh` | 推送前规范自检（默认模式） |
| `bash scripts/vercel-guard.sh --live` | 上线后验收（sha/状态/包体/页面/缓存头） |
| `bash scripts/vercel-usage-snapshot.sh` | 抓 Usage 页六项数字落盘（信用额度/带宽/函数/存储/ISR/构建），审计依赖它 |
| `bash scripts/vercel-audit-daily.sh` | 无人值守入口：先抓用量快照，再跑审计，写状态文件 + 失败通知（launchd 6 小时一次） |
| `npx vercel ls tradego-fasteners --json` | 部署列表（含 sha、状态、时间） |
| `npx vercel inspect <url>` | 构建产物与 Lambda 尺寸 |

---

## 9. 保障机制：怎么确保真的按规范执行

规范不是靠自觉。五层叠加：平台硬拒 → 本地拦截 → 事后审计 → **告警到达** → 凭证收敛，每层都能独立证伪"没按规定来"。

### 第一层 · 平台硬拒（Vercel 自己不接受）
项目 Settings → Build and Deployment → **Deployment Sources** 已设为 `Override`，生产环境**只勾 Git**，`Vercel CLI / REST API / v0 / Deploy Hooks / Marketplace` 全部取消勾选。

这条不是在本地"约定"，而是在 Vercel 侧生效的策略：`deploymentPolicy.deploymentSources[].sources = ["git"]`，API 可直接核验。也就是说，即使有人绕过钩子、拿到 token 跑 `vercel --prod`，请求也会被平台拒绝——**规范从"应该"变成了"不可能"**。

### 第二层 · 本地拦截（不让违规发生）
| 手段 | 拦什么 |
|---|---|
| `deploy-flush.sh` 为唯一入口 | 目录锁、rebase、预算闸门、prune 全在一处，绕过它就绕过了全部 |
| `.githooks/pre-push` 串 `vercel-guard.sh` | 直推 main 也会被检查：配置被改坏、又出现直推写法、部署超 3 条 → 直接拦截 |
| `_deny-direct-deploy.sh` | 8 个历史脚本里的 `npx vercel --prod` 全部改指向拦截器，执行即报错 |

### 第三层 · 事后检测（违规发生当天就能发现）
`scripts/vercel-audit.sh` 每天 08:30 由定时任务自动跑（`--quiet` 模式只在违规时出声）。检测 **11 项**：

1. 生产部署的 `source` 必须是 `git` —— **CLI 直推会留成 `source: cli`，这是最硬的证据**
2. 平台策略必须仍是"仅 git"（防止有人把开关又打开）
3. 当日部署次数 ≤ 3
4. 线上保留部署 ≤ 3
5. 线上最新**可访问**部署的 commit 是 origin/main 的祖先；若落后，其间不得有 `content / src / public / next.config.ts / package.json` 变更
6. 线上每条部署的 commit 都存在于本地 git 历史（挡住"未推送代码直接上线"）
7. 最新部署最大 Lambda ≤ 5MB
8. `/en/` 200
9. CDN 长缓存头正常
10. 用量快照未过期（>36h 报错）且信用额度未到 95%
11. 本地 `core.hooksPath=.githooks` 且 `.githooks/pre-push` 可执行 —— 新克隆/新机器最容易漏，漏了 guard 等于不存在（`deploy-flush.sh` 启动时会自动补齐）

### 第三层补充 · 告警必须"到达人"，不是只写日志
早先审计失败只弹 macOS 桌面通知——人不在电脑前等于静默。现在：
- `~/.agents/bin/vercel-alert.sh` 由 launchd（`com.tradego.vercel-alert`，30 分钟一次）调用，读 `logs/vercel-audit-last.json`
- **连续 2 次失败才推 Telegram**（防抖），同一个巡检时间点只推一次；恢复后推一条"已恢复"并清除标记
- 通道复用仓库里的 `scripts/telegram-notify.sh`（其他 cron 已在用，`TELEGRAM_CHAT_ID` 默认 8758157215）
- 该脚本只读状态文件，不碰仓库、不占部署额度

### 第四层 · 凭证收敛（把能力本身限制住）
- Vercel CLI token 只在**这台 Mac**（`~/Library/Application Support/com.vercel.cli/auth.json`）；云主机 `vm` 与 Windows 机器都没有登录态，物理上跑不了部署
- 团队 owner 只有 `ipedmond9951@gmail.com`；没有第二个可部署身份
- 不为任何 agent 单独发放 token；所有代理一律通过 `deploy-flush.sh` 这条命令上线

### 附：ignoreCommand 的副作用（必须知道）
`vercel.json` 的 `ignoreCommand` 在"只有 `content/src/public/next.config.ts/package.json` 之外的路径发生变化"时以 exit 0 跳过构建。因此**纯文档/脚本的提交会显示为 CANCELED 部署，不产生线上部署**——这是省额度的正常行为，不是故障。审计脚本已按此语义判定（线上 commit 可以是 origin/main 的祖先，前提是其后没有构建产物相关改动）。

对应地，`deploy-flush.sh` 会先判断本次 diff 是否命中构建路径：没命中就跳过部署预算计数（这类 push 不占"每日 3 次构建"额度），但仍受"每日无构建推送 ≤5 次"的独立上限约束。无构建推送的计数与部署预算统一按 **Asia/Shanghai** 日期滚动（早先按机器本地 PST 日期，会导致北京时间上午永远卡在上一天的 5/5）。

CANCELED 记录要 push 后十几秒才出现在 API 里，所以 `deploy-flush.sh` 在无构建推送后会再等 25 秒补跑一次 `vercel-prune.sh`；同时审计的"保留 ≤3 条"只统计非 CANCELED 部署——CANCELED 没有产物，不该被算成第 4 条。

### 已知缺口（不粉饰）
1. `git push --no-verify` 可以跳过 pre-push 钩子 —— 但第三层的 sha 对齐 + 当日次数审计仍会记录，且部署本身仍是一次正常的 git 部署，风险有限
2. ~~能读到本机 token 的进程仍可 `vercel --prod`~~ —— 已被平台层堵死（来源策略仅 git）；万一有人把开关打开，第三层审计当天就会报"未启用部署来源限制"
3. 审计只在**这台 Mac 醒着**时才跑；机器关机/休眠期间没有检测，也没有告警——恢复供电后 launchd 的 `RunAtLoad` 会补跑一次
4. 若将来多人协作或代理增多，应升级为 **GitHub 分支保护（main 必须走 PR + 必过 checks）**；当前单人直推流程与之冲突，暂不启用，写在这里作为下一步选项

## 10. 变更记录

| 日期 | 变更 | 触发原因 |
|---|---|---|
| 2026-11-24 | sitemap 改 `force-static`；middleware matcher 收窄到非语种路径 | FOT/CPU/ISR 三项同时逼近上限 |
| 2026-11-24 | 全站 402（FOT 198%），升级 Pro 解除；部署清理到 3 条 | Hobby fair-use 暂停 |
| 2026-11-25 | `outputFileTracingExcludes` 剔除 content/public；llms.txt 静态化；动态路由 `dynamicParams=false`；λ 136MB→2.03MB | Function/Deployment Storage 超限 |
| 2026-11-25 | 本文档 v1.0 + `vercel-guard.sh` 落地 | 规范需要可执行，而非口头约定 |
| 2026-11-25 | 新增 `vercel-audit.sh`（事后检测）+ 每日 08:30 定时审计 | 钩子可被 `--no-verify` 绕过，需要独立检测层 |
| 2026-11-25 | 平台层 Deployment Sources 设为"生产仅 Git"，CLI/REST/v0/Hook/Marketplace 全部关闭 | 让"只能 git push"成为平台事实，而非约定 |
| 2026-11-25 | GitHub main 开分支保护（禁强推/禁删除/线性历史/含 admin） | 本地钩子可被 --no-verify 绕过，加一层远端硬拦 |
| 2026-11-25 | 预算口径改为"真实构建数"；prune 保留 ERROR 作证据；审计识别构建失败 | 058ea106 因 function_creation_throttled 构建失败，旧口径误判/漏报 |
| 2026-11-25 | Project Settings → Build and Deployment → Deployment Retention Policy：Production 部署 **30 days → 1 week** | 该设置只有天数粒度、没有"保留 N 条"字段；条数由 deploy-flush 后的 prune 控制（3 条），天数策略只作长尾兜底。1 week 给足一周回滚窗口，最长堆积 7 条 |
| 2026-11-25 | 无构建推送计数改按 `Asia/Shanghai`；无构建推送后补跑一次 prune；审计保留数只计非 CANCELED | 机器时区 PST 导致北京时间上午永远卡在 5/5；CANCELED 记录延迟生成，prune 抓不到会误报"保留 4 条" |
| 2026-11-25 | 审计扩到 11 项：加"用量快照/信用额度"与"本地守卫是否挂载"；`deploy-flush.sh` 自动补齐 `core.hooksPath` | 新克隆/新机器漏设 hook 时，pre-push 守卫等于不存在，而审计看不出来 |
| 2026-11-25 | 审计失败告警从"Mac 桌面通知"改为 **Telegram 推送**（`vercel-alert.sh` + launchd 30 分钟，连续 2 次才发、恢复发一条） | 桌面通知人不在电脑前等于静默 |
| 2026-11-25 | 新增 `.githooks/pre-commit` 批量改动软告警（>20 个 content/public 文件时列清单并记 `logs/vercel-bulk-commit.log`） | 工作区常驻他人 i18n 批量改动，`git add -A` 易把它们混进一次部署；只警告不阻断，避免打断内容流水线 |
| 2026-11-25 | 新增 `vercel-usage-weekly.sh`：按天落 `logs/vercel-usage-history.jsonl`，出 7 天增量与"额度用完预计天数"，接进每日审计 | 只有单日快照，看不到趋势，信用额度是"用完才知道" |
| 2026-11-25 | 新增 `check-i18n-leakage.py`：扫 10 语种 FAQ 是否仍是英文原文（`--strict` 可给 CI）；pre-push 只做软提示 | `/ja/` 页面 4 段 FAQ 是英文；全量扫描发现 169 篇文章、约 9000 条泄漏，属系统性问题 |
| 2026-11-25 | `drywall-screws-complete-guide` 的 FAQ 补 ja/zh 原生译文（其余 8 语种列 backlog） | 该页是本次被点名的样例 |
| 2026-11-25 | `next/image` 计费评估：维持现状（transformations=2，成本可忽略） | 关掉优化会伤 CWV/图片搜索，违背 SEO 优先 |
| 2026-11-25 | `seo-pipeline-guardian.sh` 的 `log()` 移到使用之前 | 早期分支误调 macOS `/usr/bin/log`，`Unknown subcommand` + exit 64，launchd 每次报失败 |

## 11. 踩坑清单（都是真撞出来的，别再重犯）

| 坑 | 症状 | 正确做法 |
|---|---|---|
| 用机器本地时区算"今天" | 北京时间上午预算永远显示已用满 | 所有计数显式用 `Asia/Shanghai` |
| prune 紧贴 push 跑 | 审计报"保留 4 条"，几分钟后又自己好了 | CANCELED 生成有十几秒延迟，无构建推送后 sleep 25 秒再 prune 一次 |
| 把 CANCELED 算进保留数 | 每次纯文档推送都误报超标 | 保留数只统计非 CANCELED |
| 用 `origin/main..HEAD` 判断会不会构建 | 别人推了未上线的 content 时误判"会跳过" | 用上次 READY+production 的 sha..HEAD，与 ignoreCommand 同口径 |
| 在 launchd 脚本里先调用 `log()` 再定义 | `Unknown subcommand '...'`，launchctl 第二列 64 | 函数定义放在最前；排查先 `launchctl list` 看非 0，再看 `*.err` 里的系统命令 usage |
| 全角括号紧跟变量名 | `unbound variable` | 写 `${VAR}` |
| `vercel inspect` 直接 grep | 抓不到尺寸 | 输出在 stderr，必须 `2>&1` |
| 以为 `deploymentsToKeep` 能设 | PATCH 400 `should NOT have additional property` | 只读；条数靠 prune，平台只有天数型 Retention Policy |
| 平台 cron / `at` 当可靠调度 | 到点 `last_run_time` 不动 | 本机一律用 launchd（RunAtLoad + StartInterval/StartCalendarInterval），写状态 json |
| 2026-11-25 | 接入 `@vercel/speed-insights`（CWV 实测数据，服务 SEO）；Vercel Web Analytics 与 GA4 重复，保持不接线 | Speed Insights 仪表盘早已启用但 `hasData:false`，等于白开 |
| 2026-11-25 | 新增 `vercel-usage-snapshot.sh`，用量快照进审计（第 10 项：信用额度/带宽/函数/存储/ISR/构建） | 402 事故的根因是"发现太晚"：Vercel 只在 75%/100% 发邮件，而邮件到达时站已经挂了 |
| 2026-11-25 | Instant Rollback 实测演练一次（切 145c2d25 → 验证 → 切回 896c65c8），流程写进 6.3 | 回滚方案没演练过等于没有；顺带摸清"rollback 不算部署、不占预算" |

## 附：部署窗口（2026-11-25）

`deploy-flush.sh` 在预算检查之后多一道窗口闸门 `scripts/deploy-window.sh`：只在 `09:00-11:00` 与 `17:00-19:00`（Asia/Shanghai）允许真构建，其余时间把提交攒在本地、exit 0；紧急上线用 `DEPLOY_WINDOW_FORCE=1`。窗口可用 `DEPLOY_WINDOWS="09:00-11:00,13:00-14:00"` 覆盖。与预算闸门串联后，单日最多 3 次构建且集中在两个窗口，避免和 OpenClaw 内容管线互相抢额度。

## 域名别名：push 成功≠上线（2026-11-25 事故复盘）

三个生产域名（`tradego-fasteners.com`、`www.tradego-fasteners.com`、`tradego-fasteners.vercel.app`）在 2026-07 被手工钉在 `dpl_77MMMsya` 上，之后所有 Git 部署只拿到 `tradego-fasteners-git-main-...` 别名。结果是：push 成功、构建 READY、线上内容几周不变。

处置与固化：

- `bash scripts/vercel-promote.sh`：比对「最新 READY 的 production 部署」与「域名当前指向」；
- `bash scripts/vercel-promote.sh --apply`：把三个域名指向最新部署，并抽检文章页是否出现 `FAQPage`；
- 每日 08:35 的 `~/AgentOps/bin/content_audit.sh` 已内嵌 promote + 抽检，抽不到 `FAQPage` 会弹桌面通知。

自查命令：

```bash
curl -s "https://api.vercel.com/v4/aliases?limit=100" -H "Authorization: Bearer $TOKEN" | \
  python3 -c "import json,sys;[print(a['alias'],a.get('deploymentId','')[:12]) for a in json.load(sys.stdin)['aliases'] if 'tradego' in a['alias']]"
```

## 补丁：计数口径、上线最后一公里、定时器对齐（2026-11-25 晚）

三处结构性漏洞已修：

1. **真实部署计数** `scripts/deploy-ledger.py`：台账 `logs/deploy-history.jsonl` 按 uid 持久化，`sync` 从 API 补账、`count` 按北京时间给当日构建数。`vercel-audit.sh` 改以台账为准——此前数的是"现存部署"，剪枝删两条就把 5 次构建显示成 3 次，闸门被自己的清理动作洗白。今天真实构建 5 次，台账如实记 5 次，审计如实报红。
2. **上线最后一公里** `scripts/vercel-promote-wait.sh`：git push 只产生部署并给 git-main 别名，三个生产域名钉在旧部署上不动（今天 523ab23a 构建 READY 但线上仍是 3b351da1）。`deploy-flush.sh` 推送后自动挂起等待进程，等本次 sha READY 后跑 `vercel-promote.sh --apply`，日志写 `logs/promote.log`。
3. **定时器对齐窗口** `com.tradego.deploy-flush` 原为 12:30/21:30 本地(PST)=04:30/13:30 CST，永远落在 09:00–11:00、17:00–19:00 窗口之外，等于永不自动上线。改成 `StartInterval 1800`（每 30 分钟检查一次），由窗口与预算闸门决定推不推。

## 新检测项：多语种渲染抽检

`scripts/check-render-locales.py` 已并入每日审计（第 9 项），抽样抓线上 HTML 断言三条：
非英文页不得出现英文问句、有 FAQ 标题就必须有问答条目、英文页必须有 FAQPage 结构化数据。

首次跑就抓到两类真问题：
- 阿语页空 FAQ 标题（native-only 过滤后标题仍渲染，修法见 `renderSection` 的 `isFaqSection` 判断）；
- 15 篇改过名的文章旧 slug 直接 404：`generateStaticParams` 把 redirectTo 文章排除了，又设 `dynamicParams=false`，页面里的 `permanentRedirect` 根本不执行 —— 150 个 URL（15 篇 × 10 语种）丢掉外链权重。已改为 redirect slug 也预生成（只输出 301，不占空间）。

## 2026-11-25 补丁四：预算闸门改吃台账（不是 API 现值）

现象：`deploy-budget.sh` 只看 Vercel API 列表里的"现存"部署，剪枝删掉两条旧部署后，当天 6 次真实构建被算成 3 次、4 次，闸门等于被自己的清理动作洗白，继续放行第 7 次。

改法：`deploy-budget.sh` 取 `max(Vercel API, logs/deploy-budget.json, logs/deploy-history.jsonl 当日条数)`。
台账按 uid 持久化、删部署不丢，是权威口径；API 只用来补"别的 agent 刚推的"；本机计数器作兜底。
判定输出会同时打印三个数（`Vercel=4 本地=3 台账=6`），一眼能看出是谁在刷。

## FAQ 小节正文：不再渲染英文副本

`renderSection` 原先对 FAQ 小节也渲染 `section.body`，而 body 是英文问答正文的复制；本地化缺失时 `localizedText` 回退 en，非英语种的页面上就整段漏英文（渲染抽检只查问句，一直没抓到这一层）。
现在 FAQ 小节只渲染 `FAQ_INTRO[locale]` 一句本地化引导语，内链到 `/{locale}/products` 与 `/{locale}/contact`；条目由 native-only 折叠块 + FAQPage JSON-LD 承载。顺带把"FAQ 重复正文"这一层 SEO 重复内容也去掉了。

## 2026-11-25 补丁五：直推清零 + 钩子硬闸门

背景：`deploy-flush` 成了"唯一推送入口"，但 `auto-seo-v2.sh`、`auto-seo.sh`、`hybrid-cron-v1/v3.sh`、`publish-queue.sh`、`seo-deploy-only.sh`、`seo-deep-dryrun.sh` 里还留着裸 `git push origin main`。13:13 deploy-flush 拦下人工推送时，13:14 / 13:25 又各起了一次构建，当天真实构建数到 7。

改法两层：
1. 上述脚本的推送一律替换为 `bash "$PROJECT_DIR/scripts/deploy-flush.sh"`，预算、窗口、promote 全部由它决定；脚本只负责 commit。
2. `.githooks/pre-push` 增加只读预算校验：非 `DEPLOY_FORCE=1` 推送时先跑 `DEPLOY_BUDGET_READONLY=1 bash scripts/deploy-budget.sh`，超预算 exit 1。只读模式不写计数器，避免钩子与 push 各记一次。

保留的两个逃生口：`DEPLOY_FORCE=1 git push`（彻底跳过）、`DEPLOY_SKIP_BUDGET=1 git push`（只跳过预算）。两者都属事故通道，用完在 `logs/vercel-usage-watch.md` 留痕。
自检：`echo refs | .githooks/pre-push origin <url>` 可直接验证拦截是否生效（超预算时 rc=1）。

## 2026-11-26 补丁：CTA 文案 native-only

线上实测两处：`en/ar` 页底部 CTA 直接显示 `Need {topic} for your B2B project?`（4 篇文章的 `cta.text` 带未替换占位符）；188 篇文章的 `cta.buttonText` 在 ar/ru/hi 里是英文 `Request Quote`，非英语页出现英文按钮。
口径统一到和 FAQ 一致：该语种值等于 en 视为缺失、含 `{topic}` 视为不可用，一律回落 `uiCopy.articleCta` 的本地化通用文案。抽检脚本新增 `{topic}` 残留断言。

## 变更记录 2026-11-25（预算闸门 fail-open 事故）

- **事故**：当日真实构建 10 次（预算 3），`deploy-budget.sh` 全程打印"预算内，放行"。
- **根因**：① Vercel `GET /v6/deployments?projectId=...`（含加 `teamId`）对 CLI token 返回 403，`api_count` 为 None；② 拦截条件写成 `if api_count is not None and count >= limit`，读不到就跳过 —— 典型 fail-open。
- **修复**：拦截改为只看 `count >= limit`；新增 `scripts/vercel_deployments.py`（全量拉取 + 本地按 projectId/name 过滤，输出与 API 同形），promote / promote-wait / prune / _prev-prod-sha / audit / ledger sync 全部改走它。
- **防复发**：新增 `scripts/vercel-gate-selftest.sh`（预算=0 必须拦、预算放大必须放、`DEPLOY_FORCE` 必须放、取数脚本可用、pre-push 已挂载），作为审计第 10 项；护栏脚本每次改动都必须跑。
- **铁律**：护栏里"读不到上游数据就放行"的分支等于没有护栏；取数失败只能影响"能否看到别人的推送"，不能影响"我自己能不能推"。

## 变更记录 2026-11-25（并发提交归属错乱，第二次）

- **现象**：本地两个 agent 同写一份工作区，一边跑 `git commit -a` 把另一边刚落地的内容改动一起卷进提交，commit message 只描述了自己那部分 → 归属错乱、事后无法按 commit 追溯是谁改了什么（上一次同样的问题记在 44ddbe7d）。
- **本轮受影响**：`fda34896`（标题写的是"输送带接头与 IBR 屋面条补足 1600+ 词"）实际还包含 13 篇文章 41 处"单词级串语"修正（ja/es/fr/pt/de 各语种零星混入俄语/中文词），见 `scripts/oneoff-stray-word-fix.py`。
- **处置**：不改写历史（rebase 会打断另一条流水线），改为在审计层面留痕 + 提高未来可见性。
- **新增护栏**：`.githooks/pre-commit` 在"同时暂存 content/ 与 src|scripts|docs 且总数 ≥4"时打跨领域混合告警，提示改用 `git commit -- <paths>` 只提交自己的文件，并写入 `logs/vercel-bulk-commit.log`（只告警不阻断，避免打断合法的跨领域提交）。
- **约定**：每个 agent 提交时用路径限定（`git commit -- <本轮改的路径>`），不要 `git add -A`；发现别人的在途改动就留在工作区，不替它提交。

## 变更记录 2026-11-25 晚（邮件驱动的失败复盘：两次构建挂在同一个本地资产上）

从 Vercel 通知邮件（`notifications@vercel.com`、`billing@vercel.com`）里翻出来的事实：

- **两封失败邮件，不是一次事故**：`058ea10`（2026-11-25 00:51 UTC / 08:51 CST）和 `a48bd40`（11:44 UTC / 19:44 CST）都让 `next build` 退 1。前一次发生在任何人工介入之前，说明品牌线换图标那天线上就已经滞后了十几个小时，只是没人看邮件。
- **根因同一个**：`src/app/favicon.ico` 里的 PNG 帧是 RGB，Turbopack 报 `Format error decoding Ico: The PNG is not in RGBA format!` 直接中止构建。
- **账单侧**：`$20.00` Pro，账期 Nov 24–Dec 23，2026-11-24 已付（发票 `Invoice-QFPY9VWU-0003.pdf`）。Free 团队的 "sites are offline / 198% Fast Origin" 邮件都发生在升级之前，不是当前状态。

对应改动（都在 `scripts/`，不改业务代码）：

1. `scripts/check-build-assets.py` —— 直接读 ICO 二进制目录 + PNG IHDR 颜色类型，要求每帧 RGBA 且含 16/32/48。**不用 PIL 判断**：PIL 读 ICO 只暴露一帧，还会把 RGB 静默转成 RGBA，正好放过这次事故的文件。
2. `scripts/deploy-preflight.sh` —— push 前的本地体检（fail-closed）：资产体检永远跑；改了 `content/articles` 跑 schema；改了 `src/public/依赖` 跑本地 `npm run build`。`PREFLIGHT_SKIP=1` 才跳过，且会打醒目告警。
3. `deploy-flush.sh` 在 `git push` 前强制调用它：体检不过就保留提交、不推。
4. `vercel-promote-wait.sh` 修 `$state` 后紧跟中文全角括号导致老 bash 把多字节吃进变量名的 `unbound variable`（`line 54: state?: unbound variable`）—— 这就是之前每次 push 后自动 promote 必崩的原因，现在 READY/超时两条分支都跑通。
5. `vercel-audit.sh` 的失败告警改成“只报比线上更晚的失败”，并且措辞不再写成"最新部署构建失败"。之前 prune 保留的旧 ERROR 会被 `bad[0]` 选中，报出与事实相反的告警。

教训：**Vercel 失败邮件是"生产已滞后"的第一信号，不是噪音**。看到 `Production deployment failed` 先查 `vercel_deployments.py` 里生产域名指向的 sha，再决定是补 promote 还是修构建。

## 夜间自动推送（2026-11-25 加）


当日构建预算触顶后，`pre-push` 会拒绝推送，白天不再消耗预算。夜间窗口由 launchd 兜住：

- 任务：`com.agentops.content-push`（`~/Library/LaunchAgents/`），脚本 `~/AgentOps/bin/content-push.sh`，`StartInterval 600`。
- 门控：只在 Asia/Shanghai `00` 点窗口动作；当日成功后写 `~/AgentOps/state/content-push-<日期>.done`，同一天不会重复推。
- 顺序：契约校验（BLOCK>0 即停）→ `contract_selftest.py`（失败即停）→ `git push origin main` → `vercel-promote.sh --apply` → `vercel-audit.sh`，结果写 `~/AgentOps/logs/content-push.log` 并弹桌面通知。
- 失败重试：推送成功后才写 marker，所以 00 点窗口内失败每 10 分钟重试一次；出了窗口自动停，等第二天。
- 手动放行单次：`FORCE=1 bash ~/AgentOps/bin/content-push.sh`（会跳过时间门控，其余护栏不变）。
