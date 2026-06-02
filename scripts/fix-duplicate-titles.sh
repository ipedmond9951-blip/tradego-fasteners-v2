#!/bin/bash
# fix-duplicate-titles.sh
# 修复标题重复/同质化问题
# 用法: bash fix-duplicate-titles.sh [--dry-run] [--auto]
set -e

PROJECT_ROOT="/Users/zhangming/workspace/tradego-fasteners-v2"
ARTICLES_DIR="$PROJECT_ROOT/content/articles"

DRY_RUN=false
AUTO_MODE=false
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --auto) AUTO_MODE=true ;;
  esac
done

echo "🔍 扫描 $ARTICLES_DIR 中重复/相似标题..."
echo ""

python3 << PYEOF
import json, os
from collections import defaultdict

ARTICLES_DIR = '$ARTICLES_DIR'

# 收集所有文章标题
articles = []
for f in os.listdir(ARTICLES_DIR):
    if not f.endswith('.json'): continue
    path = f'{ARTICLES_DIR}/{f}'
    d = json.load(open(path))
    title_obj = d.get('title', {})
    title_en = title_obj.get('en', '') if isinstance(title_obj, dict) else str(title_obj)
    articles.append({
        'file': f,
        'path': path,
        'slug': d.get('slug', f.replace('.json', '')),
        'title': title_en,
    })

# 按关键词分组
keywords_groups = defaultdict(list)
for a in articles:
    # 提取核心关键词（去除通用词）
    title_lower = a['title'].lower()
    # 检测国家/产品
    if 'senegal' in title_lower:
        keywords_groups['senegal'].append(a)
    if 'tanzania' in title_lower:
        keywords_groups['tanzania'].append(a)
    if 'guide' in title_lower and 'fastener' in title_lower:
        keywords_groups['fastener-guide'].append(a)
    if 'market' in title_lower and 'fastener' in title_lower:
        keywords_groups['fastener-market'].append(a)

# 输出重复组
for kw, group in keywords_groups.items():
    if len(group) > 1:
        print(f'\\n🔴 重复组 [{kw}]: {len(group)} 篇')
        for a in group:
            print(f'   {a["file"]}')
            print(f'      title: {a["title"][:70]}')
            print(f'      slug: {a["slug"]}')

# 总计
print(f'\\n📊 总结:')
print(f'   总文章: {len(articles)}')
print(f'   重复组: {sum(1 for g in keywords_groups.values() if len(g) > 1)}')
print(f'   重复文章: {sum(len(g) for g in keywords_groups.values() if len(g) > 1)}')
PYEOF

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "🔸 Dry-run 模式，未做任何更改"
    exit 0
fi

if [ "$AUTO_MODE" = false ]; then
    echo ""
    read -p "是否自动修复? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "退出"
        exit 0
    fi
fi

echo ""
echo "🔧 自动修复 Senegal 重复..."

python3 << 'PYEOF'
import json
# Senegal 重复: senegal-fastener-market (短) 改名为 "Quick Overview"
file_short = '/Users/zhangming/workspace/tradego-fasteners-v2/content/articles/senegal-fastener-market.json'
d = json.load(open(file_short))

# 修改 title
old_title = d.get('title', {})
if isinstance(old_title, dict):
    new_title = dict(old_title)
    new_title['en'] = 'Senegal Fastener Market 2026: Quick Overview for Importers'
    new_title['zh'] = '塞内加尔紧固件市场 2026：进口商快速概览'
    new_title['es'] = 'Mercado de sujetadores Senegal 2026: Vista rápida para importadores'
    new_title['ar'] = 'سوق مثبتات السنغال 2026: نظرة سريعة للمستوردين'
    new_title['fr'] = 'Marché des fixations Sénégal 2026 : Aperçu rapide pour les importateurs'
    new_title['pt'] = 'Mercado de fixadores Senegal 2026: Visão rápida para importadores'
    new_title['ru'] = 'Рынок крепежа Сенегал 2026: Краткий обзор для импортеров'
    new_title['ja'] = 'セネガル締結具市場 2026：輸入業者向けクイック概要'
    new_title['de'] = 'Senegal Befestigungsmarkt 2026: Schneller Überblick für Importeure'
    new_title['hi'] = 'Senegal Fastener Market 2026: आयातकों के लिए त्वरित अवलोकन'
    d['title'] = new_title

# 修改 description
old_desc = d.get('description', {})
if isinstance(old_desc, dict):
    new_desc = dict(old_desc)
    new_desc['en'] = 'Quick 5-minute overview of Senegal fastener market: top products, import duties, key suppliers, and shipping options for African importers.'
    new_desc['zh'] = '塞内加尔紧固件市场 5 分钟快速概览：热门产品、进口关税、关键供应商及非洲进口商运输选择。'
    d['description'] = new_desc

json.dump(d, open(file_short, 'w'), ensure_ascii=False, indent=2)
print(f"✅ 修改: {file_short}")
print(f"   新标题: Senegal Fastener Market 2026: Quick Overview for Importers")
PYEOF

echo ""
echo "✅ 修复完成"
