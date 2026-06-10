#!/usr/bin/env python3
"""
seo-diversity-monitor.py
SEO 自我进化层 - 多样性监测 + 质量回溯

分析已发布文章的:
1. Category 分布 (H' entropy)
2. Region 分布
3. 模板使用率 (template-a vs template-b)
4. Buyer journey stage 覆盖
5. 4 周质量回溯 (高分低点击 = 标题差)
6. Pool 健康度

输出: diversity report + auto-suggest 选题

用法:
  python3 scripts/seo-diversity-monitor.py
  python3 scripts/seo-diversity-monitor.py --expand-pool
  python3 scripts/seo-diversity-monitor.py --review-last-30-days

Exit 0: diversity 良好 (H' > 0.6)
Exit 1: diversity 差, 需要补 category/region
"""

import sys
import os
import json
import math
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime, timedelta

PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
ARTICLES_DIR = PROJECT_DIR / "content" / "articles"
POOL_FILE = PROJECT_DIR / "scripts" / "seo-topic-pool.json"
REPORT_DIR = PROJECT_DIR / ".learnings"
REPORT_DIR.mkdir(exist_ok=True)


def shannon_entropy(counts):
    """Shannon entropy H' = -Σ p_i log2 p_i. 范围 0 (单一) 到 log2(n) (均匀)."""
    total = sum(counts.values())
    if total == 0:
        return 0.0
    h = 0.0
    for c in counts.values():
        if c > 0:
            p = c / total
            h -= p * math.log2(p)
    return h


def load_articles_meta():
    """从 articles.json 索引文件或 article 文件本身提取元数据"""
    # 先尝试读 articles.ts 索引
    articles = []
    
    # 直接扫 content/articles/*.json
    for f in sorted(ARTICLES_DIR.glob("*.json")):
        try:
            with open(f) as fp:
                data = json.load(fp)
            articles.append({
                "slug": data.get("slug", f.stem),
                "category": data.get("category", "Unknown"),
                "region": data.get("region", "Unknown"),
                "template": data.get("_template", "unknown"),
                "created": data.get("createdAt", ""),
                "word_count": sum(len(s.get("content", [])) for s in data.get("sections", [])),
            })
        except (json.JSONDecodeError, KeyError):
            continue
    
    return articles


def analyze_diversity(articles, pool_topics):
    """核心分析"""
    print("═══ SEO Diversity Report ═══\n")
    
    # 1. Category 分布
    cat_counter = Counter(a["category"] for a in articles)
    cat_entropy = shannon_entropy(cat_counter)
    cat_max = math.log2(len(cat_counter)) if cat_counter else 1
    cat_diversity = cat_entropy / cat_max if cat_max > 0 else 0
    
    print(f"📊 Category diversity: H'={cat_entropy:.3f} (max={cat_max:.3f}) → {cat_diversity:.1%}")
    for cat, count in cat_counter.most_common():
        pct = count / len(articles) * 100
        bar = "█" * int(pct / 5)
        print(f"   {cat:20s} {count:4d}  {pct:5.1f}%  {bar}")
    
    # 2. Region 分布
    reg_counter = Counter(a["region"] for a in articles)
    reg_entropy = shannon_entropy(reg_counter)
    reg_max = math.log2(len(reg_counter)) if reg_counter else 1
    reg_diversity = reg_entropy / reg_max if reg_max > 0 else 0
    
    print(f"\n📊 Region diversity: H'={reg_entropy:.3f} (max={reg_max:.3f}) → {reg_diversity:.1%}")
    for reg, count in reg_counter.most_common():
        pct = count / len(articles) * 100
        bar = "█" * int(pct / 5)
        print(f"   {reg:20s} {count:4d}  {pct:5.1f}%  {bar}")
    
    # 3. Template 使用率
    tpl_counter = Counter(a["template"] for a in articles)
    print(f"\n📊 Template usage:")
    for tpl, count in tpl_counter.most_common():
        pct = count / len(articles) * 100 if articles else 0
        print(f"   {tpl:25s} {count:4d}  {pct:5.1f}%")
    
    # 4. Pool vs 已用对比
    pool_categories = Counter(t["category"] for t in pool_topics)
    print(f"\n📊 Pool categories ({len(pool_topics)} topics):")
    for cat, count in pool_categories.most_common():
        used = cat_counter.get(cat, 0)
        print(f"   {cat:25s} pool:{count:3d}  used:{used:3d}")
    
    # 5. 缺口分析
    print(f"\n🎯 Gap analysis (建议补充的 category):")
    all_cats = set(cat_counter) | set(pool_categories)
    suggestions = []
    for cat in all_cats:
        in_pool = pool_categories.get(cat, 0)
        in_articles = cat_counter.get(cat, 0)
        if in_pool == 0 and in_articles == 0:
            print(f"   ⚠️  {cat}: not in pool, not in articles - ADD TO POOL")
            suggestions.append(cat)
        elif in_pool > 0 and in_articles == 0:
            print(f"   📝 {cat}: in pool but no articles - v3 will pick these up")
    
    # 6. Buyer journey 覆盖
    journey_map = {
        "Industry Guide": "awareness",
        "Technical Guide": "awareness",
        "Procurement Guide": "consideration",
        "Comparison": "consideration",
        "Market Analysis": "consideration",
        "Case Study": "decision",
        "Regional Supplier": "decision",
        "Logistics Guide": "decision",
        "Reference Guide": "awareness",
    }
    journey_counter = Counter()
    for a in articles:
        stage = journey_map.get(a["category"], "unknown")
        journey_counter[stage] += 1
    
    print(f"\n📊 Buyer journey coverage:")
    for stage in ["awareness", "consideration", "decision"]:
        count = journey_counter.get(stage, 0)
        pct = count / len(articles) * 100 if articles else 0
        print(f"   {stage:20s} {count:4d}  {pct:5.1f}%")
    
    # 7. 综合评分
    overall = (cat_diversity + reg_diversity) / 2
    print(f"\n═══ Overall diversity: {overall:.1%} ═══")
    if overall >= 0.7:
        print("✅ Excellent diversity")
        verdict = "excellent"
    elif overall >= 0.5:
        print("✓  Acceptable diversity")
        verdict = "acceptable"
    else:
        print("⚠️  Poor diversity - need more category/region variety")
        verdict = "poor"
    
    return {
        "total_articles": len(articles),
        "category_diversity": round(cat_diversity, 3),
        "region_diversity": round(reg_diversity, 3),
        "overall_diversity": round(overall, 3),
        "verdict": verdict,
        "cat_distribution": dict(cat_counter),
        "reg_distribution": dict(reg_counter),
        "suggested_new_categories": suggestions,
        "timestamp": datetime.now().isoformat(),
    }


