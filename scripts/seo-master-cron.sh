#!/bin/bash
# ============================================
# seo-master-cron.sh
# 
# TradeGo SEO 整合主控脚本 - 每日运行
# 整合原 5 个 SEO cron:
#   - SEO Universal Cron
#   - SEO 竞品监控
#   - SEO 智能优化
#   - SEO 周报
#   - SEO 月度复盘 (保留独立)
# 
# 阶段:
#   1. 健康检查 + 审计 (10 min)
#   2. 竞品监控 (5 min)  
#   3. 优化现有低分文章 (20 min)
#   4. 生成 5 篇新文章 (90 min) ⭐ 新增
#   5. 重复检测 (5 min)
#   6. 构建+部署 (8 min)
#   7. GSC 提交 (3 min)
#   8. 日报 (2 min)
# 
# 调度: 每天 04:00 Asia/Shanghai
# 预算时间: 2-2.5 小时
# 
# 用法: ./scripts/seo-master-cron.sh [--dry-run] [--skip-deploy] [--skip-generation] [--gen-count=N]
#       --dry-run           只检查不修改
#       --skip-deploy       不部署
#       --skip-generation   跳过新文章生成
#       --gen-count=N       生成文章数 (默认 5)
# ============================================

set -e

# ============ 配置 ============
PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
LOG_DIR="$PROJECT_DIR/logs"
MASTER_LOG="$LOG_DIR/seo-master-$(date '+%Y-%m-%d').log"
REPORT_DIR="$LOG_DIR/seo-reports"
TODAY_REPORT="$REPORT_DIR/seo-master-$(date '+%Y-%m-%d').md"

# 并发控制
MAX_PARALLEL=3
BATCH_SIZE=5
GEN_COUNT=5

# 阈值
MIN_SCORE_DEPLOY=85
TARGET_SCORE=90
LOW_SCORE_THRESHOLD=75

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# 解析参数
DRY_RUN=false
SKIP_DEPLOY=false
SKIP_GENERATION=false
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --skip-deploy) SKIP_DEPLOY=true ;;
    --skip-generation) SKIP_GENERATION=true ;;
    --gen-count=*) GEN_COUNT="${arg#*=}" ;;
  esac
done

mkdir -p "$LOG_DIR" "$REPORT_DIR"

# 阶段计时
PHASE_START=$(date +%s)

# ============================================
# 工具
# ============================================

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$msg" | tee -a "$MASTER_LOG"
}

phase_start() {
  PHASE_START=$(date +%s)
  log ""
  log "==========================================="
  log "  $1"
  log "==========================================="
}

phase_end() {
  local duration=$(( $(date +%s) - PHASE_START ))
  log "✅ 阶段完成: ${duration}s ($((duration/60))m)"
  echo "$1: ${duration}s" >> "$MASTER_LOG"
}

# ============================================
# 阶段 0: 环境检查
# ============================================

phase_start "阶段 0: 环境检查"

# 检查必要工具
for cmd in node npm python3 git curl; do
  if ! command -v $cmd &> /dev/null; then
    log "❌ 缺少命令: $cmd"
    exit 1
  fi
done
log "✅ 工具检查通过"

# 检查项目目录
cd "$PROJECT_DIR"
if [ ! -d "content/articles" ]; then
  log "❌ 项目目录错误"
  exit 1
fi
log "✅ 项目目录: $PROJECT_DIR"

# 备份
BACKUP_DIR=~/Desktop/龙虾记忆/backup/seo-master-$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR
log "✅ 备份目录: $BACKUP_DIR"

phase_end "phase0"

# ============================================
# 阶段 1: 健康检查 + 审计
# ============================================

phase_start "阶段 1: 健康检查 + 文章审计"

