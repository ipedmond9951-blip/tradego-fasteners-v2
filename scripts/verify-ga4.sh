#!/bin/bash
# GA4数据验证脚本
# 测试TradeGo站的GA4 Measurement Protocol是否正常工作

MEASUREMENT_ID="G-6RE8PBNLC6"
CLIENT_ID="test.client.$(date +%s).verify"
TIMESTAMP=$(date +%s)

echo "=== GA4验证测试 ==="
echo "Measurement ID: $MEASUREMENT_ID"
echo "时间: $(date)"

# 1. 发送测试page_view事件
echo ""
echo ">>> 1. 发送page_view测试..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST "https://www.google-analytics.com/g/collect?v=1&tid=${MEASUREMENT_ID}&cid=${CLIENT_ID}&en=page_view&dp=%2Ftest-verify-page&dt=Test+Verification+Page&dl=http%3A%2F%2Ftest.tradego-fasteners.com%2Ftest-verify-page&ua=OpenClaw-Verification-Agent%2F1.0" \
  -H "User-Agent: OpenClaw-Verification-Agent/1.0")

echo "响应: $RESPONSE"

# 2. 发送测试custom事件
echo ""
echo ">>> 2. 发送custom测试事件..."
RESPONSE2=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST "https://www.google-analytics.com/g/collect?v=1&tid=${MEASUREMENT_ID}&cid=${CLIENT_ID}&en=test_verification_event&ep.event_category=test&ep.event_label=verification_script&ua=OpenClaw-Verification-Agent%2F1.0" \
  -H "User-Agent: OpenClaw-Verification-Agent/1.0")

echo "响应: $RESPONSE2"

echo ""
echo "=== 结果 ==="
if echo "$RESPONSE" | grep -q "HTTP_CODE:204"; then
  echo "✅ GA4 collect端点正常 - 数据已接受"
else
  echo "❌ GA4端点异常"
fi

echo ""
echo "请在GA4后台验证:"
echo "1. 打开 https://analytics.google.com"
echo "2. 进入 报告 → 实时(Realtime)"
echo "3. 确认能看到 'test-verify-page' 页面"
echo "4. 或在 探索 → 随便看看 中查看"
