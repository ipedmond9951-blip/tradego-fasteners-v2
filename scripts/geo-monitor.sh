#!/bin/bash
# GEO-SEO 20轮优化进度监控脚本
# 使用方法: ./scripts/geo-monitor.sh

echo "=========================================="
echo "TradeGo GEO-SEO 20轮优化进度监控"
echo "时间: $(date)"
echo "=========================================="

# 定义进度文件
PROGRESS_FILE="/Users/zhangming/workspace/GEO-SEO-PROGRESS.md"
PLAN_FILE="/Users/zhangming/workspace/GEO-SEO-20-ROUND-PLAN.md"
PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"

# 检查项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 项目目录不存在: $PROJECT_DIR"
    exit 1
fi

echo ""
echo "📊 计划检查:"
if [ -f "$PLAN_FILE" ]; then
    echo "✅ 计划文件存在"
    echo "   路径: $PLAN_FILE"
else
    echo "❌ 计划文件不存在"
fi

echo ""
echo "📁 项目状态:"
cd "$PROJECT_DIR" || exit 1

# Git状态
GIT_STATUS=$(git status --short 2>/dev/null)
if [ -z "$GIT_STATUS" ]; then
    echo "✅ Git工作区干净"
else
    echo "⚠️ Git工作区有变更:"
    echo "$GIT_STATUS"
fi

# 最近提交
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)
if [ -n "$LAST_COMMIT" ]; then
    echo "📝 最近提交: $LAST_COMMIT"
fi

echo ""
echo "🔍 Schema组件检查:"
SCHEMA_COMPONENTS=(
    "BreadcrumbSchema"
    "FAQSchema"
    "HowToSchema"
    "LocalBusinessSchema"
    "NavigationSchema"
    "OrganizationSchema"
    "ProductSchema"
    "ReviewSchema"
    "VideoSchema"
    "WebSiteSchema"
    "ArticleSchema"
)

for comp in "${SCHEMA_COMPONENTS[@]}"; do
    if [ -f "src/components/${comp}.tsx" ]; then
        echo "   ✅ $comp"
    else
        echo "   ❌ $comp (缺失)"
    fi
done

echo ""
echo "🏥 Build状态:"
if npm run build 2>&1 | grep -q "Build error"; then
    echo "   ❌ Build失败"
else
    echo "   ✅ Build成功"
fi

echo ""
echo "=========================================="
echo "优化进度总结"
echo "=========================================="

# 统计已完成的Schema数量
COMPLETED_SCHEMAS=0
for comp in "${SCHEMA_COMPONENTS[@]}"; do
    if [ -f "src/components/${comp}.tsx" ]; then
        COMPLETED_SCHEMAS=$((COMPLETED_SCHEMAS + 1))
    fi
done

echo "Schema组件: $COMPLETED_SCHEMAS/${#SCHEMA_COMPONENTS[@]}"

# 检查git log中的GEO提交
GEO_COMMITS=$(git log --oneline --grep="GEO" 2>/dev/null | wc -l | tr -d ' ')
echo "GEO相关提交: $GEO_COMMITS"

echo ""
if [ "$COMPLETED_SCHEMAS" -ge 10 ] && [ "$GEO_COMMITS" -ge 3 ]; then
    echo "🎉 进度良好！继续加油！"
elif [ "$COMPLETED_SCHEMAS" -ge 5 ]; then
    echo "⏳ 进行中..."
else
    echo "⚠️ 需要加速执行"
fi

echo ""
echo "下一步建议:"
echo "1. 运行 'npm run dev' 启动开发服务器"
echo "2. 检查 https://search.google.com/structured-data/testing-tool"
echo "3. 继续执行GEO-SEO-20-ROUND-PLAN.md中的优化"
echo "=========================================="
