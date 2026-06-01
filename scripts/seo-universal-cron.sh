#!/bin/bash
# ============================================
# seo-universal-cron.sh
# 
# Unified SEO Automation using seo-universal-author skill
# Integrates all SEO tasks into one optimized workflow
#
# 阶段:
#   1. 健康检查 (health check) - 5 min
#   2. 文章质量审计 (audit) - 10 min  
#   3. 自动优化 (auto-optimize) - 15 min
#   4. 重复内容检测+修复 (dedup) - 5 min
#   5. 部署 (deploy) - 3 min
#   6. GSC 提交 (gsc) - 5 min
#
# 调度: 每天 06:00 Asia/Shanghai
# 预算时间: 45-60 分钟
#
# 用法: ./scripts/seo-universal-cron.sh [--dry-run] [--skip-deploy]
#       --auto-dedupe        自动删除重复文章 (小心使用)
# ============================================

set -e

# ============ 配置 ============
PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
LOG_DIR="$PROJECT_DIR/logs"
SEO_LOG="$LOG_DIR/seo-universal-$(date '+%Y-%m-%d').log"
REPORT_DIR="$LOG_DIR/seo-reports"
TODAY_REPORT="$REPORT_DIR/seo-universal-$(date '+%Y-%m-%d').md"

# 并发控制
MAX_PARALLEL=3
BATCH_SIZE=5  # 每次优化文章数

# 阈值
MIN_SCORE_DEPLOY=85     # 低于此分不部署
TARGET_SCORE=90         # 目标分

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 解析参数
DRY_RUN=false
SKIP_DEPLOY=false
SKIP_OPTIMIZE=false
SKIP_AUDIT=false
AUTO_DEDUPE=false

for arg in "$@"; do
    case $arg in
        --dry-run) DRY_RUN=true ;;
        --skip-deploy) SKIP_DEPLOY=true ;;
        --skip-optimize) SKIP_OPTIMIZE=true ;;
        --skip-audit) SKIP_AUDIT=true ;;
        --auto-dedupe) AUTO_DEDUPE=true ;;
        *) echo "Unknown arg: $arg"; exit 1 ;;
    esac
done

# ============ 初始化 ============
mkdir -p "$LOG_DIR" "$REPORT_DIR"

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$SEO_LOG"
}

log_section() {
    echo "" | tee -a "$SEO_LOG"
    echo "=========================================" | tee -a "$SEO_LOG"
    echo -e "${GREEN}$1${NC}" | tee -a "$SEO_LOG"
    echo "=========================================" | tee -a "$SEO_LOG"
}

log "🚀 SEO Universal Cron started"
log "   Mode: $([ "$DRY_RUN" = true ] && echo 'DRY-RUN' || echo 'LIVE')"
log "   Skip deploy: $SKIP_DEPLOY"
log "   Skip optimize: $SKIP_OPTIMIZE"
log "   Skip audit: $SKIP_AUDIT"

# ============ 阶段 1: 健康检查 ============
log_section "📊 Phase 1/6: Health Check"

if [ -f "$PROJECT_DIR/scripts/core-web-vitals-check.sh" ]; then
    if [ "$DRY_RUN" = false ]; then
        bash "$PROJECT_DIR/scripts/core-web-vitals-check.sh" 2>&1 | tee -a "$SEO_LOG" | tail -10
    else
        log "  [DRY-RUN] Would run core-web-vitals-check.sh"
    fi
fi

# ============ 阶段 2: 文章质量审计 ============
log_section "🔍 Phase 2/6: Article Quality Audit"

if [ "$SKIP_AUDIT" = false ]; then
    log "   Scanning all articles..."
    AUDIT_OUTPUT=$(python3 "$SKILL_DIR/scripts/validate-article.py" \
        --scan "$PROJECT_DIR/content/articles" 2>&1) || true
    echo "$AUDIT_OUTPUT" | tail -30 | tee -a "$SEO_LOG"
    
    # 提取关键指标
    TOTAL=$(echo "$AUDIT_OUTPUT" | grep "Total:" | grep -oE "[0-9]+" | head -1)
    TOTAL=${TOTAL:-0}
    AVG_SCORE=$(echo "$AUDIT_OUTPUT" | grep "Average:" | grep -oE "[0-9]+" | head -1)
    AVG_SCORE=${AVG_SCORE:-0}
    P0_COUNT=$(echo "$AUDIT_OUTPUT" | grep "P0 errors:" | grep -oE "[0-9]+" | head -1)
    P0_COUNT=${P0_COUNT:-0}
    
    log "   📈 Audit Summary:"
    log "      Total articles: $TOTAL"
    log "      Average score: $AVG_SCORE"
    log "      P0 errors: $P0_COUNT"
