#!/usr/bin/env python3
"""
TradeGo GEO Content Audit Script
内容审计：识别高风险AI批量生成内容，提供保留/重写/删除建议

使用: python3 scripts/content-audit.py [--report]
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# ========== 配置 ==========
ARTICLES_DIR = Path(__file__).parent.parent / "content" / "articles"
OUTPUT_REPORT = Path(__file__).parent.parent / "logs" / f"content-audit-{datetime.now().strftime('%Y-%m-%d')}.md"
OUTPUT_CSV = Path(__file__).parent.parent / "logs" / f"content-audit-{datetime.now().strftime('%Y-%m-%d')}.csv"

# ========== 风险评分函数 ==========

def score_word_richness(text: str) -> int:
    """内容丰富度：字数越多通常越丰富"""
    words = len(text.split())
    if words < 300:
        return 0
    elif words < 500:
        return 1
    elif words < 800:
        return 2
    elif words < 1200:
        return 3
    else:
        return 4

def score_eeat_signals(article: dict) -> Tuple[int, List[str]]:
    """E-E-A-T 信号评分，返回(分数, 信号列表)"""
    score = 0
    signals = []
    
    # 1. 作者信息
    if article.get("author"):
        score += 2
        signals.append("✓ 有作者")
    else:
        signals.append("✗ 无作者")
    
    # 2. 最后更新日期（表示定期维护）
    if article.get("updated"):
        score += 1
        signals.append("✓ 有更新时间")
    
    # 3. 数据来源引用
    if article.get("sources"):
        score += 2
        signals.append(f"✓ 有{len(article.get('sources',[]))}个数据来源")
    
    # 4. 外部链接引用
    if article.get("references"):
        score += 1
        signals.append("✓ 有参考文献")
    
    # 5. FAQ结构（展示亲身经验）
    sections = article.get("sections", [])
    has_faq = any("faq" in s.get("id", "").lower() for s in sections)
    if has_faq:
        score += 1
        signals.append("✓ 有FAQ部分")
    
    # 6. 表格数据（具体数字）
    has_tables = any(s.get("table") for s in sections)
    if has_tables:
        score += 1
        signals.append("✓ 有数据表格")
    
    return score, signals

def detect_ai_pattern(article: dict) -> Tuple[int, str]:
    """AI生成模式检测，返回(风险分数, 风险描述)"""
    risk = 0
    details = []
    
    # 1. slug中的时间标记（批量生成的标志）
    slug = article.get("slug", "")
    if any(marker in slug for marker in ["2024", "2025", "2026"]):
        risk += 1
        details.append("slug含年份标记")
    
    # 2. "complete-guide"模式（模板化）
    if "complete-guide" in slug or "comprehensive-guide" in slug:
        risk += 1
        details.append("模板化slug: complete-guide")
    
    # 3. 多语言但内容空洞（只翻译不原创）
    title_en = article.get("title", {}).get("en", "")
    body_en = " ".join([
        s.get("body", {}).get("en", "")
        for s in article.get("sections", [])
        if isinstance(s.get("body"), dict)
    ])
    
    # 4. 检查sections数量（太少可能是模板填充）
    section_count = len(article.get("sections", []))
    if section_count < 4:
        risk += 1
        details.append(f"章节过少({section_count})")
    
    # 5. 所有sections都有表格（数据驱动的标志）
    tables_count = sum(1 for s in article.get("sections", []) if s.get("table"))
    if tables_count > 2:
        risk += 1
        details.append(f"多个数据表格({tables_count})")
    
    # 6. readTime异常（AI生成内容通常readTime偏高或偏低）
    read_time = article.get("readTime", 0)
    if read_time > 0:
        if read_time > 15:
            risk += 1
            details.append("阅读时间过长")
        elif read_time < 3:
            risk += 1
            details.append("阅读时间过短")
    
    # 7. 分类标签
    category = article.get("category", "")
    if not category or category == "Uncategorized":
        risk += 1
        details.append("无分类或分类不明确")
    
    return risk, "; ".join(details) if details else "无明显AI模式"

def get_recommendation(audit: dict) -> str:
    """根据审计结果给出建议"""
    eeat = audit["eeat_score"]
    word_rich = audit["word_richness"]
    ai_risk = audit["ai_risk"]
    size = audit["file_size"]
    
    # 高风险AI模式 + 低E-E-A-T = 删除
    if ai_risk >= 3 and eeat <= 2:
        return "DELETE"
    
    # 高风险AI模式 + 高E-E-A-T = 重写(降风险)
    if ai_risk >= 3 and eeat >= 4:
        return "REWRITE"
    
    # 低内容质量 + 高AI风险 = 删除
    if ai_risk >= 2 and word_rich <= 1:
        return "DELETE"
    
    # 低E-E-A-T + 文件过大(疑似充数) = 重写
    if eeat <= 2 and size > 25000:
        return "REWRITE"
    
    # 低内容质量 + 无E-E-A-T = 删除
    if word_rich <= 1 and eeat <= 1:
        return "DELETE"
    
    # 中等风险但有价值 = 保留(需优化)
    if ai_risk <= 2 and eeat >= 3 and word_rich >= 2:
        return "KEEP (OPTIMIZE)"
    
    return "KEEP"

# ========== 主审计逻辑 ==========

def audit_article(filepath: Path) -> dict:
    """审计单个文章"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            article = json.load(f)
    except Exception as e:
        return {"error": str(e), "slug": filepath.stem}
    
    # 基本信息
    slug = article.get("slug", filepath.stem)
    
    # 提取英文正文
    body_en = " ".join([
        s.get("body", {}).get("en", "")
        for s in article.get("sections", [])
        if isinstance(s.get("body"), dict)
    ])
    
    # 评分
    word_richness = score_word_richness(body_en)
    eeat_score, eeat_signals = score_eeat_signals(article)
    ai_risk, ai_details = detect_ai_pattern(article)
    
    # 综合风险评分 (0-10, 越高越危险)
    total_risk = ai_risk * 2 + max(0, 3 - eeat_score) + max(0, 2 - word_richness)
    total_risk = min(10, total_risk)
    
    recommendation = get_recommendation({
        "eeat_score": eeat_score,
        "word_richness": word_richness,
        "ai_risk": ai_risk,
        "file_size": filepath.stat().st_size
    })
    
    return {
        "slug": slug,
        "file": filepath.name,
        "file_size": filepath.stat().st_size,
        "file_size_kb": round(filepath.stat().st_size / 1024, 1),
        "date": article.get("date", ""),
        "category": article.get("category", ""),
        "read_time": article.get("readTime", 0),
        "section_count": len(article.get("sections", [])),
        "word_count": len(body_en.split()),
        "word_richness": word_richness,
        "eeat_score": eeat_score,
        "eeat_signals": ", ".join(eeat_signals),
        "ai_risk": ai_risk,
        "ai_details": ai_details,
        "total_risk": total_risk,
        "recommendation": recommendation
    }

