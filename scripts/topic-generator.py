#!/usr/bin/env python3
"""
topic-generator.py — TradeGo SEO 选题无限池自生成器 v3.0

设计：4 轴笛卡尔积
  Scene (场景) × Product (产品) × Pain (痛点) × ContentType (内容形态)
  22 × 20 × 25 × 15 = 165,000 独特组合上限

信号源（动态补充）:
  1. 静态矩阵 (本脚本核心)
  2. GSC 真实查询/机会页 (gsc-supplement)
  3. 竞品监控 (competitor-supplement)
  4. 询盘关键词 (inquiry-supplement)
  5. 季节性日历 (seasonal-supplement)

使用:
  python3 scripts/topic-generator.py --mode=generate [--seed=N] [--max=N] [--region=africa|global]
  python3 scripts/topic-generator.py --mode=supplement-gsc
  python3 scripts/topic-generator.py --mode=supplement-competitor
  python3 scripts/topic-generator.py --mode=supplement-inquiry
  python3 scripts/topic-generator.py --mode=stats
"""

import argparse
import itertools
import json
import os
import random
import sys
import time
from pathlib import Path

# ============================================================
# 4 个核心轴
# ============================================================

# 22 个场景轴（含 Africa / Zim 区域特化）
SCENES = [
    # 通用工业 (12)
    "construction-building", "mining-quarry", "oil-gas-pipeline",
    "renewable-wind", "renewable-solar", "hydro-power",
    "railway-infrastructure", "bridge-highway", "port-marine",
    "food-beverage-plant", "chemical-plant", "water-treatment",
    "industrial-machinery", "automotive-assembly", "shipbuilding",
    "telecom-tower", "transmission-tower", "agriculture-irrigation",
    "defense-equipment", "medical-equipment",
    # 区域特化 (8)
    "zim-construction", "zim-mining", "africa-power-grid",
    "africa-ftz-export", "africa-construction-boom",
    "south-africa-sabs", "kenya-construction", "nigeria-oil-gas",
    "ethiopia-industrial-park", "tanzania-railway",
]

# 20 个产品轴（TradeGo SKU 核心）
PRODUCTS = [
    "anchor-bolts", "hex-bolts", "u-bolts", "threaded-rods",
    "hex-nuts", "lock-nuts", "flat-washers", "lock-washers",
    "wood-screws", "self-tapping-screws", "concrete-screws",
    "chipboard-screws", "deck-screws", "drywall-screws",
    "carriage-bolts", "eye-bolts", "stud-bolts", "j-bolts",
    "rivets", "retaining-rings",
]

# 25 个痛点轴
PAINS = [
    "corrosion-resistance", "vibration-loosening", "fatigue-failure",
    "thread-stripping", "galvanic-corrosion", "stress-cracking",
    "high-temperature", "low-temperature", "uv-degradation",
    "chemical-attack", "salt-spray", "compliance-fail",
    "wrong-grade", "under-spec-cost", "loosening-dynamics",
    "preload-torque", "bolt-pattern", "joint-stiffness",
    "hydrogen-embrittlement", "creep-relaxation", "cost-optimization",
    "lead-time", "custom-coating", "mill-cert-traceability",
    "import-duty",
]

# 15 个内容形态轴
CONTENT_TYPES = [
    "selection-guide", "comparison", "case-study",
    "standard-explainer", "spec-checklist", "torque-calc",
    "rfq-template", "supplier-evaluation", "top-mistakes",
    "tco-analysis", "sourcing-strategy", "compliance-roadmap",
    "installation-procedure", "troubleshooting", "lifecycle-cost",
]

# 商业意图关键词（quality_check 必含 1 个）
# 注意：必须避免 "spec/cost" 这种会跟 "under-spec-cost" 误匹配
# 改为整词/复合词判断
COMMERCIAL_SIGNALS = [
    "supplier", "manufacturer", "rfq", "quote",
    "certified", "astm", "import", "export",
    "wholesale", "bulk", "grade-", "tco", "lifecycle",
    "lead-time", "mill-cert",
]

# Africa 区域关键词（地域匹配）
AFRICA_SIGNALS = [
    "africa", "zim", "zimbabwe", "kenya", "nigeria", "tanzania",
    "ethiopia", "south-africa", "sabs", "ftz", "africa-",
]


# ============================================================
# 质量评分
# ============================================================