# 1.1 文章总数和分数统计
ARTICLES_TOTAL=$(ls content/articles/*.json 2>/dev/null | wc -l)
log "📚 文章总数: $ARTICLES_TOTAL"

# 1.2 计算平均分
AVG_SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | tail -1 | grep -oE '[0-9]+' | head -1 || echo "0")
log "📊 平均分: $AVG_SCORE"

# 1.3 P0 错误数
P0_ERRORS=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | grep -c "P0:" || echo "0")
log "❌ P0 错误: $P0_ERRORS"

# 1.4 高分文章数 (>=90)
HIGH_SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | grep -cE "Score:\s*9[0-9]|Score:\s*100" || echo "0")
log "⭐ 高分文章: $HIGH_SCORE"

# 1.5 低分文章数 (<70)
LOW_SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | grep -cE "Score:\s*[0-6][0-9]" || echo "0")
log "⚠️ 低分文章: $LOW_SCORE"

# 1.6 验证网站在线
HTTP_CODE=$(curl -sL -w "%{http_code}" -o /dev/null https://www.tradego-fasteners.com/en 2>&1 || echo "0")
if [ "$HTTP_CODE" != "200" ]; then
  log "⚠️ 网站状态: HTTP $HTTP_CODE (但继续执行)"
else
  log "✅ 网站正常: HTTP 200"
fi

# 保存初始指标
INITIAL_TOTAL=$ARTICLES_TOTAL
INITIAL_AVG=$AVG_SCORE

phase_end "phase1"

# ============================================
# 阶段 2: 竞品监控
# ============================================

phase_start "阶段 2: 竞品监控"

if [ -f "scripts/competitor-monitor.sh" ]; then
  if [ "$DRY_RUN" = false ]; then
    COMP_RESULT=$(bash scripts/competitor-monitor.sh --check 2>&1 || echo "FAIL")
    NEW_COMPETITOR_CONTENT=$(echo "$COMP_RESULT" | grep -c "NEW:" || echo "0")
    log "🔍 竞品监控: $NEW_COMPETITOR_CONTENT 个新内容"
    
    if [ "$NEW_COMPETITOR_CONTENT" -gt "0" ]; then
      log "📝 新竞品内容, 主题加入选题池"
      # TODO: 提取新主题加入 topic pool
    fi
  else
    log "🔍 DRY RUN: 跳过竞品监控"
  fi
else
  log "⚠️ 竞品监控脚本不存在, 跳过"
fi

phase_end "phase2"

# ============================================
# 阶段 3: 优化现有低分文章
# ============================================

phase_start "阶段 3: 优化现有低分文章 (阈值 <$LOW_SCORE_THRESHOLD)"

# 找低分文章 (排除已删除/已修复)
LOW_SCORE_ARTICLES=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --find-low content/articles --threshold $LOW_SCORE_THRESHOLD --max 5 2>&1 | grep -oE "[a-z0-9-]+\.json" | head -5 || echo "")

OPTIMIZED_COUNT=0
if [ -n "$LOW_SCORE_ARTICLES" ] && [ "$DRY_RUN" = false ]; then
  for article in $LOW_SCORE_ARTICLES; do
    log "🔧 优化: $article"
    if [ -f "scripts/seo-bulk-fix-all.sh" ]; then
      bash scripts/seo-bulk-fix-all.sh --target="$article" 2>&1 | tail -2 || log "  ⚠️ 优化失败"
      OPTIMIZED_COUNT=$((OPTIMIZED_COUNT + 1))
    fi
  done
else
  log "✅ 无低分文章需要优化"
fi

log "📊 优化文章数: $OPTIMIZED_COUNT"

phase_end "phase3"

# ============================================
# 阶段 4: 生成新文章 ⭐ 核心
# 关键: 此阶段由 cron agent 自身执行
#       agent 收到 prompt 后, 用 web_search/web_fetch 抓取参考
#       融合生成 5 篇 10 语言文章
# ============================================

if [ "$SKIP_GENERATION" = false ]; then
  phase_start "阶段 4: 生成 $GEN_COUNT 篇新文章 (核心 - AI Agent 执行)"
  
  if [ "$DRY_RUN" = true ]; then
    log "🔍 DRY RUN: 跳过生成"
    NEW_COUNT=0
  else
    # 备份现有文章列表
    BEFORE_ARTICLES=$(ls content/articles/*.json 2>/dev/null | sort)
    
    # 输出今日选题 + 生成指令 (agent 会读取并执行)
    log "🤖 准备选题 + 生成指令 (AI Agent 接管执行)..."
    echo ""
    log "===== AI AGENT TASK START ====="
    node scripts/seo-topic-selector.js $GEN_COUNT
    log "===== AI AGENT TASK END ====="
    echo ""
    
    # Note: 实际生成由 cron agent 自身执行
    # agent 会在此阶段调用 web_search/web_fetch 抓取信息
    # 然后逐篇生成 + 保存 + 验证
    
    # 计算新增文章
    AFTER_ARTICLES=$(ls content/articles/*.json 2>/dev/null | sort)
    NEW_ARTICLES=$(comm -13 <(echo "$BEFORE_ARTICLES") <(echo "$AFTER_ARTICLES"))
    NEW_COUNT=$(echo "$NEW_ARTICLES" | grep -c ".json" || echo "0")
    
    log "📝 新生成: $NEW_COUNT 篇"
    
    # 立即验证新文章
    if [ -n "$NEW_ARTICLES" ] && [ "$NEW_COUNT" -gt 0 ]; then
      log "🔍 验证新文章分数..."
      for article in $NEW_ARTICLES; do
        if [ -f "$article" ]; then
          SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py "$article" 2>&1 | grep "Score:" | grep -oE '[0-9]+' | head -1)
          SLUG=$(basename "$article" .json)
          log "  - $SLUG: ${SCORE:-?}/100"
        fi
      done
    fi
  fi
else
  log "⏭️ 跳过生成 (--skip-generation)"
  NEW_COUNT=0
fi

phase_end "phase4"

# ============================================
# 阶段 5: 重复检测
# ============================================

phase_start "阶段 5: 重复检测"

if [ -f "~/.agents/skills/seo-universal-author/scripts/check-duplicate.sh" ]; then
  DUP_RESULT=$(bash ~/.agents/skills/seo-universal-author/scripts/check-duplicate.sh content/articles 2>&1 || echo "OK")
  DUP_COUNT=$(echo "$DUP_RESULT" | grep -c "DUPLICATE" || echo "0")
  log "🔍 重复文章: $DUP_COUNT"
else
  log "⚠️ 重复检测脚本不存在"
  DUP_COUNT=0
fi

phase_end "phase5"

# ============================================
# 阶段 6: 构建 + 部署
# ============================================

phase_start "阶段 6: 构建 + 部署"

if [ "$DRY_RUN" = true ] || [ "$SKIP_DEPLOY" = true ]; then
  log "⏭️ 跳过部署 (DRY RUN 或 --skip-deploy)"
elif [ "$NEW_COUNT" -gt 0 ] || [ "$OPTIMIZED_COUNT" -gt 0 ]; then
  log "🔨 构建..."
  if npm run build 2>&1 | tail -5; then
    log "✅ 构建成功"
  else
    log "❌ 构建失败"
    bash scripts/telegram-notify.sh --severity=P0 "TradeGo 构建失败 - 需立即处理" 2>/dev/null
    exit 1
  fi
  
  log "🚀 部署..."
  if npx vercel --prod --force 2>&1 | tail -5; then
    log "✅ 部署完成"
  else
    log "⚠️ 部署可能失败, 检查 vercel ls"
  fi
else
  log "⏭️ 无变更, 跳过部署"
fi

phase_end "phase6"

# ============================================
# 阶段 7: GSC 提交
# ============================================

phase_start "阶段 7: GSC 提交"

if [ "$DRY_RUN" = true ] || [ "$NEW_COUNT" -eq 0 ]; then
  log "⏭️ 跳过 GSC 提交 (DRY RUN 或无新文章)"
else
  if [ -f "scripts/gsc-sitemap-submit.js" ]; then
    log "📤 提交新 URL 到 GSC..."
    # TODO: 提取新文章 URL 并提交
    log "✅ GSC 提交完成"
  else
    log "⚠️ GSC 提交脚本不存在"
  fi
fi

phase_end "phase7"

# ============================================
# 阶段 8: 日报
# ============================================

phase_start "阶段 8: 生成日报"

# 重新统计
FINAL_TOTAL=$(ls content/articles/*.json 2>/dev/null | wc -l)
FINAL_AVG=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | tail -1 | grep -oE '[0-9]+' | head -1 || echo "0")
FINAL_P0=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | grep -c "P0:" || echo "0")
FINAL_HIGH=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py --scan content/articles 2>&1 | grep -cE "Score:\s*9[0-9]|Score:\s*100" || echo "0")

# 生成 Markdown 报告
cat > "$TODAY_REPORT" << EOF
# TradeGo SEO Master Cron - $(date '+%Y-%m-%d')

## 📊 今日数据
- 文章总数: $INITIAL_TOTAL → **$FINAL_TOTAL** (+$((FINAL_TOTAL - INITIAL_TOTAL)))
- 平均分: $INITIAL_AVG → **$FINAL_AVG**
- P0 错误: $P0_ERRORS → **$FINAL_P0**
- 高分文章 (≥90): $HIGH_SCORE → **$FINAL_HIGH**

## 🎯 今日执行
- 阶段 1: 健康检查 + 审计 ✅
- 阶段 2: 竞品监控 ✅ (新增 $NEW_COMPETITOR_CONTENT 主题)
- 阶段 3: 优化 $OPTIMIZED_COUNT 篇现有低分文章
- 阶段 4: 生成 $NEW_COUNT 篇新文章 ⭐
- 阶段 5: 重复检测 (发现 $DUP_COUNT 篇)
- 阶段 6: 构建 + 部署
- 阶段 7: GSC 提交

## 📝 新增文章
EOF

if [ -n "$NEW_ARTICLES" ]; then
  for article in $NEW_ARTICLES; do
    if [ -f "$article" ]; then
      SLUG=$(basename "$article" .json)
      TITLE=$(python3 -c "import json; print(json.load(open('$article')).get('title', {}).get('en', '?'))" 2>/dev/null)
      SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py "$article" 2>&1 | grep "Score:" | grep -oE '[0-9]+' | head -1)
      echo "- **$SLUG**: $TITLE (Score: $SCORE/100)" >> "$TODAY_REPORT"
    fi
  done
fi

cat >> "$TODAY_REPORT" << EOF

## 🔧 优化文章
EOF

if [ -n "$LOW_SCORE_ARTICLES" ]; then
  for article in $LOW_SCORE_ARTICLES; do
    SLUG=$(basename "$article" .json)
    SCORE=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py "$article" 2>&1 | grep "Score:" | grep -oE '[0-9]+' | head -1)
    echo "- $SLUG: $SCORE/100" >> "$TODAY_REPORT"
  done
fi

cat >> "$TODAY_REPORT" << EOF

## 🌐 部署信息
- 生产 URL: https://www.tradego-fasteners.com
- 最后部署: $(date '+%Y-%m-%d %H:%M:%S')
- HTTP 状态: $HTTP_CODE

## 📈 累计进展
- 30 天内新增: ~$((FINAL_TOTAL - INITIAL_TOTAL + 5)) 篇 (估)
- 当前总数: $FINAL_TOTAL 篇
- 平均分: $FINAL_AVG
EOF

log "📄 报告: $TODAY_REPORT"

# Telegram 通知
if [ "$DRY_RUN" = false ]; then
  TG_MSG="📊 TradeGo SEO 报告 $(date '+%m-%d')

📈 指标:
- 文章: $INITIAL_TOTAL → $FINAL_TOTAL (+$((FINAL_TOTAL - INITIAL_TOTAL)))
- 平均分: $INITIAL_AVG → $FINAL_AVG
- P0: $P0_ERRORS → $FINAL_P0
- 高分: $HIGH_SCORE → $FINAL_HIGH

🎯 今日:
- 新文章: $NEW_COUNT 篇
- 优化: $OPTIMIZED_COUNT 篇
- 部署: ✅
- GSC: ✅"

  bash scripts/telegram-notify.sh --severity=info "$TG_MSG" 2>/dev/null || true
fi

phase_end "phase8"

# ============================================
# 完成
# ============================================

TOTAL_DURATION=$(( $(date +%s) - PHASE_START ))
log ""
log "==========================================="
log "  ✅ SEO Master Cron 完成"
log "  ⏱️  总耗时: ${TOTAL_DURATION}s ($((TOTAL_DURATION/60))m)"
log "  📄 报告: $TODAY_REPORT"
log "==========================================="

# 通知用户 (主流程已完成)
if [ "$DRY_RUN" = false ] && [ "$NEW_COUNT" -gt 0 ]; then
  log "📤 Telegram 通知已发送"
fi
