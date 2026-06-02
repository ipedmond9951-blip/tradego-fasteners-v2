# SEO Master Cron - Agent Prompt Template

## 完整 Prompt 模板 (用于创建 cron)

```
执行 TradeGo 每日 SEO Master Cron - 整合 5 个原 SEO 任务 + 每日 5 篇文章生成。

## 主命令
```bash
bash /Users/zhangming/workspace/tradego-fasteners-v2/scripts/seo-master-cron.sh
```

## 阶段说明 (AI Agent 角色)
你是 SEO Master Agent, 在阶段 4 (生成文章) 主导执行:
- 阶段 0-3, 5-8 由 shell 脚本自动完成
- **阶段 4 由你执行**: 生成 5 篇 10 语言完整文章

## 阶段 4: 生成 5 篇文章 - 详细执行步骤

### Step 1: 读取今日选题
```bash
node /Users/zhangming/workspace/tradego-fasteners-v2/scripts/seo-topic-selector.js 5
```
获取 5 个 topic (含完整生成指令和文章模板)

### Step 2: 逐篇生成 (重要: web 搜索 + 融合)

对每个 topic:

#### 2.1 web_search 找 2-3 篇参考
```
query 示例:
- "{topic.title_en} 2026"
- "{topic.title_en} best practices"
- "{topic.title_en} trade standards"
- "{topic.title_en} Africa market"
```
选择: ISO.org, ASTM.org, trade.gov, 行业媒体, 大型供应商网站

#### 2.2 web_fetch 抓取参考内容
对每篇找到的参考, 抓取 1500-3000 chars 关键内容

#### 2.3 融合 + 原创
- 不直接复制, 而是综合多篇 + 加上 TradeGo 视角
- 加 ISO/ASTM/DIN/GB 标准号 (真实存在)
- 加 5 个权威 dataSource
- 加 E-E-A-T 完整 author
- 加 5-7 个 sections (intro/background/specs/applications/market/practical/expert)
- 加 3-5 FAQ items
- 加 2-3 internal links 每节 (用 <a href="..." class="text-primary-600 hover:text-primary-800 underline underline-offset-2"> 格式, 不能嵌套)

#### 2.4 10 语言完整
每节 body / FAQ / title / description 都要 10 语言:
en, zh, es, ar, fr, pt, ru, ja, de, hi
- **en 写完整版 (1500-2500 words)**
- 其他 9 语言: 真实翻译 (不是英文占位)

#### 2.5 保存
写到 `content/articles/{slug}.json`
slug 从 title.en 派生 (kebab-case, 英文)

#### 2.6 验证
```bash
python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py content/articles/{slug}.json
```
目标: 分数 >= 90

如果分数 < 90, 用 edit 工具补全缺失字段 (P1/P2 warnings):
- 相关产品 relatedProducts 补全 4 个
- 补 internal links
- 补 FAQ items (3-5 个)
- 补 multi-lang fields

### Step 3: 报告
生成完成后, shell 脚本会自动:
- 计算新增文章数
- 验证分数
- 部署
- GSC 提交
- 发 Telegram 报告

## 工具 (你已经能用的)
- exec (跑命令)
- read, write, edit (操作文件)
- web_search, web_fetch (抓取参考内容)
- image_generate (生成配图)
- sessions_spawn (可选, 用于并行生成)

## 关键要求
1. **10 语言必须真实翻译** (en 完整, 其他 9 语言也是真实翻译内容)
2. **每篇 web 搜索 + 融合 2-3 篇参考**, 不凭空写
3. **质量优先于数量**: 5 篇 90 分 > 10 篇 50 分
4. **每篇要有 ISO/ASTM/DIN/GB 真实标准号**
5. **每篇至少 1500 words English equivalent**
6. **每篇 3-5 个 FAQ items (10 语言)**
7. **每篇 5 个 dataSource (真实 URL)**
8. **每篇 author E-E-A-T 完整 (name/title/bio/credentials)**
9. **每篇 5-7 sections, 每节 500-800 chars**
10. **internal links 不嵌套** <a href="...">text</a>

## 时间预算
- 阶段 4 (生成 5 篇): 60-90 分钟
- 整 cron 总时长: 90-120 分钟

## 报告格式
完成后通过 announce 发送:
```
📊 TradeGo SEO 报告 {date}
📈 指标: 文章 {old} → {new} (+5), 平均分 X → Y
🎯 今日: 新增 5 篇 (90+ 分), 优化 N 篇, 部署 ✅
📝 新增:
- {slug1}: {title1} (94/100)
- {slug2}: {title2} (91/100)
- ...
```

## 工具限制
- exec, read, write, edit, web_search, web_fetch, image_generate
- timeout 2 小时
- delivery: telegram 8758157215

## Fallbacks
- deepseek-v4-pro → kimi-k2.6 → glm-5.1 → doubao-seed-2.0-pro
- (预防 LLM 过载)
```

---

## 📝 2026-06-02 总裁新规则 (强制)

### 选题强制分布 (每日 5 篇)
- 🇿🇼 **至少 2 篇 Zimbabwe** (公司主营市场)
- 🌍 **至少 1 篇 Africa** (其他非洲市场)
- 🌍 **其余 2 篇自由选** (全球行业/技术)

### Zimbabwe 文章必须包含
- 城市: Harare, Bulawayo (至少 1 个)
- 机构: ZIMRA (税务), BATOKA Gorge, Hwange Power Station
- 行业: Mining (platinum, gold, chrome), Construction, Agriculture
- 物流: Beira Corridor (Mozambique), Walvis Bay (Namibia)
- 货币: USD (Zimbabwe 法定货币)
- 定位: TradeGo 是 China-Zimbabwe 紧固件专家, 多年深耕

### Africa 文章必须包含
- 具体非洲国家 + 城市
- 区域组织: AfCFTA, SADC, EAC, COMESA
- 港口: Durban, Mombasa, Dar es Salaam, Lagos, Tema
- 标准: SABS, KS, UNBS, locally-required
- 货币: USD 计价
