#!/bin/bash
# vercel-usage-weekly.sh —— 用量趋势与信用额度预测（只读本地快照，不调 API、不占额度）
# 每次运行把当天快照追加到 logs/vercel-usage-history.jsonl（一天一行，同日覆盖），
# 再基于历史算 7 天增量、日均消耗与"额度见底"的预计日期。
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SNAP="$ROOT/logs/vercel-usage.json"; HIST="$ROOT/logs/vercel-usage-history.jsonl"; WATCH="$ROOT/logs/vercel-usage-watch.md"
[ -f "$SNAP" ] || { echo "缺少 logs/vercel-usage.json"; exit 0; }
mkdir -p "$ROOT/logs"

python3 - "$SNAP" "$HIST" <<'PY'
import json,sys,datetime
snap,hist=sys.argv[1],sys.argv[2]
d=json.load(open(snap))
today=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
row={"date":today,"credit_used":float(d.get("credit_used") or 0),"metrics":d.get("metrics") or {}}
lines=[]
try: lines=[json.loads(l) for l in open(hist) if l.strip()]
except Exception: lines=[]
lines=[x for x in lines if x.get("date")!=today]
lines.append(row); lines.sort(key=lambda x:x["date"])
open(hist,"w").write("\n".join(json.dumps(x,ensure_ascii=False) for x in lines)+"\n")
PY

python3 - "$SNAP" "$HIST" "$WATCH" <<'PY'
import json,sys,datetime
snap,hist,watch=sys.argv[1:4]
d=json.load(open(snap)); rows=[json.loads(l) for l in open(hist) if l.strip()]
credit=float(d.get("credit_used") or 0); total=float(d.get("credit_total") or 20)
days=len(rows)
KEY=["fast_origin_transfer","fast_data_transfer","cdn_requests","isr_reads","function_invocations","image_transformation"]
def num(v):
    try: return float(str(v).split()[0].replace(",",""))
    except Exception: return 0.0
lines=["# 用量趋势（%s）" % datetime.datetime.now().strftime("%F %H:%M")]
lines.append("")
lines.append("- 信用额度：$%.2f / $%.2f（%.1f%%）" % (credit,total,credit/total*100))
if days>=2:
    prev=rows[-2]
    delta=credit-float(prev.get("credit_used") or 0)
    rate=delta/1
    lines.append("- 较上次快照（%s）新增 $%.2f；按此速度约 %.1f 天用完额度" % (prev["date"],delta,(total-credit)/rate if rate>0 else float("inf")))
elif days==1:
    lines.append("- 历史只有 1 天数据，趋势要等第 2 天（每天审计后自动追加）")
lines.append("")
lines.append("| 指标 | 当前 | 较上次 |")
lines.append("|---|---|---|")
cur=d.get("metrics") or {}
prev_metrics=(rows[-2].get("metrics") or {}) if days>=2 else {}
for k in KEY:
    if k not in cur: continue
    c=num(cur[k]); p=num(prev_metrics.get(k,0))
    lines.append("| %s | %s | %s |" % (k, cur[k], ("%+.0f" % (c-p)) if days>=2 else "-"))
open(watch,"w").write("\n".join(lines)+"\n")
print("\n".join(lines))
PY
