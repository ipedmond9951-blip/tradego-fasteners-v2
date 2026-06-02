#!/bin/bash
# topic-discovery.sh
# 多源选题发现 - 为 TradeGo 内容扩展提供高质量选题
# 用法: bash topic-discovery.sh [--all] [--source=X] [--category=Y] [--limit=N]
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ARTICLES_DIR="$PROJECT_ROOT/content/articles"
TOPIC_POOL="$SCRIPT_DIR/topic-pool.json"
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# 默认参数
SOURCE="all"
CATEGORY=""
LIMIT=20
ALL_MODE=false

# 参数解析
for arg in "$@"; do
  case $arg in
    --all) ALL_MODE=true ;;
    --source=*) SOURCE="${arg#*=}" ;;
    --category=*) CATEGORY="${arg#*=}" ;;
    --limit=*) LIMIT="${arg#*=}" ;;
    *) echo "Unknown arg: $arg" ;;
  esac
done

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════╗"
echo "║       TradeGo 多源选题发现 - $(date '+%Y-%m-%d %H:%M')       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Step 1: 分析现有文章，避免重复
echo -e "${BLUE}📊 Step 1/5: 分析现有 153 篇文章...${NC}"
python3 << 'PYEOF'
import json, os
from collections import Counter

ARTICLE_DIR = '/Users/zhangming/workspace/tradego-fasteners-v2/content/articles'
counter_titles = Counter()
counter_slugs = Counter()
counter_keywords = Counter()

for f in os.listdir(ARTICLE_DIR):
    if not f.endswith('.json'): continue
    d = json.load(open(f'{ARTICLE_DIR}/{f}'))
    title = d.get('title', {})
    en = title.get('en', '') if isinstance(title, dict) else str(title)
    if en:
        # 提取关键词
        words = en.lower().split()
        for w in words[:3]:
            if len(w) > 4:
                counter_keywords[w] += 1
    counter_slugs[f.replace('.json', '')] += 1

print(f"   Total articles: {sum(counter_slugs.values())}")
print(f"   Top 10 title keywords:")
for w, c in counter_keywords.most_common(10):
    print(f"     {c:3d}  {w}")
PYEOF

echo ""

# Step 2: 紧固件上下游行业扩展
echo -e "${BLUE}🔧 Step 2/5: 紧固件上下游行业扩展...${NC}"
cat << 'TOPICS'
已覆盖行业:
  ✓ automotive (汽车)
  ✓ marine (海洋)
  ✓ mining (矿业)
  ✓ solar (太阳能)

待扩展行业 (高优先级):
  🔥 wind-energy (风电) - 全球新增 100GW/年
  🔥 oil-gas (油气) - 非洲新兴市场
  🔥 construction (装配式建筑) - BIM 趋势
  🔥 agriculture (农业机械) - 非洲农业现代化

中优先级:
  ⚡ railway (高铁/轨交) - 非洲铁路升级
  ⚡ electronics (电子) - 智能手机/连接器
  ⚡ medical (医疗) - 卫生级紧固件
  ⚡ food-beverage (食品级) - 卫生标准
TOPICS
echo ""

# Step 3: 非洲市场细分
echo -e "${BLUE}🌍 Step 3/5: 非洲市场细分...${NC}"
cat << 'TOPICS'
已覆盖:
  ✓ Zimbabwe / South Africa / Kenya / Senegal
  ✓ Zambia / Nigeria / Egypt / Ghana

待扩展:
  🔥 Mozambique (矿业新兴)
  🔥 Angola (石油 + 战后重建)
  🔥 Tanzania (港口物流)
  🔥 Ethiopia (工业转型)
  🔥 DRC (铜矿带)

认证标准:
  ⚡ SABS (南非) / SON (尼日利亚) / KEBS (肯尼亚)
  ⚡ ZBS (津巴布韦) / TBS (坦桑尼亚) / UNBS (乌干达)
TOPICS
echo ""

# Step 4: 技术深入
echo -e "${BLUE}🔬 Step 4/5: 紧固件技术深入...${NC}"
cat << 'TOPICS'
材料科学:
  - 钛合金 / 蒙乃尔合金 / 哈氏合金 (化工)
  - 双相不锈钢 (海洋) / 沉淀硬化不锈钢
  - 复合材料 / 碳纤维 (航空航天)

工艺技术:
  - 冷镦 vs 热锻 (工艺对比)
  - 粉末冶金 (异形件)
  - 3D 打印紧固件 (航空/医疗)

表面处理:
  - 达克罗 (耐腐蚀)
  - Geomet (环保替代)
  - 锌镍合金 (高防腐)
  - PTFE 涂层 (低摩擦)

测试方法:
  - 楔负载 / 保证载荷 / 扭矩测试
  - 氢脆检测 / 应力腐蚀
  - 疲劳寿命 / 振动测试

标准对比:
  - ISO 898 vs ASTM A325 vs DIN 933
  - GB 5783 vs JIS B1180
TOPICS
echo ""

# Step 5: 商业决策
echo -e "${BLUE}💼 Step 5/5: 商业决策选题...${NC}"
cat << 'TOPICS'
采购决策:
  - 自购 vs 经销商 (利润分析)
  - 中国直采 vs 本地仓 (TCO)
  - 长期合同 vs 现货 (风险)

财务工具:
  - 信用证 (LC) 操作流程
  - DDP vs FOB 成本对比
  - 汇率风险对冲

风险管控:
  - 假货识别 (10个方法)
  - 质量纠纷处理流程
  - 港口弃货风险预防
  - 100吨订单议价技巧

数字化:
  - 紧固件电商平台对比
  - AI 询盘自动化
  - 区块链溯源
TOPICS
echo ""

# 输出总结
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 选题池总计: 60+ 主题${NC}"
echo ""
echo "下一步:"
echo "  1. 选择 5-10 个高优先级选题"
echo "  2. 用 seo-article-generator 生成初稿"
echo "  3. 人工审核 + validate-article.py 验证"
echo "  4. 部署 + GSC 提交"
echo ""
echo "参考 SOP: ~/.openclaw/workspace/SOP/content-expansion.md"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