def quality_check(topic: dict) -> int:
    """返回 0-100 分, < 60 不进池"""
    score = 100
    slug = topic["slug"]

    # 商业意图检查
    has_commercial = any(w in slug for w in COMMERCIAL_SIGNALS)
    if not has_commercial:
        score -= 35

    # 地域匹配（兼容 market_region 或 region 字段）
    region = topic.get("market_region") or topic.get("region", "global")
    if region == "africa":
        if not any(w in slug for w in AFRICA_SIGNALS):
            score -= 30

    # 痛点-形态配对合理性
    bad_pair = (
        (topic["pain"] in ["cost-optimization", "lead-time", "import-duty"] and
         topic["content_type"] in ["case-study", "torque-calc"]) or
        (topic["pain"] in ["preload-torque", "joint-stiffness", "loosening-dynamics"] and
         topic["content_type"] in ["rfq-template", "supplier-evaluation"]) or
        (topic["content_type"] in ["selection-guide", "comparison"] and
         topic["pain"] in ["uv-degradation"])  # UV 是壁问题，selection/comparison 不合适
    )
    if bad_pair:
        score -= 30

    # 重复词检查（避免 ugly slug）
    parts = slug.split("-")
    if len(parts) != len(set(parts)):
        score -= 25

    # 长度检查（slug 太长 SEO 不友好）
    if len(slug) > 80:
        score -= 10
    elif len(slug) > 70:
        score -= 5

    # 区域多样性：每个 region 比例要平衡
    if region == "africa":
        score += 2  # 适度鼓励 Africa 内容（不过度）

    return max(score, 0)


# ============================================================
# 选题生成
# ============================================================

def generate_topics(seed: int = None, max_n: int = 270,
                    region_filter: str = None) -> list:
    """
    4 轴笛卡尔积 (本脚本用切片避免爆量):
      5 场景 × 3 产品 × 3 痛点 × 2 形态 = 90 (默认)
      22 场景 × 3 产品 × 3 痛点 × 2 形态 = 396 (full)
    """
    rng = random.Random(seed)

    # 场景选择
    scenes = SCENES
    if region_filter == "africa":
        scenes = [s for s in SCENES if any(w in s for w in AFRICA_SIGNALS)]
    elif region_filter == "global":
        scenes = [s for s in SCENES if not any(w in s for w in AFRICA_SIGNALS)]

    topics = []
    seen_slugs = set()

    # 取 max_n / 单组合数 = 需要的循环数
    # 默认全量采样（保证多样性）只用 seed 控制顺序
    products = PRODUCTS
    pains = PAINS
    types = CONTENT_TYPES

    for scene, product, pain, ctype in itertools.product(
        scenes, products, pains, types
    ):
        slug = f"{scene}-{product}-{ctype}-{pain}".replace("_", "-")
        slug = slug[:90]
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        # 区域判定
        market_region = "africa" if any(w in scene for w in AFRICA_SIGNALS) else "global"

        topic = {
            "slug": slug,
            "title_en": _build_title_en(scene, product, pain, ctype),
            "category": _build_category(ctype, market_region),
            "target_audience": _build_persona(pain, market_region),
            "search_intent": _build_intent(ctype),
            "relatedProducts": [product] + _related_products(product),
            "relatedArticles": _related_articles(scene),
            "region": market_region,
            # 扩展字段（状态机用）
            "scene": scene,
            "product": product,
            "pain": pain,
            "content_type": ctype,
            "score_potential": 0,
            "source": "generator-v3",
            "generated_at": time.strftime("%Y-%m-%d"),
        }
        topic["score_potential"] = quality_check(topic)
        if topic["score_potential"] >= 60:
            topics.append(topic)

        # 不在这里 break，让外层 max_n 控制，避免单 scene 霸占

    # 按分数降序 + 截断到 max_n
    # 采用分组排序：每个 region 内按 score 排，最后按 region 轮换合并
    # 保证 max_n 内 region 均衡
    if max_n < 1000:
        # 小量：全部按 score 排
        topics.sort(key=lambda t: t["score_potential"], reverse=True)
    else:
        # 大量：先 group by region，组内排序，然后轮换拼接
        from collections import defaultdict
        groups = defaultdict(list)
        for t in topics:
            groups[t["region"]].append(t)
        for k in groups:
            groups[k].sort(key=lambda t: t["score_potential"], reverse=True)

        result = []
        # 轮询取每个 region 的 top
        region_order = ["africa", "global", "zimbabwe"]
        idx = 0
        while sum(len(v) for v in groups.values()) > 0 and len(result) < max_n:
            region = region_order[idx % len(region_order)]
            if groups[region]:
                result.append(groups[region].pop(0))
            idx += 1
            # 防止某 region 空转
            if idx > 10000:
                break
        topics = result

    return topics[:max_n]

    # 按分数排序
    topics.sort(key=lambda t: t["score_potential"], reverse=True)
    return topics[:max_n]