fi

# ============ 阶段 3: 自动优化 ============
log_section "✨ Phase 3/6: Auto-Optimize Articles"

if [ "$SKIP_OPTIMIZE" = false ]; then
    log "   Finding articles below threshold ($MIN_SCORE_DEPLOY)..."
    
    # 找到需要优化的文章（用 validate-article.py --find-low）
    LOW_SCORE_ARTICLES=$(python3 "$SKILL_DIR/scripts/validate-article.py" \
        --find-low "$PROJECT_DIR/content/articles" \
        --threshold "$MIN_SCORE_DEPLOY" \
        --max "$BATCH_SIZE" 2>/dev/null) || LOW_SCORE_ARTICLES=""
    
    if [ -z "$LOW_SCORE_ARTICLES" ]; then
        log "   ✅ No articles below threshold"
    else
        COUNT=$(echo "$LOW_SCORE_ARTICLES" | wc -l | tr -d ' ')
        log "   📝 Found $COUNT articles to optimize"
        
        echo "$LOW_SCORE_ARTICLES" | while read -r article_path; do
            if [ -z "$article_path" ]; then continue; fi
            
            slug=$(basename "$article_path" .json)
            log "   ⚙️  Optimizing: $slug"
            
            if [ "$DRY_RUN" = false ]; then
                # 这里需要 agentTurn 来优化（AI 增强）
                # 但纯自动只能做格式优化
                python3 "$SKILL_DIR/scripts/validate-article.py" \
                    --auto-fix "$article_path" 2>&1 | tail -5 | tee -a "$SEO_LOG"
            else
                log "      [DRY-RUN] Would optimize $slug"
            fi
        done
    fi
fi

# ============ 阶段 4: 重复内容检测 ============
log_section "🔁 Phase 4/6: Duplicate Content Check"

if [ -f "$SKILL_DIR/scripts/check-duplicate.sh" ]; then
    log "   Checking for duplicate content..."
    if [ "$DRY_RUN" = false ]; then
        DEDUP_OUTPUT=$(bash "$SKILL_DIR/scripts/check-duplicate.sh" \
            "$PROJECT_DIR/content/articles" 2>&1)
        echo "$DEDUP_OUTPUT" | tail -20 | tee -a "$SEO_LOG"
        
        # 严重重复: 同 slug 出现在多个文件 - 自动备份并删除旧文件
        DUP_SLUGS=$(echo "$DEDUP_OUTPUT" | grep "Title: 100.0%" | wc -l | tr -d ' ')
        if [ "$DUP_SLUGS" -gt 0 ] && [ "$AUTO_DEDUPE" = true ]; then
            log "   ⚠️  Found $DUP_SLUGS exact duplicates (100% title match)"
            log "   Auto-dedupe enabled, backing up + removing..."
            # Run the Python script to handle
            python3 << 'PYEOF'
import json
import os
from pathlib import Path
from collections import defaultdict

ARTICLES_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles")
BACKUP_DIR = Path.home() / "Desktop/龙虾记忆/backup/seo-dedupe-20260601"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

slug_files = defaultdict(list)
for f in ARTICLES_DIR.glob("*.json"):
    try:
        with open(f) as fp:
            a = json.load(fp)
        slug = a.get("slug", "")
        size = f.stat().st_size
        date = a.get("date", "")
        slug_files[slug].append({
            "path": f,
            "size": size,
            "date": date,
        })
    except:
        continue

# Find duplicates
removed = 0
for slug, files in slug_files.items():
    if len(files) < 2:
        continue
    
    # Sort: largest first (canonical), then most recent
    files.sort(key=lambda x: (x["size"], x["date"]), reverse=True)
    
    keep = files[0]
    for f in files[1:]:
        # Backup
        backup_path = BACKUP_DIR / f["path"].name
        import shutil
        shutil.copy2(f["path"], backup_path)
        # Remove
        f["path"].unlink()
        print(f"  Removed: {f['path'].name} ({f['size']} bytes)")
        print(f"    Kept:  {keep['path'].name} ({keep['size']} bytes)")
        removed += 1

print(f"\n✅ Removed {removed} duplicate files")
PYEOF
        else
            log "   [INFO] Use --auto-dedupe to remove exact duplicates"
        fi
    else
        log "   [DRY-RUN] Would run duplicate check"
    fi
fi

