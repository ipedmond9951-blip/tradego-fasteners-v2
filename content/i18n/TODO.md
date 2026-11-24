# 文章正文本地化补齐清单（body / heading 十语）

生成方式：`python3 scripts/body_i18n.py status`（当前缺语种文章 126 篇，多数是 2026-11-23 批量生成的 buying guide 系列）。

## 处理流程（每篇）

1. `python3 scripts/body_i18n.py init <slug>` —— 生成 `content/i18n/<slug>.json` 草稿（只含 en 原文）
2. 在草稿里补 es / fr / pt / ar / ru / ja / de / hi 的 `heading` 与 `body`（豆包直写，不机器翻译）
3. `python3 scripts/body_i18n.py merge <slug>` —— 合并回 `content/articles/<slug>.json`（en/zh 永不覆盖）
4. `python3 scripts/body_i18n.py verify <slug>` —— 十语齐全 + 长度比 + 非拉丁语种字符集检查
5. `python3 scripts/content_audit.py` 复跑，然后 git push 触发部署

## 优先级（按商业价值）

第一批（产品采购指南，直连询盘）：
1. roofing-screws-buying-guide —— **已完成 es/fr/pt**（ar/ru/ja/de/hi 待补）
2. chemical-anchors-buying-guide
3. bolt-anchors-buying-guide
4. expansion-bolts-buying-guide
5. drywall-anchors-buying-guide
6. self-drilling / chipboard / coach screws 系列

第二批（市场与物流，支撑区域询盘）：
- tanzania-ibr-roofing-fasteners-dar-es-salaam（最新发布，目前仅 en/zh）
- kenya-mombasa-port-fastener-warehouse-guide
- nigeria-lekki-port-construction-fastener-logistics
- morocco-tangier-med-port-fastener-re-export
- egypt-suez-canal-industrial-fastener-tariff
- roofing-screws-vs-ibr-nails

第三批：2026-08 的 africa-* 系列与 2026-07 的 emergency 系列（低流量，最后补）

## 口径

- 译文按目标市场语言写，术语用当地工程习惯（es: correa/limahoya；fr: panne/noue；pt: terça/rincão；ar: مدادة/مزراب）
- 不塞英文原文；品牌名与标准号（TEK、EPDM、Ruspert、IBR、HDG、SANS、EN 14592）保持原样
- 单篇一次补 3–5 个语种，避免长输出截断

## 阶段化补齐策略（2026-11-24 起）
- 用户确认：先铺阶段一 `es/fr/pt/ar`（法语非洲、莫桑比克/安哥拉、北非阿语市场），再补 `ru/de/ja/hi`。
- 阶段一校验：`python3 scripts/body_i18n.py verify <slug> --phase1`（只查 en/zh/es/fr/pt/ar）。
- 一篇阶段一齐全即可 merge 上线，不必等十语；阶段二补齐时按同 slug 追加 `*.ru.json` 等草稿后再次 merge。
- 部署额度约束：每次 push 计 1 次 Vercel 部署（Hobby 100 次/天），多篇攒一批再推。

## 产品描述本地化缺口（2026-11-24 盘点）
- `src/lib/productI18n.ts` 的 `productDescriptions` 共 65 个产品：34 个只有 en/zh，30 个尚无任何描述（回落 slug 名），1 个有 pt。
- 2026-11-24 已补：首页主推 8 个产品（drywall-screws、self-drilling-screws、bolts-nuts、ibr-nails、anchor-bolts、washers、coach-screws、threaded-rods）的 es/fr/pt/ar 描述。
- 剩余 57 个产品缺 es/fr/pt/ar，产品详情页与首页网格仍会回落英文描述；下次批量补时同样按阶段一（es/fr/pt/ar）→ 阶段二（ru/de/ja/hi）推进。
- 校验方式：`grep -c "    es: " src/lib/productI18n.ts` 应随产品数同步增长；ES 页 `curl -sL <dev>/es/ | grep -c "stainless"` 应归零（现仍有余量，来自未补产品）。

## 2026-11-24 src 侧英文泄漏清零进度

