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
1. `npx vercel inspect <url>` 看构建日志尾部
2. 本地复现：`rm -rf .next && npx next build`
3. **不要在线上反复重试**（每次都算一次部署）
4. 定位不了就 `git revert` 上一个提交再走一次发布流程

### 6.3 回滚
- 首选：`git revert <sha>` → 走正常发布会话（保留 3 条部署，旧版仍可切回）
- 紧急：Vercel 后台 Instant Rollback 到上一条 READY 部署（Pro 支持），事后仍须用 git revert 对齐代码
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
| `npx vercel ls tradego-fasteners --json` | 部署列表（含 sha、状态、时间） |
| `npx vercel inspect <url>` | 构建产物与 Lambda 尺寸 |

---

## 9. 保障机制：怎么确保真的按规范执行

规范不是靠自觉。四层叠加：平台硬拒 → 本地拦截 → 事后审计 → 凭证收敛，每层都能独立证伪"没按规定来"。

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
`scripts/vercel-audit.sh` 每天 08:30 由定时任务自动跑（`--quiet` 模式只在违规时出声）。检测 9 项：

1. 生产部署的 `source` 必须是 `git` —— **CLI 直推会留成 `source: cli`，这是最硬的证据**
2. 平台策略必须仍是"仅 git"（防止有人把开关又打开）
3. 当日部署次数 ≤ 3
4. 线上保留部署 ≤ 3
5. 线上最新**可访问**部署的 commit 是 origin/main 的祖先；若落后，其间不得有 `content / src / public / next.config.ts / package.json` 变更
6. 线上每条部署的 commit 都存在于本地 git 历史（挡住"未推送代码直接上线"）
7. 最新部署最大 Lambda ≤ 5MB
8. `/en/` 200
9. CDN 长缓存头正常

违规会写进 `logs/vercel-audit.log` 并在当日摘要里报出来，不会静默。

### 第四层 · 凭证收敛（把能力本身限制住）
- Vercel CLI token 只在**这台 Mac**（`~/Library/Application Support/com.vercel.cli/auth.json`）；云主机 `vm` 与 Windows 机器都没有登录态，物理上跑不了部署
- 团队 owner 只有 `ipedmond9951@gmail.com`；没有第二个可部署身份
- 不为任何 agent 单独发放 token；所有代理一律通过 `deploy-flush.sh` 这条命令上线

### 附：ignoreCommand 的副作用（必须知道）
`vercel.json` 的 `ignoreCommand` 在"只有 `content/src/public/next.config.ts/package.json` 之外的路径发生变化"时以 exit 0 跳过构建。因此**纯文档/脚本的提交会显示为 CANCELED 部署，不产生线上部署**——这是省额度的正常行为，不是故障。审计脚本已按此语义判定（线上 commit 可以是 origin/main 的祖先，前提是其后没有构建产物相关改动）。

对应地，`deploy-flush.sh` 会先判断本次 diff 是否命中构建路径：没命中就跳过部署预算计数（这类 push 不占"每日 3 次构建"额度），但仍受"每日无构建推送 ≤5 次"的独立上限约束。

### 已知缺口（不粉饰）
1. `git push --no-verify` 可以跳过 pre-push 钩子 —— 但第三层的 sha 对齐 + 当日次数审计仍会记录，且部署本身仍是一次正常的 git 部署，风险有限
2. ~~能读到本机 token 的进程仍可 `vercel --prod`~~ —— 已被平台层堵死（来源策略仅 git）；万一有人把开关打开，第三层审计当天就会报"未启用部署来源限制"
3. 若将来多人协作或代理增多，应升级为 **GitHub 分支保护（main 必须走 PR + 必过 checks）**；当前单人直推流程与之冲突，暂不启用，写在这里作为下一步选项

## 10. 变更记录

| 日期 | 变更 | 触发原因 |
|---|---|---|
| 2026-11-24 | sitemap 改 `force-static`；middleware matcher 收窄到非语种路径 | FOT/CPU/ISR 三项同时逼近上限 |
| 2026-11-24 | 全站 402（FOT 198%），升级 Pro 解除；部署清理到 3 条 | Hobby fair-use 暂停 |
| 2026-11-25 | `outputFileTracingExcludes` 剔除 content/public；llms.txt 静态化；动态路由 `dynamicParams=false`；λ 136MB→2.03MB | Function/Deployment Storage 超限 |
| 2026-11-25 | 本文档 v1.0 + `vercel-guard.sh` 落地 | 规范需要可执行，而非口头约定 |
| 2026-11-25 | 新增 `vercel-audit.sh`（事后检测）+ 每日 08:30 定时审计 | 钩子可被 `--no-verify` 绕过，需要独立检测层 |
| 2026-11-25 | 平台层 Deployment Sources 设为"生产仅 Git"，CLI/REST/v0/Hook/Marketplace 全部关闭 | 让"只能 git push"成为平台事实，而非约定 |
