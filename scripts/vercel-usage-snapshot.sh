#!/bin/bash
# vercel-usage-snapshot.sh - 抓 Vercel 用量快照 (2026-11-25)
#
# 为什么需要它: 11-24 的 402 事故是"额度打满了才发现"，Vercel 只在 75%/100% 发邮件。
# 这个脚本每天把 Usage 页的数字抓下来落盘，超阈值就在审计里报出来，做到"提前一天看见"。
#
# 数据来源: https://vercel.com/<team-slug>/~/usage (需要 ego lite 已登录 Vercel)
# 输出: logs/vercel-usage.json (给 vercel-audit.sh 消费) + 台账一行
#
# 退出码: 0 = 正常(可能带预警), 1 = 抓取失败(登录态缺失或页面结构变了)

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="$ROOT/logs/vercel-usage.json"
TEAM_SLUG="ipedmond9951-8331s-projects"

mkdir -p "$ROOT/logs"
rm -f "$OUT"

if ! command -v ego-browser >/dev/null 2>&1; then
  echo "❌ 未找到 ego-browser，无法抓用量（Vercel 只在 75%/100% 发邮件，必须靠这个主动看）"
  exit 1
fi

ego-browser nodejs <<'JS' || true
const fs = await import("node:fs/promises");
const task = await taskSpace("vercel usage snapshot");
const page = task.page("p1");
await page.goto("https://vercel.com/ipedmond9951-8331s-projects/~/usage", { timeout: 45000 });
await page.waitForTimeout(3500);

const result = await page.evaluate(() => {
  const text = (document.querySelector("main")?.innerText || document.body.innerText || "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const NAME_TO_KEY = {
    "Fast Data Transfer": "fast_data_transfer",
    "CDN Requests": "cdn_requests",
    "Fast Origin Transfer": "fast_origin_transfer",
    "Fluid Active CPU": "fluid_active_cpu",
    "Fluid Provisioned Memory": "fluid_provisioned_memory",
    "Function Invocations": "function_invocations",
    "ISR Reads": "isr_reads",
    "ISR Writes": "isr_writes",
    "Deployment Storage": "deployment_storage",
    "Function Storage": "function_storage",
    "Build CPU Minutes": "build_cpu_minutes",
    "Image Optimization Transformation": "image_transformation",
  };
  const metrics = {};
  for (let i = 0; i < lines.length; i++) {
    const key = NAME_TO_KEY[lines[i]];
    if (!key) continue;
    // 每行指标的结构是: 名称 / [徽标行] / 用量 / 费用。取名称后第一行数字开头的是用量, $ 开头说明为 0。
    let value = "-";
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const v = lines[j];
      if (/^\d/.test(v)) { value = v.replace(/\s+/g, " "); break; }
      if (/^\$/.test(v)) { value = "0"; break; }
    }
    metrics[key] = value;
  }
  const credit = text.match(/Included Credit[\s\S]{0,40}?([\d.]+)\s*\/\s*\$?\s*([\d.]+)/);
  const period = text.match(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+)/);
  return {
    period: period ? period[1] : "",
    credit_used: credit ? credit[1] : "",
    credit_total: credit ? credit[2] : "",
    metrics,
    logged_in: !/Log in|Sign up/i.test(text.slice(0, 300)) && Object.keys(metrics).length > 0,
  };
});

await fs.writeFile("/Users/zhangming/workspace/tradego-fasteners-v2/logs/vercel-usage.json", JSON.stringify({ checked_at: new Date().toISOString(), ...result }, null, 1), "utf8");
await task.finish({ keep: [] });
JS

if [ ! -s "$OUT" ]; then
  echo "❌ 抓取返回空（ego 未连接，或页面没加载出来）"
  exit 1
fi

python3 - "$OUT" <<'PY'
import json, sys
path = sys.argv[1]
d = json.load(open(path))
if not d.get("logged_in") or not d.get("metrics"):
    print("❌ 未登录 Vercel 或页面结构变化，抓不到用量")
    sys.exit(1)
used = float(d.get("credit_used") or 0)
total = float(d.get("credit_total") or 0) or 20.0
pct = used / total * 100
m = d["metrics"]
print("📊 周期 %s | 信用额度 $%.2f / $%.2f（%.1f%%）" % (d.get("period", "?"), used, total, pct))
for k in ("fast_origin_transfer", "fast_data_transfer", "function_storage", "deployment_storage", "isr_reads", "build_cpu_minutes"):
    print("   %-22s %s" % (k, m.get(k, "-")))
d["credit_pct"] = round(pct, 1)
json.dump(d, open(path, "w"), ensure_ascii=False, indent=1)
if pct >= 60:
    print("⚠️  信用额度已用 %.1f%%，本月大概率超额，建议查最近的部署与 Lambda 尺寸" % pct)
PY
[ $? -ne 0 ] && exit 1

exit 0
