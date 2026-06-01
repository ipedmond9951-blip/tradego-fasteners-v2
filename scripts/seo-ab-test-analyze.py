#!/usr/bin/env python3
"""
seo-ab-test-analyze.py - Analyze A/B test results
Reads GA4 data for image variants, declares winner
"""
import json
import sys
import os
from pathlib import Path
from datetime import datetime, timedelta

PROJECT = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
TRACKING = PROJECT / "data" / "ab-tests"


def get_ga4_data(slug: str) -> dict:
    """Fetch GA4 data for A/B test variants."""
    # This would integrate with GA4 API
    # For now, return mock data structure
    token_file = Path.home() / "Projects/tradebrain-v2/server/config/google-oauth-tokens.json"
    if not token_file.exists():
        return {"error": "no token"}
    
    try:
        tokens = json.load(open(token_file))
        if tokens.get("expiry_date", 0) < datetime.now().timestamp() * 1000:
            return {"error": "token expired"}
    except:
        return {"error": "token read fail"}
    
    # TODO: Real GA4 query
    return {
        "A": {"pageviews": 0, "clicks": 0},
        "B": {"pageviews": 0, "clicks": 0}
    }


def analyze(slug: str, auto_set_winner: bool = False) -> bool:
    track_file = TRACKING / f"{slug}.json"
    if not track_file.exists():
        print(f"❌ No A/B test for: {slug}")
        return False
    
    data = json.load(open(track_file))
    print(f"\n📊 A/B Test Analysis: {slug}")
    print(f"   Title: {data['title']}")
    print(f"   Created: {data['created_at']}")
    print()
    
    # Get fresh GA4 data
    ga4 = get_ga4_data(slug)
    if "error" in ga4:
        print(f"⚠️  GA4 unavailable ({ga4['error']}), using recorded data")
    else:
        # Update tracking
        for variant, metrics in ga4.items():
            data["variants"][variant]["views"] = metrics.get("pageviews", 0)
            data["variants"][variant]["clicks"] = metrics.get("clicks", 0)
            views = data["variants"][variant]["views"]
            clicks = data["variants"][variant]["clicks"]
            data["variants"][variant]["ctr"] = (clicks / views * 100) if views else 0
    
    # Print comparison
    print(f"   Variant A ({data['variants']['A']['style']}):")
    print(f"      Views: {data['variants']['A']['views']}")
    print(f"      Clicks: {data['variants']['A']['clicks']}")
    print(f"      CTR: {data['variants']['A']['ctr']:.2f}%")
    print()
    print(f"   Variant B ({data['variants']['B']['style']}):")
    print(f"      Views: {data['variants']['B']['views']}")
    print(f"      Clicks: {data['variants']['B']['clicks']}")
    print(f"      CTR: {data['variants']['B']['ctr']:.2f}%")
    print()
    
    # Determine winner
    a_ctr = data['variants']['A']['ctr']
    b_ctr = data['variants']['B']['ctr']
    
    if data['variants']['A']['views'] < 100 or data['variants']['B']['views'] < 100:
        print("⏳  Not enough data yet (need 100+ views per variant)")
        return False
    
    if a_ctr > b_ctr * 1.1:  # A wins by 10%+
        winner = "A"
        print(f"🏆 Winner: A (CTR {a_ctr:.2f}% vs B {b_ctr:.2f}%)")
    elif b_ctr > a_ctr * 1.1:
        winner = "B"
        print(f"🏆 Winner: B (CTR {b_ctr:.2f}% vs A {a_ctr:.2f}%)")
    else:
        winner = None
        print(f"🤝 No clear winner (within 10%)")
    
    if winner and auto_set_winner:
        data["winner"] = winner
        data["status"] = "completed"
        # Update article
        article = PROJECT / "content" / "articles" / f"{slug}.json"
        if article.exists():
            a = json.load(open(article))
            winner_path = data["variants"][winner]["path"]
            a["image"] = winner_path
            a["imageTestWinner"] = winner
            a["imageTestDate"] = datetime.now().isoformat()
            with open(article, 'w') as f:
                json.dump(a, f, indent=2, ensure_ascii=False)
            print(f"✅ Article updated with winner image: {winner_path}")
    
    # Save tracking
    with open(track_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    return winner is not None


if __name__ == "__main__":
    slug = sys.argv[1] if len(sys.argv) > 1 else None
    auto = "--auto" in sys.argv
    
    if not slug:
        # Analyze all
        if not TRACKING.exists():
            print("No A/B tests yet")
            sys.exit(0)
        
        for f in TRACKING.glob("*.json"):
            analyze(f.stem, auto_set_winner=auto)
    else:
        analyze(slug, auto_set_winner=auto)
