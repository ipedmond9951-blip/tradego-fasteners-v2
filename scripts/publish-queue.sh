#!/bin/bash
# 队列式自动发布器：从 content/queue/*.json 取已写好的文章 → 校验 → 入库 → git push 触发 Vercel 部署
# 设计目的：文章正文由 Agent 直写并放入队列，定时任务只负责"发布"这一步，
# 不调用 gemini / grok / chatgpt 等外部浏览器通道，零封号风险。
set -uo pipefail

REPO="/Users/zhangming/workspace/tradego-fasteners-v2"
cd "$REPO" || exit 1

QUEUE="content/queue"
ART="content/articles"
REJECT="content/queue/_rejected"
LOG="logs/daily-publish/$(date +%Y-%m-%d).log"
mkdir -p "$QUEUE" "$ART" "$REJECT" "$(dirname "$LOG")"
exec >>"$LOG" 2>&1

echo "=== $(date '+%F %T') publish-queue start"

shopt -s nullglob
files=($QUEUE/*.json)
if [ ${#files[@]} -eq 0 ]; then
  echo "queue empty — 没有待发布文章，本次不做任何事"
  exit 0
fi

# 最多一次发 2 篇，避免单次部署 diff 过大
batch=("${files[@]:0:2}")
moved=0
for f in "${batch[@]}"; do
  base=$(basename "$f")
  ok=$(python3 - "$f" <<'PY'
import json, sys
LANGS = ["en","zh","es","fr","pt","ar","ru","ja","de","hi"]
p = sys.argv[1]
try:
    d = json.load(open(p, encoding="utf-8"))
except Exception as e:
    print(f"BADJSON {e}"); raise SystemExit
for k in ("slug","category","date","title","description","metaDescription","sections"):
    if k not in d:
        print(f"MISSING {k}"); raise SystemExit
missing = []
for k in ("title","description","metaDescription"):
    miss = [l for l in LANGS if not str(d.get(k,{}).get(l,"")).strip()]
    if miss:
        missing.append(f"{k}:{','.join(miss)}")
if missing:
    print("LANGS " + " | ".join(missing)); raise SystemExit
if not isinstance(d.get("sections"), list) or len(d["sections"]) < 4:
    print("SECTIONS <4"); raise SystemExit
body = json.dumps(d.get("sections"), ensure_ascii=False)
words = len(body.split())
if len(d["sections"]) == 0 or words < 300:
    print(f"TOOSHORT {words}"); raise SystemExit
print("OK")
PY
)
  echo "[$base] 校验结果: $ok"
  if [[ "$ok" != OK* ]]; then
    mv "$f" "$REJECT/${base%.json}-$(date +%s).json"
    echo "[$base] 未达门槛，已移入 _rejected"
    continue
  fi
  slug=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1],encoding='utf-8'))['slug'])" "$f")
  if [ -f "$ART/$slug.json" ]; then
    echo "[$base] 已存在 $slug.json，跳过并归档"
    mkdir -p "$QUEUE/_done" && mv "$f" "$QUEUE/_done/"
    continue
  fi
  cp "$f" "$ART/$slug.json" && rm "$f" && moved=$((moved+1))
  echo "[$base] 已入库 content/articles/$slug.json"
done

if [ "$moved" -eq 0 ]; then
  echo "本次无新增文章，跳过 commit"
  exit 0
fi

git add "$ART" >/dev/null 2>&1
if git diff --cached --quiet; then
  echo "无实际变更，跳过 commit"
  exit 0
fi
git commit -q -m "content: 队列自动发布文章（$(date +%F)）" || { echo "commit 失败"; exit 1; }

# 2026-11-24: 推送收敛到 deploy-flush(唯一入口, 含预算闸门/锁/prune), 不再各自 push
if bash "$(dirname "$0")/deploy-flush.sh"; then
  echo "推送流程结束（已推送或预算内暂缓，均视为正常）"
else
  echo "⚠️ 推送未完成，提交保留在本地，等 deploy-flush 定时窗口"
fi

echo "=== $(date '+%F %T') publish-queue done"
