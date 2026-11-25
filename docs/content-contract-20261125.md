# 内容契约校验器：首轮实测报告

日期：2026-11-25　脚本：`scripts/content_contract.py`（441 行，纯标准库，无新依赖）
范围：`content/articles/` 共 282 篇，其中 15 篇是 `redirectTo` 跳转存根，实际校验 279 篇。全量跑完耗时 1.1 秒。

---

## 一、结论：有用，可以进流程

这不是"再套一层提示词框架"，而是把文章 JSON 的**输出契约**写成可执行断言，跑一遍就能把"看起来有 10 种语言、其实只有英文"的假页面挑出来。

实测结果（2026-11-25 定稿口径）：

| 状态 | 篇数 | 占比 |
|---|---|---|
| 完全干净 | 2 | 1% |
| 只有 WARN | 111 | 42% |
| 有 BLOCK（真问题） | 151 | 57% |
| 被冻结进基线后新增 BLOCK | **0** | 0% |

BLOCK 分类：

| 检查项 | 次数 | 含义 |
|---|---|---|
| `i18n-mixed` | 638 | 本语种字段里夹着成串英文（英文本地化只做了一半） |
| `placeholder` | 58 | 正文里放着 `Content coming soon.` 占位 |
| `i18n-copy` | 20 | 标题/描述/keywords 直接照抄英文 |
| `i18n-missing` | 3 | 某个语种字段整个是空的 |
| `image-missing` | 1 | 配图路径指向不存在的文件 |
| `date` | 1 | `updated` 早于 `date`（时间倒挂） |

---

## 二、抓到的六类真问题（抽样核对过）

**1. 43 篇中文正文是空壳**
`sections[*].body.zh` 里真的写着 `<p>Content coming soon.</p>`，例如 `anchor-bolts-selection-guide`、`bolt-tightening-torque-guide`、`agrifastener-water-infrastructure`。中文站这些页面在搜索引擎眼里等于没内容。

**2. 7 篇描述只做了英文版，另外四语照搬**
`africa-railway-sleeper-fastener-specification` 的 `description.es / fr / pt / de` 与英文逐字相同；同类还有 `egypt-cairo-construction-fastener-wholesale`、`namibia-uranium-mining-fastener-corrosion`、`zim-construction-u-bolts-...`（这条是法语 `title.fr` 照搬）。

**3. 元描述普遍是"英文标题 + 本地尾巴"（122 篇，638 处）**
这是最大的一块存量欠账：

```
meta.ru : "Anchor Bolts for Foundation: Complete Guide to Str. Полное руководство по Anchor Bolts for Foundation: Complete Guide to Str - спецификации..."
meta.zh : "Africa Railway Modernization Fastener Demand 2026: SGR, Metros, and Freight Corridors 案例研究，包含 5 个真实工业示例。"
```

前半截是英文原文（甚至被截断成 "Str."），后面再接一句本语种。多语言 SEO 上这是硬伤：同一串英文在 10 个 hreflang 版本里各出现一次。

**4. 一篇纯空壳文章上线着**
`emergency-2026-07-06-fastener-sourcing-guide`：`description` 的 9 个语种全为空，配图 `public/images/articles/fastener-sourcing-africa.jpg` 文件不存在。

**5. 脏文本混进正文（西语版）**
`kenya-affordable-housing-fasteners-wholesale` 的 es 正文：`…pueden añadir entre $0,05 y undefined 200-400 por visita de inspeção`——`undefined` 是模板拼接失败的残留，句子已经碎了。

**6. 日期倒挂**
`tanzania-ibr-roofing-fasteners-dar-es-salaam`：`updated 2026-11-24` 早于 `date 2026-11-25`。

---

## 三、误报治理：四轮，从"261 篇全红"到"能看"

首版 279 篇里有 261 篇报错，等于没有信号。逐轮修的过程：