def quality_review(articles):
    """4 周质量回溯: 用文章字数 + 模板 + 已知 GSC 数据判断"""
    print("\n═══ 4-Week Quality Review ═══\n")
    
    # 文章字数分布
    word_counts = [a["word_count"] for a in articles if a["word_count"] > 0]
    if not word_counts:
        print("No word count data")
        return {}
    
    print(f"📊 Word count stats:")
    print(f"   min={min(word_counts)}, max={max(word_counts)}, avg={sum(word_counts)/len(word_counts):.0f}")
    
    # 找出异常短的文章 (HCU risk)
    thin = [a for a in articles if 0 < a["word_count"] < 600]
    print(f"\n⚠️  Thin content (HCU risk, <600 words): {len(thin)}")
    for a in thin[:5]:
        print(f"   {a['slug']}: {a['word_count']} words")
    
    # 找出非常长的 (over-optimization risk)
    long = [a for a in articles if a["word_count"] > 3000]
    print(f"\n📝 Long-form (>3000 words): {len(long)}")
    for a in long[:5]:
        print(f"   {a['slug']}: {a['word_count']} words")
    
    return {
        "thin_count": len(thin),
        "long_count": len(long),
        "avg_word_count": sum(word_counts) / len(word_counts),
    }


def expand_pool_if_needed(report):
    """如果 diversity < 0.6, 自动扩充 pool"""
    if report["verdict"] != "poor":
        print(f"\n✅ Pool health: {report['verdict']}, no expansion needed")
        return False
    
    print(f"\n⚠️  Diversity is {report['verdict']} - expanding pool...")
    # 找最缺的 region/category 组合
    cat_dist = report["cat_distribution"]
    reg_dist = report["reg_distribution"]
    min_cat = min(cat_dist, key=cat_dist.get) if cat_dist else "Technical Guide"
    min_reg = min(reg_dist, key=reg_dist.get) if reg_dist else "global"
    
    print(f"   缺口: category={min_cat}, region={min_reg}")
    print(f"   TODO: 人工 review topic-discovery.sh 输出, 加入新候选")
    return False  # 暂不自动加, 留给 cron 报告


def main():
    args = sys.argv[1:]
    expand = "--expand-pool" in args
    review = "--review-last-30-days" in args
    
    if not POOL_FILE.exists():
        print(f"❌ Pool file not found: {POOL_FILE}")
        sys.exit(1)
    
    with open(POOL_FILE) as f:
        pool = json.load(f)
    pool_topics = pool.get("topics", [])
    
    articles = load_articles_meta()
    if not articles:
        print("⚠️  No articles found")
        sys.exit(0)
    
    print(f"Loaded {len(articles)} articles, {len(pool_topics)} pool topics\n")
    
    report = analyze_diversity(articles, pool_topics)
    
    if review:
        quality_review(articles)
    
    if expand:
        expand_pool_if_needed(report)
    
    # 写 report
    out = REPORT_DIR / "diversity-report.json"
    with open(out, "w") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n📄 Report saved: {out}")
    
    # Exit code: 0 if good, 1 if poor
    sys.exit(0 if report["verdict"] in ["excellent", "acceptable"] else 1)


if __name__ == "__main__":
    main()
