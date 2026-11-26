# 采购框架样板块治理方案（DUP-BLOCK）

> 生效日期：2026-11-26 ｜ 试点线：`seo-geo-main`（A 区）｜ 范围：A 区 5 篇试点，不铺开全站
> 仓库：`/Users/zhangming/workspace/tradego-fasteners-v2`
> 配套数据：`docs/dup-sentences-2026-1126.csv`（改写前 101 族）、`docs/dup-sentences-residual-2026-1126.csv`（改写后残留 70 族）

## 1. 背景与诊断（已实测，直接引用）

- 全库实测：总 **279** 篇 = **264** 篇正文 + **15** 篇 `redirectTo` 存根；A 区 **39** 篇、B 区 **240** 篇。A 区名单唯一来源：`docs/seo-geo-main-owned-40-2026-1125.csv` 的 `slug` 列。
- 改写前 **101** 族跨篇重复句；上一轮逐篇改写后残留 **70** 族（≥3 篇为族）。残留判定：rewrite 51 / review 39 / compliant 11（101 族口径）；残留 70 族内 verdict 为 应改写 48 / 保留 22。
- 残留主干：一个约 **22 句**、覆盖 **90–97 篇**的「采购框架 + 五案例方法学」样板块；**23 个 ≥50 篇的族全部出自这里**。最大族 138 篇是内链导航块（合规保留，不动）。
- 结论：局部逐篇改写不降族数。族数只在某一族被清到 **≤2 篇**时才减 1（机制见 §6），所以必须用「一篇 canonical hub 保留框架 + 其余篇去重并内链 hub」的结构治理，而不是继续逐句打散。

### 1.1 扫描口径（重算族数时必须逐字一致）

- 只扫 `sections[].body.en`；剥 HTML 标签；按 `(?<=[.!?])\s+` 或换行切句；
- 句子 **≥40 字符**；小写、折叠空白；同 slug 去重；**≥3 篇**为一族。
- 重算脚本口径与 `scripts/dup_audit.py` 不同（后者 >60 字符、无换行切分）；族数对照一律以本节口径为准。

## 2. 用户已拍板的决策（照写，不改）

1. **不全站铺开改写，也不整段删。**
2. 选 **1 篇**做「采购框架」canonical hub，**从既有高曝光篇里挑、不新造页**（候选从 A 区 39 篇里按 GSC 曝光与「是否天然适合做采购框架总纲」两条挑，理由与被否候选见 §3）。
3. 其余篇规则：**保留 2–3 句本篇专属摘要 + 内链到 hub**，删掉逐字重复的框架句。
4. **硬约束**：每次替换后该 section 正文词数不得比现有值低超过 **5%**；否则同段补本篇**已有事实**（港口、标准号、工期、涂层体系等），**不许编造**。`body-size` WARN 只许减不许增。
5. 执行分工：**A 区由本线试点**，B 区 240 篇由 B 线按本文档执行，本线不越界。

## 3. Canonical hub 选择

### 3.1 选定

| 项 | 值 |
|---|---|
| hub slug | `high-tensile-structural-bolts-guide` |
| hub URL | `/en/industry/high-tensile-structural-bolts-guide#procurement-checklist` |
| 落点章节 | `procurement-checklist`（Procurement Checklist for African Projects） |
| GSC | 曝光 959 / 点击 2（A 区中上） |
| 框架命中 | 23 个残留族（A 区并列第一） |

**选它的理由：**

- A 区 39 篇里，它是**唯一同时**满足三条的候选：① 已内嵌完整采购框架族（23 个大族命中，并列第一）；② 自带独立 `procurement-checklist` 章节，可直接作为 canonical 落点锚点，不用新造页或新造章节；③ 曝光在 A 区中上（959），内链权重有承接基础。
- 该章节现有内容（MTR、尺寸复核、涂层体系、螺母/垫圈匹配、标记、供应商评估与记分卡）正好是通用采购框架的天然载体；hub 保留这套框架的规范表述，其余篇只留本篇摘要并回链到此锚点。
- hub 自身本轮**不做去重剥离**：它是框架的保留方。把框架打磨成干净 canonical 章节是后续单独任务，不在本试点内。

### 3.2 被否候选（两条：曝光 / 适配度）

| 候选 slug | GSC 曝光/点击 | 否决理由 |
|---|---|---|
| `china-iso-9001-fastener-manufacturer-directory` | 166 / 1 | 定位已锁定「认证按订单办理」（见 `docs/SEO-GEO-STRATEGY.md` 口径定稿段），既不是名录也不是质量体系指南；改作采购总纲会与锁定定位冲突，且曝光低。 |
| `roofing-screws-epdm-washer-guide` | 2244 / 30 | 曝光最高，但主题是 EPDM 垫圈/屋面密封，通用采购框架放进去会稀释 topical focus，内链相关度低。 |
| `hex-bolt-dimensions-chart` | 1946 / 31 | 曝光/点击最高之一，但属于尺寸对照表页面，主题窄；框架总纲与尺寸表语义不匹配。 |
| `zinc-plated-vs-black-phosphate-screws` | 1486 / 12 | 镀层对比专题，主题窄。 |
| `bolt-grade-markings-guide` | 1282 / 6 | 等级标识专题，主题窄。 |
| `anchor-bolts-selection-guide` | 805 / 3 | selection 角色接近，但锚栓主题窄，仅承载 12 个大族，框架完整度不足。 |
| 区域供应商页（`zambia-*`、`mozambique-*`、`congo-*` 等） | — | 地域锁定，不适合做全球采购框架总纲。 |

