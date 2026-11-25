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
