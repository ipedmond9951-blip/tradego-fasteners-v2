#!/usr/bin/env python3
"""
自动为文章添加relatedArticles字段
基于类别和关键词相似度匹配
支持子目录
"""

import json
import os
import random
from pathlib import Path

ARTICLES_DIR = Path("content/articles")

def load_articles():
    """加载所有文章（递归）"""
    articles = []
    for f in ARTICLES_DIR.rglob("*.json"):
        # Skip backup directories
        if 'backup' in f.parts:
            continue
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
                data['_file'] = f.stem
                data['_filepath'] = f
                articles.append(data)
        except Exception as e:
            print(f"Error loading {f}: {e}")
    return articles

def get_keywords(article):
    """提取文章关键词"""
    title = article.get('title', {}).get('en', '')
    desc = article.get('description', {}).get('en', '')
    keywords = article.get('keywords', '')
    combined = f"{title} {desc} {keywords}".lower()
    # 提取有意义的词
    words = [w for w in combined.split() if len(w) > 4 and w not in ['with', 'from', 'have', 'this', 'that', 'your', 'each', 'also', 'more', 'your', 'their']]
    return set(words)

def category_matches(a_cat, b_cat):
    """检查是否同类"""
    if a_cat == 'Market Analysis' and b_cat == 'Market Analysis':
        return True
    if a_cat == 'Product Guide' and b_cat == 'Product Guide':
        return True
    if a_cat == 'Technical Guide' and b_cat == 'Technical Guide':
        return True
    return False

def calculate_similarity(a, b):
    """计算两篇文章的相似度"""
    a_kw = get_keywords(a)
    b_kw = get_keywords(b)
    
    if not a_kw or not b_kw:
        return 0
    
    # 关键词交集
    intersection = len(a_kw & b_kw)
    # 类别匹配加分
    cat_bonus = 5 if category_matches(a.get('category'), b.get('category')) else 0
    
    return intersection + cat_bonus

def find_related_articles(article, all_articles, max_related=4):
    """为文章找到相关文章"""
    related = []
    article_title_en = article.get('title', {}).get('en', '')
    article_category = article.get('category', '')
    
    for other in all_articles:
        if other['_file'] == article['_file']:
            continue
        
        other_title_en = other.get('title', {}).get('en', '')
        other_category = other.get('category', '')
        
        similarity = calculate_similarity(article, other)
        
        # 同类别文章优先
        if article_category == other_category:
            similarity += 10
        
        related.append({
            'slug': other['_file'],
            'title': other_title_en,
            'category': other_category,
            'similarity': similarity
        })
    
    # 按相似度排序
    related.sort(key=lambda x: x['similarity'], reverse=True)
    
    # 选择top N
    selected = []
    for r in related:
        if len(selected) >= max_related:
            break
        # 避免重复slug
        if r['slug'] not in [s['slug'] for s in selected]:
            selected.append({
                'slug': r['slug'],
                'title': r['title']
            })
    
    return selected

def main():
    print("🔍 加载所有文章...")
    articles = load_articles()
    print(f"📚 总计 {len(articles)} 篇文章")
    
    updated = 0
    skipped = 0
    
    for article in articles:
        slug = article['_file']
        filepath = article['_filepath']
        
        # 如果已有relatedArticles，跳过
        if article.get('relatedArticles') and len(article.get('relatedArticles', [])) > 0:
            skipped += 1
            continue
        
        # 找到相关文章
        related = find_related_articles(article, articles, max_related=4)
        
        if related:
            # 添加relatedArticles字段（不包含_file和_filepath内部字段）
            article_clean = {k: v for k, v in article.items() if k not in ['_file', '_filepath']}
            article_clean['relatedArticles'] = related
            
            # 保存
            with open(filepath, 'w', encoding='utf-8') as fp:
                json.dump(article_clean, fp, ensure_ascii=False, indent=2)
            
            updated += 1
            if updated <= 10:
                print(f"✅ {slug}: 添加 {len(related)} 个相关文章")
    
    print(f"\n📊 统计:")
    print(f"   - 更新: {updated} 篇")
    print(f"   - 跳过(已有): {skipped} 篇")
    print(f"   - 总计: {len(articles)} 篇")
    
    if updated > 10:
        print(f"   ... 还有 {updated - 10} 篇更新")

if __name__ == "__main__":
    main()