def _build_title_en(scene: str, product: str, pain: str, ctype: str) -> str:
    """根据 4 轴生成 SEO-friendly 英文标题"""
    scene_pretty = scene.replace("-", " ").title()
    product_pretty = product.replace("-", " ").title()
    pain_pretty = pain.replace("-", " ").title()
    ctype_pretty = ctype.replace("-", " ").title()

    # 标题模板（按 ctype 分）
    templates = {
        "selection-guide": f"{scene_pretty} {product_pretty} {ctype_pretty}: {pain_pretty}",
        "comparison": f"{product_pretty} vs Alternatives for {scene_pretty}: {pain_pretty} {ctype_pretty.title()}",
        "case-study": f"{scene_pretty} {product_pretty} Case Study: Solving {pain_pretty}",
        "standard-explainer": f"{scene_pretty} {product_pretty}: ISO/ASTM/GB Standard {ctype_pretty.title()}",
        "spec-checklist": f"{scene_pretty} {product_pretty} Spec {ctype_pretty.title()}: {pain_pretty} Solutions",
        "torque-calc": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Methods",
        "rfq-template": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Procurement",
        "supplier-evaluation": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Sourcing",
        "top-mistakes": f"Top Mistakes in {scene_pretty} {product_pretty}: {pain_pretty} {ctype_pretty.title()}",
        "tco-analysis": f"{scene_pretty} {product_pretty} TCO: {pain_pretty} {ctype_pretty.title()}",
        "sourcing-strategy": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Strategy",
        "compliance-roadmap": f"{scene_pretty} {product_pretty} Compliance: {pain_pretty} {ctype_pretty.title()}",
        "installation-procedure": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Procedure",
        "troubleshooting": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Fixes",
        "lifecycle-cost": f"{scene_pretty} {product_pretty} {ctype_pretty.title()}: {pain_pretty} Costs",
    }
    return templates.get(ctype, f"{scene_pretty} {product_pretty}: {pain_pretty} Guide")


def _build_category(ctype: str, region: str) -> str:
    ctype_to_cat = {
        "selection-guide": "Industry Guide",
        "comparison": "Technical Guide",
        "case-study": "Case Study",
        "standard-explainer": "Reference Guide",
        "spec-checklist": "Procurement Guide",
        "torque-calc": "Technical Guide",
        "rfq-template": "Procurement Guide",
        "supplier-evaluation": "Procurement Guide",
        "top-mistakes": "Industry Guide",
        "tco-analysis": "Procurement Guide",
        "sourcing-strategy": "Procurement Guide",
        "compliance-roadmap": "Compliance Guide",
        "installation-procedure": "Technical Guide",
        "troubleshooting": "Technical Guide",
        "lifecycle-cost": "Procurement Guide",
    }
    base = ctype_to_cat.get(ctype, "Industry Guide")
    if region == "africa":
        return f"{base} - Africa"
    return base


def _build_persona(pain: str, region: str) -> str:
    if pain in ["cost-optimization", "lead-time", "import-duty"]:
        return "Procurement managers, purchasing agents" if region == "africa" else "Procurement managers, sourcing teams"
    if pain in ["preload-torque", "joint-stiffness", "loosening-dynamics"]:
        return "Mechanical engineers, structural engineers"
    if pain in ["compliance-fail", "mill-cert-traceability"]:
        return "Quality inspectors, compliance officers"
    return "Project engineers, site supervisors"


def _build_intent(ctype: str) -> str:
    if ctype in ["rfq-template", "supplier-evaluation", "sourcing-strategy", "tco-analysis"]:
        return "commercial"
    if ctype in ["case-study", "troubleshooting"]:
        return "informational"
    return "informational"


