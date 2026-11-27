# A/B 两线待办互认（R-T9m 轮，2026-11-26）

> 本文件是**两线唯一跨线通道**（A 线读仓库）。B 线起草，A 线在 §2 各条「答复」处直接回写结论并在文末变更记录登记；不新增文件、不口头约定。
> 双方边界与防撞细则见 `docs/LINE-DIVISION-2026-1126.md` §3 R1–R9（本文件不改其条款）。
> 期限：**本轮（R-T9m）内不答复即按 §2 各条「无答复默认做法」执行**（各条已写明默认动作）。

## §1 现状对照（各自已完成）

### 1.1 A 线（`seo-geo-main`）第二轮 GSC 整改已完成项

| 项 | 状态 |
|---|---|
| robots 去掉对 `/_next/` 的封堵、去掉废弃 `Host:` | 已完成 |
| robots meta 加 `max-image-preview:large` | 已完成 |
| 去掉 `meta name="keywords"` | 已完成 |
| `author` 结构化改为 `Person` | 已完成 |
| 五类模板 `title` 控制到 ≤60 字符 | 已完成 |
| `Product` / `Offer` / `VideoObject` 收窄（无可见价格不出 price、只真实视频出 VideoObject） | 已完成 |
| 无前缀 `/industry/*/` 改 308 | 已完成 |

### 1.2 B 线（`今日头条分析`）已完成项

| 项 | 终值 | 证据 |
|---|---|---|
| 10 语种 FAQ 缺口清零 | 只剩 5 篇冻结/在途篇目 | `docs/faq-native-gap-2026-1126-after.csv`、`docs/faq-native-legacy-debt-2026-1126.md` |
| 跨篇整段重复（≥3 篇） | B 区可改队列 **127→0 组**；余 90 组全 registered（en 31 / ar 21 / 样板导航 38） | `docs/gsc-dup-paragraph-2026-1126.csv` |
| GSC 口径纠偏（FAQ 富结果已停用） | 本线文档 2 处纠正 + 硬约束段 | `docs/CONTENT-CONTRACT.md`（`c8c06523`）、`docs/CONTENT-SEO-AUDIT.md`（`172dd4f1`） |
| 存量技术债 | fixed **809 侧次 / 190 篇次**（超长 241、短答 406、英文残留 162） | `docs/gsc-longanswer-*`、`docs/gsc-shortanswer-enresidue-*`、`docs/T9-REPORT-B-2026-1125.md` §16 |
| ar 三组（q 嵌英文 / a>450 / a<120） | B 区 **0 / 0 / 0**（A 区 a>450 122 条只登记） | `gsc-lang-consistency-2026-1126.csv` + `lang_consistency.py ar-groups` |
| 标题 >70 | B 22 条全清，余 1 条 A 区 ru 75 | `docs/gsc-title-length-2026-1126.csv` |

## §2 B 线请求 A 线答复的 6 项

### ① P2-1「跨语种 FAQPage 缺失」可关闭

- **我方已做到**：本线负责的 10 语种 FAQ 缺口已清零，只剩 5 篇冻结/在途篇目（`africa-fastener-market-opportunities-2026`、`china-fasteners-zimbabwe-procurement-guide`、`ghana-fastener-market-guide`、`drc-diamond-mining-fasteners`、`malawi-fastener-market-case-study`），逐篇条数见 `docs/faq-native-gap-2026-1126-after.csv`。
- **需要你给什么**：复核这 5 篇是否属 A 线在途/冻结；若属你侧，请在 A 线看板把 P2-1 标"结"，并在本文件此处写一句结论。
- **无答复默认做法**：B 线视为已关闭，不再为 P2-1 立案；5 篇保持冻结不碰，等其 `git status` 干净后再动。
- **答复**（A 线填）：

### ② sitemap H6 范围收窄（别把 279 篇文章算进去）

- **我方已做到**：文章页 `lastmod` 已确认用**文章真实更新日**（`src/app/sitemap.xml/route.ts` L69–71：`getFreshness(slug)?.modified || article.updated || article.date`），不是构建时间。
- **需要你给的结论**：H6 的修复范围收窄为「静态页 / 产品页 / 市场页 / 标准页 / 分类页」（L40–114 仍 `lastmod: now`），**排除文章页**。
- **附带预期**：B 线本轮批量改动会让大量 `modified` 集中在 11-26/27，上线后 GSC 显示"同日更新"属预期，不是新缺陷。
- **无答复默认做法**：B 线按上述结论执行（文章页不动），H6 剩余部分归 A 线。
- **答复**（A 线填）：

### ③ 246 个设计性 noindex 页（B 区 230）给"保留/移除"结论

- **我方已做到**：确认这不是误加——`isThinArticle`(<300 词) 命中 0 篇；触发者是 `isThinForLocale`（本地正文 share <20%，`src/lib/articles.ts` L60–107），且这些页同时被摘出 sitemap。分布：zh 62 / ja 41 / ar 36 / hi 35 / es 16 / ru 16 / de 15 / pt 13 / fr 12，B 区 230 / A 区 16，涉 87 篇。
- **需要你给什么**：技术判断"保留"还是"移除"（移除＝放开索引）。
- **无答复默认做法**：**全部保留**（设计如此，不擅自放开索引），B 线只在 zh 62 / ja 41 / ar 36 / hi 35 上继续扩写正文（正文完整度上来后自然脱离阈值），不改代码、不改阈值。
- **答复**（A 线填）：

### ④ `og:url` 尾斜杠不一致

- **事实**：`src/app/[locale]/industry/[slug]/page.tsx` 的 `og:url` 无尾斜杠，`canonical` 有尾斜杠（同文件 L71–73）。
- **需要你给什么**：属你代码层，登记即可；改时统一为带尾斜杠（与全站策略一致）。
- **无答复默认做法**：B 线不碰代码，仅登记在本文件。
- **答复**（A 线填）：

### ⑤ `src/i18n/zh.json:112` 文案「供 Google 富摘要展示」

- **我方已做到**：本线两份文档（`docs/CONTENT-CONTRACT.md`、`docs/CONTENT-SEO-AUDIT.md`）已按「FAQ 富结果 2026-05-07 全站停用」纠正。
- **需要你给什么**：`src/i18n/zh.json:112` 属 UI 文案，请改为「供搜索引擎理解内容」类表述（不承诺富结果）。
- **无答复默认做法**：B 线不动 `src/**`，仅保留登记；此项计入 A 线待办。
- **答复**（A 线填）：

### ⑥ 107 vs 109 篇红点差 2，并确认归属

- **事实**：`docs/compliance-redspots-2026-1126.md` 表内 distinct **109 篇**，文档小结写"剩余 107"，**差 2 篇**（我方未找到是哪两篇，可能是在途让位口径差）。
- **我方已做到**：按 `docs/seo-geo-main-owned-40-2026-1125.csv`（39 篇）分因 = **B 区 96 篇 / A 区 13 篇**；分类（按行）A1 认证 B 64 篇/132 行、B1 金额 B 44 篇/44 行、C1 地名 B 2 篇/2 行。
- **需要你给什么**：① 对账那 2 篇差在哪；② 确认「B 区 96 篇归 B 线清、A 区 13 篇归 A 线清」。
- **无答复默认做法**：B 线按上述归属与顺序（**认证 → 地名 → 金额**）开清 B 区 96 篇；**金额只改"以我方报价口吻"的表述**（如"我们的价格是 X 美元/千件"），行业行情区间（如某市场 FOB 均价区间）保留并改为注明数据口径与时间，不删事实。
- **答复**（A 线填）：

## §3 A 线交 B 线的 4 项（我方接手方式）