已提交（未 push）：`8c3ba3c5`、`cc38d4dd`。
- `src/lib/productI18n.ts`：65 个产品的描述全部十语（补齐此前只做了 35 个的余量 30 个）。
- `src/lib/productsContentI18n.ts`（新建）：`/products/` 列表页指南、质量认证、海运、行业应用 7 段 × 十语，替换组件内 en/zh 双语文案。
- `src/components/VideoSection.tsx`、`TestimonialsSection.tsx`：视频区与三段客户证言（含岗位、产品行、标签）十语化；数字（25 吨、2×40ft/月、18 个月）与公司名保持原文。
- `src/components/SourcesSection.tsx` + `uiCopy.ts`：四条标准（ISO/SABS/ASTM/DIN）说明十语化。
- `HeroSection` 徽标行改走 `hero.badge`；`hero.product4_name~6` 补 es/ru/ja/de 原生名。

仍保留英文但属既定取舍：产品规格值（DIN/材质/表面处理代码、`DIN 7504-K head / ETA assessment on request`、`Stainless 304/316` 等）、公司名与城市名。

## 2026-11-24 结构化数据与规范链接治理（已完成，未 push）

- 首页 JSON-LD：ItemList 8 条改本地化产品名/描述并带本语种 URL；Breadcrumb 名称与 URL 改本地化 + 尾斜杠；三个 schema 补 `inLanguage`；`next/script` 改原生 `<script>`，让服务端 HTML 直接含 JSON-LD（AI 爬虫不执行 JS）。删除站点级英文 FAQPage（`FAQSchema.tsx`），避免 8 个语种每页一份英文 FAQ 且与首页重复。
- 文章页 Article：补 `inLanguage`、`articleSection`（本地化品类）、`dateModified`（`article.updated`）。
- 文章聚合页：新增 CollectionPage + ItemList（24 条本地化标题/URL）；补 10 语标题与描述（原先 8 语显示英文标题）。
- canonical / hreflang：11 处补尾斜杠（原先指向 308 目标）；`/products/`、`/industry/` 的 `x-default` 改为指向 `/en/`（原先指向当前语种）。110 个「页面×语种」组合复验 0 偏差。
- 元数据：首页 description、`/products/`、`/terms/`、`/privacy-policy/` 描述补 8 语；`og:locale` 按语种映射（原先 9 语均 `en_US`）；`og:url` 补尾斜杠。
- 标准页：`stdNotes` 44 个标准号 × 十语（原先仅 en/zh，非英语站 H1 显示英文释义）。
- 分类页：篇数、面包屑、meta 描述十语化；补 5 个缺失品类名（Anchors/Screws/Nails/Waterproofing/Fastener guide）；聚合页品类芯片改走 `categoryLabel()`。
- 首页认证卡片：名称与释义十语（原先英文 QMS/SABS/CE/Test Reports 说明）。
- `public/llms.txt`：补十语 locale 入口表，提示 AI 引擎按语言引用对应 URL。
- 待办：`public/robots.txt` 与 `src/app/robots.ts` 冲突，dev 下 `/robots.txt` 500（线上以 robots.ts 为准）；保留现状未动，若要清理需确认线上 robots 来源。

## 2026-11-24 追加：产品 schema、市场页与法律页收尾（未 push）

- `src/components/ProductSchema.tsx`：删除两块失效的硬编码英文产品名/描述表与回退链，`name`/`description` 直接取 `productI18n`（65 slug 全覆盖）；补 `url: /{locale}/products/{slug}/`；`additionalProperty` 四个属性名改走 `specLabels`（size/standard/material/finish × 十语）；去掉无意义的 `color: 'Silver/Gray'`。`/products/` 列表页 65 个 Product 节点已全部带本地化名、描述、属性名与 url（hi/ru/de/ja 实测）。
- `src/app/[locale]/products/[slug]/page.tsx`：PDP 的 `category` 由产品名改为本地化品类名（`categoryOf` + `categoryLabel`/`pick`），ru「Анкеры」、ja「アンカー」、de「Dübel & Anker」。
- `src/lib/marketText.ts`（新增）：市场正文统一入口，优先级 = 各语种覆盖文件（marketsI18n/EsJa/Ru/Ar/DeHi）→ `markets.ts` 的 en/zh。`/markets/` 总览卡片原先只读 `hero[locale] || hero.en`，非 en/zh 全站卡片显示英文 hero；详情页也改走同一入口，删除各自拼装的空值链。津巴布韦卡片简介另存 `zimbabweHero` 十语（该市场正文页为英语独占落地页，只补卡片一句）。
- `src/app/[locale]/{terms,privacy-policy}/page.tsx` + `uiCopy.legalNoteCopy/lastUpdatedCopy`：日期与语言声明十语化，非英语站显示「本页正文为英文原文，法律效力以英文版为准」。**条款与隐私正文仍为英文原文（en/zh 两套）**，其余 8 语回落英文属既定取舍——法律文本不做机器翻译，避免条款责任风险；若后续要正式本地化，应交人工/律师处理。
- sitemap/robots 复核：`public/sitemap.xml`（4,394 loc 旧快照）与 `public/robots.txt` 是本地构建残留、未被 git 跟踪，但会让 dev 下 `/sitemap.xml`、`/robots.txt` 抛 500（conflicting public file and page file）。已删除本地副本，dev 现返回 200：sitemap 4,322 条 loc，全部带尾斜杠、无重复，`/steel-prices/` 与 zimbabwe 落地页只出 en；robots 为 `robots.ts` 的 AI 白名单版本。仓库内无该两文件，线上不受影响。

