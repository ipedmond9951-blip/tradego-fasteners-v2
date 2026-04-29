#!/bin/bash
# 文章刷新工作流脚本
# 用途：识别旧文章，生成刷新建议，添加作者信息和来源引用模板

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs"

mkdir -p "$LOG_DIR"

echo "=== 文章刷新工作流 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 识别最旧的7篇文章
echo "1. 识别需要刷新的旧文章..."
python3 << 'PYEOF'
import json
from pathlib import Path
from datetime import datetime

articles_dir = Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles")
articles = []

for f in articles_dir.glob("*.json"):
    try:
        with open(f, 'r') as fp:
            d = json.load(fp)
            title = d.get('title', {})
            title_en = title.get('en', f.name) if isinstance(title, dict) else title
            date = d.get('date', '1970-01-01')
            articles.append({
                'file': f.name,
                'title': title_en[:60],
                'date': date
            })
    except:
        pass

articles.sort(key=lambda x: x['date'])

print("\n需要刷新的旧文章 (按日期排序):")
print("-" * 80)
for i, a in enumerate(articles[:7], 1):
    print(f"{i}. {a['date']} | {a['title']}")
    print(f"   文件: {a['file']}")
    print()

# 生成刷新建议
with open("/Users/zhangming/workspace/tradego-fasteners-v2/logs/article-refresh-todo.md", "w") as f:
    f.write("# 文章刷新待办清单\n\n")
    f.write(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    f.write("## 待刷新文章 (按优先级)\n\n")
    for i, a in enumerate(articles[:7], 1):
        f.write(f"### {i}. {a['title']}\n")
        f.write(f"- 日期: {a['date']}\n")
        f.write(f"- 文件: `{a['file']}`\n")
        f.write(f"- 刷新建议:\n")
        f.write(f"  - [ ] 更新统计数据和来源引用\n")
        f.write(f"  - [ ] 验证内容准确性\n")
        f.write(f"  - [ ] 添加作者信息\n")
        f.write(f"  - [ ] 检查SEO meta信息\n")
        f.write(f"  - [ ] 添加内链到相关文章\n\n")

print("✅ 待刷新清单已生成: logs/article-refresh-todo.md")
PYEOF

echo ""
echo "2. 检查文章schema结构..."
python3 << 'PYEOF'
import json
from pathlib import Path

# 检查一篇文章的结构
sample = Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles/africa-fastener-market-opportunities-2026.json")
with open(sample, 'r') as f:
    d = json.load(f)

print("当前文章字段:")
for key in d.keys():
    print(f"  - {key}")
    
print("\n需要添加的字段:")
print("  - author (作者信息)")
print("  - dataSources (数据来源)")
print("  - lastVerified (最后验证时间)")
PYEOF

echo ""
echo "=== 完成 ==="
echo ""
echo "下一步: 手动编辑文章添加作者信息和来源引用"
echo "参考: logs/article-refresh-todo.md"