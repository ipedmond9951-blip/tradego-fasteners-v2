#!/bin/bash
# _deny-direct-deploy.sh - 直推部署拦截器 (2026-11-25)
# 依据 docs/VERCEL-OPS.md 第 4 节：唯一的线上入口是 scripts/deploy-flush.sh。
# 任何脚本里的 `npx vercel --prod` / `vercel deploy` 都已替换为本脚本，确保它们无法绕过闸门。
# 需要紧急上线时：bash scripts/deploy-flush.sh（必要时加 --force，并在 logs 写原因）。
echo "⛔ 直推部署已停用（docs/VERCEL-OPS.md 第 4 节）。请改用: bash scripts/deploy-flush.sh" >&2
echo "   产物已保存在 git，闸门会负责 push → 构建 → prune 到 3 条。" >&2
exit 1