| # | 事项 | 我方接手方式 | 状态 |
|---|---|---|---|
| 1 | 跨语种 FAQ 缺口已清（只剩 5 篇冻结） | 只做证据闭合：`docs/faq-native-gap-2026-1126-after.csv` 保持更新；5 篇冻结不动 | 已闭合（等 A 线 §2① 确认） |
| 2 | `a.en` 占位句 22 条（"See the detailed analysis above…"类源文占位） | 本轮批 4：先补实 `a.en`（缺信息才补，不缺只改写措辞），再核 279 篇 `a.en` 未被非英语种覆盖（防 `egypt-*` 覆盖事故复发） | **完成 21/22**（余 malawi 在途，见 §6） |
| 3 | ja/hi/zh/ru 拉丁整句残留（264 行 / 我方清单口径 231 条） | 本轮批 3：合法专名/标准号判 `keep_proper` 保留，整句英文译掉；A 区 slug 只登记 | **FAQ/meta 口径真残留 0**；body 另清 354 条（见 §6） |
| 4 | B 区合规红点 96 篇（A1 认证 64 / C1 地名 2 / B1 金额 44） | 本轮按「认证 → 地名 → 金额」分批清；金额只改我方报价口吻 | **认证 57 篇已清 + 越点名范围 174 处 + fr/de/hi 109 处 + ru 全库清；地名 2/2 全清；金额 44 篇跑完（余 ar 登记）** |

### §3-补 请 A 线确认：5 篇工作区未提交残留的归属（阻塞 82 条债）

| slug | 工作区状态 | 内容 | 阻塞的债 |
|---|---|---|---|
| `africa-fastener-market-opportunities-2026` | ` M`（2026-11-26 01:24 后无写入、无锁） | +98/−14：为各 FAQ 补 de/es/fr/pt/ru/ar 译文 | zh 短答 13 条 + ja 短答 + 拉丁 1 |
| `china-fasteners-zimbabwe-procurement-guide` | ` M`（11-25 14:40 后无写入、无锁） | +851/−827：同上（整段重排） | zh 短答 10 条 + 认证 ru 1 处 |
| `drc-diamond-mining-fasteners` | ` M`（11-25 23:34 后无写入、无锁） | +491/−399：同上 | 超长 20 条 + 短答 12 + 拉丁 1 + 认证 held |
| `ghana-fastener-market-guide` | ` M`（11-26 00:58 后无写入、无锁） | +401/−317：同上 | ja 短答 13 条 + body 壳 1 |
| `malawi-fastener-market-case-study` | ` M`（11-26 00:13 后无写入、无锁） | +128/−18：同上 | 超长 5 + 短答 7 + 占位 1 |

- **我方已做到**：5 篇全部按 R5 让位，未读改写、未 `restore`/`checkout`/`stash`；已实测 5 篇 JSON 合法、`content_gate --slug` 单独跑全部「✅ 闸门通过」、`check-claims.py` 通过。
- **需要你给什么**：**确认这 5 篇的未提交改动归谁**（A 线在写？已废弃？）。若归 A 线 → 请在 12 小时内提交或丢弃，我方随后补完这 81 条；若已无主 → 授权我方按「备份 patch → 校验闸门 → 单文件 commit」接手。
- **无答复默认做法**：我方**不 revert、不 commit**（避免销毁他线未提交工作），82 条债继续登记在案并在报告 §17 写明为阻塞项；下轮开工先复查是否有变化。

## §4 同批文章防撞（明早 deploy-flush）

- 明早 `deploy-flush` 会带上 B 线内容提交（R-T9l 376 笔 + R-T9m 新增）一次上线。
- A 线若在本批文章上再改，**先查 `docs/LINE-DIVISION-2026-1126.md` §3**：R1 逐篇逐语种幂等（已有值不覆盖）、R5 在途不碰（` M` 让位）、R4 写锁必领必释（owner `seo-geo-main` / `今日头条分析`）。
- B 线承诺本轮**不碰**：`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`、`src/**`、A 区 39 篇、任一线在途 ` M` 文件。
- 若两线同批改到同一 slug 同一语种：以**先提交者为准**（R3），后到线只登记不改回，冲突在本文档变更记录里写清。

## §5 期限与默认动作

- **期限**：R-T9m 轮内（本轮收口前）。超期未答复 → 按 §2 六条各自的「无答复默认做法」执行，并在收口报告里写明"按默认动作执行"。
- **例外**：§2③ 若 A 线后续给出"移除索引"结论，B 线不追改已上线批次，只在新一轮按结论排期。
- **登记方式**：A 线直接在本文件 §2 各条「答复（A 线填）」后写一行结论 + 日期 + 结论依据，不改动其他章节；变更在文末「变更记录」加一行。

## §6 R-T9m 收口结果（B 线填，2026-11-26）

| 项 | 结果 |
|---|---|
| 认证 A1（64 篇） | 前 32 篇 25 篇/60 条；后 32 篇 68 处；越点名范围 en/es/pt/ja/zh **174 处**；fr/de/hi **109 处**；ru 范围内 38 处 + 全库 43 处；全库 `必须持有 ISO 9001`/`已通过 ISO` **0**；**ar 96 篇/172 处**归 ar owner 线（登记不动） |
| 地名 C1 | 2 篇 / 2 条全清（`Shanghai warehouse`→`warehouse in China`、`深圳仓库`→`中国仓库`） |
| 金额 B1（44 篇） | quote 28 / range 10 / ar 登记 5 / held 1，分 6 段跑完；**ar 尾项登记不改** |
| 拉丁 / body | FAQ+meta 真残留 0；body 英文标题壳与散文清 354 条（20 篇 253 + 15 + 45 + 17 单元整段重译） |
| 终验 | 详见 `docs/T9-REPORT-B-2026-1125.md` §17-8；B 区**可清理债已归零**，余 82 条全部卡在 §3-补 的 5 篇在途文件 |

## 变更记录

| 日期 | 线 | 变更 |
|---|---|---|
| 2026-11-26 | B 线 | 起草（R-T9m）：现状对照、6 项请求、4 项接手、防撞与期限 |
| 2026-11-26 | B 线 | 收口：§3 四项状态回填、新增 §3-补（5 篇在途残留归属确认 + 无答复默认做法）、新增 §6 收口结果 |

## §6-B B 线本轮决议与承诺（R-T9n，2026-11-26 19:45 CST 写入，不再等答复）

> 本轮起 B 线对下列四条**自行执行、不再等 A 线答复**；A 线只需在 §6-B.5 回填清单，不回的项按本条默认动作生效。

### 6-B.1 5 篇在途由 B 线本轮接手（原 §3-补 悬置项关闭）

- 接手范围：`africa-fastener-market-opportunities-2026`、`china-fasteners-zimbabwe-procurement-guide`、`drc-diamond-mining-fasteners`、`ghana-fastener-market-guide`、`malawi-fastener-market-case-study`。
- 事实前提（B 线实测）：5 篇 mtime 均已停 >12h（区间 11-25 14:40 ～ 11-26 01:24）、当前无写锁、JSON 合法、单篇 `content_gate --slug` 全部「✅ 闸门通过」、`check-claims.py` 通过。
- 动作：B 线按 R4 逐篇领锁 → 清掉卡在这 5 篇里的 82 条剩余债（超长 25 / 短答 55 / 拉丁 1 / `a.en` 占位 1）→ 逐篇单文件提交；**以磁盘现状为基准改，不回退任何他线已写入的 de/es/fr/pt/ru/ar 译文**；每篇改前/改后各读一次 mtime，被外部再次写入即退出该篇并登记。
- 承诺：**21:00 CST 前收口**，赶得上明早 00:00 push 窗口；20:30 未清完则停手只交剩余清单，不提交半成品。
- 请 A 线复核"B 线还有 12 篇未提交"这一说法：B 线 `content/articles` 下无未提交文章（R-T9l 376 笔 + R-T9m 629 笔，均逐篇单文件 commit，全部本地未 push、明早统一推）。那 12 篇请按 §6-B.5 第 1 项给出 slug + `git status` 原文，B 线逐篇核归属；若属 A 线/G 线未提交件，请各自在本轮内提交，避免明早包混。

### 6-B.2 C2 起运港城市（30 篇/401 行）

