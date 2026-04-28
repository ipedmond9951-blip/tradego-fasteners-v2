#!/bin/bash
# SEO图片优化脚本 - 批量生成并替换低质量文章图片
# 用法: ./scripts/seo-image-optimize.sh [--dry-run]
#
# 功能：
#   1. 扫描并识别低质量/损坏的文章图片（<100KB或0字节）
#   2. 使用MiniMax AI生成高质量替代图片
#   3. 自动备份旧图片
#   4. 更新文章引用
#
# Cron任务设置：
#   0 6 * * * /Users/zhangming/workspace/tradego-fasteners-v2/scripts/seo-image-optimize.sh >> logs/seo-image-$(date +\%Y-\%m-\%d).log 2>&1

set -e

# 配置
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MINIMAX_SCRIPT="$HOME/.openclaw/workspace/tools/minimax-image-gen.sh"
BACKUP_DIR="$PROJECT_DIR/public/images/backup/$(date +%Y%m%d-%H%M%S)"
PUBLIC_IMAGES="$PROJECT_DIR/public/images"
ARTICLES_DIR="$PROJECT_DIR/content/articles"

# 参数
DRY_RUN=false
if [ "$1" = "--dry-run" ] || [ "$1" = "-n" ]; then
    DRY_RUN=true
    echo "[DRY-RUN模式] 不会实际修改任何文件"
    echo ""
fi

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    if [ ! -f "$MINIMAX_SCRIPT" ]; then
        log_error "MiniMax脚本不存在: $MINIMAX_SCRIPT"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq未安装，请运行: brew install jq"
        exit 1
    fi
}

# 扫描低质量图片
scan_low_quality_images() {
    log "🔍 扫描低质量/损坏的图片..."
    
    local count=0
    local total=0
    
    # 扫描articles目录下的图片
    while IFS= read -r img_path; do
        total=$((total + 1))
        size=$(wc -c < "$img_path" 2>/dev/null || echo 0)
        size_kb=$((size / 1024))
        
        # 低质量：小于100KB 或 损坏：0字节
        if [ "$size_kb" -lt 100 ] || [ "$size" -eq 0 ]; then
            count=$((count + 1))
            rel_path="${img_path#$PUBLIC_IMAGES/}"
            echo "$rel_path|$size_kb"
        fi
    done < <(find "$PUBLIC_IMAGES/articles" -name "*.jpg" -o -name "*.png" 2>/dev/null)
    
    log "   扫描完成: $count 个低质量/损坏图片 (总共 $total 个)"
    
    if [ "$count" -eq 0 ]; then
        log_success "所有图片质量良好，无需优化"
        exit 0
    fi
}

# 图片Prompt映射 - 根据场景类型生成合适的prompt
get_prompt_for_image() {
    local img_name="$1"
    
    # 提取图片名称中的关键词
    case "$img_name" in
        *mining*)
            echo "Large scale mining operation in Africa with heavy equipment and conveyor systems, industrial photography, professional, high detail"
            ;;
        *construction*)
            echo "Aerial view of modern construction site in Africa with steel structures and cranes, industrial architecture photography, professional, high detail"
            ;;
        *industrial*)
            echo "Modern industrial facility in Africa with manufacturing equipment and steel structures, professional photography, high detail"
            ;;
        *logistics*)
            echo "Modern African port with cargo ships and container cranes, logistic and shipping infrastructure, professional photography, high detail"
            ;;
        *city*)
            echo "Modern African city skyline at sunset with skyscrapers and urban development, professional photography, high detail"
            ;;
        *infrastructure*)
            echo "Modern African highway and bridge infrastructure with steel construction, aerial view, professional photography, high detail"
            ;;
        *steel*)
            echo "African steel factory and manufacturing plant with molten metal and industrial equipment, professional photography, high detail"
            ;;
        *building*)
            echo "Modern building construction in Africa with steel structure and glass facade, architectural photography, professional, high detail"
            ;;
        *road*)
            echo "Modern highway road construction in Africa with asphalt and steel bridges, aerial view, professional photography, high detail"
            ;;
        *warehouse*)
            echo "Large warehouse and storage facility in Africa with shipping containers and industrial equipment, professional photography"
            ;;
        *hardware*)
            echo "African hardware store with various fasteners and tools display, retail interior photography, professional"
            ;;
        *conveyor*)
            echo "Mining conveyor belt system with ore and heavy machinery, industrial photography, Africa, professional"
            ;;
        *southern-africa*)
            echo "Southern Africa landscape with industrial harbor and shipping containers, aerial photography, professional, high detail"
            ;;
        *west-africa*)
            echo "West Africa coastal industrial zone with port and shipping facilities, aerial photography, professional"
            ;;
        *east-africa*)
            echo "East Africa industrial zone with manufacturing facilities and infrastructure, aerial photography, professional"
            ;;
        *africa*)
            echo "African industrial landscape with modern infrastructure and construction, aerial view, professional photography, high detail"
            ;;
        *factory*)
            echo "Modern factory interior with manufacturing equipment and production lines, industrial photography, professional"
            ;;
        *port*)
            echo "Modern seaport with container cranes and cargo ships, shipping logistics, professional photography"
            ;;
        *bridge*)
            echo "Modern bridge construction in Africa with steel cables and concrete, architectural photography, professional"
            ;;
        *)
            echo "Professional industrial photography with detailed textures and proper lighting, high quality, 1024x1024"
            ;;
    esac
}

