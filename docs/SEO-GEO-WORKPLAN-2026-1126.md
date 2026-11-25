# TradeGo SEO / GEO 工作计划（2026-11-26 起）

> **这份文件是什么**：执行层工单。谁在哪个对话里接手内容整改，按这份文件从上往下做。
> **排期冲突时**：以 `docs/SEO-GEO-STRATEGY.md` 为准（它是唯一排期表），本文件只补充"今天线上是什么状态、每件事具体怎么做、怎么算做完"。
> **最后更新**：2026-11-25 19:50（上海）｜A 线推送完成后实测

---

## 0. 先读这三段，再动手

1. **线上已经是新版了**，不用再等推送窗口。推送前那套"只准备清单、不动内容"的冻结已经解除。
2. **动手前先领租约**：`python3 scripts/article-claim.py claim <slug> <线名>`，被占用就换一篇，别硬上。
3. **改一篇 = 改该篇全部语种**再提交，只按显式文件名提交（`git commit -m "…" -- content/articles/<slug>.json`），禁止 `git add content`。

---

## 1. 上线状态（已核实，2026-11-25 19:47 上海）

| 项 | 实测 |
|---|---|
| 本地 vs 远端 | `origin/main` = `667780d3`，领先/落后 **0**，工作区干净 |
| 生产部署 | `dpl_CL7sEzXr`（对应提交 `667780d3`），三个域名均指向它 |
| 抽样验证 | `/en/industry/structural-steel-connections-guide/` 首段新文案已在线，该页 `<p>` 从 33 → **64** |
| 下一步不需要 | 不需要再 push、不需要再 promote；下次改动走正常流程即可 |

---

## 2. 上线后实测基线（这批数字就是接下来所有工单的靶子）

### 内容契约（`python3 scripts/content_contract.py --quiet`）

- **BLOCK 0**，WARN **65** 篇（全部 `body-size`）
- 英文不足 1,600 词：**51 / 264 篇**

### GEO（`python3 scripts/geo_audit.py`）

- 均分 **62.7**（A 90+ 11 篇 / B 30 / C 51 / D 66 / **E <60 106 篇**）
- 首段逐字复述标题 **141 篇**｜实体密度 <2/千词 **63 篇**｜FAQ 不足 3 条 0 篇
- 问句化标题（qh）大面积是 **0.0**，这是全站最整齐的一个短板

### 结构与覆盖

- 模板文（`check-template-filler.py`）：**11 / 279 篇**（从 30 降下来，阈值 50%）
- 跨篇共用整句 >15%：**120 篇**
- 正文语种污染（`check-body-lang.py`）：**english 级 14 处 / 18 篇**
- **8 个非英语语种的段落缺口：8,318 节**（es 1,052、pt 1,063、fr 1,040、de 1,041、ru 1,044、ar 1,032、hi 1,039、ja 1,007）；en 只剩 24 节、zh 3 节
- 本地 FAQ 覆盖：en **100%**、zh 47.7%、ja 28.4%、fr/pt/es 约 23%、de/ru 22%、hi 20.1%、**ar 10.6%**
- 标题超 55 字符：**905** 个「文章 × 语种」组合，其中非英语 **834**（es 154 / fr 150 / de 132 / ru 130 / pt 115 / ar 83 / hi 70 / en 70）
- 零入链（按 `relatedArticles` 口径）：**18 篇**；正文出链中位数 **0**，内链全靠 `relatedArticles`

---

## 3. 工单（按顺序做，做完一件再开下一件）

每单都写清：做什么、谁做、怎么验、什么算做完。**没写验法的不要开工**。

### W1 · 修掉 14 处英文残留（约 1 小时，1 人）

