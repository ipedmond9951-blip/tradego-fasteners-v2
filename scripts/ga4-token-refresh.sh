#!/bin/bash
# ============================================
# ga4-token-refresh.sh
# 
# Auto-refresh GA4 OAuth access_token using refresh_token
# Updates google-oauth-tokens.json with fresh access_token
# 
# 用法: bash scripts/ga4-token-refresh.sh [--check-only]
# ============================================

set -e

TOKEN_FILE="$HOME/Projects/tradebrain-v2/server/config/google-oauth-tokens.json"
CLIENT_ID_FILE="$HOME/Projects/tradebrain-v2/server/config/google-oauth-client.json"
TOKEN_URL="https://oauth2.googleapis.com/token"

CHECK_ONLY=false
for arg in "$@"; do
    case $arg in
        --check-only) CHECK_ONLY=true ;;
    esac
done

if [ ! -f "$TOKEN_FILE" ]; then
    echo "❌ Token file not found: $TOKEN_FILE"
    exit 1
fi

# Get current expiry
EXPIRY=$(python3 -c "import json; print(json.load(open('$TOKEN_FILE'))['expiry_date'])" 2>/dev/null)
NOW=$(python3 -c "import time; print(int(time.time() * 1000))")

EXPIRES_IN_MIN=$(( (EXPIRY - NOW) / 60000 ))

if [ "$CHECK_ONLY" = true ]; then
    if [ "$EXPIRES_IN_MIN" -gt 30 ]; then
        echo "✅ Token valid for $EXPIRES_IN_MIN minutes"
        exit 0
    else
        echo "⚠️  Token expires in $EXPIRES_IN_MIN minutes (need refresh)"
        exit 1
    fi
fi

# Need refresh if expires in < 30 min
if [ "$EXPIRES_IN_MIN" -gt 30 ]; then
    echo "✅ Token still valid ($EXPIRES_IN_MIN min), no refresh needed"
    exit 0
fi

echo "🔄 Refreshing GA4 OAuth token..."

# Get credentials
if [ ! -f "$CLIENT_ID_FILE" ]; then
    echo "❌ Client config not found: $CLIENT_ID_FILE"
    echo "   Please save OAuth client_id + client_secret to: $CLIENT_ID_FILE"
    echo "   Format: {\"client_id\":\"...\",\"client_secret\":\"...\"}"
    exit 1
fi

# Get refresh_token + client credentials
REFRESH_TOKEN=$(python3 -c "import json; print(json.load(open('$TOKEN_FILE')).get('refresh_token', ''))")
CLIENT_ID=$(python3 -c "import json; print(json.load(open('$CLIENT_ID_FILE')).get('client_id', ''))")
CLIENT_SECRET=$(python3 -c "import json; print(json.load(open('$CLIENT_ID_FILE')).get('client_secret', ''))")

if [ -z "$REFRESH_TOKEN" ] || [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Missing refresh_token, client_id, or client_secret"
    exit 1
fi

# Refresh
RESPONSE=$(curl -s -X POST "$TOKEN_URL" \
    -d "client_id=$CLIENT_ID" \
    -d "client_secret=$CLIENT_SECRET" \
    -d "refresh_token=$REFRESH_TOKEN" \
    -d "grant_type=refresh_token")

# Parse and save
python3 << PYEOF
import json
from pathlib import Path

TOKEN_FILE = Path("$TOKEN_FILE")
response = json.loads('''$RESPONSE''')

if 'access_token' not in response:
    print(f"❌ Refresh failed: {response}")
    exit(1)

# Load existing tokens
tokens = json.load(open(TOKEN_FILE))

# Update
tokens['access_token'] = response['access_token']
tokens['expiry_date'] = int((json.loads('''$NOW''')) if False else __import__('time').time() * 1000) + response.get('expires_in', 3600) * 1000

# Save
with open(TOKEN_FILE, 'w') as f:
    json.dump(tokens, f, indent=2)

print(f"✅ Token refreshed, valid for {response.get('expires_in', 3600)}s")
PYEOF