1. **`imageAlt` 8 语复用英文、缺 `faq` 字段** → 从 BLOCK 降为 WARN。这两项是历史资产普遍现象，不该卡发布。
2. **俄语标题误伤**：`Высокопрочные болты: A325, A490 и EN 14399` 被判"非俄语"，因为型号占了大半字符。改成"该文字**存在性下限**"（西里尔/阿拉伯/天城至少 5 个字符，汉字至少 4 个），不再用绝对比例。
3. **西/法/葡/德正文大面积误报**：一开始用"连续 4 个 ASCII 词"判定，结果西班牙语 `para la industria automotriz` 也被算成英文（ASCII 词分不出语种）→ 拉丁语系改用**英文虚词命中**（the/and/with/your/this… 命中 ≥3 个）。
4. **占位词重复计数**：`content coming soon` 和 `coming soon` 同时命中同一条文本，84 处里有一半是重报。改成按字段路径比对、同一字段只报一次，且报出具体位置（如 `sections[2].body.zh`）。

现在残留的噪声只有 `imageAlt` 一类 WARN（213 处英文 alt 复用、26 处 alt 过短），建议再降一级到 info，不影响判断。

---

## 四、基线机制：让存量问题不挡住新内容

57% 的存量问题如果直接当门禁，流程会立刻停摆。所以加了快照：

```bash
# 首次：把当前问题冻结成基线
python3 scripts/content_contract.py --write-baseline logs/content-contract-baseline.json

# 日常：只拦基线之外的新增问题
python3 scripts/content_contract.py --baseline logs/content-contract-baseline.json
```

验证结果：
- 带基线重跑 → 151 篇存量降级为 `[存量]` WARN，**新增 BLOCK 0 篇，退出码 0**；
- 我造了一篇假文章（描述全填 `x`、补一句 `Content coming soon.`）→ 6 项全部命中（zh/ar/ru/hi 语言缺失、缺中文正文、占位文案），**退出码 1**。

也就是说：老文章不挡路，新写的假翻译一定会被拦住。

---

## 五、建议的接入顺序

1. **先修高价值的三类**（合计约 50 篇，工作量可控）：43 篇中文占位正文 → 用现成的 `scripts/add-faq-to-articles.py` 同套路批量补真中文；7 篇照搬英文的描述 → 重写；`emergency-2026-07-06` 那篇空壳 → 要么补全要么下线。
2. **元描述英文夹带作为专项**（122 篇）：写个脚本把"英文标题 + 本地尾巴"拆开，只保留本地句子，英文标题留给 keywords。
3. **挂进流程**：`seo-ai-pipeline` 收工环节加一条 `--slug <新文章>` 校验；`.githooks/pre-commit` 里对改动文件跑一次，BLOCK 就拒绝提交。
4. **不要一次性全量重写**：基线冻结着，按上面顺序逐个消，基线文件每月重生成一次，数字往下走就是进度。

---

## 六、成本与维护

- 跑一次 1.1 秒，纯标准库，无新依赖，可进 CI 也可本地 pre-commit。
- 检查项集中在 `check_article()` 一处，加规则只需追加几行；严重级统一用 `issues.b()` / `issues.w()` 区分，调整口径不用改结构。
- 已知边界：只校验 JSON 字段层，不判断"内容对不对"（是否胡说、数据是否真实）；正文只查体量与占位，不查语义。这一层仍要人抽检或另接模型评审。

---

产物：
- 校验器 `scripts/content_contract.py`
- 全量报告 `logs/content-contract-20261125.json`
- 存量基线 `logs/content-contract-baseline.json`

---

## 七、第二轮：真修一遍，并接进流程

第一轮只是"能查"，第二轮开始真改。原则：**能确定性生成的自动修，需要写内容的进待办清单，不糊弄。**

修复前后对比（同一口径 running 279 篇）：

| 指标 | 修前 | 修后 |
|---|---|---|
| 有 BLOCK 的篇数 | 151（57%） | **99（38%）** |
| `i18n-mixed`（英文夹带） | 638 处 | **279 处** |
| `i18n-copy`（整段照抄英文） | 20 处 | **1 处** |
| `placeholder`（占位文案） | 58 处 | 57 处（补了 1 篇中文） |
| `image-missing` / `date` | 各 1 处 | 0 |

具体做了什么：

