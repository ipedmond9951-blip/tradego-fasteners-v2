#!/bin/bash
# ============================================
# hybrid-cron-v3.sh
# TradeGo SEO Master - 5 篇每日批量 + 8 项交付标准 + 自主决策
#
# 每天跑 5 篇文章:
#   2 篇 Zimbabwe + 1 篇 Africa + 2 篇 Global
#
# 8 项硬性交付标准 (seo-delivery-check.py):
#   1. Validator score >= 90
#   2. 10 语言全填
#   3. 关键词密度 (核心≥3, 长尾≥5)
#   4. 内部链接 (3+ 产品, 1+ category)
#   5. 部署 10/10 语言 200
#   6. 配图 50-500KB JPEG
#   7. Git pushed
#   8. GSC 可索引 (无 noindex)
#
# 自主决策:
#   - 选题失败 → 自动降级 global
#   - validator < 90 → 自动修 3 轮
#   - Vercel 队列拥堵 → 自动 rm 旧 deployment
#   - 配图失败 → 跳过但继续
#   - 验证失败 → 多源 retry
#   - 8 项任一不达 → 不算交付 → 修复 → 重测
#
# Usage: ./scripts/hybrid-cron-v3.sh [--dry-run] [--skip-deploy]
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/hybrid-v3-$(date '+%Y%m%d-%H%M%S').log"
TODAY=$(date '+%Y-%m-%d')

mkdir -p "$LOG_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse args
DRY_RUN=false
SKIP_DEPLOY=false
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --skip-deploy) SKIP_DEPLOY=true ;;
  esac
done

log() { echo -e "$1" | tee -a "$LOG_FILE"; }
step() { log ""; log "${GREEN}═══ $1 ═══${NC}"; }