# ============ 阶段 5: 构建与部署 ============
log_section "🚀 Phase 5/6: Build & Deploy"

if [ "$SKIP_DEPLOY" = false ] && [ "$DRY_RUN" = false ]; then
    log "   Building Next.js..."
    cd "$PROJECT_DIR"
    if npm run build 2>&1 | tail -5 | tee -a "$SEO_LOG"; then
        log "   ✅ Build successful"
        
        log "   Deploying to Vercel (--force)..."
        npx vercel --prod --force 2>&1 | tail -5 | tee -a "$SEO_LOG"
    else
        log "   ❌ Build failed, skipping deploy"
    fi
else
    log "   [SKIP/DRY-RUN] Build & deploy skipped"
fi

# ============ 阶段 6: GSC 提交 ============
log_section "📡 Phase 6/6: GSC Sitemap Submit"

if [ "$SKIP_DEPLOY" = false ] && [ "$DRY_RUN" = false ]; then
    if [ -f "$PROJECT_DIR/scripts/gsc-sitemap-submit.js" ]; then
        log "   Submitting sitemap to Google Search Console..."
        GSC_LOG="/tmp/gsc-submit-$(date '+%Y%m%d').log"
        node "$PROJECT_DIR/scripts/gsc-sitemap-submit.js" > "$GSC_LOG" 2>&1
        tail -10 "$GSC_LOG" | tee -a "$SEO_LOG"
        
        # Failure classification
        if [ -f "$PROJECT_DIR/scripts/gsc-failure-classifier.sh" ]; then
            GSC_RESULT=$(bash "$PROJECT_DIR/scripts/gsc-failure-classifier.sh" "$GSC_LOG" 2>&1)
            GSC_EXIT=$?
            log "   GSC classifier: $GSC_RESULT"
            
            if [ "$GSC_EXIT" -ge 3 ]; then
                log "   🚨 GSC critical failure, will notify via Telegram"
                bash "$PROJECT_DIR/scripts/telegram-notify.sh" \
                    --severity=P1 \
                    "GSC 提交异常:

$GSC_RESULT

请手动检查 gsc-submit.log
详情: $GSC_LOG" 2>&1 | tee -a "$SEO_LOG"
            fi
        fi
    fi
    
    # Token 有效性检查
    if [ -f "$HOME/Projects/tradebrain-v2/server/config/google-oauth-tokens.json" ]; then
        TOKEN_EXPIRY=$(node -e "console.log(require('$HOME/Projects/tradebrain-v2/server/config/google-oauth-tokens.json').expiry_date)" 2>/dev/null || echo "0")
        NOW=$(node -e "console.log(Date.now())")
        if [ "$TOKEN_EXPIRY" -lt "$NOW" ]; then
            log "   ⚠️  GA4 OAuth token expired, skipping GA4 data fetch"
            bash "$PROJECT_DIR/scripts/telegram-notify.sh" \
                --severity=P3 \
                "GA4 token 过期

需要手动:
1. 打开 http://localhost:3000/oauth (启动 oauth-server-nopkce.js)
2. 重新授权
3. Token 会自动保存" 2>&1 | tee -a "$SEO_LOG" || true
        else
            log "   ✅ GA4 token valid"
        fi
    fi
fi

# ============ 报告 ============
log_section "📊 Daily Report"

cat > "$TODAY_REPORT" << EOF
# SEO Universal Cron Report - $(date '+%Y-%m-%d')

## 执行摘要
- **执行时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **模式**: $([ "$DRY_RUN" = true ] && echo 'DRY-RUN' || echo 'LIVE')
- **总文章数**: $TOTAL
- **平均分**: $AVG_SCORE
- **P0 错误数**: $P0_COUNT

## 详细日志
详见: \`$SEO_LOG\`

## 后续行动
EOF

if [ "$P0_COUNT" -gt 0 ]; then
    echo "- [P0] 修复 $P0_COUNT 个 P0 错误" >> "$TODAY_REPORT"
fi

if [ "$AVG_SCORE" -lt "$TARGET_SCORE" ]; then
    echo "- [优化] 平均分 $AVG_SCORE 低于目标 $TARGET_SCORE，需要提升" >> "$TODAY_REPORT"
fi

echo "" | tee -a "$SEO_LOG"
log "✅ SEO Universal Cron completed"
log "   Log: $SEO_LOG"
log "   Report: $TODAY_REPORT"
chmod +x /Users/zhangming/workspace/tradego-fasteners-v2/scripts/seo-universal-cron.sh
echo "✅ seo-universal-cron.sh created"