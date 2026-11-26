#!/bin/bash
# weekly-audit.sh - SEO/GEO 每周体检（只读，不改内容、不 push、不部署）
# 用法: bash scripts/weekly-audit.sh [--notify]
# 输出: docs/reports/weekly-<YYYY-MM-DD>.md（同日覆盖）+ weekly-latest.md
# 退出码: 0=无问题 1=有 P1 2=有 P0；检查项与处置规则见 docs/WEEKLY-AUDIT-SPEC.md
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

SITE="${SITE:-https://www.tradego-fasteners.com}"
DATE=$(TZ=Asia/Shanghai date +%Y-%m-%d)
OUT="docs/reports/weekly-${DATE}.md"
LOG="logs/weekly-audit/${DATE}.log"
mkdir -p docs/reports logs/weekly-audit
NOTIFY=0
[ "${1:-}" = "--notify" ] && NOTIFY=1

T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT

P0=0; P1=0
sec() { printf '\n## %s\n\n' "$1" >> "$OUT"; }
block() { echo '```' >> "$OUT"; cat "$1" >> "$OUT" 2>/dev/null; echo '```' >> "$OUT"; echo >> "$OUT"; }
flag() {
  echo "- **$1**：$2" >> "$OUT"
  [ "$1" = "P0" ] && P0=$((P0+1)) || P1=$((P1+1))
}

# ---------- 并行采集 ----------
( timeout 600 python3 scripts/content_gate.py --brief > "$T/gate" 2>&1; echo $? > "$T/gate.rc" ) &
( python3 scripts/check-template-filler.py > "$T/tpl" 2>&1 ) &
( python3 scripts/check-body-lang.py > "$T/lang" 2>&1 ) &
( python3 scripts/check-money-claims.py > "$T/money" 2>&1 ) &
( python3 scripts/check-cert-claims.py > "$T/cert" 2>&1 ) &
( python3 scripts/check-claims.py --quiet > "$T/claims" 2>&1; echo $? > "$T/claims.rc" ) &
( python3 scripts/geo_audit.py --top 5 > "$T/geo" 2>&1 ) &
( python3 scripts/check-geo-readiness.py > "$T/ready" 2>&1 ) &
( bash scripts/post-deploy-verify.sh --site "$SITE" > "$T/verify" 2>&1; echo $? > "$T/verify.rc" ) &
wait

{
  echo "# SEO/GEO 周检 ${DATE}"
  echo
  echo "生成：$(TZ=Asia/Shanghai date '+%Y-%m-%d %H:%M %Z')｜站点 ${SITE}｜只读体检"
  echo
  echo "规则：见 \`docs/WEEKLY-AUDIT-SPEC.md\`（每项都有阈值和处置动作）"
} > "$OUT"

# ---------- 1. GSC ----------
sec "1. GSC 读数"
GSC_OUT=$(python3 - <<'PY'
import json, datetime, os
p="data/gsc-snapshot.json"
if not os.path.exists(p):
    print("MISSING|无快照"); raise SystemExit
d=json.load(open(p))
tz=datetime.timezone(datetime.timedelta(hours=8))
try: age=(datetime.datetime.now(tz).date()-datetime.date.fromisoformat(d.get("date",""))).days
except Exception: age=999
print(f"AGE|{age}"); print(f"DATE|{d.get('date','')}")
for k in ["clicks","impressions","ctr","avg_position","indexed","not_indexed","sitemap_urls","structured_errors","redirect_pages"]:
    print(f"{k.upper()}|{d.get(k,'-')}")
prev={}
if os.path.exists("data/gsc-prev.json"):
    try: prev=json.load(open("data/gsc-prev.json"))
    except Exception: prev={}
for k in ["indexed","not_indexed"]:
    if isinstance(prev.get(k),int) and isinstance(d.get(k),int):
        print(f"DELTA_{k.upper()}|{d[k]-prev[k]:+d}")
PY
)
echo "$GSC_OUT" >> "$LOG"
GSC_AGE=$(echo "$GSC_OUT" | awk -F'|' '/^AGE/{print $2}')
if [ "${GSC_AGE:-999}" -ge 8 ] 2>/dev/null; then
  echo "⚠️ 快照缺失或过期（${GSC_AGE} 天）：本项判为 **无法评估**。" >> "$OUT"; echo >> "$OUT"
  echo "补数动作：在会话里说「抓一次 GSC」，助手用 Ego 取数后覆盖 \`data/gsc-snapshot.json\`；结构见文件内 note。" >> "$OUT"; echo >> "$OUT"
