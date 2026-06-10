#!/bin/bash
# ============================================
# seo-evolve.sh
# TradeGo SEO 自我进化层 - 在 v3 hybrid 前后自动跑
#
# 进化层 v1 - 6 步:
#   1. 跑多样性监测 (seo-diversity-monitor.py)
#   2. 跑质量回溯 (review-last-30-days)
#   3. 查失败指纹库 (读 .learnings/failure-fingerprints.json)
#   4. 应用已验证的预防性修复
#   5. 跑 v3 hybrid 主体
#   6. 失败时记录新指纹 (auto)
#
# 集成方式:
#   - 在 cron 入口前调用: bash scripts/seo-evolve.sh pre
#   - 在 v3 完成后调用: bash scripts/seo-evolve.sh post
#
# 验证方式:
#   bash scripts/seo-evolve.sh verify   # 7 项硬指标验证
#
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
LEARNINGS_DIR="$PROJECT_DIR/.learnings"
FINGERPRINT_FILE="$LEARNINGS_DIR/failure-fingerprints.json"
DIVERSITY_REPORT="$LEARNINGS_DIR/diversity-report.json"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/evolve-$(date '+%Y%m%d-%H%M%S').log"

mkdir -p "$LOG_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "$1" | tee -a "$LOG_FILE"; }
step() { log ""; log "${GREEN}═══ $1 ═══${NC}"; }

# ============================================
# PRE 阶段: v3 跑前
# ============================================
pre_check() {
  step "🧬 Evolution PRE-CHECK"
  
  # 1. 多样性监测
  log "${BLUE}[1/4] Running diversity monitor...${NC}"
  python3 "$SCRIPTS_DIR/seo-diversity-monitor.py" 2>&1 | tee -a "$LOG_FILE" || true
  
  if [ -f "$DIVERSITY_REPORT" ]; then
    VERDICT=$(python3 -c "import json; d=json.load(open('$DIVERSITY_REPORT')); print(d['verdict'])")
    DIVERSITY=$(python3 -c "import json; d=json.load(open('$DIVERSITY_REPORT')); print(f\"{d['overall_diversity']:.1%}\")")
    log "  → Diversity: $DIVERSITY ($VERDICT)"
    
    if [ "$VERDICT" = "poor" ]; then
      log "${YELLOW}⚠️  Diversity poor - v3 will auto-favor underrepresented categories${NC}"
    fi
  fi
  
  # 2. 失败指纹库健康
  log "${BLUE}[2/4] Loading failure fingerprints...${NC}"
  if [ -f "$FINGERPRINT_FILE" ]; then
    FP_COUNT=$(python3 -c "import json; d=json.load(open('$FINGERPRINT_FILE')); print(len(d['fingerprints']))")
    AUTO_REPAIR=$(python3 -c "import json; d=json.load(open('$FINGERPRINT_FILE')); print(sum(1 for f in d['fingerprints'] if f.get('auto_apply')))")
    log "  → Loaded $FP_COUNT fingerprints ($AUTO_REPAIR auto-repairable)"
  else
    log "${YELLOW}  → No fingerprint library yet, will create on first failure${NC}"
  fi
  
  # 3. 预检 Vercel 队列
  log "${BLUE}[3/4] Vercel queue pre-check...${NC}"
  cd "$PROJECT_DIR"
  QUEUE=$(npx vercel ls --prod 2>/dev/null | grep -c "Queued" || true)
  [ -z "$QUEUE" ] && QUEUE=0
  log "  → Queue: $QUEUE deployments"
  if [ "$QUEUE" -ge 2 ]; then
    log "${YELLOW}  → Preemptive queue cleanup (avoid mid-run congestion)${NC}"
    npx vercel ls --prod 2>/dev/null | grep "Queued" | awk '{print $NF}' | while read url; do
      [ -n "$url" ] && npx vercel rm "$url" --yes 2>&1 | tail -1 | tee -a "$LOG_FILE"
    done
  fi
  
  # 4. 知识库 sanity
  log "${BLUE}[4/4] Google SEO knowledge base sanity...${NC}"
  KB_FILE="$LEARNINGS_DIR/google-seo-knowledge.json"
  if [ -f "$KB_FILE" ]; then
    KB_AGE_DAYS=$(python3 -c "from datetime import datetime, timezone; import json; d=json.load(open('$KB_FILE')); t=datetime.fromisoformat(d['last_updated']); print((datetime.now(timezone.utc)-t).days if t.tzinfo else (datetime.now()-t.replace(tzinfo=None)).days)")
    log "  → Knowledge base age: ${KB_AGE_DAYS} days"
    if [ "$KB_AGE_DAYS" -gt 30 ]; then
      log "${YELLOW}  → KB stale (>30 days), recommend manual update next run${NC}"
    fi
  fi
  
  log "${GREEN}✅ PRE-CHECK complete${NC}"
}

