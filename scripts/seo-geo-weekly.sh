#!/bin/bash
# SEO/GEO 每周体检：把策略第 7–8 节的指标一口气跑成一份可对比的报告。
# 用法: bash scripts/seo-geo-weekly.sh
# 输出: docs/reports/seo-geo-<YYYY-MM-DD>.md（同一天重复跑会覆盖）
# 只读：不改任何内容文件，不 push，不部署。
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

DATE=$(TZ=Asia/Shanghai date +%Y-%m-%d)
OUT="docs/reports/seo-geo-${DATE}.md"
mkdir -p docs/reports

{
  echo "# SEO/GEO 周报 ${DATE}"
  echo
  echo "生成时间：$(TZ=Asia/Shanghai date '+%Y-%m-%d %H:%M %Z')｜只读体检，不改内容"
  echo

  echo "## 1. GEO 可摘性（geo_audit）"
  echo '```'
  python3 scripts/geo_audit.py --top 10 2>&1 | head -16
  echo '```'
  echo

  echo "## 2. GEO 就绪度（check-geo-readiness）"
  echo '```'
  python3 scripts/check-geo-readiness.py 2>&1 | tail -8
  echo '```'
  echo

  echo "## 3. 模板文 / 语种污染 / 金额断言"
  echo '```'
  python3 scripts/check-template-filler.py 2>&1 | head -2
  python3 scripts/check-body-lang.py 2>&1 | tail -2
  python3 scripts/check-money-claims.py 2>&1 | grep -E "金额|价格语义" | head -3
  echo '```'
  echo

  echo "## 4. 内容闸门"
  echo '```'
  timeout 240 python3 scripts/content_gate.py --brief 2>&1 | tail -2
  echo '```'
  echo

  echo "## 5. 文案合规（src + llms.txt）"
  echo '```'
  python3 scripts/check-claims.py --quiet 2>&1 | tail -2
  echo '```'
  echo

  echo "## 6. 上线状态"
  echo '```'
  echo "未推提交: $(git rev-list --count origin/main..HEAD)"
  bash scripts/deploy-budget.sh 2>&1 | tail -3
  echo "工作区脏文件: $(git status --short | wc -l | tr -d ' ')"
  echo '```'
  echo

  echo "## 7. 本周要盯的数（需人工从 GSC 导出后填）"
  echo
  echo "| 指标 | 上周 | 本周 | 目标 |"
  echo "|---|---|---|---|"
  echo "| CTR | 0.95% |  | ≥2.0% |"
  echo "| 点击 | 280 |  | ≥600 |"
  echo "| GEO 均分 | 61.7 |  | ≥75 |"
  echo "| 首段复述标题 | 145 |  | ≤40 |"
  echo "| 模板文 | 30 |  | ≤10 |"
} > "$OUT"

echo "报告已生成: $OUT"