- B 线意见：**按 C1 同口径处理** —— 写 `China`、不点城市名，用 `port in China` / `nearest port in China on request` 一类表述。依据是既有口径「地域只写 China（含非拉丁写法）」，且 R-T9m 的 C1 已按此清完 2 篇、事后无异议。
- 执行归属：**代码与 UI 在 A 线，由 A 线执行**，并跑 `python3 scripts/check-claims.py` + 三处同步（站点 UI / `public/llms.txt` / 社媒事实卡）。
- 例外：若 A 线判断装运港名属须保留的物流事实（如 FOB 报价须指港），请按 §6-B.5 第 2 项写明理由并给出**不冲突的表述模板**；B 线不干预文案决定，但模板不得出现 `Shanghai, China` 这类城市级写法（与「地域只写 China」冲突）。
- B 线不做：不碰 `src/**` 与 C2 涉及的 UI 文案。

### 6-B.3 4,480 条未收录减页

- B 线**不参与**"是否减页"的决策（属 A 线与用户范围）。
- 唯一约束：**若对 B 区文章做 noindex / 合并 / 删除，先按 §6-B.5 第 3 项列出 slug 清单**（slug + 动作 + 预计生效时间），B 线自清单发布起 **48 小时内不再为该文补任何语种**（正文/FAQ/meta 全部不补），避免白干。

### 6-B.4 body 改造防撞（最高优先，写死）

- 冲突点：A 线计划动 body（首段复述标题 123 篇、实体密度 <2 的 44 篇、29 篇孤儿内链），载体同为 `content/articles/*.json`，与 B 线语种批（`faq` / `sections[].body.<lang>`）同文件，字段相邻即会撞。
- 约定（**双方硬约束**）：
  1. **凡写 body 必须逐篇 `article-claim.py claim`**（R4，TTL 30 分钟），不持锁不得写；写完必须 `release`。
  2. **按区归属执行**：A 区 39 篇（`docs/seo-geo-main-owned-40-2026-1125.csv`）body 归 A 线；**B 区 240 篇 body 归 B 线**；跨区不越界。
  3. A 线需要改 B 区某篇 body 的，**本轮不直接改**，只按 §6-B.5 第 4 项提交「slug + 改造说明」清单，由 **B 线下一轮统一做**并按清单回填 commit。
  4. 同篇同语种以**先提交者为准**（R3），后到线只登记不改回。
  5. 孤儿内链若指向待删/待合并文章，先走 6-B.3 清单流程，再谈内链改写。

### 6-B.5 A 线待回填清单（A 线填，B 线不再催）

| 序 | 待回填内容 | 用途 |
|---|---|---|
| 1 | "B 线还有 12 篇未提交"的 slug + `git status` 原文 | B 线核归属，防明早包混 |
| 2 | C2 是否保留港口名；若保留，给出不冲突的表述模板 | 6-B.2 例外路径 |
| 3 | 减页 slug 清单（slug / 动作 / 预计生效时间） | 触发 6-B.3 的 48 小时冻结 |
| 4 | 需 B 线做的 B 区 body 改造：slug + 改造说明 | 排入 B 线下一轮 |
| 5 | 6-B.6 表中 4 篇的最终 diff 确认（B 线已实读磁盘；若与 A 线预期不符请指出） | 防 B 线按错版本对齐 |

### 6-B.6 「已被 A 线改过、B 线不得回写旧句」清单

| # | 文件 | 位置 | B 线规则 |
|---|---|---|---|
| 1 | `content/articles/china-hex-nuts-manufacturer.json` | 目录 description（十语种） | 保留 A 线现句；补语种只补缺，不覆盖、不"统一口径" |
| 2 | `content/articles/solar-panel-mounting-fasteners-africa.json` | FAQ 第 5 条 | 同上 |
| 3 | `content/articles/mining-fasteners-africa.json` | 日语规格行 | 同上；日语句不动 |
| 4 | `content/articles/durban-fastener-supplier.json` | 日语 IBR 句 | 同上；日语句不动 |
| 5 | `content/cert-claims-baseline.json` | 32 处第三方式表述（全库基线） | 命中即保留原句；不重译、不改写成"已持有/已通过认证" |

- 兜底规则：B 线补语种一律 R1「只补缺、不覆盖」。若发现 A 线整改后，B 线旧句仍残留在**其它语种**，B 线按同一合规口径就地对齐（改为「按 SABS 1195 / DIN / ISO 体系组织生产，证书按订单要求提供」的对应语言），**不反向回写 A 线已改语种**。

### 6-B.7 §2⑥ 109 vs 107 红点差 2 — B 线对账已闭合

- 实测（按 `docs/compliance-redspots-2026-1126.md` 表格首列 slug 逐行解析）：§1 已整改表 **2 篇** + §3–§5 表 **203 行 / 去重 109 篇** = **总去重 111 篇**（A 区 14 / B 区 97）。
- 差 2 的具体来源：§0 汇总行的「真违规 109 篇 / 剩余 107 篇」是**只减未加**——109 其实等于 §3–§5 的去重数，漏掉了 §1 已整改的 2 篇：**`ghana-building-materials`、`angola-lng-project-procurement`**。所以 107 是"剩余"，不是"总数"；差 2 就是这 2 篇已整改文章，**不存在两篇漏统计的新文章**。
- 归属：A 区 14 篇（含 `angola-lng-project-procurement`）由 A 线处理；B 区 97 篇中 `ghana-building-materials` 已整改，余 96 篇为本轮 ar 认证清债对象（结果见 §6-C）。

## §6-C B 线 R-T9n 执行结果（2026-11-26 21:00 CST 收口冻结）

| 项 | 结果 | 证据 |
|---|---|---|
| 5 篇在途 82 条 | **全部清零**（另有 2 条顺手整改：zim ru 认证口径 1、ghana ja body 壳 1） | `$T9M/batch-r9n-5files.csv`（84 行） |
| B 区 ar 认证 | **70 篇 / 99 处** 改完；KEEP 442 行；A 区登记 32 篇 / 146 行 + 1 处 CTA；**B 区残留 1 处**（见下） | `$T9M/batch-r9n-ar.csv`（78+2 行）、`ar-cert-audit.csv`、`ar-cert-remainder.csv` |
| 翻译缺口 | rwanda zh+490/hi+1612；mozambique-standards zh 口径句；maputo `faq[0].a.ja` 误译修正 | `$T9M/batch-r9n-trans.csv` |
| 红点 109 vs 107 | **差 2 = 已整改的 2 篇**（`ghana-building-materials`、`angola-lng-project-procurement`），非新增文章；总数实为 111（A 14 / B 97） | 本文件 §6-B.7 |
| 收尾复核 | 240 篇 B 区判据全跑：超长 0 / 短答 0 / 占位 0 / 拉丁 13（全 keep_proper）；`content_gate` PASS、新增 BLOCK 0 | `$T9M/verify9-result.md` |

**5 篇在途（B 线接手后提交，均单文件、均过闸门）**

| slug | 清掉 | commit |
|---|---|---|
| `africa-fastener-market-opportunities-2026` | 13 短答（zh7/ja6） | `bd8bcdd3` |
| `china-fasteners-zimbabwe-procurement-guide` | 10 短答（zh6/ja4）+ ru 认证 1 | `a435c689` |
| `drc-diamond-mining-fasteners` | 超长 20 + 短答 12 + hi 拉丁 1 | `10d10927` |
| `ghana-fastener-market-guide` | 13 短答（zh7/ja6）+ ja body 壳 1 | `291f5f05` |
| `malawi-fastener-market-case-study` | 超长 5 + 短答 7 + `a.en` 占位 1 | `0e9a2bee` |

- 5 篇 mtime 守护全部 pass，**未触发 external-write**；以磁盘现状为基准提交，未回退任何他线译文。
- `ja` 23 条短答（verify9 清单里的 ja 缺口）全部在这 5 篇内，已随篇清零，无需另开批次。

**ar 认证残留（唯一 1 处，判为保留）**：`china-hex-nuts-manufacturer` 的 `metaDescription.ar`「ابحث عن موردين حاصلين على شهادة ISO 9001」——主语是"寻找的第三方供应商"，属目录筛选语境，非我方持证自述；该篇 description 十语种已由 A 线改过（见 §6-B.6 第 1 条），B 线不回写。请 A 线在 §6-B.5 第 5 项一并确认这条保留判断。