## 4. 其余篇改写规则（试点与 B 线通用）

### 4.1 保留不动

- **p1 冻结**：每篇第一个 `</p>` 之前的内容逐字不动。
- `heading` / `title` / `section.id` 不动；非目标句子不动。
- **内链导航块**（`Related resources: …`，138 篇族，合规保留）逐字保留。
- **标准定义参考行**（ISO 898-1 / ISO 3506-1 / ISO 3269 / ISO 4042 / ISO 1502 那一句，112 篇族）保留。
- **单证/认证/法律口径**句保留；方法学免责与区域标准清单按既有 R5 经验保留。

### 4.2 需要替换的框架句（残留 verdict = 应改写）

典型样板句（节选，全表见 residual CSV）：

- 「This procurement framework applies to fastener sourcing for construction, mining, energy, automotive, and general industrial applications.」
- 「The decision logic prioritizes quality consistency, supplier reliability, and total cost of ownership over short-term unit price.」
- 「Standardized specifications that travel across projects reduce training time, RFQ processing time, and supplier onboarding effort.」
- 「Actual market prices fluctuate with raw material costs (steel, zinc, nickel), energy costs, labor costs, and currency exchange rates.」
- 「For accurate comparison, request identical RFQs from 3-5 qualified suppliers and compare landed cost …」
- 「Supplier evaluation should be a continuous process, not a one-time exercise.」/ 记分卡权重句 / 「Drop suppliers scoring below 70% …」
- 「The verification checklist applies to both initial supplier qualification and ongoing batch inspection.」/ 高风险应用加测句 / 验证成本 0.1–0.3% 句。
- 跨国采购协调句、区域框架清单句（SABS/KEBS/TBS/ZIMRA/SON/AfCFTA）、本地标准强制句。

### 4.3 替换写法

- 每处样板句替换为 **2–3 句本篇专属摘要**：只写本篇已有的事实（应用场景、规格/等级、涂层体系、港口/项目地名、安装或检验要点、本篇标准号），**不引入新数字、新报价、新认证**。
- 在该 section 末尾（或摘要句旁）加 **1 条回链 hub**：
  `<a href="/en/industry/high-tensile-structural-bolts-guide#procurement-checklist" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">procurement framework and supplier evaluation checklist</a>`
- 同一段内若样板句成组出现，合并改写为一段本篇摘要 + 1 条 hub 回链，不要每句各挂一条链接。
- **新写内容不得复述**「五案例方法学 2018–2024」这类跨篇样板；方法学年份表述随样板句一并移除。

### 4.4 词数硬线（决策 4）

- 替换后该 section 英文正文词数 ≥ 改前的 **95%**（允许小幅波动，不得低于原值 95%）。
- 不足时同段补本篇**已有事实**（已有港口、标准号、工期、涂层体系、规格范围、检验要点），**不许编造**。
- `body-size` WARN **只许减不许增**；`geo_audit` 的 `words` 不得低于原值 95%，en 分量不得掉。

## 5. 口径红线（任何语种、任何线）

- **认证**：只写「按 SABS 1195 / DIN / ISO 生产」或「证书按订单要求提供」；不写已持有，也不写不持有。
- **报价**：不写具体单价/折扣数字，只讲报价结构（料价 + 表面处理附加 + 运费/保险/关税的 landed cost 结构）。
- **地域**：发货/办公地只写 `China`；目的港、项目地名属正常业务信息可保留。
- **署名**：`Edmond | TradeGo Fasteners`。
- **第三方验货机构**：SGS / Bureau Veritas / Intertek 全称每篇只出现一次。
- 新写内容不得出现跨篇样板复述（见 §4.3）。

## 6. 族数机制说明（为什么逐篇改写降不动族数）

- 一族 = 同一句归一化后出现在 **≥3 篇**。族数 **只在该族成员被清到 ≤2 篇时才减 1**；成员从 92 篇降到 80 篇，族数仍然不变（仍是一族）。
- 这就是「改了 42 篇、族数却只从 101 降到 70」的原因：多数族还有几十篇挂着，远没跌破 3 篇门槛。
- 本方案的结构治理能让大族逐步解体：hub 保留一份规范表述，其余篇改成各自专属摘要后，同一句的成员数逐批下降；只有当某族在一批批清理后跌破 3 篇，该族才从计数中消失。**试点后族数下降可能很小，属机制内预期，如实记录，不美化。**

## 7. 替换前后自检清单