# 优化单张图片
optimize_image() {
    local rel_path="$1"
    local current_size_kb="$2"
    local img_path="$PUBLIC_IMAGES/$rel_path"
    
    # 获取合适的prompt
    local prompt=$(get_prompt_for_image "$rel_path")
    local img_name=$(basename "$rel_path")
    
    log "   处理: $rel_path (当前: ${current_size_kb}KB)"
    
    if [ "$DRY_RUN" = true ]; then
        echo "       [DRY-RUN] 会生成新图片替换"
        return 0
    fi
    
    # 创建备份目录
    mkdir -p "$BACKUP_DIR"
    
    # 备份旧图片
    cp "$img_path" "$BACKUP_DIR/"
    log "       📦 已备份到 $BACKUP_DIR/"
    
    # 生成新图片
    local tmp_path="/tmp/seo_optimize_$$_$img_name"
    
    if $MINIMAX_SCRIPT "$prompt" "$tmp_path" 2>&1; then
        # 验证新图片
        local new_size=$(wc -c < "$tmp_path" 2>/dev/null || echo 0)
        local new_size_kb=$((new_size / 1024))
        
        if [ "$new_size_kb" -lt 100 ]; then
            log_error "   生成图片质量过低 (${new_size_kb}KB)，跳过"
            rm -f "$tmp_path"
            return 1
        fi
        
        # 替换图片
        mv "$tmp_path" "$img_path"
        
        # 检查文章引用
        update_article_references "$rel_path"
        
        log_success "   完成: ${current_size_kb}KB → ${new_size_kb}KB"
    else
        log_error "   生成失败"
        rm -f "$tmp_path"
        return 1
    fi
}

# 更新文章引用（如果需要）
update_article_references() {
    local img_path="$1"
    local img_name=$(basename "$img_path")
    
    # 图片引用在JSON的image字段中，直接替换文件即可，文章无需修改
    # 如果文章使用/img或/images路径，则无需修改文章JSON
    :
}

# 主函数
main() {
    echo ""
    log "=========================================="
    log "🖼️ SEO图片优化开始"
    log "   时间: $(date '+%Y-%m-%d %H:%M:%S')"
    log "=========================================="
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 创建备份目录
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$BACKUP_DIR"
        log "📦 备份目录: $BACKUP_DIR"
    fi
    
    # 扫描低质量图片
    local images=$(scan_low_quality_images)
    
    if [ -z "$images" ]; then
        log_success "所有图片质量良好，无需优化"
        exit 0
    fi
    
    # 优化每张图片
    local success=0
    local failed=0
    local skipped=0
    
    while IFS='|' read -r rel_path size_kb; do
        if [ -z "$rel_path" ]; then
            continue
        fi
        
        # 跳过非articles目录的图片（产品图等单独处理）
        if [[ "$rel_path" != articles/* ]]; then
            skipped=$((skipped + 1))
            continue
        fi
        
        if optimize_image "$rel_path" "$size_kb"; then
            success=$((success + 1))
        else
            failed=$((failed + 1))
        fi
        
        # API限流保护 - 每张图片间隔2秒
        sleep 2
        
    done <<< "$images"
    
    # 输出统计
    echo ""
    log "=========================================="
    log "📊 优化完成"
    log "   成功: $success"
    log "   失败: $failed"
    log "   跳过: $skipped (非articles目录)"
    if [ "$DRY_RUN" = false ]; then
        log "   备份: $BACKUP_DIR"
    fi
    log "=========================================="
    
    if [ "$failed" -gt 0 ]; then
        exit 1
    fi
    
    exit 0
}

# 运行
main
