"""
Fix broken nested <a> tags in article descriptions.
A previous SEO auto-update script kept wrapping the word "fasteners" in <a> tags,
creating deeply nested invalid HTML like:
  <a href="/products"...><a href="/products"...><a href="/products"...>fasteners</a></a></a>...

This script:
1. Finds articles where description has nested <a> tags
2. Cleans the description: removes all <a> tags, keeps text, then re-adds ONE clean link
3. Saves backup before changes
"""
import json
import re
import shutil
from pathlib import Path
from datetime import datetime

ARTICLES_DIR = Path('/Users/zhangming/workspace/tradego-fasteners-v2/content/articles')
BACKUP_DIR = Path(f'/Users/zhangming/workspace/tradego-fasteners-v2/content/articles/backup/nested-a-fix-{datetime.now().strftime("%Y%m%d-%H%M%S")}')

def clean_nested_a(text):
    """Remove ALL <a> tags from text, keep only inner text. Then re-link 'fasteners' once."""
    if not isinstance(text, str):
        return text
    if '<a href' not in text:
        return text
    # Strip ALL <a ...> opening tags
    cleaned = re.sub(r'<a\s+[^>]*>', '', text)
    # Strip ALL </a> closing tags
    cleaned = re.sub(r'</a>', '', cleaned)
    # Also strip orphaned /a> fragments
    cleaned = re.sub(r'/a>', '', cleaned)
    # Collapse extra spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    # Re-link 'fasteners' ONCE (first occurrence) with clean link
    link = '<a href="/products" class="text-primary-600 hover:text-primary-800 underline">fasteners</a>'
    # Use word boundary, case insensitive, replace only first match (count=1)
    cleaned = re.sub(r'\bfasteners\b', link, cleaned, count=1, flags=re.IGNORECASE)
    return cleaned

def main():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    fixed_count = 0
    fixed_files = []
    
    for f in sorted(ARTICLES_DIR.glob('*.json')):
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
        except Exception as e:
            print(f"SKIP {f.name}: {e}")
            continue
        
        changed = False
        desc = data.get('description')
        
        if isinstance(desc, dict):
            for lang, txt in list(desc.items()):
                if isinstance(txt, str) and txt.count('<a href') > 1:
                    new_txt = clean_nested_a(txt)
                    if new_txt != txt:
                        desc[lang] = new_txt
                        changed = True
        elif isinstance(desc, str) and desc.count('<a href') > 1:
            data['description'] = clean_nested_a(desc)
            changed = True
        
        # Also check metaDescription
        meta = data.get('metaDescription')
        if isinstance(meta, dict):
            for lang, txt in list(meta.items()):
                if isinstance(txt, str) and txt.count('<a href') > 1:
                    new_txt = clean_nested_a(txt)
                    if new_txt != txt:
                        meta[lang] = new_txt
                        changed = True
        elif isinstance(meta, str) and meta.count('<a href') > 1:
            data['metaDescription'] = clean_nested_a(meta)
            changed = True
        
        if changed:
            # Backup original
            shutil.copy2(f, BACKUP_DIR / f.name)
            # Write cleaned
            with open(f, 'w', encoding='utf-8') as fp:
                json.dump(data, fp, ensure_ascii=False, indent=2)
            fixed_count += 1
            fixed_files.append(f.name)
            print(f"FIXED: {f.name}")
    
    print(f"\n--- Summary ---")
    print(f"Fixed {fixed_count} articles")
    print(f"Backup: {BACKUP_DIR}")
    return fixed_files

if __name__ == '__main__':
    main()