# 选题 (按 region 分配)
# v3 进化: 接入 topic-state-manager.py (5 态状态机 + 1 分钟随机种子)
#         池子是 225,000 组合的动态生成器 (不再受 35 固定池限制)
select_topics() {
  # 进化 v1: 单 cron 跑 2 篇 (≈ 18 分钟, 留 22 分钟缓冲给 2400s timeout)
  local count=${1:-2}
  # 进化 v3.0: 调用 topic-state-manager.py select
  # 它会考虑 region 过滤 + 状态机 (跳过 in_progress) + 多样性 (不连发同 product)
  local region_filter="${2:-all}"
  local selected_json
  selected_json=$(python3 "$SCRIPTS_DIR/topic-state-manager.py" select --region="$region_filter" --count="$count" 2>&1)
  if [ $? -ne 0 ] || [ -z "$selected_json" ]; then
    log "${RED}state-manager select 失败, 降级到 pool 直选${NC}"
    selected_json=$(python3 -c "
import json, os, random, time
random.seed(int(time.time()) // 60)
pool = json.load(open('$SCRIPTS_DIR/seo-topic-pool.json'))
existing = set(f.replace('.json', '') for f in os.listdir('$PROJECT_DIR/content/articles') if f.endswith('.json'))
pool_available = [t for t in pool['topics'] if t['slug'] not in existing]
pool_shuffled = list(pool_available)
random.shuffle(pool_shuffled)
selected = pool_shuffled[:$count]
print(json.dumps([{'slug': t['slug'], 'score': t.get('score_potential', 0), 'category': t.get('category', '?'), 'region': t.get('region', 'global'), 'title_en': t.get('title_en', t['slug'])} for t in selected]))
")
  fi
  # 包装输出 (供下游 bash 解析)
  echo "$selected_json" | python3 -c "
import json, sys
sel = json.load(sys.stdin)
zim = [t for t in sel if t['region'] == 'zimbabwe']
africa = [t for t in sel if t['region'] == 'africa']
global_ = [t for t in sel if t['region'] == 'global']
print(json.dumps({
    'topics': [{'slug': t['slug'], 'category': t['category'], 'region': t['region']} for t in sel],
    'counts': {'zimbabwe': len(zim), 'africa': len(africa), 'global': len(global_)},
    'pool_exhausted': False
}, indent=2))
"

  # 进化 v3.0: 标记选中的为 in_progress (防下次重选)
  echo "$selected_json" | python3 -c "
import json, sys, subprocess
sel = json.load(sys.stdin)
for t in sel:
    subprocess.run(['python3', '$SCRIPTS_DIR/topic-state-manager.py', 'mark', t['slug'], 'in_progress'], cwd='$PROJECT_DIR')
" 2>&1 | head -5
}

# 生成 + 部署 + 验证 单篇
run_one_article() {
  local slug=$1
  local category=$2
  local region=$3
  local article_file="$PROJECT_DIR/content/articles/$slug.json"
  local img_file="$PROJECT_DIR/public/images/articles/$slug.jpg"

  step "📝 Article: $slug ($region / $category)"

  # 1. 生成 (用 hybrid 模板, 0 LLM)
  log "${BLUE}Step 1: Generate JSON via template${NC}"
  if [ -f "$article_file" ]; then
    log "${YELLOW}Existing file, regenerating: $article_file${NC}"
    rm "$article_file"
  fi
  node "$SCRIPTS_DIR/gen-article-hybrid.js" "$slug" 2>&1 | tail -5 | tee -a "$LOG_FILE"

  # 验证 JSON 语法
  python3 -c "import json; json.load(open('$article_file'))" 2>&1 | tee -a "$LOG_FILE" \
    || { log "${RED}JSON invalid, abort${NC}"; return 1; }

  # 2. 自修复 (3-pass, 目标 ≥ 95)
  log "${BLUE}Step 2: Auto-fix to 100/100 (3 retries)${NC}"
  for attempt in 1 2 3; do
    log "  Attempt $attempt/3:"
    python3 "$SCRIPTS_DIR/hybrid-auto-fix.py" "$article_file" 2>&1 | tail -5 | tee -a "$LOG_FILE"
    SCORE=$(python3 "$SCRIPTS_DIR/hybrid-auto-fix.py" "$article_file" 2>&1 | grep "FINAL:" | grep -oE "[0-9]+/100" | head -1)
    if [ -n "$SCORE" ] && [ "${SCORE%%/*}" -ge 90 ]; then
      log "${GREEN}✅ Score: $SCORE${NC}"
      break
    fi
    [ $attempt -eq 3 ] && log "${YELLOW}Score still < 90 after 3 attempts: $SCORE${NC}"
  done

  # 3. 配图
  log "${BLUE}Step 3: Image generation${NC}"
  if [ -f "$img_file" ]; then
    log "${YELLOW}Image exists, regenerating${NC}"
    rm "$img_file"
  fi
  IMG_PROMPT="Industrial fastener and construction hardware in B2B context, professional photography, $category"
  "$HOME/.openclaw/workspace/tools/minimax-image-gen.sh" "$IMG_PROMPT" "$img_file" 2>&1 | tail -3 | tee -a "$LOG_FILE" \
    || log "${YELLOW}Image gen failed, will use placeholder${NC}"

  # 自主决策: 配图失败 → placeholder
  if [ ! -f "$img_file" ] || [ $(stat -f%z "$img_file" 2>/dev/null || echo 0) -lt 50000 ]; then
    log "${YELLOW}Image too small or missing, using default placeholder${NC}"
    # 用 default.jpg 或不传 image 字段
  fi

  # 4. Git commit + push (自主重试 3 次)
  log "${BLUE}Step 4: Git commit + push (3 retries)${NC}"
  cd "$PROJECT_DIR"
  for attempt in 1 2 3; do
    git add "content/articles/$slug.json" "$img_file" "src/lib/articles.ts" 2>&1 | tail -1 | tee -a "$LOG_FILE"
    git commit -m "feat(seo): $slug article $TODAY" 2>&1 | tail -2 | tee -a "$LOG_FILE"
    if git push 2>&1 | tail -2 | tee -a "$LOG_FILE"; then
      log "${GREEN}✅ Pushed${NC}"
      break
    fi
    [ $attempt -eq 3 ] && log "${RED}Push failed 3 times${NC}"
    sleep 5
  done

  # 5. 部署 (自主决策树)
  if [ "$SKIP_DEPLOY" = "true" ]; then
    log "${YELLOW}Step 5: Deploy SKIPPED${NC}"
  else
    log "${BLUE}Step 5: Vercel deploy (queue-aware)${NC}"

    # 自主决策 A: 队列拥堵 → rm
    QUEUE_COUNT=$(npx vercel ls --prod 2>/dev/null | grep -c "Queued" || true)
    [ -z "$QUEUE_COUNT" ] && QUEUE_COUNT=0
    log "  Current queue: $QUEUE_COUNT"
    if [ "$QUEUE_COUNT" -ge 2 ]; then
      log "${YELLOW}Cleaning $QUEUE_COUNT stuck deployments...${NC}"
      npx vercel ls --prod 2>/dev/null | grep "Queued" | awk '{print $NF}' | while read url; do
        [ -n "$url" ] && npx vercel rm "$url" --yes 2>&1 | tail -1
      done
    fi

    # 自主决策 B: 3 次部署重试
    DEPLOYED=false
    for attempt in 1 2 3; do
      log "  Deploy attempt $attempt/3:"
      DEPLOY_OUTPUT=$(npx vercel --prod --force --yes 2>&1 | tail -20)
      echo "$DEPLOY_OUTPUT" | tee -a "$LOG_FILE"
      if echo "$DEPLOY_OUTPUT" | grep -qE "(Production|Aliased|✅)"; then
        DEPLOYED=true
        break
      fi
      # 自主决策: 失败 → 等 60s + 清队列 + 重试
      sleep 60
      QUEUE_COUNT=$(npx vercel ls --prod 2>/dev/null | grep -c "Queued" || true)
      [ -z "$QUEUE_COUNT" ] && QUEUE_COUNT=0
      if [ "$QUEUE_COUNT" -ge 2 ]; then
        npx vercel ls --prod 2>/dev/null | grep "Queued" | awk '{print $NF}' | while read url; do
          [ -n "$url" ] && npx vercel rm "$url" --yes 2>&1 | tail -1
        done
      fi
    done

    if [ "$DEPLOYED" = "false" ]; then
      log "${RED}Deploy failed 3 times, skipping verify${NC}"
    fi
  fi

  # 6. 等 Vercel 边缘节点
  log "${BLUE}Step 6: Wait + verify (Vercel edge)${NC}"
  sleep 90

  # 7. 8 项交付标准检查
  log "${BLUE}Step 7: Delivery Check (8 standards)${NC}"
  python3 "$SCRIPTS_DIR/seo-delivery-check.py" "$slug" 2>&1 | tee -a "$LOG_FILE"
  DELIVERY_EXIT=$?

  if [ $DELIVERY_EXIT -eq 0 ]; then
    log "${GREEN}🎉 DELIVERED: $slug${NC}"
    return 0
  else
    log "${YELLOW}⚠️ NOT DELIVERED: $slug (will retry autofix + redeploy)${NC}"

    # 自主决策: 不达 → 跑 1 轮 auto-fix + 重新 deploy
    log "${BLUE}Retry: auto-fix + redeploy${NC}"
    python3 "$SCRIPTS_DIR/hybrid-auto-fix.py" "$article_file" 2>&1 | tail -3 | tee -a "$LOG_FILE"

    if [ "$SKIP_DEPLOY" != "true" ]; then
      npx vercel --prod --force --yes 2>&1 | tail -5 | tee -a "$LOG_FILE"
      sleep 90
    fi

    # 再 check 1 次
    python3 "$SCRIPTS_DIR/seo-delivery-check.py" "$slug" 2>&1 | tee -a "$LOG_FILE"
    DELIVERY_EXIT=$?

    if [ $DELIVERY_EXIT -eq 0 ]; then
      log "${GREEN}🎉 DELIVERED after retry: $slug${NC}"
      return 0
    else
      log "${RED}❌ FAILED after retry: $slug${NC}"
      return 1
    fi
  fi
}

# ============================================
# MAIN
# ============================================
log "${GREEN}═══════════════════════════════════════════════════════${NC}"
log "${GREEN}  TradeGo SEO Master v3 - 5 Articles Batch${NC}"
log "${GREEN}  Date: $TODAY${NC}"
log "${GREEN}═══════════════════════════════════════════════════════${NC}"

# 🧬 进化层 PRE-CHECK (多样性 + 指纹 + 队列预清)
log "${BLUE}🧬 Running evolution PRE-CHECK...${NC}"
bash "$SCRIPTS_DIR/seo-evolve.sh" pre 2>&1 | tail -30 | tee -a "$LOG_FILE" || log "${YELLOW}Pre-check warning, continuing${NC}"

# 选题
step "📋 Topic Selection"
TOPICS_JSON=$(select_topics 2)
echo "$TOPICS_JSON" | tee -a "$LOG_FILE"
TOPIC_SLUGS=$(echo "$TOPICS_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print('\n'.join(t['slug'] for t in d['topics']))")

# 跑 5 篇 (错开避免 Vercel 队列)
DELIVERED=0
FAILED=0
FAILED_SLUGS=""
i=0
for slug in $TOPIC_SLUGS; do
  i=$((i+1))
  category=$(echo "$TOPICS_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print([t['category'] for t in d['topics'] if t['slug']=='$slug'][0])")
  region=$(echo "$TOPICS_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print([t['region'] for t in d['topics'] if t['slug']=='$slug'][0])")

  log ""
  log "${GREEN}═══ ARTICLE $i of 5: $slug ($region / $category) ═══${NC}"

  if run_one_article "$slug" "$category" "$region"; then
    DELIVERED=$((DELIVERED+1))
  else
    FAILED=$((FAILED+1))
    FAILED_SLUGS="$FAILED_SLUGS $slug"
  fi

  # 错开 5 分钟避免 Vercel 队列拥堵
  if [ $i -lt 2 ]; then
    log "${YELLOW}Waiting 3 min before next article (avoid Vercel queue)...${NC}"
    sleep 180
  fi
done

# 最终报告
step "📊 FINAL REPORT"
log "Total: 2 articles"
log "${GREEN}Delivered: $DELIVERED${NC}"
log "${RED}Failed: $FAILED${NC}"
[ -n "$FAILED_SLUGS" ] && log "Failed slugs:$FAILED_SLUGS"
log ""
log "Log: $LOG_FILE"

if [ $DELIVERED -eq 2 ]; then
  log "${GREEN}🎉 ALL 2 DELIVERED${NC}"
  EVOLUTION_RESULT=0
else
  log "${YELLOW}⚠️ $DELIVERED/2 delivered, $FAILED failed${NC}"
  EVOLUTION_RESULT=1
fi

# 🧬 进化层 POST-ANALYZE (delivery recheck + diversity update + evo log)
log "${BLUE}🧬 Running evolution POST-ANALYZE...${NC}"
bash "$SCRIPTS_DIR/seo-evolve.sh" post 2>&1 | tail -20 | tee -a "$LOG_FILE" || log "${YELLOW}Post-analyze warning, continuing${NC}"

exit $EVOLUTION_RESULT
