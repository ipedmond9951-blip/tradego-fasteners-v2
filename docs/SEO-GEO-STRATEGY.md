# TradeGo 全站 SEO / GEO 整改策略（v1 · 2026-11-25）

维护：Tradego网站运营（运营总控线）｜生效范围：www.tradego-fasteners.com 全站 10 语种 + 全部内容线
配套清单：`docs/seo-p0-ctr-pages-2026-1125.csv`（P0 点击率目标页）

---

## 0. 这份文件怎么用（其他对话开工前必读）

1. **先读，再动手**。任何要改 `content/articles`、`src`、`public`、`scripts` 的对话/窗口，开工第一步读完本文件第 5–6 节。
2. **本文件是唯一排期表**。与 `docs/GEO-PLAN.md`（2026-04 初稿）、`docs/CONTENT-SEO-AUDIT.md`（2026-04-29）冲突时，以本文件为准；旧文件只作背景。
3. **不读不改，不领租约不改，不按批次顺序不许跳批**（批次 0 没通，后面改了也上不了线）。
4. 发现策略与实际不符：先改策略（一次提交只改本文件），不要在代码里绕开。
5. 所有数字以本文件第 1 节基线为准；有新数据就更新基线，不要把旧数字继续往下传。

---

## 1. 基线（2026-11-25 实测，改动前先看这一行是否已过期）

### 技术面（基本健康，不要再重复修）

| 项 | 实测 |
|---|---|
| sitemap | 线上 4,332 条 URL，`force-static` 构建期生成，CDN 直出 |
| hreflang | 每页 11 条（10 语种 + x-default），canonical 带尾斜杠 |
| 结构化数据 | 单页 18 个 JSON-LD 块（Article / FAQPage / BreadcrumbList / Organization / LocalBusiness / WebSite / VideoObject 等），服务端直出、不依赖 JS |
| robots.txt | 显式放行 19 个 AI 爬虫（GPTBot、OAI-SearchBot、ClaudeBot、PerplexityBot、Google-Extended、Grok 等） |
| llms.txt | `public/llms.txt` 6,121 B，含公司事实、产品线矩阵、市场、10 语入口表 |
| 噪音数据 | 虚构 AggregateRating 已移除；单 H1；薄页 noindex 且不进 sitemap |
| 性能 | 桌面 LCP 0.7–0.9 s、移动真实网络 0.9 s；`/en/industry/` 聚合页 194 KB（已从 970 KB 降） |

### 流量面（GSC 页面维度 2026-11-22 导出，999 页样本）

| 指标 | 实测 |
|---|---|
| 点击 / 曝光 | 280 / 29,476，**CTR 0.95%** |
| 排名分布 | 1–3 名 91 页；**4–10 名 609 页**；11–20 名 180 页；21–50 名 92 页 |
| 零点击页 | 863 页有曝光但 0 点击，占 36% 曝光 |
| 语言结构 | en 18,312 曝光（62%）、zh 3,808（13%）、es 2,017；非英语合计 38% 曝光，CTR 反而略高于 en |
| **最高杠杆** | 39 个页面行（27 篇文章 + 3 个聚合页）曝光 ≥100 且 CTR <1%，吃掉 **53% 总曝光**；其中文章 14,011 曝光（47.5%）只换来 71 次点击 |
| **低 CTR 分两类**（2026-11-25 修正） | **排名 ≤10 且 CTR <1%：15 行 / 6,220 曝光 / 48 点击（0.77%）→ 纯 snippet 问题，改标题与描述**；排名 >10 且 CTR <1%：24 行 / 9,391 曝光 → 排名问题，补内容、补内链，改标题没用 |

### 内容面

| 指标 | 实测 | 判定 |
|---|---|---|
| 文章 | 279 篇（15 篇 redirect）× 10 语种 | 数量已够，**不要再靠加页面增长** |
| 英文体量 | 中位 1,627 词；≥1,600 词 221 篇；<600 词 10 篇 | 合格 |
| 中文体量 | 中位 1,575 字；≥2,000 字 106 篇 | 偏薄 |
| 语种覆盖率（按节） | en 0.96 / es 0.92 / fr 0.92 / pt 0.91 / de 0.91 / ru 0.91 / ar 0.88 / hi 0.87 / ja 0.83 / **zh 0.71** | zh 是唯一明显半成品 |
| 满覆盖文章（≥90% 节） | zh 仅 27 篇（en 195、fr 160、ru 160） | zh 缺口最大 |
| 模板文 | **30 篇 / 128 节**（单篇 5–7 节里 6 节是模板） | 翻译前必须重写 |
| 零入链文章 | **29 篇**（无任何站内文章指向它） | 抓取与权重都吃不饱 |
| 标题过长 | **71 篇** en 标题 >55 字符，线上被代码 `slice + "..."` 截断 | 直接损失 CTR |
| meta 描述过长 | 31 篇 >160 字符 | 同上 |

