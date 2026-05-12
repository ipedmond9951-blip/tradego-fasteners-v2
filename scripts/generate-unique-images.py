#!/usr/bin/env python3
"""Generate unique images for articles with duplicate image usage."""

import subprocess
import json
import os
import time
from pathlib import Path

SCRIPT = os.path.expanduser("~/.openclaw/workspace/tools/minimax-image-gen.sh")
IMG_DIR = os.path.expanduser("~/workspace/tradego-fasteners-v2/public/images/articles")
ARTICLE_DIR = os.path.expanduser("~/workspace/tradego-fasteners-v2/content/articles")
BACKUP_DIR = os.path.join(IMG_DIR, "backup", time.strftime("%Y%m%d-%H%M%S"))
DRY_RUN = False  # Set to False to actually generate

ARTICLE_IMAGE_MAP = {
    # 3x africa-construction-1.jpg
    "bolt-grade-markings-guide": "Professional close-up of high strength steel hex bolts with stamped grade markings 8.8 and 10.9 on industrial workbench, technical photography, high detail, 1024x1024",
    "cameroon-fastener-market-complete-guide": "Douala port Cameroon with shipping containers and cargo cranes at sunset, commercial port infrastructure, professional photography, high detail",
    "mining-equipment-fasteners-zambia-southafrica": "Underground mining operation in Africa with heavy equipment and rock drilling machinery, industrial mining photography, professional",
    
    # 3x africa-industrial-1.jpg
    "hex-bolt-dimensions-chart": "Technical engineering diagram showing hex bolt dimensions and measurements with labels and scale, clean white background, technical illustration style, high detail",
    "nuts-bolts-glossary-terminology": "Assorted hex nuts and bolts in various sizes arranged in rows on white background, industrial catalog photography, various finishes zinc plated and stainless, high detail",
    "ethiopia-fastener-market-complete-guide": "Addis Ababa construction site with modern building and steel structure framework, Ethiopia urban development, professional photography, high detail",
    
    # 2x water-fasteners-1.jpg
    "agrifastener-water-infrastructure": "Water pipeline and irrigation system in rural Africa with pipe fittings and metal fasteners, agricultural infrastructure, professional photography, high detail",
    
    # 2x africa-logistics-1.jpg
    "payment-terms-international-fastener-trade": "International trade documents and shipping bills of lading with calculator and laptop on desk, trade finance documentation, professional photography",
    "buy-construction-fasteners-wholesale-china": "Chinese fastener factory warehouse with steel drums and export packaging, manufacturing industrial photography, professional, high detail",
    
    # 2x self-drilling-screws-1.jpg
    "self-drilling-screws-selection-guide": "Self-drilling roofing screws with sharp drill tips close-up on metal sheeting, product photography, industrial catalog style, high detail, 1024x1024",
    "self-drilling-tek-screws-price-list": "Box of self-drilling TEK screws with product labels and price tags, retail product photography, clean background, high detail",
    
    # 2x hex-nuts.jpg
    "china-hex-nuts-manufacturer": "Chinese hex nuts manufacturing factory with automated threading machines and quality inspection station, industrial factory photography, professional",
    "hex-nuts-selection-guide": "Various hex nuts in different sizes and finishes zinc plated stainless arranged systematically in rows, product catalog photography, high detail",
    
    # 2x congo-construction.jpg
    "congo-brazzaville-fastener": "Modern bridge construction in Central Africa with steel structural connections and cable stays, infrastructure project, professional photography",
    "republic-of-congo-fastener-supplier": "Brazzaville Congo commercial district with hardware store facade and building construction, urban Africa development, professional photography",
    
    # 2x fastener-testing-1.jpg
    "fastener-testing-quality-certification": "Laboratory tensile testing machine with broken fastener test specimen after testing, quality certification testing equipment, industrial photography",
    "fastener-quality-inspection-guide": "Quality control inspector using digital caliper to measure fastener dimensions in factory, precision measurement, professional photography, high detail",
    
    # 2x quality-control.jpg
    "fastener-quality-control-iso9001": "ISO 9001 quality management certificate with company seal and audit documentation on desk, quality certification, professional photography",
    "galvanized-vs-stainless-steel-fasteners": "Comparison of galvanized and stainless steel hex bolts side by side showing surface finish differences, product photography, high detail, 1024x1024",
    
    # 2x africa-hardware-1.jpg
    "china-iso-9001-fastener-manufacturer-directory": "Modern Chinese fastener factory exterior with company logo signage and shipping containers for export, manufacturing facility, professional",
    "solar-panel-mounting-fasteners": "Solar panel array installation on rooftop with mounting brackets and steel fasteners, renewable energy equipment, professional photography, high detail",
}

def generate_image(prompt, output_path):
    """Call MiniMax script to generate image."""
    result = subprocess.run(
        [SCRIPT, prompt, output_path],
        capture_output=True, text=True
    )
    return result.returncode == 0, result.stdout, result.stderr

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    total = len(ARTICLE_IMAGE_MAP)
    current = 0
    success = 0
    failed = 0
    
    print(f"=== Generating Unique Images for {total} Articles ===")
    print(f"Dry run: {DRY_RUN}")
    print()
    
    for slug, prompt in ARTICLE_IMAGE_MAP.items():
        current += 1
        
        article_file = Path(ARTICLE_DIR) / f"{slug}.json"
        if not article_file.exists():
            print(f"[{current}/{total}] ❌ Article file not found: {slug}")
            failed += 1
            continue
        
        # Get current image
        with open(article_file) as f:
            article_data = json.load(f)
        
        current_img = article_data.get('image', '')
        
        # Determine new image path
        if not current_img or current_img == '/images/articles/default.jpg':
            new_img_name = f"{slug}.jpg"
        else:
            new_img_name = os.path.basename(current_img)
        
        new_img_path = os.path.join(IMG_DIR, new_img_name)
        new_image_url = f"/images/articles/{new_img_name}"
        
        if current_img and current_img != '/images/articles/default.jpg':
            # Backup existing
            if os.path.exists(new_img_path):
                subprocess.run(['cp', new_img_path, BACKUP_DIR])
        
        print(f"[{current}/{total}] {'📸' if not current_img or current_img == '/images/articles/default.jpg' else '🔄'} {slug}")
        print(f"    Image: {new_img_name}")
        print(f"    Prompt: {prompt[:70]}...")
        
        if DRY_RUN:
            print(f"    ⏭️ [DRY RUN] Would generate: {new_img_path}")
            continue
        
        ok, stdout, stderr = generate_image(prompt, new_img_path)
        
        if ok:
            size_kb = os.path.getsize(new_img_path) // 1024
            print(f"    ✅ Generated: {size_kb}KB")
            
            # Update article
            article_data['image'] = new_image_url
            with open(article_file, 'w') as f:
                json.dump(article_data, f, indent=2, ensure_ascii=False)
            print(f"    📝 Updated: {new_image_url}")
            success += 1
        else:
            print(f"    ❌ Failed: {stderr[:100]}")
            failed += 1
        
        time.sleep(3)  # Rate limit
    
    print()
    print(f"=== Results ===")
    print(f"Total: {total} | Success: {success} | Failed: {failed}")
    if not DRY_RUN:
        print(f"Backup: {BACKUP_DIR}")

if __name__ == '__main__':
    main()