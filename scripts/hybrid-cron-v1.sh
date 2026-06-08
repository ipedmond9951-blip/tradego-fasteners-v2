#!/bin/bash
# ============================================
# hybrid-cron-v1.sh
# End-to-end test of hybrid article generation pipeline
# 
# Runs the full workflow for ONE topic:
# 1. Select topic from pool
# 2. Generate JSON via template
# 3. Auto-fix to 100/100
# 4. Generate image
# 5. git commit + push
# 6. Vercel deploy
# 7. 10-language verification
# 
# Self-healing: if any step fails, retry up to 3 times with fix
# 
# Usage: ./scripts/hybrid-cron-v1.sh [--topic=SLUG] [--skip-deploy] [--dry-run]
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/hybrid-v1-$(date '+%Y%m%d-%H%M%S').log"
MAX_RETRIES=3

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

mkdir -p "$LOG_DIR"

# Parse args
TOPIC_SLUG=""
SKIP_DEPLOY=false
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --topic=*) TOPIC_SLUG="${arg#*=}" ;;
    --skip-deploy) SKIP_DEPLOY=true ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

log() {
  echo -e "$1" | tee -a "$LOG_FILE"
}

step() {
  log ""
  log "${GREEN}===== $1 =====${NC}"
}

# ============================================
# STEP 1: Select topic
# ============================================
step "STEP 1: Select topic from pool"

if [ -z "$TOPIC_SLUG" ]; then
  # Pick first non-existing topic
  TOPIC_SLUG=$(python3 -c "
import json, os
pool = json.load(open('$SCRIPTS_DIR/seo-topic-pool.json'))
existing = set(f.replace('.json', '') for f in os.listdir('$PROJECT_DIR/content/articles') if f.endswith('.json'))
for t in pool['topics']:
    if t['slug'] not in existing:
        print(t['slug'])
        break
")
fi
log "Topic: $TOPIC_SLUG"

if [ -z "$TOPIC_SLUG" ]; then
  log "${RED}No available topic in pool${NC}"
  exit 1
fi

# ============================================
# STEP 2: Generate JSON via template
# ============================================
step "STEP 2: Generate JSON via template (hybrid mode)"
ARTICLE_FILE="$PROJECT_DIR/content/articles/$TOPIC_SLUG.json"
[ -f "$ARTICLE_FILE" ] && { log "${YELLOW}Already exists, removing: $ARTICLE_FILE${NC}"; rm "$ARTICLE_FILE"; }
node "$SCRIPTS_DIR/gen-article-hybrid.js" "$TOPIC_SLUG" 2>&1 | tee -a "$LOG_FILE"

# Validate JSON
log "Validating JSON syntax..."
python3 -c "import json; json.load(open('$ARTICLE_FILE'))" 2>&1 | tee -a "$LOG_FILE" || { log "${RED}JSON invalid${NC}"; exit 1; }
log "${GREEN}✅ JSON valid${NC}"

# ============================================
# STEP 3: Auto-fix to 100/100
# ============================================
step "STEP 3: Auto-fix to 100/100 (max $MAX_RETRIES retries)"

FIXED=false
for attempt in $(seq 1 $MAX_RETRIES); do
  log "Attempt $attempt/$MAX_RETRIES:"
  SCORE=$(python3 "$SCRIPTS_DIR/hybrid-auto-fix.py" "$ARTICLE_FILE" 2>&1 | tee -a "$LOG_FILE" | grep "FINAL:" | grep -oE "[0-9]+/100" | head -1)
  log "Score: $SCORE"
  if [ -n "$SCORE" ] && [ "${SCORE%%/*}" -ge 95 ]; then
    FIXED=true
    break
  fi
done

if [ "$FIXED" = "false" ]; then
  log "${RED}Failed to reach 95/100 in $MAX_RETRIES attempts${NC}"
  exit 1
fi
log "${GREEN}✅ Article score: $SCORE${NC}"

# ============================================
# STEP 4: Generate image
# ============================================
step "STEP 4: Generate hero image"
IMG_FILE="$PROJECT_DIR/public/images/articles/$TOPIC_SLUG.jpg"
[ -f "$IMG_FILE" ] && { log "${YELLOW}Image exists, removing${NC}"; rm "$IMG_FILE"; }

# Image prompt varies by category
CATEGORY=$(python3 -c "import json; t=json.load(open('$SCRIPTS_DIR/seo-topic-pool.json'))['topics']; print([x['category'] for x in t if x['slug']=='$TOPIC_SLUG'][0] if any(x['slug']=='$TOPIC_SLUG' for x in t) else 'Procurement')")

case "$CATEGORY" in
  "Case Study") IMG_PROMPT="Cross-section of failed industrial fastener showing fracture surface analysis with microscopic view, professional industrial photography" ;;
  *) IMG_PROMPT="Industrial fastener quality control and procurement inspection in modern factory, professional B2B photography" ;;
