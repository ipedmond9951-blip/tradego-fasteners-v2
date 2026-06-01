#!/bin/bash
# ============================================
# skill-router-lint.sh
# 
# Lint all skills to ensure they have Keywords section
# for auto-skill-router discovery
#
# 用法: bash scripts/skill-router-lint.sh [--fix] [--report] [--verbose]
#   --fix      自动添加缺失的 Keywords (使用 Python 映射)
#   --report   生成报告到 logs/
#   --verbose  显示每个技能状态
# ============================================

set -e

SKILL_DIR="$HOME/.agents/skills"
FIX=false
REPORT=""
VERBOSE=false

for arg in "$@"; do
    case $arg in
        --fix) FIX=true ;;
        --report) REPORT="logs/skill-lint-$(date '+%Y%m%d').txt" ;;
        --verbose) VERBOSE=true ;;
    esac
done

if [ -n "$REPORT" ]; then
    mkdir -p "$(dirname "$REPORT")"
    exec > >(tee "$REPORT") 2>&1
fi

echo "🔍 Skill Router Lint - Scanning all skills for Keywords section..."
echo "   Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

MISSING=()
TOTAL=0
FOUND=0

for skill_dir in "$SKILL_DIR"/*/ "$SKILL_DIR"/open-claw/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$(dirname "$skill_dir")")/$(basename "$skill_dir")
    skill_name=$(echo "$skill_name" | sed 's|/$||; s|^\./||; s|^/||')
    
    skill_md="$skill_dir/SKILL.md"
    [ -f "$skill_md" ] || continue
    
    TOTAL=$((TOTAL + 1))
    
    if grep -q "^## Keywords" "$skill_md"; then
        FOUND=$((FOUND + 1))
        if [ "$VERBOSE" = true ]; then
            keywords=$(grep -A 1 "^## Keywords" "$skill_md" | tail -1 | cut -c1-80)
            echo "  ✅ $skill_name: $keywords"
        fi
    else
        MISSING+=("$skill_name")
        echo "  ❌ MISSING: $skill_name"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════"
echo "📊 Result: $FOUND/$TOTAL skills have Keywords"
echo "═══════════════════════════════════════════════════"

if [ ${#MISSING[@]} -gt 0 ]; then
    echo ""
    echo "❌ ${#MISSING[@]} skills will NOT be discovered by auto-skill-router:"
    for s in "${MISSING[@]}"; do
        echo "   • $s"
    done
    echo ""
    echo "🔧 To fix:"
    echo "   1. Add '## Keywords' section to each SKILL.md"
    echo "   2. Or run: bash scripts/skill-router-lint.sh --fix"
    echo ""
    
    if [ "$FIX" = true ]; then
        echo "🤖 Auto-fix starting..."
        python3 << 'PYEOF'
import os
import re

KEYWORDS_MAP = {}  # Add mappings as needed
# Auto-extract keywords from name + description as fallback
SKILL_DIR = os.path.expanduser("~/.agents/skills")
import glob

fixed = 0
for skill_dir in sorted(glob.glob(os.path.join(SKILL_DIR, "*/"))) + \
               sorted(glob.glob(os.path.join(SKILL_DIR, "open-claw/*/"))):
    skill_md = os.path.join(skill_dir, "SKILL.md")
    if not os.path.isfile(skill_md):
        continue
    
    with open(skill_md) as f:
        content = f.read()
    
    if re.search(r'^## Keywords', content, re.MULTILINE):
        continue  # Already has
    
    # Extract name + description as fallback keywords
    name_match = re.search(r'^name:\s*(.+)$', content, re.MULTILINE)
    desc_match = re.search(r'^description:\s*(.+?)(?=\n[a-z_-]+:|\Z)', content, re.MULTILINE | re.DOTALL)
    
    if name_match and desc_match:
        keywords = f"{name_match.group(1).strip()}, {desc_match.group(1).strip()[:200]}"
    elif name_match:
        keywords = name_match.group(1).strip()
    else:
        keywords = "skill"
    
    # Insert after frontmatter
    if content.startswith('---'):
        match = re.search(r'^---\s*\n', content[3:], re.MULTILINE)
        if match:
            insert_pos = 3 + match.end()
            new_section = f"\n## Keywords\n{keywords}\n\n"
            content = content[:insert_pos] + new_section + content[insert_pos:]
            
            with open(skill_md, 'w') as f:
                f.write(content)
            fixed += 1
            print(f"  ✅ Auto-fixed: {os.path.basename(os.path.normpath(skill_dir))}")
        else:
            print(f"  ❌ Can't parse frontmatter: {os.path.basename(os.path.normpath(skill_dir))}")

print(f"\n🤖 Auto-fixed: {fixed}")
PYEOF
    fi
    exit 1
else
    echo "🎉 All skills discoverable!"
    exit 0
fi