else
  python3 - "$GSC_OUT" >> "$OUT" <<'PYG'
import sys
d={l.split("|")[0]: l.split("|")[1] for l in sys.argv[1].splitlines() if "|" in l}
print("| 指标 | 当前 | 说明 |"); print("|---|---|---|")
rows=[("点击","CLICKS",""),("展示","IMPRESSIONS",""),("CTR","CTR","<0.8% → P2"),("均排","AVG_POSITION",""),
      ("已索引","INDEXED","周环比 −5% → P1"),("未收录","NOT_INDEXED","周环比 +10% → P1"),
      ("sitemap 条数","SITEMAP_URLS",""),("结构化报错","STRUCTURED_ERRORS",""),("重定向页","REDIRECT_PAGES","")]
for label,k,n in rows: print(f"| {label} | {d.get(k,'-')} | {n} |")
for k in ("DELTA_INDEXED","DELTA_NOT_INDEXED"):
    if k in d: print(f"\n{k.replace('DELTA_','')} 环比：{d[k]}")
print(f"\n快照日期：{d.get('DATE','-')}（{d.get('AGE','?')} 天前）")
PYG
  echo >> "$OUT"
fi
echo "阈值：索引 −5% / 未收录 +10% → P1；CTR <0.8% → P2。" >> "$OUT"; echo >> "$OUT"

# ---------- 2. 站点技术 ----------
sec "2. 站点技术（12 项）"
block "$T/verify"
VERIFY_RC=$(cat "$T/verify.rc" 2>/dev/null || echo 1)
AHEAD=$(git rev-list --count origin/main..HEAD)
if [ "$VERIFY_RC" -ne 0 ]; then
  if [ "$AHEAD" -gt 0 ]; then
    flag P1 "技术复核未通过，但本地有 $AHEAD 个未推提交 → 判定「待上线」，随下一次上线包修复；上线后必须重跑复验"
  else
    flag P0 "技术复核未通过且无未推提交 → 线上回归，当天回滚或热修"
  fi
else
  echo "- ✅ 12 项技术复核全部通过" >> "$OUT"; echo >> "$OUT"
fi

# ---------- 3. 内容 ----------
sec "3. 内容（闸门 / 模板文 / 语种混排 / 金额断言）"
block "$T/gate"
block "$T/tpl"
block "$T/lang"
{ echo '```'; grep -E "金额|价格语义" "$T/money" | head -4; echo '```'; echo; } >> "$OUT"
GATE_TAIL=$(grep -E "BLOCK" "$T/gate" 2>/dev/null | tail -1)
if [ -z "$GATE_TAIL" ]; then
  flag P1 "内容闸门未产出结果（脚本异常或超时），先查 logs 再判定"
elif echo "$GATE_TAIL" | grep -q "有 BLOCK: 0"; then
  echo "- ✅ 内容闸门 0 BLOCK" >> "$OUT"
else
  flag P1 "内容闸门出现 BLOCK（逐条修完跑 content_gate.py 复验）"
fi
echo >> "$OUT"

# ---------- 4. GEO ----------
sec "4. GEO 可摘性"
{ echo '```'; head -12 "$T/geo"; echo '```'; echo; } >> "$OUT"
{ echo '```'; tail -6 "$T/ready"; echo '```'; echo; } >> "$OUT"
GEO_AVG=$(grep -oE '平均 [0-9.]+' "$T/geo" 2>/dev/null | grep -oE '[0-9.]+' | head -1)
if [ -n "${GEO_AVG:-}" ]; then
  awk -v g="$GEO_AVG" 'BEGIN{ if (g<60) exit 2; else if (g<70) exit 1; else exit 0 }'
  case $? in
    2) flag P0 "GEO 均分 ${GEO_AVG} <60" ;;
    1) flag P1 "GEO 均分 ${GEO_AVG} <70（先补首段自证与实体密度，再段落去重）" ;;
    0) echo "- ✅ GEO 均分 ${GEO_AVG} ≥70" >> "$OUT" ;;
  esac
