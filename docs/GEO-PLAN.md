# TradeGo GEO 自动化优化方案
## 目标：让AI（ChatGPT/Grok/Gemini/Claude）收录你的网站

---

## 🎯 核心目标

**让AI搜索引擎（ChatGPT、Grok、Gemini、Claude等）在回答用户相关问题时，能够引用/收录TradeGo网站的内容。**

---

## 🌍 目标市场

### 津巴布韦边境国家（你的核心市场）

| 国家 | 主要城市 | 贸易重点 | 边境口岸 |
|------|---------|---------|---------|
| **南非** | Johannesburg, Durban, Pretoria | 综合制造、矿业 | Beitbridge (最大边境) |
| **赞比亚** | Lusaka, Ndola, Kitwe | 铜矿、边境贸易 | Chirundu |
| **莫桑比克** | Maputo, Beira, Tete | 港口、煤炭 | Forrestry |
| **博茨瓦纳** | Gaborone, Francistown, Kasane | 钻石、畜牧业 | Martins Drift |

---

## 🤖 GEO vs 传统SEO

| 对比项 | 传统SEO | GEO (Generative Engine Optimization) |
|--------|---------|-----------------------------------|
| 目标 | Google/Bing排名 | AI引擎回答时引用 |
| 方式 | 关键词密度、外链 | 结构化内容、Schema标记、FAQ |
| 爬虫 | 实时抓取 | 训练数据+RAG |
| 重点 | 排名算法 | **内容可被AI理解和引用** |

---

## 📋 GEO优化策略

### 1. 内容层面（AI友好的问答内容）

每篇文章包含：
- **FAQ问答**: 针对AI可能会问的问题
- **清晰的结构**: 让AI容易提取关键信息
- **多语言内容**: 9种语言覆盖主要市场
- **数据表格**: AI容易解析的结构化数据

**示例FAQ问题（AI可能会问）:**
```
Q: What fasteners are most imported to South Africa from China?
Q: What is the border crossing situation for trade between Zimbabwe and Zambia?
Q: What are the import duties on fasteners in Botswana?
```

### 2. 代码层面（Schema标记）

网站已有组件：
- ✅ OrganizationSchema - 公司信息
- ✅ FAQSchema - 常见问题（AI最爱）
- ✅ ArticleSchema - 文章结构
- ✅ VideoSchema - 视频内容
- ✅ ProductSchema - 产品信息
- ✅ LocalBusinessSchema - 本地商业信息
- ✅ BreadcrumbSchema - 面包屑导航
- ✅ ReviewSchema - 评论/评分

### 3. 技术层面

- ✅ 多语言支持（9种语言）
- ✅ Canonical URL - 避免重复内容
- ✅ XML Sitemap - AI可发现所有页面
- ✅ Robots.txt - 正确的爬虫规则
- ✅ Open Graph - 社交分享优化

---

## ⚙️ 自动化工作流程

### 每日 08:00 自动执行

```
┌─────────────────────────────────────────────────────┐
│  Cron 定时器 (每天 08:00 Asia/Shanghai)              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  gen-zimbabwe-border.js                              │
│  • 检查已覆盖的边境国家                              │
│  • 生成新的GEO文章（每次1-2篇）                      │
│  • 9种语言内容                                      │
│  • AI友好的FAQ                                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  auto-seo.sh                                        │
│  • 网站可访问性检查                                  │
│  • Sitemap验证                                      │
│  • Schema标记检查                                    │
│  • 响应时间测试                                      │
│  • 页面状态检查                                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Git 自动提交推送                                    │
│  → Vercel 自动部署                                  │
└─────────────────────────────────────────────────────┘
```

---

## 📊 已生成的内容

### 津巴布韦边境市场文章

| 文章 | 国家 | 语言 | 状态 |
|------|------|------|------|
| Zambia Fasteners China Import Guide | 赞比亚 | 9种 | ✅ |
| Mozambique Fasteners China Import Guide | 莫桑比克 | 9种 | ✅ |
| Botswana Fasteners China Import Guide | 博茨瓦纳 | 9种 | ✅ |
| South Africa Fasteners China Import Guide | 南非 | 9种 | ✅ |

每篇文章包含：
- 市场概况（规模、货币、语言）
- 边境贸易信息
- 从中国进口指南
- 物流和边境口岸详情
- 5+个AI友好FAQ问题
- 数据表格（易于AI解析）

---

## 🚀 下一步计划

### Phase 1: 基础设施 ✅ 已完成
- [x] 创建gen-zimbabwe-border.js
- [x] 创建auto-seo.sh
- [x] 生成4个边境国家的GEO文章
- [x] 配置每日Cron任务

### Phase 2: 内容扩展（进行中）
- [ ] 为每个国家生成更多细分文章
  - 矿业专用紧固件指南
  - 农业建筑紧固件指南
  - 沿海地区不锈钢紧固件
- [ ] 添加当地语言关键词
- [ ] 添加更多FAQ内容

### Phase 3: 技术优化
- [ ] 添加更多Schema类型
- [ ] 优化页面加载速度
- [ ] 添加结构化数据验证
- [ ] 提交到AI友好的目录

---

## 📈 预期效果

### 短期（1-3个月）
- ✅ 所有目标页面有完整的Schema标记
- ✅ 津巴布韦边境市场文章全覆盖
- ✅ 每日自动化运行，稳定产出

### 中期（3-6个月）
- 📈 AI引擎开始收录网站内容
- 📈 在相关查询中出现
- 📈 品牌认知度提升

### 长期（6-12个月）
- 🎯 AI回答中频繁引用TradeGo内容
- 🎯 成为"AI信任的来源"
- 🎯 带来稳定的B2B询盘

---

## 📝 Cron任务设置

```bash
# 编辑crontab
crontab -e

# 添加每日08:00执行
0 8 * * * cd /Users/zhangming/workspace/tradego-fasteners-v2 && ./scripts/auto-seo.sh >> logs/cron.log 2>&1
```

---

## 📁 文件结构

```
tradego-fasteners-v2/
├── scripts/
│   ├── auto-seo.sh              # 主自动化脚本
│   └── gen-zimbabwe-border.js   # GEO文章生成器
├── content/
│   └── articles/
│       ├── zambia-fasteners-*.json      # 赞比亚文章
│       ├── mozambique-fasteners-*.json  # 莫桑比克文章
│       ├── botswana-fasteners-*.json     # 博茨瓦纳文章
│       └── south-africa-fasteners-*.json # 南非文章
└── logs/
    ├── auto-seo-YYYY-MM-DD.log  # 每日SEO日志
    └── geo-generation-YYYY-MM-DD.log  # 文章生成日志
```

---

## 🔍 如何验证效果

### 1. 检查文章生成
```bash
cd /Users/zhangming/workspace/tradego-fasteners-v2
node scripts/gen-zimbabwe-border.js
```

### 2. 检查网站状态
```bash
./scripts/auto-seo.sh
```

### 3. 查看日志
```bash
cat logs/auto-seo-2026-04-26.log
```

### 4. 验证AI收录（示例问题）
问ChatGPT/Grok:
```
"What are the main border crossings for trade between Zimbabwe and South Africa?"
"Where can I find reliable fastener suppliers in Zambia?"
```

---

**文档更新时间**: 2026-04-26
**下次审查**: 2026-05-26
