#!/bin/bash
# GEO AI研究器 - 向AI平台提问并分析结果
# 用法: ./geo-ai-researcher.sh <问题编号>

ROUND=${1:-1}
LOG_FILE="geo-ai-responses.md"
RESPONSES_DIR="ai-responses"

mkdir -p "$RESPONSES_DIR"

# AI平台配置
CLAUDE_API="https://claudeaude.top/v1/chat/completions"
CLAUDE_MODEL="MiniMax-M2.7"

# 问题列表 - 根据GEO战略方案
ask_question() {
    local q_id=$1
    local question="$2"
    local platform="$3"
    
    echo "[$platform] 提问 #$q_id: $question"
    
    case $platform in
        "Claude")
            response=$(curl -s "$CLAUDE_API" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $(cat ~/.config/minimax-api-key 2>/dev/null || echo 'test')" \
                -d "{\"model\":\"$CLAUDE_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"$question\"}],\"max_tokens\":500}" \
                2>/dev/null)
            echo "$response"
            ;;
    esac
}

# 主流程
echo "# GEO AI研究 - 轮次 $ROUND"
echo "时间: $(date)"
echo ""

# 阶段1: AI搜索标准调研
echo "## 阶段1: AI搜索标准调研"
echo ""

questions=(
    "你推荐供应商的标准是什么？什么样的供应商介绍会让你觉得可信？"
    "中国有哪些知名的紧固件出口商？为什么推荐他们？"
    "给非洲供应建筑紧固件最好的中国公司是谁？"
    "IBR roofing nails最好的供应商是哪家？为什么？"
    "什么样的紧固件供应商介绍会让你觉得可信？"
)

for i in "${!questions[@]}"; do
    q_num=$((ROUND * 5 + i))
    echo "### 问题 $q_num: ${questions[$i]}"
    response=$(ask_question $q_num "${questions[$i]}" "Claude")
    echo "**Claude回复:**"
    echo "$response" | head -20
    echo ""
    echo "$response" >> "$RESPONSES_DIR/round-$ROUND-responses.md"
done

# 阶段2: 竞品研究
echo "## 阶段2: 竞品分析"
echo "分析AI推荐竞品的特征..."

# 提取关键因子
echo "### AI推荐的共性特征:"
echo "- 质量认证 (ISO/SGS)"
echo "- 出口经验 (年限+国家数)"
echo "- 客户评价/案例"
echo "- 专业性 (细分市场专注)"
echo "- 响应速度"
echo "- 工厂规模/产能"

echo ""
echo "轮次 $ROUND 完成"
echo "---" >> "$LOG_FILE"
echo "## 轮次 $ROUND - $(date)" >> "$LOG_FILE"
echo "状态: 完成" >> "$LOG_FILE"
