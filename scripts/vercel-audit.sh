#!/bin/bash
# vercel-audit.sh - Vercel 操作合规审计（事后检测层）2026-11-25
#
# 定位：vercel-guard.sh 是"事前预防"（钩子拦 push、封禁直推命令），本脚本是"事后检测"——
# 就算有人用 git push --no-verify、或在别的机器上用 CLI 直接部署，这里都能查出来。
#
# 检测项（对应 docs/VERCEL-OPS.md）：
#   1. 部署来源: 生产部署的 source 必须是 git（CLI 直推会是 cli）
#   2. 当日部署数（北京时间）≤ AUDIT_DAILY_LIMIT（默认 3）
#   3. 线上保留部署数 ≤ AUDIT_KEEP（默认 3）
#   4. 线上最新 commit sha == origin/main HEAD
#   5. 最近部署的 commit 必须存在于本地 git 历史（未推送代码不得上线）
#   6. 最新部署最大 Lambda ≤ 5MB
#   7. 站点可用: /en/ 200 且带 s-maxage=86400
#
# 退出码: 0 = 合规；1 = 发现违规（需人工处置）
# 用法:
#   bash scripts/vercel-audit.sh              # 审计 + 打印结论
#   bash scripts/vercel-audit.sh --quiet      # 仅在违规时输出（给定时任务用）

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1
DAILY_LIMIT="${AUDIT_DAILY_LIMIT:-3}"
KEEP="${AUDIT_KEEP:-3}"
AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"
PROJECT_ID="prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
LOG="$ROOT/logs/vercel-audit.log"
mkdir -p "$ROOT/logs"

FAIL=0
declare -a ISSUES
say() { [ "$QUIET" -eq 0 ] && echo "$1"; return 0; }
issue() { ISSUES+=("$1"); FAIL=$((FAIL+1)); say "  ❌ $1"; }
pass() { say "  ✅ $1"; }

[ "$QUIET" -eq 0 ] && echo "🕵  Vercel 合规审计 $(date '+%Y-%m-%d %H:%M')"

# --- 本地守卫是否真的挂上（新克隆/新机器最容易漏，漏了 guard 等于不存在）---
HP=$(git config core.hooksPath 2>/dev/null || echo "")
if [ "$HP" = ".githooks" ] && [ -x .githooks/pre-push ]; then
  pass "本地 pre-push 守卫已挂载（core.hooksPath=.githooks）"
else
  issue "本地守卫未挂载（core.hooksPath=${HP:-空}），push 会绕过 guard：git config core.hooksPath .githooks"
fi

git fetch -q origin main 2>/dev/null || true
ORIGIN_SHA=$(git rev-parse origin/main 2>/dev/null || echo "")
HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo "")

DATA=$(python3 - "$AUTH" "$PROJECT_ID" <<'PY'
import json, sys, urllib.request
auth, pid = sys.argv[1], sys.argv[2]
tok = json.load(open(auth))["token"]
req = urllib.request.Request(
    "https://api.vercel.com/v6/deployments?projectId=%s&limit=20" % pid,
    headers={"Authorization": "Bearer " + tok},
)
d = json.load(urllib.request.urlopen(req))
out = []
for x in d.get("deployments", []):
    m = x.get("meta") or {}
    out.append({
        "uid": x.get("uid"),
        "url": x.get("url"),
        "source": x.get("source"),
        "state": x.get("state"),
        "target": x.get("target"),
        "createdAt": x.get("createdAt"),
        "sha": (m.get("githubCommitSha") or "")[:8],
        "sha_full": m.get("githubCommitSha") or "",
        "ref": m.get("githubCommitRef") or "",
    })
print(json.dumps(out, ensure_ascii=False))
PY
) || { issue "无法读取 Vercel 部署列表（检查 CLI 登录）"; DATA="[]"; }

