#!/bin/bash
# 自动更新文章的imageAlt字段
# 基于文章标题和图片路径生成合适的alt text

set -e

ARTICLES_DIR="/Users/zhangming/workspace/tradego-fasteners-v2/content/articles"

echo "开始更新文章imageAlt字段..."

updated=0
failed=0

for json_file in "$ARTICLES_DIR"/*.json; do
    # 获取当前值
    current_alt=$(jq -r '.imageAlt // "null"' "$json_file" 2>/dev/null)
    
    # 只有当imageAlt为null时才更新
    if [ "$current_alt" = "null" ]; then
        # 获取文章标题（英文）
        title=$(jq -r '.title.en // ""' "$json_file" 2>/dev/null)
        
        # 获取图片路径
        image=$(jq -r '.image // ""' "$json_file" 2>/dev/null)
        
        # 生成alt text
        alt=""
        
        case "$image" in
            */africa-1.jpg)
                alt="African industrial and construction sector fastener supply chain"
                ;;
            */africa-mining-1.jpg)
                alt="Mining industry fastener solutions in Africa"
                ;;
            */africa-construction-1.jpg)
                alt="Construction industry fasteners for African building projects"
                ;;
            */africa-industrial-1.jpg)
                alt="Industrial fastener manufacturing and supply in Africa"
                ;;
            */africa-logistics-1.jpg)
                alt="Fastener logistics and distribution in Africa"
                ;;
            */africa-market-1.jpg)
                alt="African fastener market overview and trade opportunities"
                ;;
            */africa-city-1.jpg)
                alt="Urban development and infrastructure fasteners in Africa"
                ;;
            */africa-infrastructure-1.jpg)
                alt="Infrastructure construction fasteners for African projects"
                ;;
            */africa-steel-1.jpg)
                alt="Steel and industrial fasteners for African manufacturing"
                ;;
            */africa-building-1.jpg)
                alt="Building construction fasteners for African projects"
                ;;
            */africa-road-1.jpg)
                alt="Road construction fasteners for African infrastructure"
                ;;
            */africa-bridge-1.jpg)
                alt="Bridge construction fasteners for African infrastructure"
                ;;
            */africa-harbor-1.jpg|*/africa-port-1.jpg)
                alt="Port and harbor construction fasteners in Africa"
                ;;
            */africa-factory-1.jpg)
                alt="Manufacturing factory fasteners for African industry"
                ;;
            */africa-hardware-1.jpg)
                alt="Hardware fasteners for African construction industry"
                ;;
            */mining-conveyor-1.jpg)
                alt="Mining conveyor system fasteners for African operations"
                ;;
            */southern-africa-1.jpg)
                alt="Southern Africa fastener distribution and supply"
                ;;
            */east-africa-1.jpg)
                alt="East Africa fastener market and construction industry"
                ;;
            */west-africa-1.jpg)
                alt="West Africa fastener market and industrial growth"
                ;;
            */anchor-bolts*)
                alt="Anchor bolts for foundation and structural applications"
                ;;
            */bolt-types*)
                alt="Various bolt types and applications for construction"
                ;;
            */washer-types*)
                alt="Washer types and applications for industrial use"
                ;;
            */coach-screws*)
                alt="Coach screws for construction and woodworking applications"
                ;;
            */drywall-screws*)
                alt="Drywall screws for construction and building applications"
                ;;
            */self-drilling*)
                alt="Self-drilling screws for efficient construction fastening"
                ;;
            */hex-bolts*)
                alt="Hex bolts for industrial and construction applications"
                ;;
            */nuts*)
                alt="Nuts for industrial and construction fastening"
                ;;
            */washers*)
                alt="Washers for proper load distribution in fastening"
                ;;
            */ibr-nails*)
                alt="IBR nails for roofing and construction applications"
                ;;
            */threaded-rods*)
                alt="Threaded rods for structural and industrial applications"
                ;;
            *)
                # 通用描述，基于标题生成
                if [ -n "$title" ]; then
                    # 提取标题中的关键词
                    alt=$(echo "$title" | sed 's/:/ /g' | sed 's/,/ /g' | cut -d' ' -f1-6 | xargs)
                    alt="${alt} - fastener solutions"
                else
                    alt="Industrial fasteners for construction and manufacturing"
                fi
                ;;
        esac
        
        # 如果alt太长，截断
        alt=$(echo "$alt" | cut -c1-125)
        
        # 更新JSON
        if [ -n "$alt" ]; then
            # 使用jq更新imageAlt，保留其他字段
            temp=$(mktemp)
            if jq --arg alt "$alt" '.imageAlt = $alt' "$json_file" > "$temp"; then
                mv "$temp" "$json_file"
                updated=$((updated + 1))
            else
                rm -f "$temp"
                failed=$((failed + 1))
                echo "❌ 更新失败: $json_file"
            fi
        else
            failed=$((failed + 1))
        fi
    fi
done

echo ""
echo "=== 完成 ==="
echo "✅ 成功更新: $updated"
echo "❌ 失败: $failed"
echo "📝 总文章数: $(ls "$ARTICLES_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')"