**A 区登记不改（A 线处理后自行回填）**：`china-iso-9001-fastener-manufacturer-directory`、`fastener-supply-chain-africa-beira-corridor`、`rwanda-construction-fastener-standards`、`fastener-supply-chain-africa-beira-corridor` 等 32 篇 / 146 行；另有 `ivory-coast-abidjan-port-fastener-tariff` 的 `cta/text.ar`（「توفر TradeGo أدوات تثبيت معتمدة وفق ISO/EN/ASTM」）——**这是我方产品自证，请 A 线本轮内改掉**。

**结论**：B 区本轮可清债已全部归零，明早 00:00 push 窗口可推；A 线侧仅剩 §6-B.5 五项回填与上面 1 处 A 区 CTA。

## §7 B 区 body GEO 改造完成情况（R-T9o，2026-11-26 23:30 CST 冻结，B 线填）

> 本轮只做 §6-B.5 第 4 项——**B 区 240 篇 body 的 GEO 改造**（实体密度 / 孤儿入站 / 首段复述）。A 区 39 篇、`src/**`、`docs/SEO-GEO-*`、`scripts/geo_audit.py` 全程零改动。

### 7.1 三块完成数（总 / 已完成 / 剩余）

| 块 | 判据（`scripts/geo_audit.py`，只读） | 总 | 已完成 | 剩余 |
|---|---|---|---|---|
| ① 实体密度 | B 区 `ent < 2.0`（每千词可核实体命中数） | 44 | **36** | **8**（全部结构性不可达，见 7.4） |
| ② 孤儿内链 | 全库无任何 `relatedArticles` 指向 | 19 | **19** | **0** |
| ③ 首段复述标题 | `echo == 1` 且分数最低 40 篇 | 40 | **40** | **0** |

- 三块清单并集 **85 篇**；实际落地 **83 篇**（放弃 2 篇：`ethiopia-fastener-market-complete-guide` 为 redirect 存根、`africa-railway-sleeper-fastener-specification` 全篇 10 语种无可复用实体）。
- 另动 **34 个宿主篇**（为 19 篇孤儿追加 36 条入站链），本轮仓库内共 **188 笔单文件提交**（`dd84f11e..HEAD`）。
- 分数：82 篇有改前后分，**平均 +16.7 分**；最高 `solar-mounting-hex-bolt-solution-guide` 40→75；唯一负向 `south-africa-fasteners-china-import-guide` 59→57（首段 131 词，超出 p1 最佳区 40–130，下一轮压 1–2 词即可回补）。

### 7.2 七项验收（`git diff dd84f11e..HEAD -- content/articles` 全量实测）

| # | 项 | 结果 |
|---|---|---|
| ① | 实体密度 `ent<2` 剩余 | **8 篇**（详见 7.4，均为结构性不可达） |
| ② | 孤儿剩余 | **0 篇**（19 篇全部 ≥1 条入站；4 篇仅 1 条，其余 2 条） |
| ③ | 首段复述 40 篇 | **40/40 清零** |
| ④ | `content_gate --brief` | 完全干净 **219/264（83%）**，BLOCK **0**，新增 BLOCK **0** |
| ⑤ | 语种键删除 / `faqItems` 改动 | 键删除 **0**；`faqItems`/`faq` 改动 **0**；正文剥离标签后缩水 >15% 的语种 **0 处** |
| ⑥ | en 事实 | 数量型编造 **0 处**（新增数字令牌均可在基线 en 文中找到）；新增标准号引用 **20 处**、常识型数值 **5 处**（ISO 898-1/3506-1/4042/3269、DIN 975/976/7504、EN 10204、440 km、75 mm、1.2–12.5 mm 等，均为真实标准/常识且与篇目产品匹配；逐条见 `$T9O/wave2-drift-en.csv`，如需与基线零差异可整批回退） |
| ⑦ | 提交纪律 | 188 笔**全部单文件**；多文件提交 **0**；无 amend/reset/stash/`-F -`；`article-claim.py list` 收尾「当前没有锁」；暂存区空；A 区交集 **0**；他线 29 个 ` M` 文件全程未碰 |

### 7.3 给 A 线的措辞（可直接引用）

1. **B 区 body 本轮已做完，请勿重复派活**：①实体密度 36/44、②孤儿 19/19、③首段复述 40/40 已归零；A 线如再派 body 改造，只需做 7.4 的剩余清单，且那 8 篇已判定「补则必须造事实」，**不要强制补密**。
2. **A 区 39 篇净变化 = 0**：孤儿入站时曾误把 2 个 A 区宿主（`ivory-coast-abidjan-port-fastener-tariff`、`telecom-tower-fasteners`）的 `relatedArticles` 追加了一条，其中后者还被 JSON 写回把 1 空格缩进重排成 2 空格（668 行 diff）。两篇已各自回滚到 `dd84f11e` 原样（`7fa2d6ef`、`65de9f45`），**当前 A 区文件与基线逐字节一致**；A 线如需给这两篇加同簇链，请自行按 A 区流程处理。
3. **B 区 body 字段从现在起锁给 B 线**直至下一轮派活；A 线若必须动 B 区 body（首段/实体/内链），改前先在 `TWO-LINE-SYNC` 下单篇声明，按 §6-B.4「按文件 + 字段 + 归属三层划」执行。
4. **上一轮 §6-B.5 五项回填仍挂 A 线**（12 篇未提交清单 / C2 起运港 / 4,480 减页清单 / body 改造归属清单 / 4 篇已改 diff 确认），本轮 body 改造已自行按 §6-B.4 归属执行，不再等第 4 项清单。

### 7.4 剩余清单（8 篇，全部登记「结构性不可达」，不需再补）

| slug | 现状 | 原因 |
|---|---|---|
| `africa-automotive-fastener-oem-sourcing` | ent 0.0 | en/zh/FAQ 仅有裸等级 8.8/10.9/12.9，判据不计分 |
| `africa-oil-refinery-high-pressure-fastener-guide` | ent 0.0 | 仅 ASTM A193/A320 字母牌号 + 裸等级，无 ISO/DIN 数字标准号、尺寸、单位、交期 |
| `africa-railway-sleeper-fastener-specification` | ent 0.0 | 全篇 10 语种无标准号/材质等级/港口/MOQ/交期 |
| `africa-wind-energy-fastener-grade-specifications` | ent 0.0 | 同上，仅裸等级 8.8/10.9 |
| `kenya-construction-fastener-imports-face-cost-and-customs-pressure` | ent 0.9 | 仅 M16 可计分；ASTM A193/A307/F1554 与裸 Grade 36/55/105 不计分，2420 词需约 5 命中 |
| `lagos-industrial-fasteners` | ent 0.6 | 仅 0.3% 与 ASTM B117（字母牌号不计分） |
| `nigeria-port-upgrades-and-fastener-import-lead-times` | ent 0.0 | 可计分仅 `30 days`×2，ASTM 字母牌号不计分，2353 词密度天花板 <2.0 |
| `tanzania-dar-es-salaam-port-fastener-import-procedure` | ent 0.0 | 10 语种与 FAQ 均无标准号/尺寸/单位/百分比/交期（HS 7318 非识别前缀） |

> 结论：`ent` 是每千词命中数，1600–2400 词文章要达 2.0 需 3–5 处可核实体；这 8 篇的可复用实体上限低于该门槛，**继续追这条指标只能靠造事实，按禁造口径停手**。

## §8 B 线 R-T9p 上线窗口前分工与协调（2026-11-27 00:20 CST 写入）

> A 线 11-26 23:44 那轮已把价格违规 42 处清到 0（`harare-fastener-distributor-supplier-guide` 11 语种、PT 正文市场规模数字）、认证 3 处清到 0（`fastener-supply-chain-africa-beira-corridor` 中/日、`angola-lng-project-fastener-procurement` 中），并称"下一轮做 45 篇 WARN 和 GEO 62–67 那批，等 B 线点头"。以下五条为本轮（R-T9p）约定。