# --- 1. 部署来源 + 2/3. 数量统计 ---
STATS=$(printf '%s' "$DATA" | python3 -c '
import json, sys, datetime
ds = json.load(sys.stdin)
tz = datetime.timezone(datetime.timedelta(hours=8))
today = datetime.datetime.now(tz).date()
today_ds = [d for d in ds if datetime.datetime.fromtimestamp(d["createdAt"]/1000, tz).date() == today]
cli = [d for d in ds if (d.get("source") or "") != "git" and d.get("target") == "production"]
# 保留数只算占位部署：CANCELED（ignoreCommand 跳过构建的记录）没有产物，prune 会即时删除，
# 不能算进"线上保留 3 条"，否则每次纯 docs 推送都会误报第 4 条。
keep_ds = [d for d in ds if (d.get("state") or "") != "CANCELED"]
print(len(keep_ds), len(today_ds), len(cli))
for c in cli[:5]:
    print("CLI", c["sha"], datetime.datetime.fromtimestamp(c["createdAt"]/1000, tz).strftime("%m-%d %H:%M"))
')
TOTAL=$(echo "$STATS" | sed -n 1p | awk '{print $1}')
TODAYN=$(echo "$STATS" | sed -n 1p | awk '{print $2}')
CLIN=$(echo "$STATS" | sed -n 1p | awk '{print $3}')

[ "$CLIN" -eq 0 ] && pass "部署来源全部为 git 集成（无 CLI 直推）" || issue "发现 $CLIN 条 CLI 直推的生产部署（违反第 4 节）"
echo "$STATS" | grep "^CLI" | while read -r _ sha when; do echo "      违规部署: $sha @ $when"; done

# 平台侧硬约束：项目只允许 git 来源部署生产（设置了才真正堵死 CLI/REST API）
POLICY=$(python3 - "$AUTH" "$PROJECT_ID" <<'PY'
import json, sys, urllib.request
auth, pid = sys.argv[1], sys.argv[2]
tok = json.load(open(auth))["token"]
req = urllib.request.Request("https://api.vercel.com/v9/projects/%s" % pid,
                             headers={"Authorization": "Bearer " + tok})
d = json.load(urllib.request.urlopen(req))
pol = (d.get("deploymentPolicy") or {}).get("deploymentSources") or []
srcs = set()
for rule in pol:
    if rule.get("enabled"):
        srcs.update(rule.get("sources") or [])
print(",".join(sorted(srcs)) if srcs else "unrestricted")
PY
)
case "$POLICY" in
  git) pass "平台已限制生产部署来源=git（CLI/REST API 被 Vercel 拒绝）" ;;
  unrestricted) issue "项目未启用部署来源限制（任何人可用 CLI 直推），去 Settings→Build and Deployment 设 Override=仅 Git" ;;
  *) issue "部署来源限制异常: $POLICY（应为 git）" ;;
esac

[ "$TODAYN" -le "$DAILY_LIMIT" ] && pass "当日部署 ${TODAYN} 次（≤${DAILY_LIMIT}）" || issue "当日部署 $TODAYN 次，超过 $DAILY_LIMIT 次上限"
[ "$TOTAL" -le "$KEEP" ] && pass "线上保留 ${TOTAL} 条（≤${KEEP}）" || issue "线上保留 $TOTAL 条，超过 $KEEP 条（跑 vercel-prune.sh --apply）"

# --- 4/5. sha 对齐与来源合法性 ---
LIVE=$(printf '%s' "$DATA" | python3 -c 'import json,sys;ds=json.load(sys.stdin);x=next((d for d in ds if d.get("state")=="READY" and d.get("target")=="production"),{});print(json.dumps(x))')
LATEST_SHA=$(printf '%s' "$LIVE" | python3 -c 'import json,sys;d=json.load(sys.stdin);print(d.get("sha_full",""))')
if [ -z "$LATEST_SHA" ]; then
  issue "取不到线上最新部署 sha"
elif [ "$LATEST_SHA" = "$ORIGIN_SHA" ]; then
  pass "线上最新 ${LATEST_SHA:0:8} = origin/main"
else
  # 允许“仅文档/脚本变更”落后：vercel.json 的 ignoreCommand 会跳过不必要的构建
  if git merge-base --is-ancestor "$LATEST_SHA" "$ORIGIN_SHA" 2>/dev/null; then
    if git diff --quiet "$LATEST_SHA" "$ORIGIN_SHA" -- content src public next.config.ts package.json 2>/dev/null; then
      pass "线上 ${LATEST_SHA:0:8} 是 origin/main 祖先，其后仅 docs/scripts 变更（ignoreCommand 已跳过构建，最新提交 ${ORIGIN_SHA:0:8} 无生产部署）"
    else
      issue "线上 ${LATEST_SHA:0:8} 落后于 origin/main，且其间有构建产物相关变更未上线"
    fi
  else
    issue "线上 ${LATEST_SHA:0:8} 不是 origin/main 的祖先（代码来源可疑）"
  fi
fi
[ "$HEAD_SHA" != "$ORIGIN_SHA" ] && say "  ⚠️  本地 HEAD ${HEAD_SHA:0:8} 领先 origin/main，有未推送提交"