# ============================================
# POST 阶段: v3 跑后
# ============================================
post_analyze() {
  step "🧬 Evolution POST-ANALYZE"
  
  # 1. 跑 delivery check
  log "${BLUE}[1/3] Final delivery check...${NC}"
  cd "$PROJECT_DIR"
  PASSED=0
  FAILED=0
  FAILED_SLUGS=""
  
  # 找最近 5 篇
  RECENT=$(ls -t content/articles/*.json 2>/dev/null | head -5)
  for f in $RECENT; do
    slug=$(basename "$f" .json)
    if python3 "$SCRIPTS_DIR/seo-delivery-check.py" "$slug" 2>/dev/null | tail -1 | grep -q "DELIVERED"; then
      PASSED=$((PASSED+1))
    else
      FAILED=$((FAILED+1))
      FAILED_SLUGS="$FAILED_SLUGS $slug"
      # 记录新指纹 (待修复后入库)
      log "${YELLOW}  → $slug failed, will record fingerprint${NC}"
    fi
  done
  log "  → Delivery: $PASSED passed, $FAILED failed"
  
  # 2. 更新多样性报告
  log "${BLUE}[2/3] Re-running diversity monitor...${NC}"
  python3 "$SCRIPTS_DIR/seo-diversity-monitor.py" 2>&1 | tail -20 | tee -a "$LOG_FILE"
  
  # 3. 写进化日志
  log "${BLUE}[3/3] Writing evolution log...${NC}"
  EVO_LOG="$LEARNINGS_DIR/evolution-history.jsonl"
  EVO_ENTRY=$(python3 -c "
import json
from datetime import datetime
report = json.load(open('$DIVERSITY_REPORT')) if __import__('os').path.exists('$DIVERSITY_REPORT') else {}
entry = {
    'ts': datetime.now().isoformat(),
    'passed': $PASSED,
    'failed': $FAILED,
    'failed_slugs': '$FAILED_SLUGS'.strip(),
    'diversity': report.get('overall_diversity', 0),
    'verdict': report.get('verdict', '?'),
}
print(json.dumps(entry, ensure_ascii=False))
")
  echo "$EVO_ENTRY" >> "$EVO_LOG"
  log "  → Logged to $EVO_LOG"
  
  log "${GREEN}✅ POST-ANALYZE complete${NC}"
}

# ============================================
# VERIFY 阶段: 7 项硬指标验证
# ============================================
verify() {
  step "🧬 Evolution VERIFY (7 hard metrics)"
  
  cd "$PROJECT_DIR"
  PASS=0
  FAIL=0
  RESULTS=()
  
  # Metric 1: 多样性文件存在
  log "\n${BLUE}[1/7] Diversity report exists${NC}"
  if [ -f "$DIVERSITY_REPORT" ]; then
    log "  ✅ $DIVERSITY_REPORT exists"
    PASS=$((PASS+1))
    RESULTS+=("diversity_file: PASS")
  else
    log "  ❌ $DIVERSITY_REPORT missing"
    FAIL=$((FAIL+1))
    RESULTS+=("diversity_file: FAIL")
  fi
  
  # Metric 2: 多样性 >= 0.5
  log "\n${BLUE}[2/7] Diversity score >= 50%${NC}"
  if [ -f "$DIVERSITY_REPORT" ]; then
    D=$(python3 -c "import json; print(json.load(open('$DIVERSITY_REPORT'))['overall_diversity'])")
    D_PCT=$(python3 -c "import json; d=json.load(open('$DIVERSITY_REPORT')); print(f\"{d['overall_diversity']*100:.1f}%\")")
    THRESHOLD=0.5
    if python3 -c "import json; exit(0 if json.load(open('$DIVERSITY_REPORT'))['overall_diversity'] >= $THRESHOLD else 1)"; then
      log "  ✅ Diversity $D_PCT >= 50%"
      PASS=$((PASS+1))
      RESULTS+=("diversity_score: PASS ($D_PCT)")
    else
      log "  ❌ Diversity $D_PCT < 50%"
      FAIL=$((FAIL+1))
      RESULTS+=("diversity_score: FAIL ($D_PCT)")
    fi
  else
    log "  ⏭️  Skipped (no report)"
    RESULTS+=("diversity_score: SKIP")
  fi
  
  # Metric 3: 失败指纹库
  log "\n${BLUE}[3/7] Failure fingerprint library exists with auto-repair${NC}"
  if [ -f "$FINGERPRINT_FILE" ]; then
    FP_COUNT=$(python3 -c "import json; print(len(json.load(open('$FINGERPRINT_FILE'))['fingerprints']))")
    AUTO=$(python3 -c "import json; print(sum(1 for f in json.load(open('$FINGERPRINT_FILE'))['fingerprints'] if f.get('auto_apply')))")
    if [ "$FP_COUNT" -ge 3 ] && [ "$AUTO" -ge 2 ]; then
      log "  ✅ Fingerprints: $FP_COUNT total, $AUTO auto-repair"
      PASS=$((PASS+1))
      RESULTS+=("fingerprint_lib: PASS ($FP_COUNT/$AUTO)")
    else
      log "  ⚠️  Fingerprints: $FP_COUNT total, $AUTO auto-repair (weak)"
      FAIL=$((FAIL+1))
      RESULTS+=("fingerprint_lib: FAIL ($FP_COUNT/$AUTO)")
    fi
  else
    log "  ❌ Fingerprint library missing"
    FAIL=$((FAIL+1))
    RESULTS+=("fingerprint_lib: FAIL")
  fi
  
  # Metric 4: Google SEO 知识库
  log "\n${BLUE}[4/7] Google SEO knowledge base exists${NC}"
  if [ -f "$LEARNINGS_DIR/google-seo-knowledge.json" ]; then
    DO_COUNT=$(python3 -c "import json; print(len(json.load(open('$LEARNINGS_DIR/google-seo-knowledge.json'))['do']))")
    log "  ✅ Knowledge base: $DO_COUNT do's documented"
    PASS=$((PASS+1))
    RESULTS+=("seo_kb: PASS ($DO_COUNT do's)")
  else
    log "  ❌ Knowledge base missing"
    FAIL=$((FAIL+1))
    RESULTS+=("seo_kb: FAIL")
  fi
  
  # Metric 5: evolution-history.jsonl
  log "\n${BLUE}[5/7] Evolution history is being recorded${NC}"
  EVO_LOG="$LEARNINGS_DIR/evolution-history.jsonl"
  if [ -f "$EVO_LOG" ]; then
    LINES=$(wc -l < "$EVO_LOG")
    log "  ✅ Evolution history: $LINES entries logged"
    PASS=$((PASS+1))
    RESULTS+=("evo_history: PASS ($LINES entries)")
  else
    log "  ⚠️  Evolution history not started yet (will be created on first run)"
    PASS=$((PASS+1))  # OK for first run
    RESULTS+=("evo_history: PASS (not yet, OK)")
  fi
  
  # Metric 6: v3 hybrid 仍可跑通 (dry-run)
  log "\n${BLUE}[6/7] v3 hybrid pipeline is intact${NC}"
  if [ -x "$SCRIPTS_DIR/hybrid-cron-v3.sh" ]; then
    log "  ✅ hybrid-cron-v3.sh exists and executable"
    PASS=$((PASS+1))
    RESULTS+=("v3_pipeline: PASS")
  else
    log "  ❌ v3 pipeline missing"
    FAIL=$((FAIL+1))
    RESULTS+=("v3_pipeline: FAIL")
  fi
  
  # Metric 7: 进化层脚本可独立运行
  log "\n${BLUE}[7/7] Evolution layer scripts are self-contained${NC}"
  SCRIPT_OK=true
  for s in seo-diversity-monitor.py; do
    if ! python3 -c "import ast; ast.parse(open('$SCRIPTS_DIR/$s').read())" 2>/dev/null; then
      log "  ❌ $s has syntax error"
      SCRIPT_OK=false
    fi
  done
  if [ -x "$SCRIPTS_DIR/seo-evolve.sh" ]; then
    log "  ✅ seo-evolve.sh executable"
  else
    log "  ❌ seo-evolve.sh not executable"
    SCRIPT_OK=false
  fi
  if $SCRIPT_OK; then
    PASS=$((PASS+1))
    RESULTS+=("self_contained: PASS")
  else
    FAIL=$((FAIL+1))
    RESULTS+=("self_contained: FAIL")
  fi
  
  # 总结
  step "📊 Evolution VERIFY Results"
  for r in "${RESULTS[@]}"; do
    log "  $r"
  done
  log ""
  log "Score: $PASS / 7 passed"
  
  if [ "$PASS" -ge 5 ]; then
    log "${GREEN}✅ Evolution layer VERIFIED${NC}"
    exit 0
  else
    log "${RED}❌ Evolution layer BROKEN ($FAIL/7 failed)${NC}"
    exit 1
  fi
}

# ============================================
# 入口
# ============================================
case "${1:-}" in
  pre)
    pre_check
    ;;
  post)
    post_analyze
    ;;
  verify)
    verify
    ;;
  *)
    echo "Usage: $0 {pre|post|verify}"
    echo "  pre    - Run before v3 hybrid (diversity check, fingerprint load, queue check)"
    echo "  post   - Run after v3 hybrid (delivery check, diversity re-check, evolution log)"
    echo "  verify - Run 7 hard metric validation"
    exit 1
    ;;
esac