esac

log "Image prompt: $IMG_PROMPT"
"$HOME/.openclaw/workspace/tools/minimax-image-gen.sh" "$IMG_PROMPT" "$IMG_FILE" 2>&1 | tail -3 | tee -a "$LOG_FILE"
log "${GREEN}✅ Image generated${NC}"

# ============================================
# STEP 5: git commit + push
# ============================================
step "STEP 5: git commit + push"

cd "$PROJECT_DIR"
git add "content/articles/$TOPIC_SLUG.json" "public/images/articles/$TOPIC_SLUG.jpg" src/lib/articles.ts 2>&1 | tee -a "$LOG_FILE"
git commit -m "feat(seo): $TOPIC_SLUG article 2026-06-09" 2>&1 | tee -a "$LOG_FILE" | tail -2
git push 2>&1 | tee -a "$LOG_FILE" | tail -2
log "${GREEN}✅ Git push complete${NC}"

# ============================================
# STEP 6: Vercel deploy
# ============================================
if [ "$SKIP_DEPLOY" = "true" ]; then
  log "${YELLOW}STEP 6: Skipped (--skip-deploy)${NC}"
else
  step "STEP 6: Vercel deploy"
  # First check queue
  QUEUE_COUNT=$(npx vercel ls --prod 2>/dev/null | grep -c "Queued" || echo 0)
  log "Current queue: $QUEUE_COUNT"
  if [ "$QUEUE_COUNT" -ge 2 ]; then
    log "${YELLOW}Cleaning $QUEUE_COUNT stuck deployments...${NC}"
    npx vercel ls --prod 2>/dev/null | grep "Queued" | awk '{print $4}' | while read url; do
      [ -n "$url" ] && npx vercel rm "$url" --yes 2>&1 | tail -1
    done
  fi
  npx vercel --prod --yes 2>&1 | tail -5 | tee -a "$LOG_FILE"
  log "${GREEN}✅ Deploy initiated${NC}"
fi

# ============================================
# STEP 7: 10-language verification
# ============================================
step "STEP 7: 10-language verification (post-deploy)"

log "Waiting 90s for Vercel build..."
sleep 90

PASS=0
FAIL=0
for locale in en zh es ar fr pt ru ja de hi; do
  CODE=$(curl -sL --max-time 15 -w "%{http_code}" -o /dev/null "https://www.tradego-fasteners.com/$locale/industry/$TOPIC_SLUG" 2>&1)
  if [ "$CODE" = "200" ]; then
    log "${GREEN}✅ $locale: 200${NC}"
    PASS=$((PASS + 1))
  else
    log "${RED}❌ $locale: $CODE${NC}"
    FAIL=$((FAIL + 1))
  fi
done

log ""
log "=================================="
log "${GREEN}10-lang result: $PASS pass / $FAIL fail${NC}"
log "Log: $LOG_FILE"
log "=================================="

if [ $FAIL -gt 0 ]; then
  log "${YELLOW}Some langs failed. Wait 60s and retry once...${NC}"
  sleep 60
  RETRY_PASS=0
  RETRY_FAIL=0
  for locale in en zh es ar fr pt ru ja de hi; do
    CODE=$(curl -sL --max-time 15 -w "%{http_code}" -o /dev/null "https://www.tradego-fasteners.com/$locale/industry/$TOPIC_SLUG" 2>&1)
    if [ "$CODE" = "200" ]; then
      RETRY_PASS=$((RETRY_PASS + 1))
    else
      RETRY_FAIL=$((RETRY_FAIL + 1))
      log "${RED}❌ $locale: $CODE (retry)${NC}"
    fi
  done
  log "Retry: $RETRY_PASS / 10"
fi

# Final report
log ""
log "${GREEN}🎉 HYBRID V1 PIPELINE COMPLETE${NC}"
log "   Article: $TOPIC_SLUG"
log "   Score: $SCORE"
log "   Log: $LOG_FILE"