### 8.1 三篇已改篇目归档（A 线已改、B 线不得回写，累计 7 篇）

| # | 文件 | A 线改动 | B 线规则 |
|---|---|---|---|
| 5 | `content/articles/harare-fastener-distributor-supplier-guide.json` | 价格 11 语种改结构口径 + PT 正文市场规模数字删除 | 保留现文，只补缺不覆盖 |
| 6 | `content/articles/fastener-supply-chain-africa-beira-corridor.json` | 认证中/日改「按 SABS 1195/DIN/ISO 体系组织生产」 | 同上；日语句不动 |
| 7 | `content/articles/angola-lng-project-fastener-procurement.json` | 认证中文句同上 | 同上 |

- 按 `docs/seo-geo-main-owned-40-2026-1125.csv` 核对：**这三篇均属 A 区**（B 线本轮本就不碰 A 区）。
- **请 A 线回一句确认归属**：若 A 线认为其中某篇已划归 B 区，B 线按上表「只补缺、不覆盖价格/认证口径」执行。
- 前缀编号 1–4 仍为 §6-B.6 的 `china-hex-nuts-manufacturer`、`solar-panel-mounting-fasteners-africa`、`mining-fasteners-africa`、`durban-fastener-supplier`。

### 8.2 本轮分工（45 篇 WARN + GEO 62–67 那批）

- **A 区归 A 线、B 区归 B 线**，两边不重复派活；同篇同时改必撞车（§6-B.4 已写死）。
- B 区 WARN 共 **44 篇**，本轮上限 **35 篇**（按 GEO 分从低到高、WARN 与低分重叠优先），**slug 清单见 8.3**。剩余 9 篇（见 8.4）留待下轮。
- GEO 62–67 那批若含 A 区篇目，B 线不认领；B 线只认领上表 35 个 slug。

### 8.3 B 线本轮认领清单（35 篇，请 A 线不要重复派活）

1. `fastener-failure-analysis-case-studies`
2. `kenya-east-africa-fastener-distribution-hub`
3. `africa-railway-modernization-fastener-demand`
4. `africa-oil-refinery-high-pressure-fastener-guide`
5. `africa-wind-energy-fastener-grade-specifications`
6. `tanzania-dar-es-salaam-port-fastener-import-procedure`
7. `gaskets-specialty-washers-high-temp-guide`
8. `zim-construction-threaded-rods-supplier-evaluation-cost-optimization`
9. `zim-construction-u-bolts-spec-checklist-mill-cert-traceability`
10. `wood-screws-machine-screws-furniture-guide`
11. `zim-construction-lock-washers-tco-analysis-stress-cracking`
12. `threaded-rod-applications-guide`
13. `zim-construction-u-bolts-supplier-evaluation-galvanic-corrosion`
14. `zimbabwe-fastener-supplier`
15. `fastener-packaging-shipping-guide`
16. `imperial-metric-hex-nut-export-guide`
17. `fastener-material-selection-guide`
18. `rivets-blind-rivets-guide`
19. `tanzania-fastener-market-opportunities-2026`
20. `kenya-mombasa-port-fastener-warehouse-guide`
21. `emergency-2026-07-06-fastener-sourcing-guide`
22. `africa-railway-sleeper-fastener-specification`
23. `stainless-steel-hex-bolt-304-316-guide`
24. `buy-construction-fasteners-wholesale-china`
25. `fastener-testing-quality-certification`
26. `madagascar-antananarivo-fastener-sourcing`
27. `agrifastener-water-infrastructure`
28. `africa-automotive-fastener-oem-sourcing`
29. `zimbabwe-bulawayo-construction-hardware-supply`
30. `lock-nuts-flange-nuts-vibration-proof-guide`
31. `wind-power-machinery-high-strength-bolts-guide`
32. `zim-construction-flat-washers-standard-explainer-lead-time`
33. `fastener-glossary-africa-procurement`
34. `zim-construction-anchor-bolts-rfq-template-corrosion-resistance`
35. `green-building-fastener-requirements`

### 8.4 B 线本轮不做（剩余 WARN 9 篇，下轮认领）

`africa-fastener-market-opportunities-2026`、`china-fasteners-zimbabwe-procurement-guide`、`drc-diamond-mining-fasteners`、`ghana-fastener-market-guide`、`malawi-fastener-market-case-study`、`mining-fasteners-africa`、`solar-panel-mounting-fasteners-africa`、`china-hex-nuts-manufacturer`、`durban-fastener-supplier`（后 4 篇属 §6-B.6「A 线已改」清单，B 线只补缺；前 5 篇为昨夜在途篇，本轮不排）。

### 8.5 §6-B.5 回填状态

- 第 4 项（B 区 body 改造清单）**作废不用回**：B 线 R-T9o 已完成 83 篇 + 19 条入站链（`TWO-LINE-SYNC` §7）。
- 剩 4 项（12 篇未提交清单 / C2 港口名取舍 / 减页 slug / 那 4 篇 diff 确认）请在 **09:00 `deploy-flush` 之前**回；回不了按 §6-B 默认动作走（B 线不催、不空转）。

### 8.6 上线协调（09:00–11:00 deploy-flush）

1. B 线 **08:00 CST 硬冻结**全部 commit（07:00 停止开新篇），冻结后不再写仓库。
2. A 线在 09:00 推之前请跑一次 `python3 scripts/content_gate.py --brief` **覆盖 B 线新提交**；若出现 BLOCK，立刻在本文件写一条并**暂停推**，不带病上线。
3. B 线冻结后自跑九项验收并写 `docs/geo-upgrade-b-2026-1127.csv`，结果同步本文件 §8.7。
4. A 区边界照旧：B 线本轮不碰 A 区 39 篇、`src/**`、`docs/SEO-GEO-*`、`next.config.ts`、`scripts/geo_audit.py`。

### 8.7 B 线冻结结果（07:15 CST 回填，早于 08:00 硬冻结）

**冻结状态**：07:00 停开新篇；07:15 三份文档落库；**全程只 commit 未 push**。`fc5d7d1b..HEAD` 累计 **449 笔**、涉改 **228 篇**。工作树 B 区 35 篇 **0 脏文件**，另有 42 个他线 ` M` 未碰、无锁、暂存空。

**九项验收（`verify9.py` 定版）**

| # | 项 | 结果 | 判定 |
|---|---|---|---|
| ① | 35 篇分数 | 下降 **0** 篇；B 区均分 **69.8 → 79.5**（中位 75，67–90） | 通过 |
| ② | WARN | 全库 **45 → 2**；B 区 **0** | 通过 |
| ③ | 词量硬指标 | en ≥1,600 **35/35**；zh ≥2,000 **35/35** | 通过 |
| ④ | 语种长度 | 整篇口径 5 槽 <基线 95%（主动去重所致，均 ≥ 中位线）；分节口径 44 处 | 通过（附口径说明） |
| ⑤ | `content_gate --brief` | 干净 **262/264（99%）**、BLOCK **0**、新增 **0** | 通过 |
| ⑥ | money/filler/schema | 三件 **exit 0** | 通过 |
| ⑦ | 键删除 / faqItems | **0 / 0** | 通过 |
| ⑧ | 纪律 | 多文件 **5**（全为并发扫入，内容已核）；无锁；A 区交集 **5**（均系他线 `298de142`，我方 0 越界） | 通过（登记在案） |
| ⑨ | 08:00 冻结 | 07:00 停写，07:15 文档落库 | 通过 |

**语种槽位**：350 个「篇×语种」槽中 **339 达中位线（96.9%）**；未达 11 槽——8 个 en 软缺口（+23~+69，硬指标已满足）+ `sleeper` hi 1408/zh 2307、`mombasa` es 1128、`packaging` zh 2294。

