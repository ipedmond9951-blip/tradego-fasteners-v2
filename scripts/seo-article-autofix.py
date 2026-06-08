#!/usr/bin/env python3
"""
SEO Article Auto-Fix Tool

A self-repair script for TradeGo article JSON files. Addresses common issues
documented in PITFALLS.md (坑 38-45) so that a malformed article can be
rescued instead of being re-authored from scratch.

Usage:
  python3 seo-article-autofix.py <path-to-article.json>

Returns:
  - fixes_applied: list of human-readable strings describing what was changed
  - article: the repaired article dict

Fixes applied (in order):
  1. Replace literal \\' with ASCII ' in the raw text (pitfall 42)
  2. Try to close a truncated JSON string (e.g. unterminated value)
  3. keywords: dict -> comma-separated string (pitfall 39)
  4. author: 10-language dict -> standard dict + authorI18n backup (pitfall 41)
  5. Missing dataSource -> add default 5 URL set
  6. Missing date -> set to today (pitfall 43 follow-up)
  7. description.en too long -> trim to 157 + '...'
  8. imageAlt: 10-language dict check
  9. author is plain string -> convert to standard dict
"""

from __future__ import annotations

import json
import sys
import re
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple

LANGUAGES = ["en", "zh", "es", "ar", "fr", "pt", "ru", "ja", "de", "hi"]


def _try_close_truncated_json(content: str) -> Tuple[str, Optional[str]]:
    """Attempt to close a truncated JSON string by appending a quote,
    closing the current object/array, and re-trying.

    Returns (new_content, note). If a fix is applied, the note describes it.
    """
    # Heuristic: if the last non-whitespace char is one of ', "', :',
    # we may have a truncated string. Try appending " followed by the
    # necessary closing structure.
    stripped = content.rstrip()
    if not stripped:
        return content, None
    last = stripped[-1]
    if last in (",", ":", '"', "'"):
        # Try the simplest closure: append a closing quote, then progressively
        # close the structure.
        for suffix in ('"', "}", "}}", "]", "}}]"):
            try:
                candidate = stripped + suffix
                json.loads(candidate)
                return candidate, f"closed truncated JSON with suffix {suffix!r}"
            except json.JSONDecodeError:
                continue
    return content, None


