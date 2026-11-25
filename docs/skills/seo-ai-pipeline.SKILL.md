---
name: seo-ai-pipeline
description: TradeGo 站点 SEO 文章生产流水线的真实运行手册 — 四步管线、通道降级、内容契约校验、配图选择、占位/404 治理、git push 部署与验证。改任何文章 JSON 时自动先跑校验闸门。
---

# SEO AI Pipeline（TradeGo-fasteners-v2）

## Keywords
SEO 文章, 站内文章, 文章, 文章流水线, seo-ai-pipeline, 写文章, 改文章, 改稿, 改写, 大纲, 审计, 内容校验, 内容契约, 检查文章质量, 文章质量, 本地化, 标题, 描述, 元描述, 翻译, 补译, 多语言, 十种语言, 配图, 首图, 占位文案, 占位, Content coming soon, 软404, 英文夹带, 部署验证

## 触发条件
- 要新增 / 重写 / 补译站内文章（content/articles/*.json）
- 文章配图缺失、重复、404
- 线上出现占位文案、"Not Found" 软 404、旧内容

## 自动执行：内容契约闸门（无需用户开口）

**规则**：本会话只要碰了 `content/articles/*.json`（新写、改写、改标题/描述/元描述、补译、批量修），就先跑闸门，再动内容；改完再跑一次。用户不提、也不催，照样跑。

```bash
cd /Users/zhangming/workspace/tradego-fasteners-v2
python3 scripts/content_gate.py --brief            # 开工看底数（npm run content:gate:brief）
python3 scripts/content_gate.py --slug <slug>      # 一篇改完就查（有 BLOCK 退出 1）
python3 scripts/content_gate.py                    # 全量 + 新增 BLOCK 判定
python3 scripts/content_gate.py --fix              # 先跑 meta/extract/date/image 安全修复再体检
```

**看到 BLOCK 怎么办**：先看 `fix_content_contract.py {meta|extract|zh-strip|date|image} --dry-run` 命中什么，能自动修的 `--apply`；剩下要手写的，按 `docs/content-contract-backlog.md` 取 slug 与 section-id 补正文。修不动（缺素材/缺事实）就如实说，别交"看着干净"的稿。

**一批改完收口基线**：`python3 scripts/content_contract.py --write-baseline content/contract-baseline.json`，再 `content_gate.py` 确认"新增 BLOCK 0 篇"。基线不收口，下一次正常改动也会被 pre-commit 拦。

**三层兜底**：会话内靠本节规则主动跑 → commit 时 `.githooks/pre-commit` 拦新增 BLOCK → 每日 08:35 launchd（`com.agentops.content-contract`）跑全量并落报告 `~/AgentOps/reports/content/<日期>.txt`。

判定口径（哪些算 BLOCK、哪些算 WARN、误报怎么认）见仓库 `docs/CONTENT-CONTRACT.md`。

## 入口与四步

```bash
cd /Users/zhangming/workspace/tradego-fasteners-v2
bash scripts/seo-pipeline-preflight.sh                 # 预检：通道可用性
bash scripts/seo-ai-pipeline.sh <slug> <主题/关键词>    # STEP1-4 全流程
```

四步：大纲 → 正文 → 审计（门槛 ≥60 分）→ 配图。产物 `content/articles/<slug>.json` + `public/images/articles/<slug>.jpg`。

## 通道与降级

- **首选走 OpenClaw**（2026-11-24 起）：`scripts/oc_writer.py` / `scripts/llm_client.generate()` 默认先调 OpenClaw 网关，再降级直连 HTTP，再降级浏览器通道。改 `WRITER_CHANNEL=direct` 可强制直连排障。
- OpenClaw 调用方式：`$HOME/.nvm/versions/node/<ver>/bin/node $HOME/.nvm/versions/node/<ver>/lib/node_modules/openclaw/dist/index.js infer model run --model <provider/model> --prompt ... --json`（PATH 上的 homebrew `openclaw` 与 live state schema 不兼容，任何命令都报 schema 36 > 1，别用）。返回 `{ok, provider, model, usage, outputs:[{text}]}`，成功一次约 3.8s、cost 0。
- 模型链默认 `zai/glm-4.5-flash,openrouter/free,zai/glm-4.7-flash,openrouter/nvidia/nemotron-3-ultra-550b-a55b:free,zai/glm-4.6v-flash`。
- **OpenClaw 生产线路（2026-11-24 定稿，7 个模型全通）**：primary `zai/glm-4.5-flash`(3–5s) → `x-ai/grok-4.3`(4s) → `openrouter/nvidia/nemotron-3-ultra-550b-a55b:free` → `openrouter/baidu/ernie-5.5-flash-preview:free` → `openrouter/openrouter/free` → `openrouter/nvidia/nemotron-3.5-lightning:free` → `xai/grok-4`。每个模型 5 轮实测均 5/5。**`zai/glm-4.6v-flash` 已从链路剔除**（文字类请求只有 2/5，它是视觉模型，若要做 imageModel 得另测）。体检脚本：`bash scripts/oc_route_check.sh`（默认测 primary+fallbacks 全部，`--fast` 用更短提示；退出码 0 才有意义）。端到端验收要跑带工具调用的真任务：`openclaw agent --agent main --message "用 shell 执行 echo ROUTE_OK，然后只回复命令的输出"`。
- 关键认知：**单模型间歇 429 是免费池常态**（openrouter 免费池 + zai 余额），不要因为体检某一轮 FAIL 就改配置；看 5 轮稳定率和最终 fallback 是否兜住。真正不能留的是稳定 2/5 以下的模型。
- **OpenClaw provider 大扫除（2026-11-24，46 个模型逐个实跑后完成）**：可用只剩 4 家——`zai`（glm-4.5-flash / glm-4.7-flash / glm-4.6v-flash / glm-4.1v-thinking-flash / glm-4v-flash）、`openrouter`（4 条免费）、`xai`/`x-ai`（grok-3 系 / grok-4 系 / grok-4.20 系全部 OK）。已整家删除：`volcengine-agent-plan`(404 订阅失效)、`google`(402 credits depleted + 官方已下线 1.5/2.5-preview)、`minimax`+`minimax-portal`+`minimax-cn`+`minimax-portal-cn`(402)、`groq`(无 key)、`codex`(Auth lookup failed)、`anthropic-vertex`(Auth lookup failed)、`deepseek`(余额不足)。单独失效的模型：`grok-code-fast-1`、`grok-build-0.1`(404)、`zai` 里 17 个 glm 变体(429 余额不足)。连带同步：`agents.defaults.modelPolicy.allow`、10 个 agent 的 `model.fallbacks`、`imageModel`(→`zai/glm-4.6v-flash`)、`plugins.lossless-claw` 的 summaryModel/expansionModel(→`zai/glm-4.5-flash`)、以及 `mcp.servers.minimax`(整条删除)。每个 agent 私有 `agents/<id>/agent/models.json` 也做了同样裁剪。
- 备份点：`~/.openclaw/backups/openclaw.json.bak-precull-<时间>`、`~/.openclaw/backups/modelsjson-<时间>/<agent>.models.json`（整目录可整体还原）。改完 `gateway restart` + `gateway health` + `agent --agent main` 冒烟三件套必跑。
- 教训：`oc models auth list` / 任何 auth 变更在 gateway 运行时会被拒（要求 offline exclusive ownership），想动 credential 必须先停 gateway；配 `agents/<id>/agent/models.json` 的私有 provider 不在全局 `models list` 里，光看全局会漏测。
- **浏览器通道改用 ego lite（2026-11-24）**：`bash scripts/ego-ai-router-call.sh <gemini|grok|chatgpt> <prompt_file> [timeout]`，内部生成脚本交给 `ego-browser nodejs` 跑，登录态复用 ego profile；`seo-ai-router-call.sh` 默认先走它，`AI_ROUTER_BACKEND=chrome` 可退回老的 Chrome 18800 + playwright。ego 不对外暴露 CDP 端口，所以不能 `connectOverCDP`，只能用 taskSpace/page API。
- ego 版实测（2026-11-24）：**gemini / grok / chatgpt 三条全部跑通**（短提示均返回，10–50s）。
- 最大的坑不是权限弹窗，而是**任务空间命名**：`taskSpace()` 复用固定名字时，只要该空间曾被 `handOff()` 交给用户（例如弹过"通知权限"），下一次 `taskSpace()` 会立刻抛 `A browser permission prompt ... The user now controls this task space`，看起来像"权限弹窗永远点不完"。正解是每次跑用唯一名字（脚本里已改成 `seo-llm-<ai>-<时间戳>`），登录态在浏览器 profile 里不会丢。
- ChatGPT 已去掉 `data-message-author-role`，回复抽取以选择器为主、`body.innerText` 差分兜底（取提问之后的文本并切掉尾部 UI 噪音）。
- 所有通道共用 `scripts/llm_quota.py` 闸门（SAFE_RATIO=0.8），key 用 `provider:model`，OpenClaw 与直连共用同一份台账，避免多进程各自撞 429。
- **例外：`openrouter:*` 不设闸门**（用户 2026-11-24 明确要求）。`NO_GATE_PREFIXES` 里放行，只统计用量、不限窗口/日上限、429 也不降容不冷却——把换模型的活交给 OpenRouter 自带的 `openrouter/free` meta-router。
- **OpenRouter 已接入可用（2026-11-24）**：provider `openrouter`（`https://openrouter.ai/api/v1`、`api=openai-completions`、`apiKey=openrouter:manual`），key 名 `doubao`（无到期、无 credit limit），存在 OpenClaw auth store（`openclaw models auth paste-api-key --provider openrouter --agent main`，**多 agent 环境必须带 `--agent main`**，否则报 `AGENT_SELECTION_REQUIRED` 静默失败）。接入脚本 `bash scripts/oc_openrouter_enable.sh <sk-or-v1-...>`（存 key → 幂等插 fallback → 真实调用验证）。实测模型：`openrouter/free`、`nvidia/nemotron-3-ultra-550b-a55b:free`、`baidu/ernie-5.5-flash-preview:free`、`nvidia/nemotron-3.5-lightning:free` 全部 ✅；`google/gemma-4-31b-it:free`、`inclusionai/ling-3.2-flash:free` 当前上游 429（免费池争抢，非配置问题）。`openrouter/free` 是 meta-router，质量不稳（可能挑到很弱的模型），写作用具名模型更稳。
- 免费模型 id 别照旧抄：查当前真实可用清单 `curl -s https://openrouter.ai/api/v1/models | jq` 过滤 `pricing.prompt=="0"`；此前配置里 `deepseek/deepseek-v4-flash:free`、`openai/gpt-oss-20b:free`、`qwen/qwen3-next-80b-instruct:free` 一律 404（id 已失效）。
- **删 OpenRouter key 只能走 PATCH（站点没有 DELETE 路由）**：列表 `GET /api/frontend/v1/private/workspace-api-keys?workspace_id=<ws>&limit=100&offset=0`（缺 `limit` 报 400，缺 `workspace_id` 报 400；workspace_id 从页面请求里抓，`default` 不是真 id）。删除 = `PATCH /api/frontend/v1/private/workspace-api-keys/<hash>?workspace_id=<ws>`，body `{"payload":{"deleted":true}}` → 200 且 `deleted/disabled` 双 true。**body 必须包在 `payload` 里**（扁平 body 报 `payload: expected object`），改名字 `{"payload":{"name":...}}` 会 403。UI 的 kebab 菜单（Activity/Edit/Disable/Delete）点不动：菜单项是 floating 层，`snapshot` 抓不到、`.click()` 会穿透到下层按钮，别在 UI 上死磕，直接用接口。
- 在 ego 里自动建 OpenRouter key 的正确姿势：keys 页会弹 Support portal 需先点 `Close`；`New key` → `input[name="name"]` → 两个下拉必须用 `page.evaluate` 直接 `click()` DOM（ref 点击被 option 拦截）；**点 Create 前先 `page.cdp("Network.enable")` + `page.events()` 清缓冲**，然后从 `Network.requestWillBeSent` 里找 URL 含 `workspace-api-keys` 的 requestId，用 `Network.getResponseBody` 取响应体——完整 key 在 `data.key`（73 字符），`data.api_key.label` 只有 18 字符是掩码。页面 `body.innerText`、input value、剪贴板都取不到全文明文（剪贴板还会触发权限弹窗把控制权交给用户）。
- 管线统一入口 `scripts/seo-llm.sh` 的默认顺序已改成 `openclaw codex gemini grok chatgpt`（`SEO_LLM_CHANNELS` 可覆盖）：`openclaw` 走 `scripts/oc_writer.py`、不依赖 Chrome、4 秒一次、自带额度闸门；后三个只在 OpenClaw 全失败时兜底。
- 每次调用自动追加 `[Internal-ref: ...]` nonce，绕开 ai-guard 的 prompt hash 24h 去重；输出经 `scripts/_strip_router_labels.py` 清洗。
- codex 只有 `-m codex-auto-review` 稳定（其他型号报 model not supported）；单次约 25k tokens 固定开销。
- 禁用 DeepSeek（余额）、MiniMax（不作为写作通道）、旧 `minimax-quick*.sh`（已改兼容层）；`minimax-image-gen.sh` 不可用。
- codex 额度撞到 2026-12-21 03:33 才恢复；浏览器通道（gemini/grok web）有封号风险，只在应急时用，不作为常规写作路径。

## 质量门槛（真实硬指标）

- 正文字数 **≥1600 词**，低于直接 FAIL（300 词级假成功是真正要挡的）。
- 审计分数 ≥60，评分脚本回 `SCORE: N`。
- JSON 必须含 en + zh 正文；其余语种走 en 回退也可以接受，但不能出现 `Content coming soon`。

## 内容契约校验（每篇收工必跑）

字段级断言，不是"看着像"的检查。**新写或改动的文章必须过，存量问题由基线冻结。**（完整说明见仓库 `docs/content-contract-20261125.md`）

```bash
python3 scripts/content_contract.py --slug <slug>                       # 单篇
python3 scripts/content_contract.py                                     # 全量
python3 scripts/content_contract.py --write-baseline content/contract-baseline.json   # 收窄基线
python3 scripts/content_contract_backlog.py                             # 生成待办清单 docs/content-contract-backlog.md
```

- BLOCK（必须修）：`Content coming soon`/`lorem ipsum` 占位、标题/描述/元描述照抄英文或夹着 4 个以上连续英文词、某语种字段为空、脚本字符缺失（ar/ru/hi/zh 几乎没有该语言文字）、配图文件不存在、`updated` 早于 `date`、缺中文正文。
- WARN（可排期）：`imageAlt` 复用英文、缺 `faq`（GEO 结构化问答）、正文体量偏薄、SEO 长度越界。
- 退出门禁：`.githooks/pre-commit` 会对改动过的文章跑 `--baseline`，**只拦基线之外的新增问题**；确需绕过用 `CONTENT_CONTRACT_SKIP=1 git commit ...`。
- 修存量：`scripts/fix_content_contract.py extract|meta|zh-strip|date|image`（机械修复，默认 dry-run）→ `scripts/fill_body_zh.py patch.json --apply`（补中文正文，带 ≥120 汉字质量闸）。

**事实纪律（按项目尺度掌握，不必过度考据）**：标准编号、等级对应、螺纹规格这类"写错就等于错货"的对应关系必须准确；价格、产量、失效比例这类市场数字给区间、注明"参考值，以项目实测为准"即可，不用逐条标来源。原则是宁可少写一个数字，也不要把对应关系写反。

## 配图

```bash
bash scripts/pick-hero-image.sh <slug> "<主题词>"
```

按主题词元命中文件名打分，排除最近 20 篇用过的图、排除与通用占位图同 md5 的图；`SEO_PICK_EXCLUDE=<md5:md5>` 可强制避开；webp/png 会转 jpg。新增 4 张生成图靠 `image_gen`，生成后压到 1200px 左右再入库。

## 渲染层防线（改代码前先看这两处）

- `src/app/[locale]/industry/[slug]/page.tsx`：`localizedText()` + `stripPlaceholder()` 用 `new RegExp` 构造（Turbopack 不接受带中文的正则字面量），剥掉开头占位句。
- 同一文件：表格形状归一化（兼容按语言分组的旧表）。
- 假 slug 必须 `notFound()`（文章页、产品页都已加），否则 200 + "Not Found" 是软 404。

## 部署与验收

- 一律 `git push` 触发 Vercel，不用 `vercel --prod`（Not authorized）。
- 等 `npx vercel ls tradego-fasteners --environment production` 出现 `● Ready`，拿 build-id URL 验证；Queued 半小时属平台排队，不要重建。
- 验收三项：假 slug 404、真页 200、占位文案计数 0；补译文章看 zh 正文有中文。

## 常见坑

- 浏览器通道对长段会原样回吐中文 → 生成后必须做"en 不得含中文 / zh 必须含中文"校验。
- 同一张图被判给多篇 → 检查字节 md5，`pick-hero-image.sh` 已排除同 md5。
- 提交前禁用部署：用 `/tmp/dryrun-bin` 里的 git/npx echo 版本（干跑约定）。