- **做什么**：打开 `docs/content-lang-leaks-2026-1125.csv`，逐行定位 `slug / section / field.lang`，把那几句英文按原意译回该语种（不是删掉，是译回去并保留信息量）。
- **重点三处**：`fastener-glossary-africa-procurement` 第 5 节 es/fr/pt/de 四语言各一段同一英文；`ghana-building-materials` pt 两节；`botswana-construction-boom-fastener-import` ar 两句（其中一句是"阿拉伯语句子夹英文谓语"）。
- **怎么验**：`python3 scripts/check-body-lang.py --slug <slug>` 该篇 english 归 0；全库 `--strict` 退出码 0。
- **做完的标志**：`check-body-lang.py --strict` 全库 0，然后把它挂进 `content_contract` 或 pre-commit 的拦截面（**先修完再挂，挂早了当晚推送会被卡死**）。

### W2 · 8 语种段落化（核心，5–6 天，一天一语种）

- **做什么**：`python3 scripts/paragrapher.py --locale es --apply`（一次只跑一个语种），跑完立刻 `--dedupe --locale es`，再跑契约。
- **顺序**：es → pt → fr → de → ru → ar → hi → ja（写死，别改；ja 最难放最后）。
- **工具状态**：已支持 8 语种、写回前做"去空白后逐字相等"自检，全库实测 **8,318 节自检失败 0**；`docs/geo-locale-para-plan-2026-1125.csv` 有每语种的节数/预计段数/预计新增重复。
- **怎么验**（每个语种跑完都验，不过不进入下一个）：
  1. `python3 scripts/content_contract.py --quiet` → BLOCK 必须 0（hi/ja 会唤醒 80 余处重复段，用 `--dedupe` 清完才回 0）
  2. `python3 scripts/geo_audit.py --top 5` → 均分不得下降
  3. 抽 1 篇线上同语种页面，确认 `<p>` 数明显上升（部署后才有意义）
- **做完的标志**：8 语种各自"段落数 > 0"的章节占比 ≥ 95%，`docs/geo-para-dup-2026-1125.csv` 里 160 行重复清零。

### W3 · 标题短写（1–2 天，按曝光排序）

- **做什么**：`docs/seo-meta-gaps-non-en-2026-1125.csv` 里 `issues` 含 `title>55` 的行，逐条在 JSON 里把标题写短（≤55 字符含空格），不要靠代码 slice。
- **公式**：`品类 + 场景 + 一个可核差异`（例 `EPDM Roofing Washers: 14–22 mm, 1.5 mm Rubber`）。
- **禁用**：`Complete Guide` / `Best` / `Ultimate` / 价格数字 / 认证字样。
- **顺序**：先做 `docs/seo-p0-ctr-pages-2026-1125.csv` 里有曝光的语种，再按 exposure 列降序铺开；es/fr/de 三语种占了一半。
- **怎么验**：该篇 `--slug` 契约 0 BLOCK；再统计 `len(title) > 55` 的计数下降。
- **做完的标志**：905 → 0（或仅剩必须保留的长尾，需写明理由）。
- **注意**：`page.tsx:40` 的 `slice(0,55)` 对所有语种生效，改标题不等于改代码；要不要调阈值是 A 线的事，不在这单范围。

### W4 · 补内链（半天，脚本辅助 + 人工过一遍）

- **做什么**：`docs/internal-link-plan-2026-1125.csv` 给了 18 篇零入链页 × 3 个宿主页共 54 条边，把 `relatedArticles` 加进宿主页（双向优先）。
- **人工必看**：`shared_terms` 只有 1–2 个词的边（如 `africa, demand`）要么换宿主，要么在正文加一句真实关联再链，别为凑数硬塞。
- **禁令**：不许在文末硬塞"相关阅读"列表；链接必须出现在讲这件事的段落里。
- **怎么验**：重算入链图，零入链 = 0；抽 2 篇看渲染。
- **做完的标志**：零入链 18 → 0。

### W5 · GEO 首段与问句化（3 天，先 20 篇）

- **做什么**：按 `geo_audit.py` 分数升序取 20 篇（当前最差：`bulk-fastener-ordering-strategies` 34、`drc-mining-concession-fastener-logistics` 37、`nigeria-lekki-port-construction-fastener-logistics` 37…），每篇四件事：
  1. 首段压到 40–130 词，第一句就是定义/结论（`X is …`），带 1 个可核数字
  2. 首段**不许**逐字复述标题（echo 归 0）
  3. 每个 H2 改成采购真问题（`Can I substitute 8.8 for 10.9?`），qh ≥ 0.25
  4. 正文加 1–2 句「X 是/指的是…」的定义句
