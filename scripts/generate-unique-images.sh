#!/bin/bash
# Generate unique images for articles with duplicate image usage
# Usage: ./generate-unique-images.sh [--dry-run]

SCRIPT="$HOME/.openclaw/workspace/tools/minimax-image-gen.sh"
IMG_DIR="$HOME/workspace/tradego-fasteners-v2/public/images/articles"
ARTICLE_DIR="$HOME/workspace/tradego-fasteners-v2/content/articles"
BACKUP_DIR="$IMG_DIR/backup/$(date +%Y%m%d-%H%M%S)"
DRY_RUN=false

[ "$1" = "--dry-run" ] && DRY_RUN=true

mkdir -p "$BACKUP_DIR"

declare -A ARTICLE_IMAGE_MAP=(
    # 3x africa-construction-1.jpg
    ["bolt-grade-markings-guide"]="Professional close-up of high strength steel hex bolts with stamped grade markings 8.8 and 10.9 on industrial workbench, technical photography, high detail, 1024x1024"
    ["cameroon-fastener-market-complete-guide"]="Douala port Cameroon with shipping containers and cargo cranes at sunset, commercial port infrastructure, professional photography, high detail"
    ["mining-equipment-fasteners-zambia-southafrica"]="Underground mining operation in Africa with heavy equipment and rock drilling machinery, industrial mining photography, professional"
    
    # 3x africa-industrial-1.jpg
    ["hex-bolt-dimensions-chart"]="Technical engineering diagram showing hex bolt dimensions and measurements with labels and scale, clean white background, technical illustration style, high detail"
    ["nuts-bolts-glossary-terminology"]="Assorted hex nuts and bolts in various sizes arranged in rows on white background, industrial catalog photography, various finishes zinc plated and stainless, high detail"
    ["ethiopia-fastener-market-complete-guide"]="Addis Ababa construction site with modern building and steel structure framework, Ethiopia urban development, professional photography, high detail"
    
    # 2x water-fasteners-1.jpg
    ["agrifastener-water-infrastructure"]="Water pipeline and irrigation system in rural Africa with pipe fittings and metal fasteners, agricultural infrastructure, professional photography, high detail"
    
    # 2x africa-logistics-1.jpg
    ["payment-terms-international-fastener-trade"]="International trade documents and shipping bills of lading with calculator and laptop on desk, trade finance documentation, professional photography"
    ["buy-construction-fasteners-wholesale-china"]="Chinese fastener factory warehouse with steel drums and export packaging, manufacturing industrial photography, professional, high detail"
    
    # 2x self-drilling-screws-1.jpg
    ["self-drilling-screws-selection-guide"]="Self-drilling roofing screws with sharp drill tips close-up on metal sheeting, product photography, industrial catalog style, high detail, 1024x1024"
    ["self-drilling-tek-screws-price-list"]="Box of self-drilling TEK screws with product labels and price tags, retail product photography, clean background, high detail"
    
    # 2x hex-nuts.jpg
    ["china-hex-nuts-manufacturer"]="Chinese hex nuts manufacturing factory with automated threading machines and quality inspection station, industrial factory photography, professional"
    ["hex-nuts-selection-guide"]="Various hex nuts in different sizes and finishes zinc plated stainless arranged systematically in rows, product catalog photography, high detail"
    
    # 2x congo-construction.jpg
    ["congo-brazzaville-fastener"]="Modern bridge construction in Central Africa with steel structural connections and cable stays, infrastructure project, professional photography"
    ["republic-of-congo-fastener-supplier"]="Brazzaville Congo commercial district with hardware store facade and building construction, urban Africa development, professional photography"
    
    # 2x fastener-testing-1.jpg
    ["fastener-testing-quality-certification"]="Laboratory tensile testing machine with broken fastener test specimen after testing, quality certification testing equipment, industrial photography"
    ["fastener-quality-inspection-guide"]="Quality control inspector using digital caliper to measure fastener dimensions in factory, precision measurement, professional photography, high detail"
    
    # 2x quality-control.jpg
    ["fastener-quality-control-iso9001"]="ISO 9001 quality management certificate with company seal and audit documentation on desk, quality certification, professional photography"
    ["galvanized-vs-stainless-steel-fasteners"]="Comparison of galvanized and stainless steel hex bolts side by side showing surface finish differences, product photography, high detail, 1024x1024"
    
    # 2x africa-hardware-1.jpg
    ["china-iso-9001-fastener-manufacturer-directory"]="Modern Chinese fastener factory exterior with company logo signage and shipping containers for export, manufacturing facility, professional"
    ["solar-panel-mounting-fasteners"]="Solar panel array installation on rooftop with mounting brackets and steel fasteners, renewable energy equipment, professional photography, high detail"
)

total=${#ARTICLE_IMAGE_MAP[@]}
current=0
success=0
failed=0

echo "=== Generating Unique Images for $total Articles ==="
echo "Dry run: $DRY_RUN"
echo ""

for slug in "${!ARTICLE_IMAGE_MAP[@]}"; do
    ((current++))
    prompt="${ARTICLE_IMAGE_MAP[$slug]}"
    
    # Find article file
    article_file=""
    for f in "$ARTICLE_DIR"/*.json; do
        if [[ $(basename "$f") == "${slug}.json" ]]; then
            article_file="$f"
            break
        fi
    done
    
    if [ -z "$article_file" ]; then
        echo "[$current/$total] ❌ Article file not found for: $slug"
        ((failed++))
        continue
    fi
    
    # Get current image from article
    current_img=$(python3 -c "import json,sys; d=json.load(open('$article_file')); print(d.get('image',''))" 2>/dev/null)
    
    if [ -z "$current_img" ] || [ "$current_img" = "/images/articles/default.jpg" ]; then
        # New unique image name
        new_img_name="${slug}.jpg"
        new_img_path="$IMG_DIR/$new_img_name"
        echo "[$current/$total] 📸 $slug (NEW: $new_img_name)"
    else
        # Replace existing image
        new_img_name=$(basename "$current_img")
        new_img_path="$IMG_DIR/$new_img_name"
        
        # Backup existing
        if [ -f "$new_img_path" ]; then
            cp "$new_img_path" "$BACKUP_DIR/"
        fi
        echo "[$current/$total] 🔄 $slug (REPLACE: $new_img_name)"
    fi
    
    echo "    Prompt: ${prompt:0:70]}..."
    
    if [ "$DRY_RUN" = true ]; then
        echo "    ⏭️ [DRY RUN] Would generate $new_img_path"
        continue
    fi
    
    # Generate image
    if $SCRIPT "$prompt" "$new_img_path" 2>&1; then
        echo "    ✅ Generated: $(ls -lh $new_img_path | awk '{print $5}')"
        
        # Update article JSON
        new_image_url="/images/articles/$(basename $new_img_name)"
        if [[ "$new_img_name" == products/* ]] || [[ "$new_img_name" == scenarios/* ]]; then
            new_image_url="/images/$new_img_name"
        fi
        
        python3 << PYEOF
import json
with open('$article_file', 'r+') as f:
    d = json.load(f)
    d['image'] = '$new_image_url'
    f.seek(0)
    json.dump(d, f, indent=2, ensure_ascii=False)
    f.truncate()
PYEOF
        
        echo "    📝 Updated article image to: $new_image_url"
        ((success++))
    else
        echo "    ❌ Generation failed"
        ((failed++))
    fi
    
    # Rate limit delay
    sleep 3
done

echo ""
echo "=== Results ==="
echo "Total: $total | Success: $success | Failed: $failed"
[ "$DRY_RUN" = false ] && echo "Backup: $BACKUP_DIR"