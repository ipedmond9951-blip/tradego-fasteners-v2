#!/usr/bin/env python3
"""文章写锁：防止多个对话/窗口同时改同一篇 content/articles/<slug>.json 互相覆盖。

背景：2026-11-25 已发生过一次整篇覆盖事故（一条线读旧 JSON、另一条线写新 JSON，
后写的把先写的 es/fr/de 正文从 3.6k 字清回摘要级）。规则写在 docs/SEO-GEO-STRATEGY.md 第 6 节。

用法：
  python3 scripts/article-claim.py claim <slug> <owner>     # 领锁（默认 TTL 30 分钟）
  python3 scripts/article-claim.py release <slug> <owner>   # 交还（owner 不符则拒绝）
  python3 scripts/article-claim.py list                     # 当前持有情况
退出码：0 成功 / 1 被他人持有或 owner 不符 / 2 参数或路径问题（fail-closed）
"""
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
LOCKS = os.path.join(ROOT, "content", ".locks")
TTL = 30 * 60


def die(msg, code=2):
    print(msg)
    sys.exit(code)


def lock_path(slug):
    if not slug or "/" in slug or slug.startswith("."):
        die(f"非法 slug: {slug!r}")
    return os.path.join(LOCKS, f"{slug}.json")


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except Exception as e:
        die(f"锁文件读不出来，按 fail-closed 退出: {path}: {e}", 2)


def claim(slug, owner):
    if not os.path.isfile(os.path.join(ART, f"{slug}.json")):
        die(f"文章不存在: content/articles/{slug}.json")
    os.makedirs(LOCKS, exist_ok=True)
    path = lock_path(slug)
    cur = load(path)
    now = int(time.time())
    if cur:
        same = cur.get("owner") == owner
        expired = now >= int(cur.get("until", 0))
        if not same and not expired:
            left = int(cur.get("until", 0)) - now
            die(f"被 {cur.get('owner')} 持有（剩 {left}s）：{slug} —— 换一篇，别硬上", 1)
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"slug": slug, "owner": owner, "since": now, "until": now + TTL}, f, ensure_ascii=False)
    print(f"OK 已领锁 {slug} → {owner}（{TTL // 60} 分钟）")


def release(slug, owner):
    path = lock_path(slug)
    cur = load(path)
    if not cur:
        print(f"无锁可交还: {slug}")
        return
    if cur.get("owner") != owner:
        die(f"锁在 {cur.get('owner')} 手里，{owner} 无权交还: {slug}", 1)
    os.remove(path)
    print(f"OK 已交还 {slug}")


def list_locks():
    if not os.path.isdir(LOCKS):
        print("当前没有锁")
        return
    now = int(time.time())
    rows = []
    for name in sorted(os.listdir(LOCKS)):
        if not name.endswith(".json"):
            continue
        cur = load(os.path.join(LOCKS, name))
        if not cur:
            continue
        left = int(cur.get("until", 0)) - now
        state = "生效" if left > 0 else "过期"
        rows.append(f"{state}\t{cur.get('owner')}\t剩{max(left, 0)}s\t{cur.get('slug')}")
    print("\n".join(rows) if rows else "当前没有锁")


def main():
    if len(sys.argv) < 2:
        die(__doc__)
    cmd = sys.argv[1]
    if cmd == "list":
        list_locks()
    elif cmd in ("claim", "release"):
        if len(sys.argv) < 4:
            die("需要 <slug> <owner>")
        (claim if cmd == "claim" else release)(sys.argv[2], sys.argv[3])
    else:
        die(f"未知子命令: {cmd}")


if __name__ == "__main__":
    main()
