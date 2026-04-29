# TradeGo外贸独立站 - 项目知识

> 本文件是Claude Code/OpenClaw理解TradeGo项目的核心入口。
> 等同于文章说的"新人onboarding文档"。

---

## 项目概述

- **名称**：TradeGo Fasteners外贸独立站
- **技术栈**：Next.js 16 + React 18 + TailwindCSS + TypeScript
- **托管**：Vercel（生产环境 www.tradego-fasteners.com）
- **类型**：B2B外贸展示站，主攻津巴布韦/非洲市场
- **核心功能**：产品展示、SEO优化、多语言(i18n)、GEO智能识别

---

## 项目结构

```
tradego-fasteners-v2/
├── src/
│   ├── app/                    # Next.js App Router页面
│   │   ├── [locale]/          # i18n路由（en, es, fr, pt）
│   │   ├── products/          # 产品详情页
│   │   ├── categories/        # 分类页
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   ├── lib/                   # 工具函数
│   ├── i18n/                 # 国际化配置
│   └── contexts/             # React上下文
├── scripts/                   # 自动化脚本
│   ├── auto-seo-v2.sh        # SEO自动化（主用）
│   ├── gen-*.js              # 内容生成
│   └── seo-image-optimize.sh # 图片优化
├── public/
│   └── images/               # 产品图片
└── .next/                    # 构建输出（勿动）
```

---

## 编码规范

### Next.js 16 关键规则

```javascript
// ✅ 正确：使用next/link
import Link from 'next/link'

// ✅ 正确：App Router的metadata API
export const metadata = {
  title: 'xxx',
  description: 'xxx'
}

// ❌ 错误：next.config.js的trailingSlash配置
// Vercel部署时不要加trailing slash，会导致重定向循环
```

### 样式规范

- 使用TailwindCSS，不要写裸CSS
- 响应式设计：mobile-first
- E-E-A-T图片：真实工厂照片 > AI生成图

### 图片规范

- 放到`public/images/`目录
- 引用路径：`/images/xxx.jpg`
- 图片优化：>100KB需压缩，<100KB才是好的

---

## 部署流程（⚠️ 关键！）

### 标准部署
```bash
npm run build
npx vercel --prod
```

### 依赖变更后部署（必须加--force！）
```bash
npm run build
npx vercel --prod --force   # ← 每次依赖变更后必须加！
```

**为什么？** Vercel会缓存node_modules，依赖变更后不强制重建会导致网站异常（内容消失/白屏）。

**验证部署成功的标志**：
- 构建日志中有`"Detected Next.js version: 16.2.3"`
- 运行`npx vercel logs www.tradego-fasteners.com`检查无报错

### 回退流程
```bash
# 查看可用版本
git log --oneline -10

# 回退到指定版本
git reset --hard <commit>
npx vercel --prod --force
```

---

## 测试策略

```bash
# lint检查（必需）
npm run lint

# 构建测试（部署前必须跑）
npm run build
```

---

## 🔴 最常踩的坑（必读！）

### 1. Vercel部署后内容消失
**表现**：用户报告网站打不开/白屏/内容消失
**根因**：依赖变更后直接`vercel --prod`没有`--force`，Vercel用了旧缓存
**解决**：必须加`--force`，见上方部署流程

### 2. Next.js 16 breaking changes
**表现**：代码按旧写法报错
**规则**：先读`node_modules/next/dist/docs/`再看文档写代码
**关键点**：App Router优先，Page Router是旧写法

### 3. SEO图片质量差
**表现**：Google排名低，Core Web Vitals差
**根因**：使用了AI生成图或小于100KB的图片
**规则**：产品图必须>100KB，工厂照片优先

### 4. Git push忘记部署
**规则**：改完即push，不要忘记`git commit`
**自动化**：已配置CI/CD，但每次代码变更后要检查部署状态

### 5. 多语言路由配置错误
**位置**：`src/i18n/`目录
**规则**：新增语言需要在`i18n.ts`和`dictionaries/`同时配置

---

## SEO工作流

### 日常SEO（每日/每周）
```bash
./scripts/auto-seo-v2.sh    # 主自动化脚本
./scripts/check-rankings.sh # 排名检查
```

### SEO审计（发现问题后）
1. 运行`./scripts/auto-seo-v2.sh --dry-run`预览
2. 检查`SEO-AUDIT-YYYY-MM-DD.md`报告
3. 人工确认后去掉`--dry-run`执行

---

## 常用命令速查

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 构建 |
| `npm run lint` | 检查 |
| `npx vercel --prod --force` | 生产部署（依赖变更后） |
| `npx vercel logs www.tradego-fasteners.com` | 查看部署日志 |
| `./scripts/auto-seo-v2.sh` | SEO自动化 |

---

## 项目联系人

- **负责人**：总裁（WhatsApp: +8615963409951）
- **Agent**：创业掌舵人·战略总监（OpenClaw）

---

*最后更新：2026-04-29*
*来源：4次Hero迭代教训 + Vercel部署失败经验*