# 构建失败要单独报：线上不是"没部署"，而是"部署挂了"
FAILED=$(printf '%s' "$DATA" | python3 -c 'import json,sys;ds=json.load(sys.stdin);bad=[d for d in ds if d.get("state")=="ERROR"];print(json.dumps(bad[0]) if bad else "")')
if [ -n "$FAILED" ]; then
  FUID=$(printf '%s' "$FAILED" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("uid",""))')
  FSHA=$(printf '%s' "$FAILED" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("sha_full","")[:8])')
  ECODE=$(bash "$ROOT/scripts/_vercel-deploy-error.sh" "$FUID" 2>/dev/null || true)
  if [ "$FSHA" != "${LATEST_SHA:0:8}" ]; then
    issue "最新部署 ${FSHA} 构建失败（${ECODE:-unknown}），线上仍是 ${LATEST_SHA:0:8}；修 forward 后重推，别用 CLI 绕"
  fi
fi

# --- 6. Lambda 尺寸 ---
URL=$(printf '%s' "$LIVE" | python3 -c 'import json,sys;d=json.load(sys.stdin);print(d.get("url",""))')
if [ -n "$URL" ]; then
  MAXMB=$(npx --yes vercel inspect "$URL" 2>&1 | grep -oE "λ [^ ]+ ?\([0-9.]+MB\)" | grep -oE "[0-9.]+MB" | sed 's/MB//' | sort -rn | head -1)
  if [ -n "$MAXMB" ]; then
    if [ "$(echo "$MAXMB < 5" | bc -l 2>/dev/null || echo 1)" = "1" ]; then pass "最大 Lambda ${MAXMB}MB（≤5MB）"; else issue "最大 Lambda ${MAXMB}MB 超过 5MB"; fi
  else
    say "  ℹ️  未能解析 Lambda 尺寸（跳过）"
  fi
fi

# --- 7. 站点可用 ---
CODE=$(curl -s -o /dev/null -w "%{http_code}" -L https://www.tradego-fasteners.com/en/)
[ "$CODE" = "200" ] && pass "/en/ → 200" || issue "/en/ → $CODE（站点不可用）"
CC=$(curl -sI -L https://www.tradego-fasteners.com/en/ | grep -i cache-control | head -1)
case "$CC" in *s-maxage=86400*) pass "CDN 长缓存正常";; *) issue "缓存头异常: ${CC:-<空>}";; esac

# --- 8. 用量快照（防 402 复发：Vercel 只在 75%/100% 发邮件，必须自己看） ---
USAGE="$ROOT/logs/vercel-usage.json"
if [ -s "$USAGE" ]; then
  URES=$(python3 - "$USAGE" <<'PY'
import json, sys, datetime
d = json.load(open(sys.argv[1]))
ts = d.get("checked_at", "")
try:
    age_h = (datetime.datetime.now(datetime.timezone.utc) - datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))).total_seconds() / 3600
except Exception:
    age_h = 999
pct = float(d.get("credit_pct") or 0)
if age_h > 36:
    print("STALE|%.0f|%.1f" % (age_h, pct))
elif pct >= 95:
    print("HIGH|%.0f|%.1f" % (age_h, pct))
else:
    print("OK|%.0f|%.1f" % (age_h, pct))
PY
)
  USTATE=${URES%%|*}; REST=${URES#*|}; UAGE=${REST%%|*}; UPCT=${REST##*|}
  case "$USTATE" in
    OK) pass "用量快照 ${UAGE}h 前，信用额度已用 ${UPCT}%" ;;
    HIGH) issue "信用额度已用 ${UPCT}%（$20 含额度快要吃满），查最近部署/Lambda/流量" ;;
    STALE) issue "用量快照已过期 ${UAGE}h（跑 scripts/vercel-usage-snapshot.sh）" ;;
  esac
else
  issue "缺少用量快照 logs/vercel-usage.json（跑 scripts/vercel-usage-snapshot.sh）"
fi

# --- 记录 ---
RESULT="PASS"; [ "$FAIL" -gt 0 ] && RESULT="FAIL($FAIL)"
printf '%s | %s | 当日部署=%s 保留=%s cli直推=%s 最新=%s\n' "$(date '+%F %T')" "$RESULT" "$TODAYN" "$TOTAL" "$CLIN" "${LATEST_SHA:0:8}" >> "$LOG"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "❌ 审计发现 $FAIL 项违规，按 docs/VERCEL-OPS.md 第 6 节处置："
  for i in "${ISSUES[@]}"; do echo "   - $i"; done
  echo "   记录已写入 logs/vercel-audit.log"
  exit 1
fi
say ""
say "✅ 审计通过：未发现绕过闸门或超额的操作。"
exit 0
