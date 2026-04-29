#!/usr/bin/env python3
"""
为文章添加来源引用模板
来源: 由创业掌舵人·战略总监 🎯 生成
"""

import json
from pathlib import Path
from datetime import datetime

# 来源引用模板
CITATIONS_TEMPLATE = {
    "citationStyle": "APA 7th Edition",
    "sources": [
        {
            "type": "marketData",
            "citation": "TradeGo internal market research and analysis",
            "lastUpdated": datetime.now().strftime("%Y-%m-%d")
        },
        {
            "type": "tradeStatistics",
            "citation": "Data adapted from UN Comtrade (uncomtrade.un.org) and African Development Bank statistical reports",
            "lastUpdated": datetime.now().strftime("%Y-%m-%d")
        },
        {
            "type": "industryStandards",
            "citation": "International Standards Organization (ISO) and regional standards bodies",
            "lastUpdated": datetime.now().strftime("%Y-%m-%d")
        }
    ],
    "disclaimer": "Market data and statistics are for informational purposes only and should be verified with current sources before making business decisions."
}

# 在文章sections中添加来源引用块的函数
def add_citations_to_sections(sections):
    """在sections末尾添加来源引用块"""
    citation_section = {
        "id": "sources-and-references",
        "heading": {
            "en": "Sources & References",
            "zh": "来源与参考文献",
            "es": "Fuentes y Referencias",
            "fr": "Sources et Références",
            "pt": "Fontes e Referências",
            "ar": "المصادر والمراجع",
            "ru": "Источники и ссылки",
            "ja": "ソースと参考文献",
            "de": "Quellen und Referenzen",
            "hi": "स्रोत और संदर्भ"
        },
        "body": {
            "en": f"**Market Data**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**Trade Statistics**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**Industry Standards**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "zh": f"**市场数据**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**贸易统计**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**行业标准**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "es": f"**Datos de Mercado**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**Estadísticas Comerciales**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**Estándares de la Industria**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "fr": f"**Données de Marché**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**Statistiques Commerciales**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**Normes de l'Industrie**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "pt": f"**Dados de Mercado**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**Estatísticas Comerciais**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**Padrões da Indústria**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "ar": f"**بيانات السوق**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**إحصاءات التجارة**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**معايير الصناعة**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "ru": f"**Рыночные Данные**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                      f"**Торговая Статистика**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                      f"**Отраслевые Стандарты**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                      f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "ja": f"**市場データ**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**貿易統計**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**業界標準**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "de": f"**Marktdaten**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**Handelsstatistiken**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**Industrienormen**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_",
            "hi": f"**बाजार डेटा**: {CITATIONS_TEMPLATE['sources'][0]['citation']}\n\n"
                  f"**व्यापार आंकड़े**: {CITATIONS_TEMPLATE['sources'][1]['citation']}\n\n"
                  f"**उद्योग मानक**: {CITATIONS_TEMPLATE['sources'][2]['citation']}\n\n"
                  f"_{CITATIONS_TEMPLATE['disclaimer']}_"
        }
    }
    
    sections.append(citation_section)
    return sections

def add_citations_to_article(article_path):
    """为单篇文章添加来源引用"""
    with open(article_path, 'r') as f:
        article = json.load(f)
    
    # 检查是否已有来源引用
    if 'citations' in article:
        print(f"  ⚠️  已存在来源引用，跳过: {article_path.name}")
        return False
    
    if 'sections' in article:
        article['sections'] = add_citations_to_sections(article['sections'])
    
    article['citations'] = CITATIONS_TEMPLATE
    
    with open(article_path, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)
    
    print(f"  ✅ 已添加来源引用: {article_path.name}")
    return True

def main():
    articles_dir = Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles")
    articles = list(articles_dir.glob("*.json"))
    
    print("=== 为文章添加来源引用 ===")
    print(f"来源: 创业掌舵人·战略总监 🎯")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    count = 0
    skipped = 0
    
    for article_path in sorted(articles):
        try:
            if add_citations_to_article(article_path):
                count += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  ❌ 错误: {article_path.name} - {e}")
    
    print()
    print(f"=== 完成 ===")
    print(f"新增来源引用: {count} 篇")
    print(f"跳过(已有): {skipped} 篇")
    print(f"总计: {len(articles)} 篇")

if __name__ == "__main__":
    main()
