#!/bin/bash

# TradeGo SEO优化马拉松 - 进度管理脚本
# 用法: ./optimize.sh [命令]
# 命令: status | next | done | reset | log

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TRACKING_FILE="$SCRIPT_DIR/round_progress.json"
PROGRESS_FILE="$SCRIPT_DIR/OPTIMIZE_MARATHON.md"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示横幅
show_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║       TradeGo SEO优化马拉松 - 进度管理系统              ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 初始化进度文件
init_tracking() {
    if [ ! -f "$TRACKING_FILE" ]; then
        cat > "$TRACKING_FILE" << 'EOF'
{
    "current_round": 1,
    "cycle": 1,
    "last_updated": null
}
EOF
    fi
}

# 获取当前进度
get_status() {
    init_tracking
    local current=$(cat "$TRACKING_FILE" | grep -o '"current_round": [0-9]*' | cut -d':' -f2 | tr -d ' ' || echo "1")
    local cycle=$(cat "$TRACKING_FILE" | grep -o '"cycle": [0-9]*' | cut -d':' -f2 | tr -d ' ' || echo "1")
    local completed=0
    local total=20
    
    # 从markdown计算实际完成数 (查找 "| 数字 | ✅ |" 模式)
    completed=$(grep -E '^\| [0-9]+ \| ✅ \|' "$PROGRESS_FILE" 2>/dev/null | wc -l || echo "0")
    
    echo -e "${BLUE}当前进度:${NC}"
    echo -e "  循环: ${YELLOW}第 ${cycle:-1} 循环${NC}"
    echo -e "  当前Round: ${GREEN}Round ${current:-1}${NC}"
    echo -e "  完成度: ${GREEN}${completed}/20${NC} (${YELLOW}$(( completed * 100 / 20 ))%${NC})"
    echo ""
}

# 显示下一个任务
show_next() {
    init_tracking
    local current=$(cat "$TRACKING_FILE" | grep -o '"current_round": [0-9]*' | cut -d':' -f2 | tr -d ' ' || echo "1")
    
    echo -e "${GREEN}→ 下一个任务: Round $current${NC}"
    echo ""
    
    case $current in
        1) echo -e "${YELLOW}Round 1: 技术SEO基础 + 首页优化${NC}"
           echo "  - 验证所有页面的meta title/description唯一"
           echo "  - 检查robots.txt不阻止重要页面"
           echo "  - 验证sitemap.xml包含所有重要页面"
           echo "  - 检查canonical标签正确"
           echo "  - 添加缺失的alt标签"
           ;;
        2) echo -e "${YELLOW}Round 2: 结构化数据全面升级${NC}"
           echo "  - Product schema (所有产品页面)"
           echo "  - FAQPage schema (主页、FAQ页)"
           echo "  - BreadcrumbList schema"
           echo "  - Organization schema"
           ;;
        3) echo -e "${YELLOW}Round 3: 内容工厂 - 文章批量生产${NC}"
           echo "  - 创建5篇技术指南文章"
           echo "  - 创建3篇市场分析文章"
           echo "  - 创建2篇客户案例"
           ;;
        4) echo -e "${YELLOW}Round 4: 图片优化突击${NC}"
           echo "  - 将所有图片转为WebP格式"
           echo "  - 实现响应式图片 (srcset)"
           echo "  - 添加懒加载 (loading='lazy')"
           ;;
        5) echo -e "${YELLOW}Round 5: 转化漏斗优化${NC}"
           echo "  - 优化主页CTA按钮"
           echo "  - 添加即时聊天"
           echo "  - 添加信任徽章"
           ;;
        6) echo -e "${YELLOW}Round 6: GEO定向内容扩展${NC}"
           echo "  - 为主要非洲市场创建落地页"
           echo "  - 南非、尼日利亚、肯尼亚、加纳..."
           ;;
        7) echo -e "${YELLOW}Round 7: 页面速度冲刺${NC}"
           echo "  - 实施代码分割"
           echo "  - 启用Gzip压缩"
           echo "  - PageSpeed移动端 85+"
           ;;
        8) echo -e "${YELLOW}Round 8: 内链策略执行${NC}"
           echo "  - 审核现有内部链接"
           echo "  - 创建相关文章模块"
           echo "  - 优化导航结构"
           ;;
        9) echo -e "${YELLOW}Round 9: 社交媒体整合${NC}"
           echo "  - 添加社交分享按钮"
           echo "  - 创建OpenGraph图片"
           ;;
        10) echo -e "${YELLOW}Round 10: 技术债务清理${NC}"
            echo "  - 清理未使用的CSS"
            echo "  - 修复console错误"
            ;;
        11) echo -e "${YELLOW}Round 11: 竞争对手超越${NC}"
            echo "  - 分析竞品关键词策略"
            echo "  - 创建竞品缺失的内容"
            ;;
        12) echo -e "${YELLOW}Round 12: 移动端优化${NC}"
            echo "  - 测试所有页面移动端"
            echo "  - 优化触摸目标大小"
            ;;
        13) echo -e "${YELLOW}Round 13: 视频内容战略${NC}"
            echo "  - 创建产品介绍视频"
            echo "  - 创建工厂参观视频"
            ;;
        14) echo -e "${YELLOW}Round 14: 本地化深度优化${NC}"
            echo "  - 检查所有语言的meta标签"
            echo "  - 验证hreflang标签"
            ;;
        15) echo -e "${YELLOW}Round 15: AMP/PWA实施${NC}"
            echo "  - 添加PWA清单"
            echo "  - 创建service worker"
            ;;
        16) echo -e "${YELLOW}Round 16: 邮件营销整合${NC}"
            echo "  - 添加邮箱订阅弹窗"
            echo "  - 创建欢迎邮件序列"
            ;;
        17) echo -e "${YELLOW}Round 17: 分析和监控${NC}"
            echo "  - 设置Google Analytics 4"
            echo "  - 创建自定义仪表板"
            ;;
        18) echo -e "${YELLOW}Round 18: 安全和信任${NC}"
            echo "  - 启用HTTPS"
            echo "  - 添加SSL证书"
            ;;
        19) echo -e "${YELLOW}Round 19: 自动化和效率${NC}"
            echo "  - 设置自动部署"
            echo "  - 创建自动备份"
            ;;
        20) echo -e "${YELLOW}Round 20: 全面审核和计划${NC}"
            echo "  - 全面SEO审核"
            echo "  - 创建下一循环计划"
            ;;
        *) echo -e "${YELLOW}Round $current: 自定义任务${NC}" ;;
    esac
    echo ""
    echo -e "${CYAN}提示:${NC} 完成每个Round后运行 ${YELLOW}./optimize.sh done${NC}"
}