### 7.1 单篇闸门（每篇改完立刻跑，全绿才提交）

1. `python3 scripts/content_gate.py --slug <slug>` —— **0 BLOCK**；`body-size` WARN 不得新增（改前 `warn: []`，改后不得出现 body-size 类 WARN）。
2. `python3 scripts/check-body-lang.py --slug <slug>` —— english / script / label / noise 四类计数**不得高于改前**。
3. `python3 scripts/check-stray-markup.py --slug <slug>` —— 无半截模板残留。
4. `python3 scripts/check-claims.py` —— 认证/地域/工厂产权/贸易商表述不过界。
5. `python3 scripts/geo_audit.py --slug <slug>` —— en 分量不得掉；`words` 允许小幅变化但 **≥ 原值 95%**。

### 7.2 两轮 8 词滑窗查重

- **第一轮（批内）**：本批 5 篇两两互比；剔除标准号 / 牌号 / 规格 / 单位后，8 词滑窗重合 **≤15**。
- **第二轮（对全库）**：本批 5 篇分别对全库其余篇；同样剔除标准号/牌号/规格/单位后，8 词滑窗重合 **≤15**。
- 命中超阈值的片段回到 §4.3 重写为本篇专属表述。

### 7.3 逐字节全等断言

- 写回前 `json.loads` 深拷贝，递归 diff；写回后与 `git show HEAD:<仓库相对路径>` 比对。
- **除目标句子外零变化**；断言必须用仓库相对路径（`git show HEAD:<绝对路径>` 会返空串，让断言静默失效）。
- `heading` / `title` / `section.id` / 非目标语种 / FAQ / meta 等未改字段逐字节全等。

### 7.4 写锁与提交纪律

- 改任何 `content/articles/<slug>.json` 前：`python3 scripts/article-claim.py claim <slug> seo-geo-main`（TTL 30 分钟）；退出码 1 = 被持锁 → **跳过并登记**，不硬上、不删锁文件。
- commit 成功后 `release`；收尾 `python3 scripts/article-claim.py list` 自查名下无残留锁。
- **一次一笔、单文件**：消息写 `/tmp/msg-<slug>.txt`，再 `git add <单文件> && git commit -F /tmp/msg-<slug>.txt -- <同一单文件>`。**禁止 `git commit -F -`**（stdin 读会永久阻塞并残留 `.git/index.lock`）。
- 提交前后核对 `git diff --cached --name-only` 与 `git show --name-only HEAD`。
- 不 push、不跑 `scripts/vercel-promote.sh`、不加 `DEPLOY_FORCE`、不碰部署预算。

## 8. 回滚办法

- 每篇单文件提交，单笔可回滚：`git revert <commit-hash>` 即可只撤该篇，不影响同批其他篇。
- 回滚后重新 `article-claim list` 确认无残留锁；若回滚后需要重做，重新领锁再改。
- 文档 `docs/DUP-BLOCK-PLAN.md` 单独一笔提交，回滚不牵连正文。

## 9. B 线批次建议（240 篇）

- **10 篇/批**；**并发 ≤3**；每批跑完 §7.1 五项闸门 + §7.2 两轮滑窗再落盘。
- 批次内先领写锁再改；撞锁/在途 ` M` 一律让位登记（R5），不 `restore`/`checkout`/`stash`。
- B 线按本文档 §4 规则执行；hub 链接统一指向 §3.1 锚点。
- 每批结束重算一次族数（§1.1 口径），登记每篇命中族数前后变化；族数下降按 §6 机制如实记。
- 非英语种镜像为后续独立批次，不在本试点内；本试点只改 `body.en`。

## 10. 本轮试点名单（A 区）

排除：禁改两篇 `ghana-building-materials`、`angola-lng-project-fastener-procurement`；在途 ` M` 八篇；被持锁篇目。

按残留族命中数排序（同数按 GSC 曝光降序）：

| # | slug | 改前命中族 | 角色 |
|---|---|---|---|
| hub | `high-tensile-structural-bolts-guide` | 23 | canonical hub，框架保留，不去重 |
| 1 | `telecom-tower-fasteners` | 23 | 试点剥离 |
| 2 | `fastener-corrosion-resistance-guide` | 20 | 试点剥离 |
| 3 | `hex-bolt-dimensions-chart` | 19 | 试点剥离 |
| 4 | `marine-outdoor-corrosion-resistant-bolts-guide` | 19 | 试点剥离 |
| 5 | `high-strength-bolts-8-8-10-9-12-9-grade-guide` | 19 | 试点剥离 |

备份候选：`conveyor-belt-fasteners`（18）。让位/持锁/未能处理的篇目在收尾报告逐条登记。

## 11. 边界与不改项

- 不改 `docs/SEO-GEO-WORKPLAN.md` 与 `docs/CONTENT-CONTRACT.md`（编排侧写）。
- A 线合法范围仅 A 区 39 篇；B 区 240 篇归 B 线，本线不越界。
- 在途 ` M` 文件、被别线持锁文件只登记不碰。