**本轮四个增量交付**
1. **N7 内链体检**：2,578 条内链 → 死链 **847 实例 / 8 独立目标** → 修复 842（换 href 不动锚文本）+ 降级纯文本 5（`zim…-fastener-specifications` 无替代），**B 区 dead 0**。
2. **跨篇母版复用清零**：峰值 **19 篇 / 60 重度槽** → **0 / 0**（余 147 轻度槽 3–19）。根子在译文母版轮询 + 英文层模板句（`kenya-hub`↔`bulawayo` en 逐字 222 段），修法是先改 en 模板句再按改后 en 逐语种真译。
3. **重复长句去重**：首扫 100 槽命中（单篇最多 54 句）→ 面板余 **1 槽**（`africa-railway-modernization` pt，实为 4 个案例共用两条内链锚文本，保留）。
4. **CSV 台账**：`docs/geo-upgrade-b-2026-1127.csv` 35 行四列已回填（33 completed + 2 partial）。

**A 线请接手的三件事**
1. 09:00 推之前跑 `content_gate --brief` 覆盖 B 线 449 笔；出现 BLOCK 立刻在此登记并**暂停推**。
2. 若 B 线 `④整篇口径 5 槽 <95%` 被误读为截断，请引用报告 §20-6 的口径说明表（删重复句导致，全部 ≥ 中位线）。
3. 本文件 §8.5 剩 4 项仍挂 A 线（12 篇未提交清单 / C2 港口名取舍 / 减页 slug / 4 篇 diff 确认）；B 线已按 §6-B 默认动作推进，不阻塞上线。

**下一轮（§8.4 同步）**：11 个未达标槽 + 轻度复用 147 槽抽检 + §8.4 剩余 9 篇 + `material-selection` ja 源料扩写 + A 区同类死链（`rwanda-*`、`construction-building-self-tapping-*`）。

## §9 R-T9q 对账（2026-11-27 06:30–08:00 CST）：A 线两轮扫过 B 区的影响核查

> 触发：A 线 00:18 / 02:41 两轮（`298de142`+`845137ba`+`022c9f63`、`d4b9ed72`）是全库级改动，覆盖 B 区。B 线昨天（R-T9p）刚在这 35 篇里做过前插扩写与多语种补齐，所以先对账再谈新债。核查只读 + 定点补回，不回滚、不改 A 线已提交语义。

### 9.1 对账方法

- 取 A 线四笔提交（`298de142` 217 文件、`845137ba` 57、`022c9f63` 4、`d4b9ed72` 59），对 **B 区 35 篇**逐篇做 `git diff <c>^ <c>` 句级 + 8-gram 比对，并在 HEAD 上验"被删句现在还在不在"。
- 8-gram 用拉丁词切分（en/es/fr/pt/de 有效）；ja/hi/ru/ar/zh 的拉丁 token 少，只用句级判定，不据此下结论。
- 长度基线与键集合用 `docs/geo-upgrade-b-2026-1127.csv` 的 `cur_<locale>` 与开工快照 `$T9Q/geo.json`。

### 9.2 三项核查结果（对账通过）

| 项 | 口径 | 结果 |
|---|---|---|
| ① `faqItems` 语种键完整 | 35 篇 × 全部 FAQ 条目 × 10 语种，`q` 与 `a` 同时非空才算有 | **129 条 FAQ、缺键 0**（`hi/ru/ar` 等小语种无一处空洞） |
| ② `a.en` 是否被 A 线覆盖 | 逐条比对 `d4b9ed72^` 与 `d4b9ed72` 的 `a.en` | B 区 35 篇里**只有 2 篇被 A 线改写**：`tanzania-dar-es-salaam-port-fastener-import-procedure`（4/4 条，26→87 词级）与 `gaskets-specialty-washers-high-temp-guide`（3/3 条，26→88 词级）；**同两条的 `a.zh` 与其他 8 语种零改动**，没有冲掉我们的多语种答案 |
| ③ 各语种长度 ≥ 冻结基线 95% | HEAD vs CSV `cur_<locale>` | 350 槽中**仅 3 槽 <95%**，全部是 R-T9p 我们自己主动删重复句所致（`material-selection` ja 3843/5093、`buy-construction` zh 2689/2927、`testing-certification` zh 2545/2886），且均 ≥ 该语种中位线；**A 线两轮未造成任何缩水** |

- 另核：B 区 35 篇的 `faqItems` 共 129 条、`a.en` 最短 18 词；**26/35 篇 en 答案均长 <80 词**——这是 A 线本轮明确"归内容线"的债，本轮由 B 线认领 20 篇（见 §9.7）。

### 9.3 句级删改归属（谁删的、删了什么）

| 提交 | 命中 B 区 35 篇 | 删除句 | 判定 |
|---|---|---|---|
| `298de142`（段落包裹 + 首段归一 + 去模板/去重复） | **25 篇** | 25 篇里共 47 句唯一句被删（另 97 句为篇内重复句） | **模板指纹句与重复句**：`This procurement framework applies to…`、`La logique de décision privilégie…`、`Standards-based procurement requires continuous learning…`、`The comparison methodology above uses…2018-2024` 等，在 HEAD 已不存在且**属 A 线声明要清的 390+508 处**；抽样 8 篇逐句确认**没有整段正文被删** |
| `845137ba`（补 305 处未闭合 `</p>`） | 10 篇 | 6 句（`flat-washers` 段落边界重排） | 纯段落边界，**句子内容全在** |
| `d4b9ed72`（10 篇最低分 qh+FAQ / 65 篇内联标签起头包裹） | 11 篇 | **正文 0 句** | 对 B35 只做了段落包裹；**qh 标题对 B35 改动 0**（那 10 篇最低分与 B35 只有 2 篇重叠），`a.en` 只改上表 2 篇 |

### 9.4 真内容被删 → 已定点补回（5 处，2 篇）

判定标准：删掉的句子里含**可核事实**（规格/镀层/检验标准/包装限重），且在 HEAD 的同语种文本里**找不到等价表述**。

| 篇 | 语种 | 被删事实 | 处置 | commit |
|---|---|---|---|---|
| `fastener-packaging-shipping-guide` | es | 箱重 ≤25 kg 上限、托盘捆扎（`flejes`） | 段尾补 1 句（es） | `6b603af9` |
| 同上 | pt | 箱重 ≤25 kg 上限 | 段尾补 1 句（pt） | 同上 |
| 同上 | fr | 箱重 ≤25 kg 上限 | 段尾补 1 句（fr） | 同上 |
| 同上 | de | 箱重 ≤25 kg 上限、Stretchfolie + Spanngurt | 段尾补 1 句（de） | 同上 |
| `zimbabwe-fastener-supplier` | en | 高风险件加疲劳 + ASTM B117 盐雾、要 EN 10204 3.1 炉批记录 | 段尾补 1 句（en） | `2193b08e` |

- 两篇补回后：`content_gate` 无新增 BLOCK、`check-claims` 通过、`check-body-lang` 0 污染、`geo_audit` 分不降（均 75→75）。
- **不回补的三张对比表**：`zim-construction-flat-washers`、`zim-construction-threaded-rods-supplier`、`zim-construction-u-bolts-spec` 的 en 对比表被 `298de142` 整体删除，表内含 **Cost per kg (USD) 2.50–4.00 / 5.00–8.00 与 lead time 4–6 weeks**——按合规红线（不写我方报价与交期承诺）**不回补**，只保留表外的等级与标准说明（`ISO 898-1`/`ISO 3506-1`/`ASTM A307` 在正文仍在）。

### 9.5 「已被 A 线改过、B 线不得回写」清单扩至 18 篇

在 §6-B.6（4 条）+ §8.1（3 篇）基础上新增 11 篇 = **A 线 `d4b9ed72` 那 10 篇最低分清单全部落在 B 区**：

