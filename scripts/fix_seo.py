#!/usr/bin/env python3
"""
SEO Fix Script for TradeGo Articles
- Fix titles to <= 60 chars
- Fix descriptions to <= 160 chars
- Add FAQ to articles missing it
"""

import json
import os
import glob

ARTICLES_DIR = "content/articles"
TITLE_MAX_LEN = 60
DESC_MAX_LEN = 160

def truncate_text(text, max_len, suffix="..."):
    """Truncate text to max_len, adding suffix if truncated"""
    if not text:
        return text
    if len(text) <= max_len:
        return text
    return text[:max_len - len(suffix)].rstrip() + suffix

def get_title_translations(title_dict):
    """Get all title translations"""
    if not title_dict:
        return {}
    return title_dict

def fix_title(title_dict):
    """Fix title for all languages"""
    if not title_dict:
        return {}
    fixed = {}
    for lang, title in title_dict.items():
        fixed[lang] = truncate_text(title, TITLE_MAX_LEN)
    return fixed

def fix_description(desc_dict):
    """Fix description for all languages"""
    if not desc_dict:
        return {}
    fixed = {}
    for lang, desc in desc_dict.items():
        fixed[lang] = truncate_text(desc, DESC_MAX_LEN)
    return fixed

def generate_faq_for_article(article_slug, category):
    """Generate basic FAQ for articles missing it"""
    # Generic fastener industry FAQs
    faq_items = [
        {
            "q": {"en": f"What are {category} and how are they used?"},
            "a": {"en": f"{category} are essential components in construction and manufacturing. Proper selection depends on load requirements, environmental conditions, and material compatibility."}
        },
        {
            "q": {"en": "How do I choose the right fastener for my project?"},
            "a": {"en": "Consider the material being fastened, load requirements, environmental exposure, and applicable standards. Consult with a professional if unsure about specifications."}
        },
        {
            "q": {"en": "What materials are available for these fasteners?"},
            "a": {"en": "Common materials include carbon steel, stainless steel, alloy steel, and specialty alloys. Each offers different strength, corrosion resistance, and cost characteristics."}
        },
        {
            "q": {"en": "Do you offer custom manufacturing?"},
            "a": {"en": "Yes, we offer custom fastener manufacturing to spec. Contact our sales team with your requirements for pricing and lead times."}
        }
    ]
    
    return {
        "id": "faq",
        "heading": {
            "en": "Frequently Asked Questions",
            "zh": "常见问题",
            "es": "Preguntas Frecuentes",
            "ar": "الأسئلة الشائعة",
            "fr": "Questions Fréquemment Posées",
            "pt": "Perguntas Frequentes",
            "ru": "Часто Задаваемые Вопросы",
            "ja": "よくある質問",
            "de": "Häufig Gestellte Fragen",
            "hi": "सामान्य प्रश्न"
        },
        "faqItems": faq_items
    }

def process_article(filepath):
    """Process a single article file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        article = json.load(f)
    
    slug = article.get('slug', os.path.basename(filepath).replace('.json', ''))
    category = article.get('category', 'Fasteners')
    
    changes = []
    
    # Fix titles
    if 'title' in article:
        old_title = article['title'].get('en', '')
        article['title'] = fix_title(article['title'])
        new_title = article['title'].get('en', '')
        if old_title != new_title:
            changes.append(f"TITLE: {len(old_title)}->{len(new_title)} chars")
    
    # Fix descriptions
    if 'description' in article:
        old_desc = article['description'].get('en', '')
        article['description'] = fix_description(article['description'])
        new_desc = article['description'].get('en', '')
        if old_desc != new_desc:
            changes.append(f"DESC: {len(old_desc)}->{len(new_desc)} chars")
    
    # Add FAQ if missing
    has_faq = any(s.get('id') == 'faq' for s in article.get('sections', []))
    if not has_faq:
        faq = generate_faq_for_article(slug, category)
        if 'sections' not in article:
            article['sections'] = []
        article['sections'].append(faq)
        changes.append("FAQ: added")
    
    # Write back if changes made
    if changes:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(article, f, indent=2, ensure_ascii=False)
        return slug, changes
    return None, None

def main():
    os.chdir("/Users/zhangming/workspace/tradego-fasteners-v2")
    
    articles = glob.glob(f"{ARTICLES_DIR}/*.json")
    print(f"Processing {len(articles)} articles...")
    
    results = {
        'fixed': [],
        'no_change': []
    }
    
    for filepath in sorted(articles):
        slug, changes = process_article(filepath)
        if changes:
            results['fixed'].append((slug, changes))
            print(f"✓ {slug}: {', '.join(changes)}")
        else:
            results['no_change'].append(os.path.basename(filepath))
    
    print(f"\n=== Summary ===")
    print(f"Fixed: {len(results['fixed'])} articles")
    print(f"No change needed: {len(results['no_change'])} articles")
    
    # Show details of changes
    print(f"\n=== Fixed Articles ===")
    for slug, changes in results['fixed']:
        print(f"  {slug}: {', '.join(changes)}")

if __name__ == "__main__":
    main()
