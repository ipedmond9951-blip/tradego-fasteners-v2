#!/bin/bash
# 回退脚本 - TradeGo Fasteners Vercel部署
# 用法：
#   ./rollback.sh              # 列出可用版本
#   ./rollback.sh <commit-hash> # 回退到指定版本并部署

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
BACKUP_DIR="/Users/zhangming/Desktop/龙虾记忆/backup"

cd "$PROJECT_DIR"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_color() {
    echo -e "${2}${1}${NC}"
}

# 创建备份
create_backup() {
    local commit=$1
    local timestamp=$(date +"%Y%m%d-%H%M%S")
    local backup_path="$BACKUP_DIR/tradego-$timestamp"
    
    echo_color "📦 创建备份..." "$YELLOW"
    mkdir -p "$backup_path"
    cp -r "$PROJECT_DIR" "$backup_path/code"
    
    # 保存当前commit信息
    cd "$PROJECT_DIR"
    git log -1 --format="%H|%ci|%s" > "$backup_path/commit-info.txt"
    
    echo_color "✅ 备份已保存到: $backup_path" "$GREEN"
    echo "$backup_path"
}

# 列出可用版本
list_versions() {
    echo_color "\n📋 最近可用的稳定版本：" "$YELLOW"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 显示最近15个commit，过滤掉merge commits
    git log --oneline --after="2026-04-01" | head -20 | while read line; do
        echo "  $line"
    done
    
    echo ""
    echo_color "用法: ./rollback.sh <commit-hash>" "$YELLOW"
    echo_color "示例: ./rollback.sh b9fffa8" "$YELLOW"
}

# 回退到指定版本
rollback_to() {
    local target_commit=$1
    
    echo_color "\n🔄 开始回退到: $target_commit" "$YELLOW"
    
    # 1. 创建备份
    create_backup "$target_commit"
    
    # 2. 保存当前状态到临时分支
    echo_color "📝 保存当前状态到临时分支..." "$YELLOW"
    cd "$PROJECT_DIR"
    current_branch=$(git branch --show-current)
    temp_branch="temp-backup-$(date +%s)"
    git branch "$temp_branch" 2>/dev/null || true
    
    # 3. 回退到目标版本
    echo_color "🔙 执行 git reset --hard $target_commit" "$YELLOW"
    git reset --hard "$target_commit"
    
    # 4. 显示版本信息
    echo_color "\n📋 回退后的版本信息：" "$YELLOW"
    git log -1 --format="Commit: %h%nDate: %ci%nMessage: %s"
    
    # 5. 确认部署
    echo_color "\n⚠️ 即将部署此版本到Vercel生产环境" "$RED"
    echo_color "按 Enter 继续，Ctrl+C 取消..." "$YELLOW"
    read
    
    # 6. 本地构建测试
    echo_color "\n🔨 本地构建测试..." "$YELLOW"
    if npm run build 2>&1 | tail -20; then
        echo_color "✅ 本地构建成功" "$GREEN"
    else
        echo_color "❌ 本地构建失败，回退操作已撤销" "$RED"
        git reset --hard "$temp_branch"
        git branch -D "$temp_branch" 2>/dev/null || true
        exit 1
    fi
    
    # 7. 部署到Vercel（强制清除缓存）
    echo_color "\n🚀 部署到Vercel（强制清除缓存）..." "$YELLOW"
    npx vercel --prod --force
    
    # 8. 清理临时分支
    git branch -D "$temp_branch" 2>/dev/null || true
    
    echo_color "\n✅ 回退完成！" "$GREEN"
    echo_color "🌐 请访问 https://www.tradego-fasteners.com 验证" "$GREEN"
}

# 主逻辑
if [ -z "$1" ]; then
    list_versions
else
    rollback_to "$1"
fi
