#!/usr/bin/env python3
"""Regenerate i18n inventory - count empty/placeholder sections per lang.
Based on i18n-fix-missing.sh detection logic.

Detection fix (7/28 19:33): use word-boundary regex instead of substring.
  - Old: any(p in v.lower() for p in ["coming soon", "todo", "placeholder", "tbd"])
  - New: re.search(r"\b(coming soon|placeholder|tbd)\b", v, re.I)
  - Reason: Spanish/Portuguese "todo" = "everything" (e.g. "Aprenda todo sobre..."),
    substring match flagged real translations as placeholder. Dropped "todo" pattern.
  - Also: track real sec_idx (was hardcoded 0), lower placeholder length threshold to 50.
"""
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime

ARTICLES_DIR = os.path.expanduser("~/workspace/tradego-fasteners-v2/content/articles")
LANGS = ["en", "es", "fr", "pt", "ru", "de", "hi", "ar", "ja"]

# Word-boundary regex: matches "coming soon", "placeholder", "tbd" as whole words.
# "todo" is intentionally NOT here — Spanish/Portuguese "todo" = "everything" is a normal word.
# Use a precompiled regex for speed (called per section per lang per article = 1000+ times).
_PLACEHOLDER_RE = re.compile(r"\b(coming soon|placeholder|tbd)\b", re.IGNORECASE)
EMPTY_THRESHOLD = 50  # chars; below = empty/short


def scan_article(fp):
    """Return list of (slug, lang, sec_idx, issue_type) for problematic entries.
    sec_idx is -1 for description, 0+ for sections[i].
    """
    slug = os.path.basename(fp).replace(".json", "")
    out = []
    try:
        with open(fp) as f:
            d = json.load(f)
    except Exception:
        return out

    sections = d.get("sections", [])
    for sec_idx, s in enumerate(sections):
        for lang in LANGS:
            v = s.get("body", {}).get(lang, "")
            if not v or len(v) < EMPTY_THRESHOLD:
                out.append((slug, lang, sec_idx, "empty"))
            elif _PLACEHOLDER_RE.search(v):
                out.append((slug, lang, sec_idx, "placeholder"))

    desc = d.get("description", {})
    if isinstance(desc, dict):
        for lang in LANGS:
            v = desc.get(lang, "")
            if not v:
                out.append((slug, lang, -1, "empty"))
            elif _PLACEHOLDER_RE.search(v):
                out.append((slug, lang, -1, "placeholder"))

    return out


def main():
    empty = []
    placeholder = []
    total = 0
    for fname in os.listdir(ARTICLES_DIR):
        if not fname.endswith(".json"):
            continue
        total += 1
        results = scan_article(os.path.join(ARTICLES_DIR, fname))
        for slug, lang, sec_idx, kind in results:
            if kind == "empty":
                empty.append([slug, lang, sec_idx])
            else:
                placeholder.append([slug, lang, sec_idx])

    ts = datetime.now().strftime("%Y-%m-%d-%H%M%S")
    out = {
        "placeholder": placeholder,
        "empty": empty,
        "total_checked": total,
        "ts": ts,
        "source": "regen-inventory.py",
        "detection": "word-boundary regex (7/28 19:33 fix)",
    }

    out_path = f"logs/i18n-translate/inventory-{ts.replace('-', '')}.json"
    os.makedirs("logs/i18n-translate", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"Wrote {out_path}")
    print(f"Empty: {len(empty)} (by lang: {dict(Counter(x[1] for x in empty))})")
    print(f"Placeholder: {len(placeholder)} (by lang: {dict(Counter(x[1] for x in placeholder))})")
    print(f"Total: {total}")
    print(f"SUM: {len(empty) + len(placeholder)}")


if __name__ == "__main__":
    main()