def fix_article_json(path: str) -> Tuple[list, dict]:
    """Read JSON file and apply automatic repairs. Returns (fixes, article)."""
    fixes_applied: list[str] = []
    p = Path(path)
    raw = p.read_text(encoding="utf-8")

    # ------------------------------------------------------------------
    # Fix 1: literal \'  -> ASCII '  (pitfall 42)
    # JSON only accepts \\ \" \/ \b \f \n \r \t \uXXXX. It does NOT accept \' .
    # ------------------------------------------------------------------
    if "\\'" in raw:
        raw = raw.replace("\\'", "'")
        fixes_applied.append("Fix 1: replaced \\' with ASCII ' (pitfall 42)")

    # ------------------------------------------------------------------
    # Fix 2: parse JSON, with truncated-string recovery
    # ------------------------------------------------------------------
    try:
        d = json.loads(raw)
    except json.JSONDecodeError as e:
        repaired, note = _try_close_truncated_json(raw)
        if note is not None:
            try:
                d = json.loads(repaired)
                fixes_applied.append(f"Fix 2: {note} (pitfall 40/43)")
                # Persist repaired raw so subsequent fixes operate on clean text
                raw = repaired
            except json.JSONDecodeError as e2:
                raise SystemExit(
                    f"❌ Cannot repair JSON in {path}: {e2}\n"
                    f"   Original error: {e}"
                )
        else:
            raise SystemExit(
                f"❌ Cannot repair JSON in {path}: {e}\n"
                f"   Tip: open the file and look near line {e.lineno} col {e.colno}."
            )

    # ------------------------------------------------------------------
    # Fix 3: keywords dict -> comma-separated string (pitfall 39)
    # ------------------------------------------------------------------
    kw = d.get("keywords")
    if isinstance(kw, dict):
        en_val = kw.get("en") or next(iter(kw.values()), "")
        if isinstance(en_val, str):
            d["keywords"] = en_val
            fixes_applied.append("Fix 3: converted keywords dict -> string (pitfall 39)")
        elif isinstance(en_val, list):
            d["keywords"] = ", ".join(str(x) for x in en_val)
            fixes_applied.append("Fix 3: converted keywords dict -> string from list (pitfall 39)")

    # ------------------------------------------------------------------
    # Fix 4: author normalization
    #    - dict-of-10-langs (no 'name' key) -> standard dict + authorI18n
    #    - plain string -> standard dict
    # ------------------------------------------------------------------
    author = d.get("author")
    if isinstance(author, str):
        d["author"] = {
            "name": author,
            "title": "Senior Fastener Trade Analyst",
            "company": "TradeGo Fasteners",
            "credentials": "12+ years China-Africa fastener trade",
        }
        fixes_applied.append("Fix 4a: converted author string -> standard dict")
    elif isinstance(author, dict) and "name" not in author and any(lang in author for lang in LANGUAGES):
        # 10-language dict structure
        author_en = author.get("en") or next(iter(author.values()), {})
        if isinstance(author_en, dict):
            d["author"] = author_en
        else:
            d["author"] = {
                "name": str(author_en),
                "title": "Senior Fastener Trade Analyst",
                "company": "TradeGo Fasteners",
                "credentials": "12+ years China-Africa fastener trade",
            }
        d["authorI18n"] = author
        fixes_applied.append("Fix 4b: converted author 10-lang dict -> standard dict + authorI18n backup")

    # ------------------------------------------------------------------
    # Fix 5: dataSource missing or empty -> default 5 URLs
    # ------------------------------------------------------------------
    if not d.get("dataSource"):
        d["dataSource"] = [
            "https://www.iso.org/standard/62085.html",
            "https://www.astm.org/standards/",
            "https://www.sabs.co.za",
            "https://www.trade.gov",
            "https://www.engineersedge.com",
        ]
        fixes_applied.append("Fix 5: added default dataSource (5 URLs)")

    # ------------------------------------------------------------------
    # Fix 6: missing date -> today
    # ------------------------------------------------------------------
    if not d.get("date"):
        d["date"] = datetime.now().strftime("%Y-%m-%d")
        fixes_applied.append(f"Fix 6: set date to {d['date']}")

    # ------------------------------------------------------------------
    # Fix 7: description.en > 160 chars -> trim to 157 + '...'
    # ------------------------------------------------------------------
    desc = d.get("description", {})
    if isinstance(desc, dict):
        en_desc = desc.get("en", "")
        if isinstance(en_desc, str) and len(en_desc) > 160:
            d["description"]["en"] = en_desc[:157] + "..."
            fixes_applied.append(
                f"Fix 7: trimmed en description from {len(en_desc)} -> 160 chars"
            )

    # ------------------------------------------------------------------
    # Fix 8: imageAlt normalization
    #    - string -> 10-language dict
    #    - missing -> empty dict (page can still render with default alt)
    # ------------------------------------------------------------------
    img_alt = d.get("imageAlt")
    if isinstance(img_alt, str):
        d["imageAlt"] = {lang: img_alt for lang in LANGUAGES}
        fixes_applied.append("Fix 8: converted imageAlt string -> 10-lang dict")
    elif img_alt is None:
        d["imageAlt"] = {}
        fixes_applied.append("Fix 8b: initialized empty imageAlt dict")

    # ------------------------------------------------------------------
    # Persist repaired JSON
    # ------------------------------------------------------------------
    p.write_text(
        json.dumps(d, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return fixes_applied, d


def main(argv) -> int:
    if len(argv) < 2:
        print("Usage: seo-article-autofix.py <path-to-article.json>")
        return 1
    path = argv[1]
    if not Path(path).exists():
        print(f"❌ File not found: {path}")
        return 1
    try:
        fixes, article = fix_article_json(path)
    except SystemExit as e:
        print(str(e))
        return 2
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return 3

    if fixes:
        print(f"✅ Repaired {path}")
        for fix in fixes:
            print(f"   - {fix}")
    else:
        print(f"✓ {path} already clean (no fixes needed)")

    # Print quick stats
    sections = article.get("sections", [])
    en_words = sum(
        len(s.get("body", {}).get("en", "").split())
        for s in sections
        if isinstance(s.get("body"), dict)
    )
    hrefs = sum(
        s.get("body", {}).get("en", "").count("href=")
        for s in sections
        if isinstance(s.get("body"), dict)
    )
    print(f"   sections: {len(sections)} | en words: {en_words} | en hrefs: {hrefs}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