- **怎么验**：`geo_audit.py --slug` 分数上升且 `p1` 落 40–130、`echo=0`、`qh≥0.25`。
- **做完的标志**：20 篇均分 ≥ 75，全库均分只升不降。

### W6 · 非英语 FAQ 本地化（1–2 周，按曝光，别平铺）

- **背景**：`nativeText()` 禁止 FAQ 回退英文，所以缺本地问答的语种**直接不输出 FAQPage**。全站 9/10 语言面上的文章页现在没有这块结构化数据。
- **做什么**：只做有曝光的页面（先 20 篇 × 有曝光语种），每篇补 ≥3 条本地问答（问题用本地语搜索词，答案 80–110 词）。
- **怎么验**：`geo_audit.py --slug` 的 faq 项达标；部署后抽查该语种页面含 `FAQPage`。
- **做完的标志**：目标 20 篇的对应语种 FAQPage 全部输出；`ar` 从 10.6% 抬起来是优先级最高的一项。

---

## 4. 每单都要过的闸门（fail-closed）

```bash
python3 scripts/content_gate.py --slug <slug>     # 0 新增 BLOCK
python3 scripts/check-claims.py                   # 认证/地域/工厂直供口径
python3 scripts/check-body-lang.py --slug <slug>  # 语种串位
python3 scripts/geo_audit.py --slug <slug>        # 分数不降、p1 落 40–130
python3 scripts/contract_selftest.py --quiet      # 校验器自身没坏
```

每批结束再加：`content_contract.py --brief`、`check-template-filler.py`、`check-money-claims.py`、`check-geo-readiness.py`、`check-ja-clean.py`。

---

## 5. 红线（改错就得回滚）

1. **认证**：只写"按 SABS 1195 / DIN / ISO 生产"或"证书按订单要求提供"。**不写已持有，也不写不持有**。站点 UI、`public/llms.txt`、社媒事实卡三处同步。
2. **价格**：不写具体报价数字，只讲报价结构，中英同步改。
3. **地域**：只写 China，含非拉丁写法；批量替换后查"中国中国 / China (China)"残句。
4. **数字**：只给标准限值或标准号，不写"提升 30%"这类无出处百分比。
5. **不编标准编号**：不确定就只讲标准族。
6. **别为清零改坏正确表述**：`check-cert-claims.py` 会把"ISO 9001 认证代表最低质量体系要求"这类**描述第三方标准**的句子算成自称持有——主语不是本公司就保留原文。
7. **三条不做**：不靠新增页面增长、不再加 FAQ（英文侧）、不再堆 schema。

---

## 6. 汇报口径（每批结束贴这几行）

```bash
python3 scripts/content_contract.py --quiet | tail -8
python3 scripts/geo_audit.py | head -2
python3 scripts/check-template-filler.py | tail -1
python3 scripts/dup_audit.py --top 3 | head -2
```

对照本文件第 2 节的基线写差异，不要只报"做完了几篇"。

---

## 7. 交出去的三件事（不归内容线做）

| 给谁 | 事项 | 原因 |
|---|---|---|
| A 线 | `page.tsx:40` 的 `slice(0,55)` 阈值按语种调整或取消 | SERP 按像素裁，55 字符对德/法/西偏紧，代码截断会切在词中 |
| A 线 | 是否给非英语页面在缺本地 FAQ 时输出 `FAQPage`（当前故意不输出） | 这是产品决策，不是内容缺口能单方面解决的 |
| F 线 | 策略第 5 节批次与第 1 节基线需要按本文件第 2 节刷新；"不再加 FAQ"需改成"英文侧不再加" | 旧基线的 GEO 61.7 / 模板 30 / 积压 216 提交都已过期 |