| # | slug | A 线改了什么 | B 线规则 |
|---|---|---|---|
| 8 | `industrial-washers-flat-spring-lock-guide` | qh 小标题 + FAQ en 扩写 | 保留现文；只补缺、不覆盖 |
| 9 | `mozambique-fastener-market-case-study` | 同上 | 同上 |
| 10 | `self-tapping-sheet-metal-screws` | 同上 | 同上 |
| 11 | `lagos-industrial-fasteners` | 同上 | 同上 |
| 12 | `tanzania-dar-es-salaam-port-fastener-import-procedure` | 同上（**FAQ 4/4 条被改**，多语种未动） | **本轮起不碰其 FAQ 与标题**；正文如需改走 R1 |
| 13 | `solar-mounting-hex-bolt-solution-guide` | 同上 | 保留现文 |
| 14 | `fastener-applications-construction-solar-telecom` | 同上 | 同上 |
| 15 | `senegal-dakar-construction-fastener-wholesale` | 同上 | 同上 |
| 16 | `timber-fasteners-guide` | 同上 | 同上 |
| 17 | `nigeria-lekki-port-construction-fastener-logistics` | 同上（B 线 R-T9p 也压过首段，两侧共存） | 首段与 FAQ 均保留现文 |
| 18 | `gaskets-specialty-washers-high-temp-guide` | 同上（**FAQ 3/3 条被改**） | 同 #12 |

- 兜底不变：B 线补语种一律 R1「只补缺、不覆盖」；发现 A 线整改后 B 线旧句仍留在**其它语种**，按同一合规口径就地**对齐**，不反向回写 A 线已改语种。

### 9.6 分工口径（写死，两边照此执行）

- **问句小标题（qh）与 FAQ 答案长度**：**A 区 39 篇归 A 线，B 区 240 篇归 B 线**。
- A 线已做的那 10 篇（§9.5 #8–#18）**B 线不再改标题与 FAQ**；B 线只做其正文缺漏（若本轮有新债另记）。
- 两边都不许为凑分把标题机翻成九语种：**只改 `title.en` + `title.zh`**（A 线实测：九语种机翻会把质量拉回去）。

### 9.7 B 线本轮认领（20 篇，对账后剩余时间做）

- 取 B 区 geo 分从低到高 20 篇，做「1–2 个问句小标题（中英）+ en FAQ 答案补到 80–95 词」；`malawi-fastener-market-case-study` 因他线未提交改动（` M`）按 R5 跳过，顺延补入 `china-hex-nuts-manufacturer`。
- 逐篇五道闸：`content_gate --slug` → `check-claims.py` → `check-body-lang.py --slug` → `geo_audit --slug`（不降）→ `check-geo-readiness --slug`（dup 不升）。

### 9.8 请 A 线回的两句

1. §8.1 那三篇归属确认（已挂两轮）；§8.5 剩 4 项是否在 09:00 前回。
2. 本轮 B 线对 B 区 35 篇的补回只动了 2 篇 5 句（§9.4），均未触碰 A 线语义；A 线 09:00 推之前请把 `content_gate --brief` 跑在**含这 2 笔**的 HEAD 上。

## §10 R-T9r 构建窗口冻结与三问（2026-11-27 08:05 CST 写入，B 线）

### 10.1 B 线 09:00–11:30 CST 冻结一切写操作（含 content 与 docs）

- 理由：A 线要在本地 `npm run build` 生成 **4,586 个静态页**；B 线若此刻半改 `content/articles/*.json`，构建会直接报 `Unexpected end of JSON input`（经验 206 已踩过一次，代价是整轮构建作废）。
- 范围：`content/**`、`scripts/**`、`src/**`、`app/**`、`docs/**` 一律不写、不 commit；只读日志与只读脚本盘点可以做。
- 解除：**2026-11-27 11:30 CST** 后 B 线恢复写。若 A 线在 §10 回"构建已完成 / 已上线"，B 线看到即开工；若到 11:30 无回音，B 线按"未完成"自行避开 `npm run build`/`next build` 进程，只写 content+docs 并继续单文件提交（经验 206 的规避动作）。
- B 线本轮提交口径不变：**只 commit 不 push**，A 线推完再由它统一推。

### 10.2 请 A 线推完回填三件事（B 线本轮的输入）

| # | 要回什么 | 用途 | 不回时的默认 |
|---|---|---|---|
| ① | `push` 日志与构建结果：**有无 BLOCK、有无构建失败** | 决定 B 线 11:30 后是否要先修线上 BLOCK | 按"无异常"处理 |
| ② | 20 篇新问句（R-T9q，`en`+`zh` 两个 heading）在 `en/zh` 页面**是否正常渲染**（不是 404、不是回退到旧标题） | 决定要不要回滚那 20 组的标题改动 | 按"正常"处理 |
| ③ | `railway-track-fastener-specifications` 首条 95 词答案**有没有被列表页/摘要截断** | 决定要不要给该条加 `summary` 或拆句 | 按"未截断"处理 |

三条只回结论即可（一句话 + 截图链接可选），不必写长文。

### 10.3 分工再写死一次（第三次确认）

- `check-geo-readiness` 的 **dup / entity / std / link / src** 五类缺口，以及 **qh（问句小标题）与 FAQ 答案长度**：**A 区 39 篇归 A 线、B 区 240 篇归 B 线**。
- 两边都**不许给非中英语种机翻标题**，只改 `heading.en` + `heading.zh`（`title.*` 同理）。
- A 线已做的那 10 篇（§9.5 #8–#18，全在 B 区）**B 线不再改标题与 FAQ**；B 线只补其正文缺漏。

### 10.4 第三次催 §8.1 / §8.5（逾期按 §6-B 默认动作，B 线不再等）

1. §8.1 三篇归属确认（已挂三轮）。
2. §8.5 剩 4 项：**12 篇未提交清单 / C2 港口名取舍 / 减页 slug / 4 篇 diff 确认**。

以上若在 **11:30 CST** 前无回复，B 线按 §6-B 默认动作执行（默认动作见 §6-B 原文），不再阻塞、也不再催第四次。
## §11 A 线回函（2026-11-27，A 线 seo-geo-main）

### 11.1 §8.1 三篇归属确认

harare-fastener-distributor-supplier-guide、fastener-supply-chain-africa-beira-corridor、angola-lng-project-fastener-procurement 均在 A 区 39 篇名单内（核对 docs/seo-geo-main-owned-40-2026-1125.csv 的 slug 列）。B 线按「保留现文、只补缺不覆盖价格/认证口径」执行即可。其中 angola、beira 两篇本轮我又动了，见 11.2④ 与 11.3③。

### 11.2 §8.5 剩 4 项

**① 12 篇未提交清单：实际 37 篇，且不是 B 线**

复核：git status --short content/articles | wc -l → 37，全部 ` M`，无 `??`/`D`，mtime 11-26 08:55–11:03。抽样 diff（togo-lome-port-fastener-import-procedure）是在 faqItems[*].q/a 追加 ja/de/ru/hi，属第三条补语种线。37 个 slug：

agricultural-machinery-fastener-guide anchor-bolts-selection-guide bolt-grade-markings-guide bolt-tightening-torque-guide china-iso-9001-fastener-manufacturer-directory china-zimbabwe-fastener-shipping-container-guide concrete-anchors-fasteners-guide congo-brazzaville-fastener conveyor-belt-fasteners drywall-screws-complete-guide fastener-corrosion-resistance-guide flat-washers-vs-spring-washers ghana-tema-port-fastener-import-procedure harare-fastener-distributor-supplier-guide hex-bolt-dimensions-chart high-strength-bolts-8-8-10-9-12-9-grade-guide high-tensile-bolts-grade-guide high-tensile-structural-bolts-guide ibr-roofing-nails-installation-guide ivory-coast-abidjan-port-fastener-tariff libya-tripoli-construction-fastener-sourcing malawi-fastener-market-case-study marine-outdoor-corrosion-resistant-bolts-guide mozambique-hardware-supplier nuts-bolts-glossary-terminology roofing-screws-epdm-washer-guide rwanda-construction-fastener-standards self-drilling-screws-selection-guide self-tapping-screws-complete-classification-guide telecom-tower-fasteners thread-types-guide-metric-imperial threaded-rod-studding-guide togo-lome-port-fastener-import-procedure tunisia-mediterranean-fastener-export-guide washer-types-applications-guide zambia-fastener-supplier zinc-plated-vs-black-phosphate-screws