### GEO（生成式引擎）面

| 指标 | 实测 |
|---|---|
| `geo_audit.py` 均分 | **61.7 / 100**（264 篇），A 90+ 仅 8 篇、E <60 有 113 篇 |
| 首段逐字复述标题 | **145 篇** |
| 可核实体密度 <2 / 千词 | **63 篇** |
| FAQ 不足 3 条 | **0 篇**（已 100% 覆盖，继续加 FAQ 边际为零） |
| `check-geo-readiness.py` | 均分 85.8；缺口 dup 146 / std 76 / entity 44 / link 43 / src 20 / fresh 15 / lead 7 |

### 工程面（元问题）

- 本地领先 `origin/main` **216 个提交**未推；今日部署 10 次 / 预算 3 次，`deploy-budget.sh` fail-closed 生效中。
- 结论：**上线通道是当前第一瓶颈**。内容改得再好，不推就等于零。

---

## 2. 四条线现在在干什么（先对齐，再分工）

| 线 | 对话 | 正在做 | 风险 |
|---|---|---|---|
| A 代码/部署 | TradeGo vercel运维 | 价格金额清理（415→0 处）、语种补齐、模板文重写、GEO 结构脚本、部署护栏 | 同时也在改 content，与 B 线撞车 |
| B 内容（技术类） | 今日头条分析 | 按"共用整句 >15%"榜重写模板页（quality-control、preload-torque、SABS、包装、仓储、润滑…），每篇 heading 10 语种 + 中英正文 | **和 A 线改同一批 JSON**，已发生过一次整篇覆盖事故（es/fr/de 从 3.6k 字掉回 468 字） |
| C 品牌/社媒 | TradeGo网站推广方案 | 6 款 logo 候选，已选 06 螺纹 TG，正在换站头与六个平台头像 | 换 logo 会改 header/favicon/Organization.logo，跨 A 线代码域 |
| D 线索/投放 | Trade Go Ga4 | TradeBrain 线索采集与开发信、Resend 配额、GA4 | 只消费站点流量，不改站 |

**已经发生过的事故**：两条线各读一份旧 JSON、各写一份新 JSON，后写的把先写的语种字段清掉。本策略第 6 节的租约与写法规则就是为此而立。

---

## 3. 诊断：四个瓶颈，按杠杆从大到小

1. **上线通道**：216 提交积压、预算 fail-closed。不解决，后面全部空转。
2. **有排名没点击**：CTR 0.95%，27 篇文章吃掉 47.5% 曝光却只换来 71 次点击。标题/描述是唯一能"当天改、数天内见效"的杠杆。
3. **有页面没被引用**：145 篇首段复述标题、63 篇实体密度 <2/千词。AI 引擎不是进不来（19 个爬虫全放行），是**取不走一句可引用的话**。
4. **覆盖质量**：zh 半成品（0.71）、30 篇模板文、29 篇孤儿。这三项决定"改完能不能被记住"。

### 三条明确不做的决策（避免下轮又绕回来）

- **不靠新增页面增长**。279 × 10 = 2,790 个文章页，索引预算早就被自己占满；新增一篇的 ROI 远低于把 4–10 名的 609 页推到前 3。
- **不再加 FAQ**。FAQ 已 100% 覆盖、FAQPage 已全站输出，边际为零。GEO 现在的瓶颈是首段和实体密度。
- **不再堆 schema**。单页 18 块已足够，继续加只会稀释信号、增加 HTML 体积。

---

## 4. KPI（90 天，2027-02-23 验收）