补充（同轮）：文章页、标准页、市场页均补 BreadcrumbList；`BreadcrumbSchema` 组件从只认 en/zh 的硬编码标签改为十语 `navLabels` + 自动补尾斜杠 + 可传上级层级（品类页现在输出「首页 → 行业指南 → 品类」三级）；文章面包屑的品类 URL 原用原文大小写（`/industry/category/Anchors/` 404），现统一走 `categorySlug()`，`industry/page.tsx` 与品类路由的同名函数一并收敛到该工具。

## 2026-11-24 追加：正文重复套话清理（未 push）

- 全库扫描发现每篇文章正文尾部普遍带「通用套话整块重复 2–3 次」（This procurement framework… / Standards-based procurement… / Supplier evaluation should be a continuous process… 等 4 句模板），累计 186 篇、3,148 段落、约 3.0 MB 重复文案；同一批模板在 270+ 页面重复出现，属典型低质重复内容，疑为收录率偏低的重要成因。
- 处理：按段落（保留 `\n` 结构）做尾部整块重复收敛，每个重复块保留一份；`scripts/body_i18n.py` 新增 `dedupe` 子命令，`merge` 写回字段时自动去重（防止旧草稿把重复段带回）。清理后 300 词以下「thin article」为 0（`countArticleWords` 统计十语合计，不受影响）。
- 同步收尾 4 篇只剩 1 节的 A 类文章（galvanic-corrosion / high-tensile / roofing-screws-epdm / threaded-rods），各补 ru/ja/de/hi 正文与小标题，verify 通过。
- 副作用说明：`verify` 的 0.45–2.2 长度比在去重后会对约 219 篇报 length-ratio 告警，集中在 es/fr/pt/hi 的 FAQ、Related resources 段落（以链接清单为主，词数天然偏高）。判定口径：missing / english-heavy 才算缺陷，单纯长度比告警不处理；该口径已同步组织方。

## 2026-11-24 追加二：检出「英文占位」缺陷（译文字段其实是英文原文）

- `body_i18n.py status` 之前只查「语种缺失」，漏掉一类更隐蔽的缺陷：字段存在、但内容是英文原文（早期批量填充把 en 写进了各语种槽位）。新增 `english_copy()` 检测（非拉丁语种按字符集，拉丁语种按与 en 的相似度 + 英文停用词），`status` 与新 `verify` 均会报 `english-copy`。
- 首次全库扫描：**120 篇文章 / 496 个字段**属英文占位，语言分布 ja 135、hi 111、ar 111、ru 103、es/fr/pt/de 各 9。清单落 `content/i18n/BACKLOG-untranslated.json`。
- 最严重两篇：`mozambique-lng-construction-fasteners-maputo`（60 字段，ar/ru/ja/hi 全篇英文）、`lobito-corridor-railway-fastener-procurement`（56 字段，2026-11-21 新文，ar/ru/ja/hi 近全篇英文）。
- 处理约定：这两篇由我直写译文；其余按清单派给组织方并行补；`verify` 的 `english-copy` 属必须修为 0 的硬缺陷（length-ratio 仍按噪声处理）。

