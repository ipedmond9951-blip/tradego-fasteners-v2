#!/usr/bin/env python3
"""
topic-state-manager.py — 选题状态机 v3.0

5 态状态机:
  queued (排队) → in_progress (生成中) → drafted (草稿) → published (已发布) → archived (30天回收)
  rejected (失败) → blacklisted (180天黑名单)

使用:
  python3 scripts/topic-state-manager.py mark <slug> <status> [--url=...] [--score=...]
  python3 scripts/topic-state-manager.py select --region=africa --count=2
  python3 scripts/topic-state-manager.py recycle  # 30天 published → archived
  python3 scripts/topic-state-manager.py stats
  python3 scripts/topic-state-manager.py blacklist <slug>  # 失败 → 180天黑名单
"""

import argparse
import json
import os
import time
from datetime import datetime, timedelta
from pathlib import Path

POOL_PATH = Path(__file__).parent / "seo-topic-pool.json"
STATE_PATH = Path(__file__).parent / "topic-state.json"
ARTICLES_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles")

VALID_STATUSES = {"queued", "in_progress", "drafted", "published", "archived", "rejected"}


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {"version": "1.0", "topics": {}, "blacklist": {}}


def save_state(state: dict):
    STATE_PATH.write_text(json.dumps(state, indent=2, ensure_ascii=False))


def load_pool() -> dict:
    return json.loads(POOL_PATH.read_text())


def get_existing_articles() -> set:
    if not ARTICLES_DIR.exists():
        return set()
    return {f.stem for f in ARTICLES_DIR.glob("*.json")}


def init_state_from_pool() -> dict:
    """首次运行时, 把 pool 中所有未发布 slug 标记为 queued"""
    state = load_state()
    pool = load_pool()
    existing = get_existing_articles()

    for t in pool["topics"]:
        slug = t["slug"]
        if slug not in state["topics"]:
            # 已发布文件 → published, 否则 queued
            if slug in existing:
                state["topics"][slug] = {
                    "status": "published",
                    "first_seen": t.get("generated_at", "unknown"),
                    "last_updated": time.strftime("%Y-%m-%d"),
                    "publish_date": "unknown",
                    "score_potential": t.get("score_potential", 0),
                    "source": t.get("source", "unknown"),
                }
            else:
                state["topics"][slug] = {
                    "status": "queued",
                    "first_seen": t.get("generated_at", time.strftime("%Y-%m-%d")),
                    "last_updated": time.strftime("%Y-%m-%d"),
                    "score_potential": t.get("score_potential", 0),
                    "source": t.get("source", "unknown"),
                }

    state["last_sync"] = time.strftime("%Y-%m-%d %H:%M:%S")
    save_state(state)
    return state


def mark(slug: str, status: str, url: str = None, score: int = None) -> dict:
    """更新单个 slug 状态"""
    if status not in VALID_STATUSES:
        return {"error": f"Invalid status. Valid: {VALID_STATUSES}"}

    state = load_state()
    if slug not in state["topics"]:
        state["topics"][slug] = {
            "status": status,
            "first_seen": time.strftime("%Y-%m-%d"),
            "score_potential": score or 0,
            "source": "unknown",
        }
    state["topics"][slug]["status"] = status
    state["topics"][slug]["last_updated"] = time.strftime("%Y-%m-%d")
    if url:
        state["topics"][slug]["publish_url"] = url
    if score is not None:
        state["topics"][slug]["score_potential"] = score
    if status == "published" and "publish_date" not in state["topics"][slug]:
        state["topics"][slug]["publish_date"] = time.strftime("%Y-%m-%d")

    save_state(state)
    return {"slug": slug, "status": status, "ok": True}