| 指标 | 基线 | 目标 | 度量 |
|---|---|---|---|
| GSC CTR | 0.95% | **≥2.0%** | GSC 页面维度，每周一导出 |
| 点击（同窗口口径） | 280 | **≥600** | 同上 |
| P0 目标页 CTR | 平均 0.51% | 27 篇中 **≥18 篇 ≥2%** | 逐 URL 对比 |
| 4–10 名推进 | 609 页 | 其中曝光 ≥50 的 40 篇里 **≥10 篇进前 3** | GSC 排名列 |
| GEO 均分 | 61.7 | **≥75** | `geo_audit.py` |
| 首段复述标题 | 145 | **≤40** | `geo_audit.py`（echo） |
| 实体密度 <2/千词 | 63 | **≤20** | `geo_audit.py`（ent） |
| 模板文 | 30 | **≤10** | `check-template-filler.py` |
| 零入链文章 | 29 | **0** | 内链图扫描 |
| zh 满覆盖 | 27 | **≥120** | 语种覆盖率统计 |
| 询盘（商业结果） | 待 GA4 基线 | 自然搜索询盘 +50% | GA4 `a392577170p534542915` |

---

## 5. 批次与整改清单

### 批次 0（11-25 → 11-26 09:30）· 通管道｜A 线独占

- A 线在上海 00:00 窗口单次推送 + `scripts/vercel-promote.sh`；**其他线此期间只准备清单，不动内容、不 commit 大批量**。
- 上线后 30 分钟内核对：sitemap 4,332 条、抽查 3 页 hreflang 11 条、薄页 noindex 与 sitemap 一致、`check-render-locales.py`、`vercel-audit.sh` 第 9–13 项。
- **完成定义**：审计 13 项里只剩"部署次数超预算"一项告警，其余全绿。

### 批次 1（11-26 → 11-30）· 点击率 P0｜B 线 + A 线（按 category 分）

对象：`docs/seo-p0-ctr-pages-2026-1125.csv` 里 **`rank_band=<=10` 的 15 行**（snippet 问题），一轮 6 篇；`rank_band=11+` 的 24 行不进本批，归批次 3 补内容与内链。

改法（统一口径，避免每人一套）：

- **只改有曝光的语种**（en 为主，另有 es/zh/ru/ja/de/pt 若干）；meta 字段不是正文，不必强求 10 语种同步，但要记进 `content/locale-backlog.json`。正文改动仍须全语种。
- 先降"排名 ≤10 却 CTR <1%"，这类页面已经站在首页边缘，只差一句能打的摘要。

- **标题 ≤55 字符**（含空格）。公式：`品类 + 场景 + 一个可核差异`。
  例：`EPDM Roofing Washers: 14–22 mm, 1.5 mm Rubber`（48 字符）。
- 禁用：`Complete Guide`、`Best`、`Everything You Need`、`Ultimate`、价格数字、认证字样。
- **描述 120–155 字符**：第一句给结论或规格区间，第二句给用途/交付事实（如"Mill cert per heat, sea freight to Durban/Beira"）。禁 `Learn more`、`Click here`。
- **10 语种各写**，不从英文机翻；本地语用该语种的搜索词（ru 用"болты", pt 用"parafusos", ar 用"مسامير" 这类）。
- 一次提交 = 一篇的全部语种字段，禁止只改 en 就提交。
- 顺手修 71 篇 >55 字符标题：**在 JSON 里写短，不靠代码 slice 截断**（带 `...` 的标题在 SERP 里等于自残）。

验收：`content_gate.py --slug <slug>` 0 BLOCK、`check-claims.py` 通过、`geo_audit.py --slug` 分数不降；14 天后看 GSC 该 URL 的 CTR。

### 批次 2（12-01 → 12-06）· GEO 可摘性 P0｜B 线主攻、A 线补结构

- **首段答案化**：先做曝光最高的 20 篇 echo 页。首段 40–130 词，第一句就是定义/结论（`X is/are …`），带 1 个可核数字（尺寸 / 等级 / 标准号）。禁 `This article`、`In this guide`、`Learn` 开头。
- **每节首句给答案**，背景放第二句以后。
- **H2 问句化**：qh 目标 ≥0.25（现在大量页面是 0.0）。用采购真问题（`Can I substitute 8.8 for 10.9?`、`What thread tolerance does galvanizing change?`）。
- **实体密度**：只给"正文真的在讲标准"的 76 篇补标准号/尺寸写法（M10×1.5、8.8 级、ISO 4014、HDG ≥50 µm）。**不新增公司没做过的标准**，不编数值。
- 不做：加 FAQ、加 schema、加关键词密度。

验收：单篇 `geo_audit.py --slug` 的 `p1` 落进 40–130、`echo=0`、`qh≥0.25`；全库均分只升不降。

