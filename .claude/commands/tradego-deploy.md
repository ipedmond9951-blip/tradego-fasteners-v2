# /tradego-deploy

> 生产部署命令。先跑lint+build，再部署，验证通过才算完成。

## 触发条件
自动执行，不需要用户确认。

## 执行步骤

### 1. 构建前检查
```bash
cd ~/workspace/tradego-fasteners-v2
git status --short
```

### 2. Lint检查
```bash
npm run lint
```
**失败标准**：exit code != 0

### 3. 构建测试
```bash
npm run build
```
**失败标准**：exit code != 0

### 4. 部署
```bash
npx vercel --prod --force
```
**注意**：如果是依赖变更（package.json改过），必须带`--force`

### 5. 验证部署
```bash
npx vercel logs www.tradego-fasteners.com --limit 20
```
**验证点**：
- 无报错
- 确认Next.js版本是16.2.3

### 6. 通知结果
成功：返回"✅ 部署完成，网站：https://www.tradego-fasteners.com"
失败：返回"❌ 部署失败，请检查上方错误"

---

## 使用方法
```
/tradego-deploy [是否依赖变更]
```
- 不带参数：标准部署
- 带参数（如"是"或"有package.json变更"）：自动加`--force`
