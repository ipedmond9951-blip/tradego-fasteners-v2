# TradeGo GEO+SEO 20轮优化计划

**制定时间**: 2026-04-23
**目标**: 让ChatGPT/Grok/Claude等AI搜索时优先找到TradeGo

---

## 第一阶段：GEO知识学习 (Round 1-2)

### Round 1: GEO核心规则学习
**目标**: 理解GEO与SEO的本质区别

**GEO核心原则**:
1. **AI引用优先** - 目标是"被AI在回答中引用"
2. **实体清晰** - Who/What/Where/When明确标注
3. **可验证事实** - 数据/统计/引用容易被验证
4. **对话式内容** - FAQ风格，AI能提取和综合
5. **原创性信号** - 独特数据/洞察/案例
6. **结构化输出** - 清晰的层级，方便AI解析

**GEO友好代码**:
- 使用语义化HTML标签
- JSON-LD结构化数据(已有)
- 清晰的heading层级
- FAQ Schema(已有)
- HowTo Schema
- ItemList Schema

### Round 2: 竞品网站研究
**目标**: 学习GEO做得好的网站

**研究对象**:
1. 同行优秀网站的结构
2. 内容组织方式
3. FAQ内容模式
4. 产品描述风格

---

## 第二阶段：GEO内容优化 (Round 3-10)

### Round 3-4: FAQ页GEO优化
**问题**: 当前FAQ内容是否容易被AI引用?
**行动**:
- 添加更多"为什么"问题
- 添加具体数字/统计
- 添加来源引用标注
- 优化问答格式便于AI提取

### Round 5-6: 文章页GEO增强
**行动**:
- 为每篇文章添加HowTo Schema(如果适用)
- 添加Article Schema的author credentials
- 添加cite/eventStatus标注
- 优化文章摘要(AI生成答案时引用)

### Round 7-8: 产品页GEO优化
**行动**:
- 添加Product Schema的brand/publisher
- 添加详细规格表(ItemList)
- 添加应用场景描述
- 添加质量认证标注(ISO等)

### Round 9-10: 信任信号强化
**行动**:
- 添加ExpertSchema(如果有)
- 添加ReviewSchema增强
- 添加Awards/ Certifications结构
- 添加工厂/公司实拍图片标注

---

## 第三阶段：产品上传学习 (Round 11-14)

### Round 11-12: Alibaba产品页研究
**行动**:
- 研究Alibaba产品标题模式
- 研究图片拍摄风格
- 研究关键词布局
- 提取可复用格式

### Round 13-14: Made-in-China对比研究
**行动**:
- 对比两个平台的差异
- 找出最适合我们的模式
- 制定产品上传模板

---

## 第四阶段：技术优化 (Round 15-18)

### Round 15-16: AI可读代码优化
**行动**:
- 优化语义化HTML
- 添加noscript内容(给禁用JS的AI看)
- 优化面包屑导航
- 添加aria-labels

### Round 17-18: 性能+可访问性
**行动**:
- 优化图片alt(已有)
- 添加skip-link
- 优化meta robots
- 添加hreflang标注

---

## 第五阶段：内容补充 (Round 19-20)

### Round 19: 添加数据支撑内容
**行动**:
- 添加行业统计数字
- 添加公司历史里程碑
- 添加客户案例(国家/数量)

### Round 20: 自我审计+部署
**行动**:
- GEO checklist自检
- 部署上线
- 生成GEO健康报告

---

## 执行命令

使用 /auto-review-loop-minimax 执行20轮优化
每轮完成后自动commit+push

---

## GEO Checklist

- [ ] FAQ Schema完整
- [ ] Article Schema完整
- [ ] Product Schema完整
- [ ] HowTo Schema(适用页面)
- [ ] Breadcrumb Schema
- [ ] Organization Schema
- [ ] LocalBusiness Schema
- [ ] Review/Rating Schema
- [ ] 语义化HTML
- [ ] aria-labels
- [ ] 详细alt文本
- [ ] 具体数字/统计
- [ ] 来源引用标注
- [ ] 信任信号(认证/奖项)
- [ ] 原创内容信号

---

*Plan Version: 1.0*