1. **元描述 102 篇自动重组**：只用文章里已有的本语种 `title + description` 拼，拼不出来的再用本语种正文首句，全程不翻译、不新造。剥掉了 "Anchor Bolts for Foundation: Complete Guide to Str." 这类残留英文和 `[3]` 引用角标。
2. **7 篇照搬英文的描述重写成真本地化**（es/fr/pt/de 各 4 篇 + 单语种 3 篇），另补了 2 篇空壳文章的 9 语种描述、1 篇 hi 缺口。
3. **发现一处英文槽位写错语种**：`zim-construction-u-bolts` 的 `title.en` 本身是法语，已改回英文标题。
4. **配图缺失**：`emergency-2026-07-06` 换成同 slug 的现成图；日期倒挂 1 篇对齐。
5. **中文正文试点 1 篇**（`bolt-tightening-torque-guide`，4 段全部写成真中文，含扭矩表、四种拧紧方法、验收问答），通过 `scripts/fill_body_zh.py` 的质量闸（≥120 汉字，数字表按 ≥50 汉字 + 200 字符放行）。

剩下 99 篇为什么不自动修：`i18n-mixed` 的 279 个字段，源文本本身是机翻垃圾（如 "背景： 紧固件行业的一个项目遇到了与 : 相关的Quality / Manufacturing Defect问题"），任何自动重组都只是把垃圾搬个位置。这些必须重写，已全部列进 `docs/content-contract-backlog.md`。

## 八、怎么让它"下次还在用"

| 入口 | 作用 |
|---|---|
| `pnpm content:contract` | 全量校验，人看 |
| `pnpm content:contract:baseline` | 收窄基线：修完一批就把基线重生成一次 |
| `pnpm content:contract:backlog` | 生成 `docs/content-contract-backlog.md`，按类型分批推进 |
| `pnpm content:contract:fix meta\|extract\|date\|image` | 机械修复，默认 dry-run，`--apply` 才落盘 |
| `.githooks/pre-commit` | **改过的文章自动过门禁**，只拦基线之外的新增问题；`CONTENT_CONTRACT_SKIP=1` 可绕过 |
| `seo-ai-pipeline` SKILL.md「内容契约校验（每篇收工必跑）」 | 写文章的流程里强制这一步，附事实纪律 |

基线放在 `content/contract-baseline.json`（不是 `logs/`，因为 `logs/` 被 gitignore）。门禁的语义是**只对新内容负责**：存量问题冻结成白名单，新写的假翻译一定拦得住。

实测门禁：塞进去一篇带 `lorem ipsum` 且缺中文正文的假文章 → 提交被拦，退出码 1；干净的改动 → 放行。

## 十、第四轮：BLOCK 清零与上线（2026-11-25 晚）

**结果**：279 篇（含 15 篇 redirect 存根不校验）中 **BLOCK 0 篇**，WARN 256 篇。

本轮动作：
1. 40 处占位正文全部补写完成——中文 21 段、英文 7 段、葡语 1 段、西语 1 段；中文段落均 ≥110 汉字并含 `<p>` 结构，英文段落 84–122 词。
2. `imageAlt` 全语本地化：1311 + 350 个字段按各语种原生标题重建（`标题 - TradeGo Fasteners` / `标题｜TradeGo 紧固件`），一次消掉 1464 条 "与英文完全相同 / 夹英文" 告警。
3. 三处字段级 BLOCK 修完：`title.ja` 去掉 `vs` 连写、`metaDescription.zh` 换中文原生表述、`metaDescription.de` 重写德语。
4. 基线归零：`content/contract-baseline.json` 按 0 篇存量问题重写，后续 pre-commit 只拦新增。
5. 已 `git push` 触发 Vercel 部署，线上抽检通过：`/en/industry/full-thread-half-thread-coarse-fine-thread-guide`（200，新章节在位、无占位文案）、`/zh/industry/agrifastener-water-infrastructure`（200，中文正文已渲染）。

**剩余 WARN（按价值排序，非阻塞）**
| 项 | 量 | 说明 |
| --- | --- | --- |
| FAQ 本地化缺口 | 8227 条 | 232 篇无 faq section；另一种口径下 i18n 复制缺口 |
| 英文正文 <1600 词 | 209 篇 | 历史资产，Vercel 站点质量门槛按 WARN 计 |
| 中文正文偏薄 | 108 篇 | <700 汉字 |
| 描述长度超限 | 67 篇 | seo-length |
| 缺语种 / 虚词缺失 | 28 / 14 篇 | es/fr/pt/ar/ru/ja/de/hi 部分缺 |
