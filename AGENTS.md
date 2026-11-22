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