### 批次 3（12-07 → 12-13）· 覆盖质量 P1｜A 线（zh）+ B 线（模板/孤儿）

- **zh 补齐**：先抽 zh 曝光最高的 30 篇写完整中文正文（zh 曝光 3,808 但覆盖率 0.71，是"有排名、内容半截"的典型）。
- **模板文 30 → ≤10**：沿用已定稿 4 节骨架（工程问题与机制 → 标准与选型 → 失效证据与替代 → 采购规范与收货检验），一篇 × 全部语种一次做完。
- **孤儿 29 → 0**：`relatedArticles` 双向 + 正文首次出现产品名处链产品页；不许在文末硬塞"相关阅读"列表。
- 标题超长 71 篇收短（与批次 1 合并做也行，但不能拖过本批）。

### 批次 4（12-14 起）· 常态供给｜全部线

- 每周 3 篇，市场 × 品类轮换；选题来自 GSC query 维度（不是拍脑袋）。
- 发布前 8 道闸门（第 7 节），缺一不提交。

---

## 6. 归口与防冲突（硬规则，违反即回滚）

### 6.1 写权限表

| 线 | 对话 | 可写 | 禁区 |
|---|---|---|---|
| A 代码/部署 | TradeGo vercel运维 | `src/**`、`public/**`（`public/brand` 除外）、`scripts/**`；**唯一 push / promote 权限** | 不用脚本批处理就不许手改 `content/articles` 正文 |
| B 技术内容 | 今日头条分析 | `content/articles` 中 category ∈ `Technical Guide` / `Product Guide` / `Quality Standards` / `Anchors` 的 slug | 不碰区域/市场/物流类文章；不碰 `src` |
| C 区域内容 | TradeGo vercel运维（同一对话的 C 角色） | `content/articles` 中 category ∈ `Market Analysis` / `Regional Supplier` / `Procurement Guide` / `Industry Guide` / `Case Study` 的 slug | 不碰技术类；部署仍走 A 角色 |
| D 品牌/社媒 | TradeGo网站推广方案 | `public/brand/**`、社媒头像与封面 | 站头/favicon/Organization.logo 的代码改动交 A 线合并；不许自行改 `src` |
| E 线索/投放 | Trade Go Ga4 | TradeBrain 与邮件系统 | 不改站点 |
| F 总控 | Tradego网站运营（本对话） | `docs/SEO-GEO-STRATEGY.md`、清单、度量脚本 | 不改正文，保持验收独立性 |

跨类文章（如"区域 + 技术"）以 JSON 里的 `category` 为准；拿不准就在本文件"变更登记"里写一行，别猜。

### 6.2 五条写法铁律

1. **原子单位是"一篇 × 全部语种"**，不是"一篇 × 英文"。
2. **先读磁盘最新文件，再只改自己负责的字段**；禁止把内存里的旧整篇写回磁盘（这就是上次 es/fr/de 被清空的原因）。
3. **发现别人的语种比你长，就保留别人的**，只补自己的缺口。
4. **禁止 `git add -A` / `git add content` / `git add .`**；只 add 自己改的具体文件。
5. **只 commit，不 push**；push 与 promote 只在 A 线的上海 00:00 窗口做一次。

### 6.3 租约（改之前先领）

```bash
python3 scripts/article-claim.py claim <slug> <线名>    # 被他人持有则 exit 1，直接退出
python3 scripts/article-claim.py list                   # 看谁在改什么
python3 scripts/article-claim.py release <slug> <线名>  # 改完交还（30 分钟自动过期）
```

领不到就换一篇，别硬上。租约不解决"谁写得更好"，只解决"两个人同时写"。

### 6.4 空闲与并发

- 同一时刻每条内容线只允许一个窗口写 `content/articles`；多窗口时先在对话里说清"我改哪 3 个 slug"。
- 脚本批处理（价格清理、去重、段落化）也必须先领租约，且**一次只跑一个语种维度**，跑完立刻 `content_gate`。

---

## 7. 验收闸门（fail-closed，缺一项不算完成）

**每篇改完**

```bash
python3 scripts/content_gate.py --slug <slug>        # 0 个新增 BLOCK
python3 scripts/check-claims.py                      # 认证/地域/工厂直供口径
python3 scripts/check-body-lang.py --slug <slug>     # 语种串位
python3 scripts/geo_audit.py --slug <slug>           # 分数不降、p1 落 40–130
```