def generate_report(audits: List[dict]) -> Tuple[str, str]:
    """生成Markdown和CSV报告"""
    
    # 统计
    total = len(audits)
    delete = sum(1 for a in audits if a.get("recommendation") == "DELETE")
    rewrite = sum(1 for a in audits if a.get("recommendation") == "REWRITE")
    keep_optimize = sum(1 for a in audits if a.get("recommendation") == "KEEP (OPTIMIZE)")
    keep = sum(1 for a in audits if a.get("recommendation") == "KEEP")
    
    # 风险分布
    high_risk = sum(1 for a in audits if a.get("total_risk", 0) >= 7)
    medium_risk = sum(1 for a in audits if 4 <= a.get("total_risk", 0) < 7)
    low_risk = sum(1 for a in audits if a.get("total_risk", 0) < 4)
    
    # Markdown报告
    md = f"""# TradeGo 内容审计报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}  
**审计文章数**: {total}  

## 📊 统计摘要

| 指标 | 数量 |
|------|------|
| 高风险 (≥7分) | {high_risk} |
| 中风险 (4-6分) | {medium_risk} |
| 低风险 (<4分) | {low_risk} |

## 📋 处理建议

| 建议 | 数量 |
|------|------|
| 🔴 DELETE | {delete} |
| 🟠 REWRITE | {rewrite} |
| 🟡 KEEP (OPTIMIZE) | {keep_optimize} |
| 🟢 KEEP | {keep} |

## 🔴 高风险文章 (建议删除)

| 文章 | 风险 | AI模式 | E-E-A-T |
|------|------|--------|---------|
"""
    high_risk_articles = [a for a in audits if a.get("total_risk", 0) >= 7]
    for a in sorted(high_risk_articles, key=lambda x: -x.get("total_risk", 0)):
        md += f"| `{a['slug']}` | {a['total_risk']}/10 | {a['ai_details'][:40]} | {a['eeat_score']}/10 |\n"
    
    md += f"""
## 🟠 需重写文章

| 文章 | 风险 | 问题 |
|------|------|------|
"""
    rewrite_articles = [a for a in audits if a.get("recommendation") == "REWRITE"]
    for a in sorted(rewrite_articles, key=lambda x: -x.get("total_risk", 0)):
        md += f"| `{a['slug']}` | {a['total_risk']}/10 | {a['ai_details'][:50]} |\n"
    
    md += f"""
## 🟡 需优化文章

| 文章 | 风险 | E-E-A-T | 优化建议 |
|------|------|---------|---------|
"""
    optimize_articles = [a for a in audits if a.get("recommendation") == "KEEP (OPTIMIZE)"]
    for a in sorted(optimize_articles, key=lambda x: -x.get("total_risk", 0)):
        md += f"| `{a['slug']}` | {a['total_risk']}/10 | {a['eeat_score']}/10 | 增加作者/数据来源/FAQ |\n"
    
    md += f"""
## 📄 全部文章清单

| slug | 风险 | AI风险 | E-E-A-T | 建议 | 字数 | 文件大小 |
|------|------|--------|---------|------|------|----------|
"""
    for a in sorted(audits, key=lambda x: -x.get("total_risk", 0)):
        rec_emoji = {"DELETE": "🔴", "REWRITE": "🟠", "KEEP (OPTIMIZE)": "🟡", "KEEP": "🟢"}.get(a["recommendation"], "")
        md += f"| `{a['slug'][:50]}` | {a['total_risk']}/10 | {a['ai_risk']} | {a['eeat_score']}/10 | {rec_emoji} | {a['word_count']} | {a['file_size_kb']}KB |\n"
    
    md += f"""
---
*本报告由TradeGo Content Audit Script自动生成*
"""
    
    # CSV报告
    csv = "slug,file_size_kb,date,category,read_time,section_count,word_count,word_richness,eeat_score,ai_risk,total_risk,recommendation\n"
    for a in audits:
        csv += f'"{a["slug"]}",{a["file_size_kb"]},{a["date"]},{a["category"]},{a["read_time"]},{a["section_count"]},{a["word_count"]},{a["word_richness"]},{a["eeat_score"]},{a["ai_risk"]},{a["total_risk"]},{a["recommendation"]}\n'
    
    return md, csv

