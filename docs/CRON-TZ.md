# 定时任务时区（CRON-TZ）

**一句话**：这台 Mac 的系统时区是 `America/Los_Angeles`（PST，UTC-8），而 launchd 的
`StartCalendarInterval` **没有时区字段、一律按机器本地时区解释**。所以 plist 里写
`03:30` 真正发生的时间是 **CST 03:30 + 16h = 19:30**，不是你以为的 03:30 CST。

```
CST = PST + 16h        （CST 00:06  →  plist 08:06，同一天）
PST = CST - 16h        （CST 03:30  →  plist 11:30，前一天）
```

## 硬规则

1. plist 里只写**换算后的 PST 字面值**；意图时刻一律以 CST 记在清单里，不靠脑子记。
2. `StartInterval`（每 N 秒/分钟）**不受时区影响**，不需要换算；新任务优先用
   `StartInterval` + 脚本内 CST 窗口自校验（如 `AgentOps/bin/content-push.sh` 的
   CST 00 点窗口 marker）。
3. 脚本里凡是要判断"今天/现在几点"的，一律 `TZ=Asia/Shanghai date`，不要用裸 `date`。
4. 日历任务必须能被 `launchd-cst.py check` 校验（有意图、有 PASS）。

## 工具

`~/Doubao/agents/tools/launchd-cst.py`（意图清单：`~/Doubao/agents/tools/launchd-intent.json`）

```bash
python3 ~/Doubao/agents/tools/launchd-cst.py list            # 全机日历任务：字面值 → 实际 CST → 下次触发
python3 ~/Doubao/agents/tools/launchd-cst.py check           # 按意图逐条比对，有偏差 exit 1
python3 ~/Doubao/agents/tools/launchd-cst.py apply --dry-run # 预览要写的 PST 字面值
python3 ~/Doubao/agents/tools/launchd-cst.py apply           # 改写（自动备份 + 重载 + 复验）
python3 ~/Doubao/agents/tools/launchd-cst.py set --label X --cst 08:30   # 改意图
```

写操作前把原 plist 复制到 `~/Doubao/agents/backup/`，可直接 `cp` 回去再
`launchctl bootout/bootstrap` 回滚。

## 现行任务表（2026-11-25 对齐后）

| 任务 | 意图（CST） | plist 字面（PST） | 说明 |
|---|---|---|---|
| com.tradego.push-cert-clean | 11-26 00:06 | 11/25 08:06 | 一次性，推品牌批次剩余提交 |
| com.tradego.daily-publish | 每日 01:00 | 09:00 | 发布队列，排在 content-push 00:00 之后，避免同分钟抢推 |
| com.tradego.seo-master | 每日 03:30 | 11:30 | `seo-ai-pipeline.sh` 注释即 03:30 CST |
| com.tradego.seo-pipeline-guardian | 每日 04:00 | 12:00 | pipeline 后 30 分钟自修复；**RunAtLoad 已设 false**，reload 不再立刻重跑 pipeline |
| com.tradego.vercel-audit | 每日 08:30（另保 6h StartInterval） | 16:30 | `docs/VERCEL-OPS.md` 口径 |
| com.agentops.daily | 每日 08:30 | 16:30 | AgentOps 巡检 |
| com.agentops.content-contract | 每日 08:35 | 16:35 | `docs/CONTENT-CONTRACT.md` 口径 |
| com.tradego.social-link-check | 每日 09:05 | 17:05 | 社媒主页死链 |
| com.agentops.i18n | 每日 09:10 | 17:10 | i18n 队列清理 |
| com.skillclaw.nightly | 每日 03:30 | 11:30 | skillclaw：每夜 3:30 自进化 |
| com.kk-electric.cwv-audit | 每日 08:00 | 16:00 | yoke-voltage-regulator |
| com.kk-electric.indexnow-ping | 每日 05:30 | 13:30 | 赶抓取前推 IndexNow |
| com.kk-electric.schema-validator | 周日 03:00 | 周六 11:00（Weekday=6） | 周任务星期会顺移一天，见下 |
| com.kk-electric.hreflang-audit | 周日 04:00 | 周六 12:00（Weekday=6） | 排在 schema 之后 |

**周任务的星期也要换算**：launchd 的 `Weekday` 0/7=周日，本地 = CST − 16h 会**退回一天**，
所以 CST 周日 → 本地周六（`Weekday=6`）。工具里按 `(cst周 − 1) mod 7` 算，改完用
`list` 看"下次本地 → 下次 CST"是否仍落在你想要的星期。

### 有意保持现状（不要平移）

| 任务 | 字面（PST） | 实际（CST） | 为什么保留 |
|---|---|---|---|
| tradebrain.auto-prospect | 8:00 | 00:00 | 凌晨抓线索，不占白天 |
| tradebrain.engaged-queue | 8:40 | 00:40 | 抓完再排队 |
| tradebrain.process-sequences | 9:00 | 01:00 | **在 19:00–04:00 发信窗口内** |
| tradebrain.leadgen | 16:30 | 08:30 | 早上补线索 |
| tradebrain.log-rotate | 5:10 | 21:10 | 与发信窗口错开 |
| tradebrain.resend-sync | 7:30 / 21:30 | 23:30 / 13:30 | 事件回写频次 |
| user.backup | 2:00 | 18:00 | 本机凌晨备份，按机器本地时间有意为之 |