**每批结束**

```bash
python3 scripts/content_gate.py --brief
python3 scripts/check-template-filler.py
python3 scripts/check-money-claims.py
python3 scripts/check-geo-readiness.py
python3 scripts/check-ja-clean.py
```

**上线前（A 线）**

```bash
bash scripts/deploy-budget.sh          # 预算不足直接拦，不许 DEPLOY_FORCE
bash scripts/vercel-promote.sh         # 唯一发布入口
python3 scripts/check-render-locales.py
bash scripts/vercel-audit.sh           # 第 9–13 项必须绿
```

**改 UI 文案或 llms.txt 之后**：`python3 scripts/check-claims.py`（`content_gate` 不覆盖 `src` 与 `public/llms.txt`）。

---

## 8. 度量节奏

| 频率 | 动作 | 数据源 |
|---|---|---|
| 每周一 | 导出 GSC 页面 + 查询词维度，更新第 1 节基线；按 CTR 重排 P0 清单 | GSC |
| 每周三 | `geo_audit.py` + `check-geo-readiness.py` 全库跑一遍，只看均分与 echo/ent 两个数 | 本地脚本 |
| 每周五 | 自然搜索会话、询盘表单、WhatsApp 点击；对比改动批次 | GA4 `a392577170p534542915` |
| 每月 1 日 | AI 引用抽检：固定 5 个采购问题，在 ChatGPT / Perplexity / Gemini 各问一次，记录是否引用本站（人工抽检，不做抓取） | 人工 |
| 每月 1 日 | Speed Insights 看 LCP/CLS 是否被新内容拖慢 | Vercel Speed Insights |

**口径提醒**：不看"干净率"当目标。去重、删价格、清模板都会让"完全干净篇数"暂时下降，那是诚实结果，不是回退（已有前例：228 → 211 篇）。

---

## 9. 红线（内容线通用，违反即回滚）

1. **认证**：只写"按 SABS 1195 / DIN / ISO 生产"或"证书按订单要求提供"；不写已持有，也不写不持有。站点 UI、`public/llms.txt`、社媒事实卡三处必须同步。
2. **价格**：内容站不写具体报价数字，只讲报价结构（五层构成 + 驱动因素 + 可比口径）；中英同步改。
3. **地域**：只写 China，含所有非拉丁写法；批量替换后查"中国中国 / China (China)"这类残句。
4. **数字**：只给标准限值或标准号（HV / µm / mm / TPI / MPa）；不写"提升 30%"这类没出处的百分比。
5. **署名**：对外统一 `Edmond | TradeGo Fasteners`，不用个人中文名。
6. **单证**：以站内 `/documents` 页口径为准，不在文章里另造一套。
7. **不编标准编号**：不确定就只讲标准族（"ISO 898-1 系列"→ 只写未编号的标准族）。

---

## 10. 变更登记

| 日期 | 改动 | 线 |
|---|---|---|
| 2026-11-25 | 建立 v1：基线、四瓶颈、批次 0–4、写权限表、租约、闸门 | F |
| 2026-11-25 | 低 CTR 拆成两类：排名 ≤10 = snippet 改文案；排名 >10 = 排名问题补内容/内链。批次 1 收窄到 15 行 | F |
| 2026-11-25 | 批次 1 已落地 8 篇 + industry 聚合页（`b2e2bc01`、`9ad21f3b`）：6 篇 en、1 篇 es、1 篇 zh；正文 md5 校验未动 | F |
| 2026-11-25 | 品牌实体一致性收口：正文/CTA 的 185 处 `Tradego`/`Tradego-Fasteners`/`TradeGoFasteners` 统一为 `TradeGo` / `TradeGo Fasteners`，URL 域名不动（`59d8301c`、`c054d4e2`、`d688a388`）。实测是 185 处 / 7 篇，不是原先记的 148 处 | B |
| 2026-11-25 | 认证口径加一道体检：新增 `scripts/check-cert-claims.py`（11 语种「自称持有」句式 + 允许写法白名单，38 条命中里仅 2 条主语为本公司），修 rwanda 篇产品级 `ISO 898-1 certified` → `produced to ISO 898-1`（`05c99ecc`） | B |
| 2026-11-25 | `china-iso-9001-fastener-manufacturer-directory` 已按本文件决定改题：`China Fastener Quality Systems: ISO 9001 Guide 2026`（51 字符），不再以"ISO 9001 名录"为卖点（`05c99ecc`） | B |

