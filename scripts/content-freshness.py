#!/usr/bin/env python3
"""content-freshness.py —— 文章新鲜度信号的唯一来源（published / modified）。

为什么要有这个脚本
------------------
线上文章页曾经出现 ``dateModified`` 早于 ``datePublished``（物理不可能），sitemap 的
lastmod 也被构建时间戳批量冒充（上千条 URL 同一个时间值）。根因是日期在页面代码和
sitemap 路由里各取一套：JSON 里的 ``updated`` 又被批量写成同一天，不能单独当权威。

本脚本把「这篇文章最后一次真实改动是什么时候 / 第一次落库是什么时候」算清楚，写进
已提交的缓存 ``content/freshness.json``，供页面 schema 与 sitemap 在构建期同一份读取。

口径（硬规则，别随手改）
------------------------
- ``modified``（真实更新日）= max(
      git 该文件最后一笔提交的作者日期(UTC 日),
      JSON ``updated`` / ``updatedDate`` 中较晚者
  )。git 记录为准：JSON 字段只做「不早于 git」的补正，不能把更新日往回拉。
- ``published``（校正后的发布日）= min(JSON ``date``, git 最早一笔提交作者日期)。
  校正只许往早走，不允许比 JSON 原值更晚。
- git 历史与 JSON 字段都拿不到 → 该篇标 ``unknown``，缓存里日期为 ``null`` 并在报告
  中点名；不许编日期。

缓存维护
--------
``content/freshness.json`` 是生成物：文章内容改动后重跑本脚本，再把缓存一并提交。
不要手工编辑缓存。``--check`` 模式把缓存与 git/JSON 实算结果比对，不一致退出码 1，
以后可以接进 CI 闸门。

用法::

  python3 scripts/content-freshness.py              # 实算 + 重写缓存，文本汇总
  python3 scripts/content-freshness.py --json       # 结构化输出（同时刷新缓存）
  python3 scripts/content-freshness.py --check      # 只比对缓存，不改文件；exit 0/1
  python3 scripts/content-freshness.py --slug <s>   # 单篇明细（文本）
"""
import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART_DIR = os.path.join(ROOT, "content", "articles")
CACHE_PATH = os.path.join(ROOT, "content", "freshness.json")


def _git(*args: str) -> str:
    """Run a read-only git command; return stripped stdout (empty on failure)."""
    proc = subprocess.run(
        ["git", "-C", ROOT, *args],
        capture_output=True,
        text=True,
        check=False,
    )
    return proc.stdout.strip() if proc.returncode == 0 else ""


def git_history_by_file() -> dict[str, list[str]]:
    """Chronological author dates (%aI) for every tracked article JSON.

    Single bulk ``git log`` call: ``--reverse`` makes output oldest-first, so the
    first occurrence of a file is its first commit and the last is its latest.
    Returns {relative_path: [iso_datetime, ...]}.
    """
    out: dict[str, list[str]] = {}
    log = _git("log", "--reverse", "--format=%aI", "--name-only", "--", "content/articles")
    current_date: str | None = None
    for line in log.splitlines():
        line = line.strip()
        if not line:
            continue
        # %aI looks like 2026-08-16T03:58:18+08:00; file lines are paths.
        if line.endswith(".json"):
            if current_date:
                out.setdefault(line, []).append(current_date)
        else:
            current_date = line
    return out


def day(iso: str | None) -> str | None:
    """Normalize a bare date or offset-aware datetime to a UTC day ``YYYY-MM-DD``."""
    if not iso:
        return None
    iso = iso.strip()
    if not iso:
        return None
    if len(iso) == 10:  # bare YYYY-MM-DD
        return iso
    try:
        dt = datetime.fromisoformat(iso)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).date().isoformat()
    except ValueError:
        return iso[:10] if len(iso) >= 10 else None


def load_article(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError):
        return {}


def compute() -> dict[str, dict]:
    """Recompute every article's freshness from git history + JSON fields."""
    history = git_history_by_file()
    entries: dict[str, dict] = {}

    for name in sorted(os.listdir(ART_DIR)):
        if not name.endswith(".json"):
            continue
        path = os.path.join(ART_DIR, name)
        if not os.path.isfile(path):
            continue
        data = load_article(path)
        slug = data.get("slug") or name[:-5]
        rel = os.path.join("content", "articles", name).replace(os.sep, "/")

        commits = history.get(rel, [])
        first_commit = day(commits[0]) if commits else None
        last_commit = day(commits[-1]) if commits else None

        json_date = day(data.get("date"))
        json_updated = day(data.get("updated"))
        json_updated_date = day(data.get("updatedDate"))
        json_latest = max(
            (d for d in (json_updated, json_updated_date) if d), default=None
        )

        # modified = 较晚者：git 最后提交为准，JSON 只做不早于 git 的补正
        modified = max(
            (d for d in (last_commit, json_latest) if d), default=None
        )
        # published 只许往早校正：min(原值, 首次落库日)
        published = min(
            (d for d in (json_date, first_commit) if d), default=None
        )

        unknown = published is None or modified is None
        entries[slug] = {
            "published": published,
            "modified": modified,
            "firstCommit": first_commit,
            "lastCommit": last_commit,
            "jsonDate": json_date,
            "jsonUpdated": json_updated,
            "unknown": unknown,
        }
    return entries


def write_cache(entries: dict[str, dict]) -> None:
    payload = {
        "note": "Generated by scripts/content-freshness.py. Re-run that script after editing article content, then commit this file. Do not hand-edit.",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "articles": entries,
    }
    with open(CACHE_PATH, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write("\n")


def read_cache() -> dict[str, dict]:
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh).get("articles", {})
    except (OSError, json.JSONDecodeError):
        return {}


def main() -> int:
    ap = argparse.ArgumentParser(description="Article freshness (published/modified) signal.")
    ap.add_argument("--json", action="store_true", help="structured JSON to stdout")
    ap.add_argument("--check", action="store_true", help="compare cache vs recomputed; exit 1 on drift")
    ap.add_argument("--slug", help="single-article detail (text mode)")
    args = ap.parse_args()

    entries = compute()

    if args.check:
        cached = read_cache()
        drift: list[str] = []
        for slug, fresh in entries.items():
            old = cached.get(slug)
            if old is None:
                drift.append(f"{slug}: missing in cache")
                continue
            for field in ("published", "modified"):
                if old.get(field) != fresh[field]:
                    drift.append(
                        f"{slug}: {field} cache={old.get(field)!r} actual={fresh[field]!r}"
                    )
        for slug in cached:
            if slug not in entries:
                drift.append(f"{slug}: stale entry in cache")
        if drift:
            print("freshness cache drift:")
            for line in drift:
                print(f"  - {line}")
            return 1
        print(f"freshness cache OK: {len(entries)} articles match git/JSON.")
        return 0

    write_cache(entries)

    unknown = [s for s, e in entries.items() if e["unknown"]]

    if args.json:
        print(json.dumps({"articles": entries}, ensure_ascii=False, indent=2, sort_keys=True))
    elif args.slug:
        fresh = entries.get(args.slug)
        if fresh is None:
            print(f"no such slug: {args.slug}")
            return 1
        print(json.dumps({args.slug: fresh}, ensure_ascii=False, indent=2))
    else:
        for slug, fresh in sorted(entries.items()):
            print(f"{slug} {fresh['modified'] or 'unknown'}")
        print(f"\n{len(entries)} articles; unknown={len(unknown)}", file=sys.stderr)
        if unknown:
            print("unknown slugs:", ", ".join(unknown), file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
