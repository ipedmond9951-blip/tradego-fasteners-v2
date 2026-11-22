<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skill-loop-workflow -->
## 工作流：技能三件套（必须遵守）

1. **开工前**：`~/.agents/bin/skill-loop route "<任务关键词>"`，按命中结果 Read 对应 SKILL.md，照步骤做；没命中就先查 `~/.agents/skills/` 再干活。
2. **收工后**：`~/.agents/bin/skill-loop close --skill <技能名> --outcome success|failure|partial --task "<一句话>" --lesson "<可复用经验>"`。
3. 失败多或踩到新坑，把中文关键词补回对应 SKILL.md 的 `## Keywords`，方便下次路由命中。
4. 部署一律 `git push` 触发，验证用带 build-id 的 URL + 内容比对，不只看 HTTP 200。
<!-- END:skill-loop-workflow -->

<!-- BEGIN:deploy-batching -->
## 部署纪律：攒批推送（必须遵守）

同一个仓库只对应一个 Vercel 项目（`tradego-fasteners`，唯一绑定 www 生产域名）。团队并发构建为 1，单次 `next build` 约 10 分钟，因此**push 的频率直接决定线上更新延迟**。

1. **一次任务只 push 一次**：把同一批改动合并成 1 个 commit，跑完再 push；中途多次 commit 只在本地，不要每条都推。
2. **推送前先看队列**：`bash scripts/deploy-status.sh`，若已有 `● Queued` 或 `● Building`，说明上一批还在跑，继续攒着，等它 Ready 再推。
3. **禁止为了"催上线"重复 push / 重复构建**：Vercel 会自动取消被覆盖的旧部署，重复推只会让队列更长。
4. **验收以 Ready + 线上内容比对为准**，不看单独 HTTP 200；构建还没跑完就下"没生效"的结论是误判。
<!-- END:deploy-batching -->
