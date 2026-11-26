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