else
  flag P1 "geo_audit 未产出均分，量具异常需排查"
fi
echo "阈值：GEO 均分 <70 → P1；<60 → P0。" >> "$OUT"; echo >> "$OUT"

# ---------- 5. 合规 ----------
sec "5. 文案合规（认证 / 价格 / 地域）"
block "$T/claims"
if [ "$(cat "$T/claims.rc" 2>/dev/null || echo 1)" -ne 0 ]; then
  flag P1 "check-claims 未通过（UI/llms.txt 越界，改完三处同步）"
else
  echo "- ✅ UI 与 llms.txt 无过界表述" >> "$OUT"; echo >> "$OUT"
fi
{ echo '```'; tail -4 "$T/cert"; echo '```'; echo; } >> "$OUT"
CERT_HITS=$(grep -cE '持有|已获|认证证书' "$T/cert" 2>/dev/null || echo 0)
if [ "${CERT_HITS:-0}" -gt 0 ]; then
  flag P1 "文章里仍有 ${CERT_HITS} 处「持有认证」类表述（按批次清，改完跑 check-cert-claims 复验）"
fi
{ echo '```'; tail -3 "$T/money"; echo '```'; echo; } >> "$OUT"

# ---------- 6. 上线与预算 ----------
sec "6. 上线与部署预算"
DIRTY=$(git status --short | wc -l | tr -d ' ')
{
  echo '```'; echo "未推提交: $AHEAD"; echo "工作区脏文件: $DIRTY"
  bash scripts/deploy-budget.sh 2>&1 | tail -3
  python3 -c "import json;d=json.load(open('logs/vercel-audit-last.json'));print('审计:',d['checked_at'],'exit',d['exit'],'连续失败',d['consecutive_fail'])" 2>/dev/null
  echo '```'; echo
} >> "$OUT"
if [ "$AHEAD" -gt 200 ]; then flag P1 "未推提交 $AHEAD 个，超出单次上线合理包（应明确批次、一日只推一次）"; fi
if [ "$DIRTY" -gt 20 ]; then flag P1 "工作区脏文件 $DIRTY 个，收工前清零或明确归属"; fi

# ---------- 7. 行动清单 ----------
sec "7. 本周行动"
if [ "$P0" -eq 0 ] && [ "$P1" -eq 0 ]; then
  echo "无需处理；下周一同样时间自动再跑。" >> "$OUT"
else
  echo "共 **P0 ${P0} 条 / P1 ${P1} 条**。按 \`docs/WEEKLY-AUDIT-SPEC.md\` 处置：P0 当天、P1 本周内、P2 记录观察。" >> "$OUT"
  echo >> "$OUT"
  echo "每条的定位命令见上文各节；修完重跑 \`bash scripts/weekly-audit.sh\` 复验。" >> "$OUT"
fi

cp "$OUT" docs/reports/weekly-latest.md

if [ "$P0" -gt 0 ]; then
  SUMMARY=$(grep -E '^- \*\*P0' "$OUT" | head -2 | tr '\n' ' ')
  [ "$NOTIFY" -eq 1 ] && osascript -e "display notification \"${SUMMARY:-周检有 P0}\" with title \"TradeGo 周检 P0\"" >/dev/null 2>&1 || true
  echo "P0=$P0 P1=$P1 -> $OUT"; exit 2
fi
if [ "$P1" -gt 0 ]; then
  [ "$NOTIFY" -eq 1 ] && osascript -e "display notification \"周检有 ${P1} 条 P1\" with title \"TradeGo 周检待办\"" >/dev/null 2>&1 || true
  echo "P0=0 P1=$P1 -> $OUT"; exit 1
fi
echo "P0=0 P1=0 -> $OUT"; exit 0