def _related_products(product: str) -> list:
    """返回 2 个最相关产品"""
    related_map = {
        "anchor-bolts": ["hex-nuts", "flat-washers"],
        "hex-bolts": ["hex-nuts", "lock-washers"],
        "u-bolts": ["hex-nuts", "flat-washers"],
        "threaded-rods": ["hex-nuts", "flat-washers"],
        "hex-nuts": ["flat-washers", "lock-washers"],
        "lock-nuts": ["flat-washers", "hex-bolts"],
        "flat-washers": ["lock-washers", "hex-bolts"],
        "lock-washers": ["flat-washers", "hex-bolts"],
        "wood-screws": ["flat-washers", "deck-screws"],
        "self-tapping-screws": ["flat-washers", "concrete-screws"],
        "concrete-screws": ["anchor-bolts", "flat-washers"],
        "chipboard-screws": ["wood-screws", "flat-washers"],
        "deck-screws": ["wood-screws", "flat-washers"],
        "drywall-screws": ["wood-screws", "flat-washers"],
        "carriage-bolts": ["hex-nuts", "flat-washers"],
        "eye-bolts": ["hex-nuts", "flat-washers"],
        "stud-bolts": ["hex-nuts", "flat-washers"],
        "j-bolts": ["hex-nuts", "flat-washers"],
        "rivets": ["flat-washers", "lock-washers"],
        "retaining-rings": ["flat-washers", "lock-nuts"],
    }
    return related_map.get(product, ["flat-washers", "hex-nuts"])


def _related_articles(scene: str) -> list:
    """返回 2 个相关场景文章（占位, 真实发布后回填）"""
    base = scene.replace("-", " ")
    return [
        f"{scene}-industry-overview",
        f"{scene}-market-2026",
    ]


# ============================================================
# 动态补充：GSC / 竞品 / 询盘 / 季节
# ============================================================

def supplement_gsc() -> list:
    """
    从 GSC 真实数据反推选题
    信号: top 100 queries + impressions>50 但 CTR<2% 的机会页
    """
    # 简化：读取 GSC scraper 缓存
    gsc_cache = Path("/tmp/gsc-30d.json")
    if not gsc_cache.exists():
        return []

    try:
        data = json.loads(gsc_cache.read_text())
    except Exception:
        return []

    opportunities = []
    # 找 impressions>50 CTR<2% 的"机会页"
    for row in data.get("rows", []):
        if row.get("impressions", 0) > 50 and row.get("ctr", 1.0) < 0.02:
            keyword = row.get("keys", ["?"])[0] if row.get("keys") else ""
            if keyword and len(keyword) > 5:
                slug = f"gsc-opportunity-{keyword.replace(' ', '-')[:50]}"
                opportunities.append({
                    "slug": slug,
                    "title_en": f"{keyword.title()} — Complete Guide for Fastener Buyers",
                    "category": "GSC Opportunity",
                    "target_audience": "Search-driven buyers",
                    "search_intent": "commercial",
                    "relatedProducts": ["hex-bolts", "flat-washers"],
                    "relatedArticles": [],
                    "region": "global",
                    "scene": "gsc-opportunity",
                    "product": "hex-bolts",
                    "pain": "wrong-grade",
                    "content_type": "selection-guide",
                    "score_potential": 95,  # 真实需求
                    "source": "gsc-supplement",
                    "gsc_keyword": keyword,
                    "gsc_impressions": row.get("impressions"),
                    "generated_at": time.strftime("%Y-%m-%d"),
                })
    return opportunities[:30]  # 最多 30 个


def supplement_competitor() -> list:
    """
    从竞品监控反推选题
    信号: 5 个竞品本月新文章 pattern
    """
    # 简化：读取竞品 scraper 缓存
    comp_cache = Path("/tmp/competitor-articles.json")
    if not comp_cache.exists():
        return []

    try:
        data = json.loads(comp_cache.read_text())
    except Exception:
        return []

    supplements = []
    for article in data.get("articles", [])[:20]:
        title = article.get("title", "")
        if not title or len(title) < 10:
            continue
        slug = f"comp-followup-{title[:50].lower().replace(' ', '-').replace('--','-')}"
        supplements.append({
            "slug": slug,
            "title_en": title,
            "category": "Competitor Follow-up",
            "target_audience": "Industry buyers",
            "search_intent": "informational",
            "relatedProducts": ["hex-bolts", "anchor-bolts"],
            "relatedArticles": [],
            "region": "global",
            "scene": "competitor-followup",
            "product": "hex-bolts",
            "pain": "wrong-grade",
            "content_type": "selection-guide",
            "score_potential": 80,
            "source": "competitor-supplement",
            "competitor_url": article.get("url", ""),
            "generated_at": time.strftime("%Y-%m-%d"),
        })
    return supplements