def blacklist(slug: str, reason: str = "unspecified") -> dict:
    """失败选题 → 180 天黑名单"""
    state = load_state()
    state["blacklist"][slug] = {
        "added_at": time.strftime("%Y-%m-%d"),
        "expires_at": (datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d"),
        "reason": reason,
    }
    if slug in state["topics"]:
        state["topics"][slug]["status"] = "rejected"
    save_state(state)
    return {"slug": slug, "blacklisted_until": state["blacklist"][slug]["expires_at"]}


def select(region: str = None, count: int = 2, exclude_published: bool = True) -> list:
    """
    从池子选 N 个可发布选题
    规则:
      1. status=queued (排除 published/in_progress/rejected)
      2. 不在黑名单中 (或已过期)
      3. 按 score_potential 降序
      4. region 过滤 (africa/global/zimbabwe)
      5. 多样性: 同 product 最多 1 个 (避免连发同产品)
    """
    state = init_state_from_pool()
    pool = load_pool()
    pool_by_slug = {t["slug"]: t for t in pool["topics"]}

    # 清理过期黑名单
    now = datetime.now()
    for slug, bl in list(state["blacklist"].items()):
        if datetime.strptime(bl["expires_at"], "%Y-%m-%d") < now:
            del state["blacklist"][slug]
    save_state(state)

    # 候选 = queued + 不在黑名单 + 不在 in_progress
    candidates = []
    in_progress_products = set()
    for slug, info in state["topics"].items():
        if info["status"] == "in_progress":
            pool_t = pool_by_slug.get(slug, {})
            in_progress_products.add(pool_t.get("product", ""))

    for slug, info in state["topics"].items():
        if info["status"] != "queued":
            continue
        if slug in state["blacklist"]:
            continue
        pool_t = pool_by_slug.get(slug)
        if not pool_t:
            continue
        # 区域过滤
        if region and pool_t.get("region") != region:
            continue
        # 多样性: 同 product 跳过
        if pool_t.get("product") in in_progress_products:
            continue
        candidates.append({
            "slug": slug,
            "score": info.get("score_potential", 0),
            "category": pool_t.get("category", "?"),
            "region": pool_t.get("region", "?"),
            "title_en": pool_t.get("title_en", slug),
        })

    # 坑 52 fix: 随机种子 + score 打乱 (让同 score 不总选前 2 个)
    import random
    random.seed(int(time.time()) // 60)  # 1 分钟种子 (避免连发时同选题)

    # score 降序 + 同 score 内随机
    candidates.sort(key=lambda x: (-x["score"], random.random()))

    # 二次多样性: 相邻选题不重复 product
    selected = []
    seen_products = set()
    for c in candidates:
        pool_t = pool_by_slug.get(c["slug"])
        product = pool_t.get("product", "")
        if product in seen_products:
            continue
        selected.append(c)
        seen_products.add(product)
        if len(selected) >= count:
            break

    # 如果多样性筛掉太多, 兜底按 score 选
    if len(selected) < count:
        for c in candidates:
            if c not in selected:
                selected.append(c)
                if len(selected) >= count:
                    break

    return selected[:count]


def recycle() -> dict:
    """30 天前 published → archived, 释放 slot"""
    state = load_state()
    cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    recycled = 0
    for slug, info in state["topics"].items():
        if info["status"] == "published":
            pub_date = info.get("publish_date", "9999-99-99")
            if pub_date < cutoff:
                info["status"] = "archived"
                info["archived_at"] = time.strftime("%Y-%m-%d")
                recycled += 1
    save_state(state)
    return {"recycled": recycled, "cutoff": cutoff}


def stats() -> dict:
    """状态统计"""
    state = load_state()
    by_status = {}
    for info in state["topics"].values():
        s = info.get("status", "unknown")
        by_status[s] = by_status.get(s, 0) + 1
    return {
        "total": len(state["topics"]),
        "by_status": by_status,
        "blacklist_count": len(state["blacklist"]),
        "last_sync": state.get("last_sync", "never"),
    }


def main():
    parser = argparse.ArgumentParser(description="Topic 状态机")
    sub = parser.add_subparsers(dest="cmd")

    p_init = sub.add_parser("init", help="从 pool 初始化 state")
    p_mark = sub.add_parser("mark", help="更新状态")
    p_mark.add_argument("slug")
    p_mark.add_argument("status", choices=list(VALID_STATUSES))
    p_mark.add_argument("--url")
    p_mark.add_argument("--score", type=int)

    p_sel = sub.add_parser("select", help="选 N 个候选")
    p_sel.add_argument("--region", choices=["africa", "global", "zimbabwe", "all"], default="all")
    p_sel.add_argument("--count", type=int, default=2)

    p_recycle = sub.add_parser("recycle", help="30天 published → archived")
    p_black = sub.add_parser("blacklist", help="加入黑名单")
    p_black.add_argument("slug")
    p_black.add_argument("--reason", default="unspecified")

    sub.add_parser("stats", help="状态统计")

    args = parser.parse_args()

    if args.cmd == "init":
        state = init_state_from_pool()
        print(f"✅ Synced {len(state['topics'])} topics to state")
    elif args.cmd == "mark":
        print(json.dumps(mark(args.slug, args.status, args.url, args.score), indent=2))
    elif args.cmd == "select":
        region = None if args.region == "all" else args.region
        print(json.dumps(select(region, args.count), indent=2, ensure_ascii=False))
    elif args.cmd == "recycle":
        print(json.dumps(recycle(), indent=2))
    elif args.cmd == "blacklist":
        print(json.dumps(blacklist(args.slug, args.reason), indent=2))
    elif args.cmd == "stats":
        print(json.dumps(stats(), indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