# 标记当前Round完成
mark_done() {
    init_tracking
    local current=$(cat "$TRACKING_FILE" | grep -o '"current_round": [0-9]*' | cut -d':' -f2 | tr -d ' ' || echo "1")
    local cycle=$(cat "$TRACKING_FILE" | grep -o '"cycle": [0-9]*' | cut -d':' -f2 | tr -d ' ' || echo "1")
    local next_round=$((current == 20 ? 1 : current + 1))
    local next_cycle=$((current == 20 ? cycle + 1 : cycle))
    local today=$(date '+%Y-%m-%d')
    local commit=$(git -C "$SCRIPT_DIR/.." rev-parse --short HEAD 2>/dev/null || echo "none")
    
    echo -e "${GREEN}✓ Round $current 完成!${NC}"
    echo "  日期: $today"
    echo "  提交: $commit"
    
    # 更新JSON
    cat > "$TRACKING_FILE" << EOF
{
    "current_round": $next_round,
    "cycle": $next_cycle,
    "last_updated": "$today"
}
EOF
    
    # 更新markdown进度
    if [ -f "$PROGRESS_FILE" ]; then
        # 查找并更新对应的round行
        if grep -q "^| $current | ⬜ |" "$PROGRESS_FILE"; then
            sed -i '' "s/| $current | ⬜ |/| $current | ✅ |/g" "$PROGRESS_FILE"
        fi
        if grep -q "^| $current | ✅ |" "$PROGRESS_FILE"; then
            sed -i '' "s/| $current | ✅ |.*$/| $current | ✅ | $today | $commit |/g" "$PROGRESS_FILE"
        fi
    fi
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    show_next
}

# 重置进度
reset_progress() {
    echo -e "${YELLOW}警告: 这将重置所有进度!${NC}"
    read -p "确定要重置吗? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        rm -f "$TRACKING_FILE"
        init_tracking
        echo -e "${GREEN}进度已重置${NC}"
    else
        echo "取消重置"
    fi
}

# 显示日志
show_log() {
    echo -e "${BLUE}最近提交:${NC}"
    git -C "$SCRIPT_DIR/.." log --oneline -10 2>/dev/null || echo "无法获取git日志"
}

# 帮助信息
show_help() {
    echo -e "${CYAN}TradeGo SEO优化马拉松 - 进度管理脚本${NC}"
    echo ""
    echo -e "${YELLOW}用法:${NC}"
    echo "  $0 [命令]"
    echo ""
    echo -e "${YELLOW}命令:${NC}"
    echo "  status    - 显示当前进度"
    echo "  next      - 显示下一个任务"
    echo "  done      - 标记当前Round完成"
    echo "  reset     - 重置所有进度"
    echo "  log       - 显示最近提交"
    echo "  help      - 显示帮助"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  $0 status    # 查看进度"
    echo "  $0 next      # 查看下一个任务"
    echo "  $0 done      # 标记完成并进入下一轮"
}

# 主程序
case "${1:-status}" in
    status)   show_banner; get_status; show_next ;;
    next)     show_banner; show_next ;;
    done)     show_banner; mark_done ;;
    reset)    show_banner; reset_progress ;;
    log)      show_banner; show_log ;;
    help|--help|-h) show_help ;;
    *)        echo -e "${RED}未知命令: $1${NC}"; show_help; exit 1 ;;
esac