def supplement_inquiry() -> list:
    """
    从询盘数据反推选题
    信号: Excel 客户询盘高频关键词
    """
    inquiry_files = list(Path("/Users/zhangming/.openclaw/workspace/Projects/tradebrain-v2/data/inquiries").glob("*.csv")) if Path("/Users/zhangming/.openclaw/workspace/Projects/tradebrain-v2/data/inquiries").exists() else []
    if not inquiry_files:
        return []

    # 简化：读最新文件 + 提取高频词
    try:
        import csv
        from collections import Counter
        keywords = Counter()
        for f in inquiry_files[-3:]:  # 最近 3 个
            with open(f) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    text = " ".join([row.get("subject", ""), row.get("body", "")]).lower()
                    for kw in ["a325", "a490", "f1554", "m16", "m20", "m24", "grade 8.8", "grade 10.9",
                                "hot-dip-galvanized", "stainless", "astm", "din", "iso", "anchor",
                                "structural", "high-tensile"]:
                        if kw in text:
                            keywords[kw] += 1

        supplements = []
        for kw, count in keywords.most_common(10):
            if count >= 2:  # 至少 2 个询盘提到
                slug = f"inquiry-driven-{kw.replace(' ', '-')}-procurement-guide"
                supplements.append({
                    "slug": slug,
                    "title_en": f"{kw.upper()} Procurement Guide for Fastener Buyers",
                    "category": "Inquiry-Driven",
                    "target_audience": "Procurement managers",
                    "search_intent": "commercial",
                    "relatedProducts": ["hex-bolts", "anchor-bolts"],
                    "relatedArticles": [],
                    "region": "global",
                    "scene": "inquiry-driven",
                    "product": "hex-bolts",
                    "pain": "wrong-grade",
                    "content_type": "supplier-evaluation",
                    "score_potential": 90,  # 真实询盘
                    "source": "inquiry-supplement",
                    "inquiry_keyword": kw,
                    "inquiry_count": count,
                    "generated_at": time.strftime("%Y-%m-%d"),
                })
        return supplements
    except Exception:
        return []


def supplement_seasonal() -> list:
    """
    季节性日历
    """
    month = int(time.strftime("%m"))
    season_map = {
        1: ("winter-construction", "Cold-weather fastener selection"),
        2: ("spring-prep", "Pre-spring construction fastener prep"),
        3: ("spring-construction", "Spring construction fastener demand"),
        4: ("rainy-season", "Rainy season fastener corrosion"),
        5: ("pre-summer", "Pre-summer construction rush"),
        6: ("summer-peak", "Summer construction peak demand"),
        7: ("mid-summer", "Mid-summer heat-resistant fasteners"),
        8: ("late-summer", "Late summer project completion"),
        9: ("autumn-construction", "Autumn construction fastener supply"),
        10: ("pre-winter", "Pre-winter fastener stockpiling"),
        11: ("winter-start", "Winter construction fastener guide"),
        12: ("year-end", "Year-end procurement fastener deals"),
    }
    scene, desc = season_map.get(month, ("general", "General fastener selection"))
    slug = f"seasonal-{scene}-fastener-guide"
    return [{
        "slug": slug,
        "title_en": f"{desc}: 2026 Procurement Guide",
        "category": "Seasonal",
        "target_audience": "Procurement managers, project planners",
        "search_intent": "commercial",
        "relatedProducts": ["hex-bolts", "anchor-bolts"],
        "relatedArticles": [],
        "region": "global",
        "scene": scene,
        "product": "hex-bolts",
        "pain": "lead-time",
        "content_type": "sourcing-strategy",
        "score_potential": 75,
        "source": "seasonal-supplement",
        "generated_at": time.strftime("%Y-%m-%d"),
    }]


# ============================================================
# 池子合并 + 状态机
# ============================================================

POOL_PATH = Path(__file__).parent / "seo-topic-pool.json"
STATE_PATH = Path(__file__).parent / "topic-state.json"