# ========== 主程序 ==========

def main():
    print("🔍 TradeGo GEO 内容审计开始...")
    
    if not ARTICLES_DIR.exists():
        print(f"❌ 目录不存在: {ARTICLES_DIR}")
        sys.exit(1)
    
    # 审计所有JSON文件
    audits = []
    for filepath in sorted(ARTICLES_DIR.glob("*.json")):
        result = audit_article(filepath)
        if "error" not in result:
            audits.append(result)
        print(f"  {'✅' if 'error' not in result else '❌'} {filepath.stem}")
    
    # 生成报告
    md_report, csv_report = generate_report(audits)
    
    # 保存
    OUTPUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write(md_report)
    
    with open(OUTPUT_CSV, "w", encoding="utf-8") as f:
        f.write(csv_report)
    
    # 打印摘要
    total = len(audits)
    delete = sum(1 for a in audits if a.get("recommendation") == "DELETE")
    rewrite = sum(1 for a in audits if a.get("recommendation") == "REWRITE")
    high_risk = sum(1 for a in audits if a.get("total_risk", 0) >= 7)
    
    print(f"\n📊 审计完成: {total}篇文章")
    print(f"   🔴 建议删除: {delete}")
    print(f"   🟠 建议重写: {rewrite}")
    print(f"   ⚠️ 高风险(≥7分): {high_risk}")
    print(f"\n📋 报告已保存:")
    print(f"   Markdown: {OUTPUT_REPORT}")
    print(f"   CSV: {OUTPUT_CSV}")
    
    # 如果有高风险内容，立即提示
    if high_risk > 0:
        print(f"\n⚠️  警告: {high_risk}篇高风险文章需要立即处理！")
        print("   建议先删除高风险文章，降低Google检测风险")
    
    return high_risk

if __name__ == "__main__":
    sys.exit(main())