这批没有平移任何一条：TradeBrain 的发信时间是**围绕发送窗口 19:00–04:00（北京）**设的，
把它们"纠正"成 09:30 CST 反而会把冷邮件发到窗口外。已登记在 `launchd-intent.json` 的
`keep` 段，`check` 会校验字面值有没有被谁偷偷改掉。

不受影响（`StartInterval`，与时区无关）：`com.agentops.content-push`(600s)、
`com.tradego.deploy-flush`(1800s)、`faq-l10n`(600s)、`ga4-monitor`(900s)、
`vercel-alert`(1800s)、`seo-pipeline-watcher`(1800s)；
`social.tick`、`ai-news-local`、`daily-leads-local` 只写 `Minute`（每小时），也与日界无关。

## 每次验证方法（改完必做）

```bash
# 1) 静态：意图 vs 字面值
python3 ~/Doubao/agents/tools/launchd-cst.py check      # 期望：全部 PASS
# 2) 动态：证明 launchd 真的按 PST 解释（插一个 2 分钟后触发的探针）
#    探针 plist 写 Hour/Minute = 本地时间+2min，脚本里同时写 date 与 TZ=Asia/Shanghai date
#    触发后两者应相差整 16 小时
# 3) 载入确认：每条都要在 launchctl list 里（否则改完根本不会跑）
launchctl list | grep -E "tradego|agentops"
```

2026-11-25 的实测证据：探针 plist 写 `Hour=5 Minute=15`，实际触发
`local=2026-11-25 05:15:02 PST` / `cst=2026-11-25 21:15:02 CST`（差 16h），
记录在 `~/Doubao/agents/logs/tz-verify-20261125.txt`。

## 踩过的坑

- **`launchctl bootstrap` 偶发 `Bootstrap failed: 5: Input/output error`**：改用
  `launchctl load -w <plist>` 可成功（工具里已做兜底）。bootstrap 失败不代表任务在跑，
  改完必须 `launchctl list` 确认已载入。
- **`RunAtLoad true` 的日历任务**：每次 reload 都会立刻跑一次。守护/重任务（如
  seo-pipeline-guardian）应设 `RunAtLoad false`，否则改时间时会意外触发重跑。
- **日历任务改时区不能靠 `plutil` 手改**：容易只改 Hour 忘了 Day/Month 的跨日回退
  （CST 00:06 落在前一天的 PST 日期）。

## 关机 / 重启之后（2026-11-26 实测）

**launchd 的日历触发一旦错过，不会补跑** —— 这是和 cron 最大的行为差异：

| 情况 | 行为 |
|---|---|
| 机器睡眠中到点 | 唤醒后**补跑一次** |
| 机器**关机**跨过时间点 | **永久错过**，当天等于没跑 |
| 开机但没登录 GUI | `~/Library/LaunchAgents` 一个都不加载，全部不跑 |
| 重启后 | 登录时自动加载（`RunAtLoad=false` 的不会立刻执行，只恢复日程） |

2026-11-25 06:22 PST 真实重启后的实测：55 个 plist 里 49 个自动回来了，
`com.tradego.seo-pipeline-watcher` 漏载（重启后偶发），说明"重启就自动全好"靠不住。

### 兜底：com.tradego.boot-check

`RunAtLoad=true` + 每 30 分钟，跑 `~/Doubao/agents/tools/after-reboot-check.sh`：

1. `launchd-cst.py check`（时区意图 vs 字面值 + **是否真的被 launchd 载入**）
2. 发现漏载的自动 `launchctl load -w`（被 `disable` 过的跳过，不硬拉）
3. CST 00:00–03:00 窗口内、且本地有未推提交、且当天空闲 → 调 `push-cert-clean-*.sh` 补推
4. 结果写 `~/Doubao/agents/logs/boot-check-<CST日期>.log`，并弹桌面通知

日志：`~/Doubao/agents/logs/boot-check-*.log`、摘要 `~/Doubao/agents/state/boot-check-latest.txt`。

### 两个必知的坑

- **补推也会被预算拦**：2026-11-26 00:00 窗口 content-push 连推 3 次把当日预算打满，
  00:06 的定时任务准点触发（08:06:08 PST = 00:06 CST）但被 `deploy-budget.sh` 拦下，
  剩下 19 个本地提交只能等下一个窗口。预算闸门 fail-closed 是**对的**，别用 `DEPLOY_FORCE` 硬推。
- **pre-push 钩子自己坏了会静默拦一切推送**：当晚 `check-build-assets.py` 在系统 python3.9 下
  `int | None` 直接 TypeError（且依赖 Pillow），加上 `icon.png/apple-icon.png` 是 RGB 非 RGBA，
  连续拦掉两次推送。已修：脚本去掉 Pillow 依赖、加 `from __future__ import annotations`，
  两张图标转 RGBA。**判断"定时推送没生效"时，先看推送日志里的 `git push 失败` 原因，别只看时间**。

### 重启后自查顺序

```bash
python3 ~/Doubao/agents/tools/launchd-cst.py check     # 期望：全部 PASS（含"已载入"）
tail -5 ~/Doubao/agents/logs/boot-check-$(TZ=Asia/Shanghai date +%Y%m%d).log
bash ~/Doubao/agents/tools/after-reboot-check.sh       # 手动补一次
```