## 11. 执行记录（批次 1 首批，2026-11-25）

| 页面 | 语种 | 曝光/点击 | 改后标题 |
|---|---|---|---|
| zinc-plated-vs-black-phosphate-screws | en | 1,362 / 8 | Zinc vs Black Phosphate Screws: Which Finish Lasts |
| china-zimbabwe-fastener-shipping-container-guide | en | 1,028 / 8 | Fasteners to Zimbabwe: The Beira Corridor Route |
| ibr-roofing-nails-installation-guide | en | 877 / 5 | IBR Roofing Nails: Length by Sheet, Purlin Spacing |
| ghana-tema-port-fastener-import-procedure | en | 346 / 0 | Tema Port Fasteners: 6 Documents, 3–7 Day Clearance |
| harare-fastener-distributor-supplier-guide | en | 286 / 2 | Harare Fasteners: Graniteside Stock and Lead Times |
| togo-lome-port-fastener-import-procedure | en | 289 / 2 | Lome Port: Cotecna PSI and the Clearance File |
| concrete-anchors-fasteners-guide | es | 327 / 0 | Anclajes para hormigón: tipos, carga e instalación |
| bolt-grade-markings-guide | zh | 151 / 1 | 螺栓等级标记：4.6、8.8、10.9、12.9 怎么读 |
| /en/industry/ 聚合页 | en | 573 / 5 | Fastener Guides: Grades, Ports and China Sourcing |
| hex-bolt-dimensions-chart | pt | 723（en/pt） | Parafusos sextavados: tabela métrica e polegadas（原描述混着英文残句 "Complete Metric & Imper."，已重写） |
| high-tensile-bolts-grade-guide | es | 114 | Pernos de alta resistencia: 8.8, 10.9 y 12.9 |
| nuts-bolts-glossary-terminology | zh | 116 | 紧固件术语表：采购必懂的螺栓螺母术语 |

**批次 1 收口**：13 个 snippet 目标全部完成。第 13 个 `china-iso-9001-fastener-manufacturer-directory` 按用户拍板改成「认证按订单办理」口径，见下条。

**顺带修掉的合规问题**（同一批提交）：`industry` / `products` / `products/[slug]` / `markets/[market]` 四个页面的 es/fr/pt/ru/hi/ar 文案原写"ISO 9001 / SABS 已认证"，已统一改成"按 SABS 1195 / DIN / ISO 生产 + 证书按订单申请"。`check-claims` 与 `tsc` 均通过。

**口径提醒**：`check-claims.py` 的 CERT 正则只认"TradeGo … certified"这种顺序，抓不到"Certificado ISO 9001"这类倒装与非英语形容词。写 UI 文案时不要依赖它兜底，认证表述只允许两种写法。

**已收口**：正文/CTA 的品牌写法 185 处已全部统一为 `TradeGo` / `TradeGo Fasteners`（复扫残留 0）；`china-iso-9001-fastener-manufacturer-directory` 已改题为质量体系指南，不再承诺名录。认证表述体检脚本 `scripts/check-cert-claims.py` 已并入闸门候选。

**口径定稿（2026-11-25，用户拍板）**：`china-iso-9001-fastener-manufacturer-directory` 的定位是「认证按订单办理」，既不是「名录」也不是「质量体系指南」。已落地的改动面：10 语种标题（en `China Fastener Suppliers: Certification by Order`／zh「中国紧固件供应商：认证按订单办理」）与 metaDescription 全重写；§2 公司段 10 语种改为「2004 年成立于河北，按 ISO/DIN 与 SABS 1195 生产，ISO 9001／CE／SABS 证书按订单要求办理，周期与费用随报价说明」；§5 CTA 首句 10 语种去掉 verified ISO 9001 manufacturer；§6 en/pt 的「ISO 9001 名录」框架句改为 supplier list；`keywords` 去掉 `ISO 9001 certified`；顺带修掉该文 zh 的 §1／§3／§4／§5 共 4 处字面 `\n`（原先整段粘成一行）。slug 不变，URL 与内链不失效。闸门：`content_gate --slug` 0 BLOCK 0 WARN、`check-body-lang` 0 污染、`geo_audit` 90 分（echo 0、FAQ 4、实体密度 12.6）。

> 下一版触发条件：批次 0 上线完成，或 GSC 新数据与基线偏差 >20%。
