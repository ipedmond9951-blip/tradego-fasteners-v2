#!/bin/bash
# 部署窗口闸门：只在固定窗口内允许真构建，其余时间把提交攒在本地。
# 理由：日均真实构建 ≤3、构建额度是稀缺资源；内容/脚本改动随时产生，但没必要随时上线。
# 窗口按 Asia/Shanghai 判定（机器本地时区是 PST，不能用 date 直接比）。
#   DEPLOY_WINDOWS="09:00-11:00,17:00-19:00"  # 默认
#   DEPLOY_WINDOW_FORCE=1                     # 紧急上线，跳过窗口判断
[ "${DEPLOY_WINDOW_FORCE:-0}" = "1" ] && exit 0
now=$(TZ=Asia/Shanghai date +%H%M)
for w in $(echo "${DEPLOY_WINDOWS:-09:00-11:00,17:00-19:00}" | tr ',' ' '); do
  s=${w%-*}; e=${w#*-}
  s=${s/:/}; e=${e/:/}
  if [ "$now" -ge "$s" ] && [ "$now" -le "$e" ]; then
    exit 0
  fi
done
echo "⏸ 当前不在部署窗口（$(TZ=Asia/Shanghai date '+%F %H:%M' ) CST；窗口 ${DEPLOY_WINDOWS:-09:00-11:00,17:00-19:00}）"
echo "   提交已保留在本地，到窗口自动推；紧急上线：DEPLOY_WINDOW_FORCE=1 bash scripts/deploy-flush.sh"
exit 1