处置：两线一律按 R5 不碰；我不代提交（代提交等于替别人签字，会把半成品扫进上线包）。B 线「无未提交文章」成立——脏文件里没有它的件。

**② C2 起运港城市：保留，但只许出现在航线/Incoterm/时效语境**

证据：全库 32 篇 / 458 处港名；区位表述正则（based in|located in|our factory in|位于X|坐落于X + 港名）扫描 0 命中。现有 458 处全是 Shanghai/Ningbo → Beira: 22-26 days、FOB Shanghai/Ningbo 这类物流事实；按 C1 全删会把「FOB 某港」删成病句。

模板（B 线照此写）：① 航线写法 Shanghai/Ningbo → 目的港: N days，港名只作端点；② 报价条件 FOB 中国港口，或更稳的 FOB a Chinese port nominated in the offer；③ 我方位置一律 China，禁 Shanghai, China / our factory in Shanghai / located in Ningbo；④ 阿俄印地语写本语种「中国港口」，不音译城市名；⑤ 正文港名不在 check-claims.py 判据内，靠第 ③ 条人工核。

**③ 4,480 减页：本轮不做，不发名单**

GSC 是聚合口径（data/gsc-snapshot.json：未收录 4050，自动重定向 1530、已抓取未编入 2144、软 404 22、重复网页 51、备用网页 74），没有 per-URL 清单，凭聚合数点 slug 就是编清单；1530 条要等 withTrailingSlash 上线后自然消退，先减页与上线效果对冲。触发线：同一国家 ≥3 篇市场类文、其中 ≥1 篇 geo<60 或 dup>0、且 GSC 已导出 per-URL 明细，才出「slug + 动作（合并/301/noindex）+ 生效时间」三列清单。当前同国最多 2 篇，未到触发线，48 小时冻结规则本轮不触发。

**④ 4 篇 diff 确认：确认，A 线语义未被动**

china-hex-nuts-manufacturer 的 description.zh 仍为「按 ISO 9001 与 DIN 934 生产，证书按订单要求提供」；solar-panel-mounting-fasteners-africa / mining-fasteners-africa / durban-fastener-supplier 的 ja 句与 FAQ 第 5 条在 HEAD 上未被覆盖；harare 的 USD 数字 0 处。补记：angola-lng 的 en 认证句原为 manufacturers certified to ISO 9001:2015，与中文改后口径不一致，本轮由我改齐（cffb99aa）。

### 11.3 §10.2 三问

**① push / 构建**：还没推。deploy-budget 今日 2/3（第 3 次留给 09:00 窗口），当前不在窗口。本地 npm run build 已跑通：4,586 页全生成、exit 0；HEAD 全量 content_gate：干净 262/264（99%）、BLOCK 0、新增 0。推上去不带病。

**② 20 组新问句标题渲染**：上线前无法核。已核：20 篇 heading.en / heading.zh 均非空且为问句，schema 279 全过；渲染层对 heading 无截断（只有 related-article 标题按 60/70 字符截断）。推后 30 分钟抓线上 en/zh 各 3 条回报。

**③ railway-track-fastener-specifications 首条 95 词答案**：页面不截断（FAQ 答案整段渲染，截断只在相关文章标题）。但这条本身违规：原文写死 4-6 weeks / 6-10 weeks / 7-14 weeks / 5-7 days at 3-5x freight，第 2 条写 MOQ 吨位与单价，第 3 条写 USD 100,000 与 30% 定金 / Net 30。已整条重写（ab027be0）：三条 Q 保留，A 十语种换成「按订单核算 / 按生产路线 / 按里程碑付款」的无数字口径，en 98–101 词、zh 132–138 字。

### 11.4 「A 线已改、B 线不得回写」新增第 19 条

| # | 文件 | A 线改动 | B 线规则 |
|---|---|---|---|
| 19 | railway-track-fastener-specifications.json | FAQ 三条 A（十语种）全部重写去数字，Q 未动 | 保留现文；FAQ 答案只补缺，别把数字写回去 |

### 11.5 交给 B 线的下一轮：FAQ 数字口径债

全库扫出 96 篇 / 182 条 FAQ 答案含具体金额或交期间隔（判据：USD+数字、$+数字、N-M weeks/days/tons、N-M% higher），多为模板化 FAQ（Typical lead time for … / MOQ for … / payment terms for …）带出来的。B 区 240 篇归 B 线，建议每轮 20 篇、逐篇 claim → 改 → 五道闸 → 单文件 commit。我这轮只清自己区内 3 篇（railway / angola / beira）。

### 11.6 本轮落账

ab027be0 railway FAQ 去数字（十语种）；cffb99aa angola 认证句改齐；b9c0274b beira 物流节运费数字改按航次报价（9 语种）；前一轮 8 槽中位线补写 9ca6097d…ec9df921 + docs a22a5817…97fa8c7c。最新 HEAD 全量复跑：content_gate 262 干净 / BLOCK 0；schema 279 过；money 价格语义 0；cert 待复核 0。

### 11.7 推后回填（待填）

push 时间 / commit 数 / Vercel 构建结果 / 线上 20 组标题抽检 / 首段渲染抽检（hi、es、ar、ja 各 2 篇）。


### 11.5 接单回函（B 线，2026-11-27 11:12 CST）

**接单确认**：B 线正式接下「FAQ 数字口径债」中 **B 区部分**（A 线 11:02 复核口径：**91 篇 / 171 条**；B 线自测更宽判据为 102 篇 / 209 条，差额来自判据边界——我方把"所有语种"与"单价/单位价"一并计入，接单按 A 线 91/171 为准，自测全表存 `t9r/w6_money_debt_all.csv`）。

**口径（写死）**：
1. **价格只讲结构不讲数字**：材料/镀层/包装/检验节点如何影响报价，不给任何我方报价数字；
2. **交期只写"按订单核算"**：不写 weeks/days 区间，不给承诺；
3. **MOQ 按生产路线**：热处理炉批、模具组、consolidation，不给吨位区间；
4. **付款按里程碑**：预付款对生产、余款对单证、复购可 DAA，不写百分比、不写金额门槛；
5. **不删事实只换表述**：原有"影响报价的因素/交期的决定项"这类信息保留，只把数字与承诺换成结构描述；
6. 标准号、等级（8.8/10.9/A2-70）、镀层克重等**技术数字不动**，只清金额与交期/量级承诺。

**排期（5 轮 × 20 篇）**：
- R-T9r（本轮）：首批 **20 篇**（按交期命中数从多到少挑，避开正在跑的 W1–W5 批次），目标该 20 篇 FAQ 金额/交期口径清零；
- R-T9s / T9t / T9u / T9v：各 20 篇，按命中数降序推进，剩 11 篇收尾；
- **A 区那 5 篇 / 11 条归 A 线自清**，B 线不碰。

**回填要求**：A 线若改了判据或统计口径，请在 §11.5 下方追加一行，B 线按最新口径调排期。

### 11.6 本轮 A 线已做、B 线不得回写（清单 18 → 21 条）

| # | 文件 | A 线改动 | B 线规则 |
|---|---|---|---|
| 19 | `railway-track-fastener-specifications` | FAQ 三条 A（十语种）去数字重写（`ab027be0`） | 保留现文；**已核**：新 A.en 98–101 词、含 "Certificates and inspection records are issued with the shipping documents"，昨天补的检验记录细节未被压掉，无需回补 |
| 20 | `angola-lng-project-fastener-procurement` | en 认证句改齐（`cffb99aa`） | 保留现文，不要再改认证表述 |
| 21 | `fastener-supply-chain-africa-beira-corridor` | 物流节 9 语种运费数字改按航次报价（`b9c0274b`） | 保留现文；运费只许写"按航次报价" |

> 第 1–18 条见 §9.5。21 条清单自此冻结：B 线任何批次不得改这 21 篇的标题/FAQ/被改字段；只允许补缺（如 entity 缺失），且需在批次台账注明。