def load_pool() -> dict:
    if POOL_PATH.exists():
        return json.loads(POOL_PATH.read_text())
    return {"version": "2.0", "description": "Auto-generated + supplemented", "topics": []}


def save_pool(pool: dict):
    POOL_PATH.write_text(json.dumps(pool, indent=2, ensure_ascii=False))


def merge_into_pool(new_topics: list, dry_run: bool = False) -> dict:
    """合并新选题到池子，去重 + 状态机追踪"""
    pool = load_pool()
    existing_slugs = {t["slug"] for t in pool["topics"]}
    new_unique = [t for t in new_topics if t["slug"] not in existing_slugs]

    if not dry_run:
        pool["topics"].extend(new_unique)
        pool["last_generated"] = time.strftime("%Y-%m-%d %H:%M:%S")
        pool["total_count"] = len(pool["topics"])
        save_pool(pool)

    return {
        "new": len(new_unique),
        "duplicates": len(new_topics) - len(new_unique),
        "total_after": len(pool["topics"]) + (0 if dry_run else len(new_unique)),
        "samples": [t["slug"] for t in new_unique[:5]],
    }


def stats() -> dict:
    pool = load_pool()
    topics = pool["topics"]
    by_source = {}
    by_region = {}
    by_score = {"60-69": 0, "70-79": 0, "80-89": 0, "90-100": 0}
    for t in topics:
        by_source[t.get("source", "unknown")] = by_source.get(t.get("source", "unknown"), 0) + 1
        by_region[t.get("region", "unknown")] = by_region.get(t.get("region", "unknown"), 0) + 1
        score = t.get("score_potential", 0)
        if score >= 90:
            by_score["90-100"] += 1
        elif score >= 80:
            by_score["80-89"] += 1
        elif score >= 70:
            by_score["70-79"] += 1
        else:
            by_score["60-69"] += 1
    return {
        "total": len(topics),
        "by_source": by_source,
        "by_region": by_region,
        "by_score": by_score,
        "last_generated": pool.get("last_generated", "never"),
    }


# ============================================================
# CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="TradeGo SEO 选题无限池")
    parser.add_argument("--mode", required=True,
                        choices=["generate", "supplement-gsc", "supplement-competitor",
                                 "supplement-inquiry", "supplement-seasonal",
                                 "supplement-all", "stats", "dry-run"],
                        help="操作模式")
    parser.add_argument("--seed", type=int, default=None, help="随机种子")
    parser.add_argument("--max", type=int, default=270, help="最大生成数")
    parser.add_argument("--region", choices=["africa", "global", "all"], default="all",
                        help="区域过滤")
    args = parser.parse_args()

    if args.mode == "stats":
        print(json.dumps(stats(), indent=2, ensure_ascii=False))
        return

    if args.mode == "dry-run":
        topics = generate_topics(seed=args.seed, max_n=args.max,
                                 region_filter=None if args.region == "all" else args.region)
        print(json.dumps({
            "would_generate": len(topics),
            "samples": [{"slug": t["slug"], "score": t["score_potential"]}
                        for t in topics[:10]]
        }, indent=2, ensure_ascii=False))
        return

    if args.mode == "generate":
        seed = args.seed or int(time.time()) // 3600  # 默认小时种子
        topics = generate_topics(seed=seed, max_n=args.max,
                                 region_filter=None if args.region == "all" else args.region)
        result = merge_into_pool(topics, dry_run=False)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    # supplement 模式
    supplement_fn = {
        "supplement-gsc": supplement_gsc,
        "supplement-competitor": supplement_competitor,
        "supplement-inquiry": supplement_inquiry,
        "supplement-seasonal": supplement_seasonal,
    }
    if args.mode in supplement_fn:
        new_topics = supplement_fn[args.mode]()
        result = merge_into_pool(new_topics, dry_run=False)
        print(json.dumps({**result, "supplement": args.mode}, indent=2, ensure_ascii=False))
        return

    if args.mode == "supplement-all":
        all_new = []
        for fn in [supplement_gsc, supplement_competitor, supplement_inquiry, supplement_seasonal]:
            all_new.extend(fn())
        result = merge_into_pool(all_new, dry_run=False)
        print(json.dumps({**result, "supplement": "all"}, indent=2, ensure_ascii=False))
        return


if __name__ == "__main__":
    main()
