# /tradego-triage

> Vercel部署问题根因分析。先收集证据，再系统诊断，不凭猜测下结论。

## 触发时机
- 总裁说"部署后网站打不开"、"网站内容不对"
- `/tradego-deploy` 部署失败
- 用户报告网站异常

## ⚠️ 第一原则
**不猜测，只验证。** 每个结论必须有日志/截图/数据支撑。

---

## 诊断流程

### Step 1：收集证据（先于诊断）

```bash
# 1. Vercel部署日志
npx vercel logs www.tradego-fasteners.com --limit 50

# 2. 本地构建是否正常
cd ~/workspace/tradego-fasteners-v2
npm run build 2>&1 | tail -20

# 3. DNS检查
dig +short www.tradego-fasteners.com

# 4. 服务器端测试（curl）
curl -sL -w "\nHTTP_CODE: %{http_code}" https://www.tradego-fasteners.com -o /dev/null

# 5. Vercel项目状态
npx vercel ls
```

**收集输出后，再进入Step 2。**

---

### Step 2：分类诊断

根据Step 1的输出，判断是哪种问题：

#### 🔴 类型A：部署失败（Build Error）
**判断**：vercel logs里有"Error:""Build failed""Command exited with code"

```
常见根因：
1. npm run build 报错 → 本地先跑 npm run build 看具体错误
2. ESLint阻止构建 → .eslintrc 或代码有lint错误
3. 依赖版本问题 → package.json 和 vercel 检测的版本不一致
4. 环境变量缺失 → .env.local 的变量在Vercel不存在

处理顺序：
① 本地跑 npm run build → 复制完整错误
② 如是lint错误 → 修复后重新部署
③ 如是依赖问题 → 删 node_modules + package-lock.json 重新安装 + --force 部署
④ 如是环境变量 → 在 Vercel Dashboard → Settings → Environment Variables 配置
```

#### 🟡 类型B：部署成功但内容消失
**判断**：vercel logs有"Deployment completed"但网站白屏或内容不对

```
常见根因：
1. Vercel缓存了旧的node_modules → 必须 --force 部署
2. 依赖变更后没有清除缓存 → npm run build 成功但部署用了旧代码
3. 最新一次部署实际失败了但显示成功 → 检查vercel logs的具体build step

处理顺序：
① npx vercel --prod --force（强制清除缓存）
② 等待3分钟后重新访问
③ 再跑 vercel logs 检查是否有新的错误
④ 如仍有问题 → 回滚到上一个可用的commit
```

#### 🟠 类型C：Vercel路由问题（间歇性不可访问）
**判断**：本地curl返回200但用户打不开，DNS正常

```
常见根因：
1. Vercel边缘节点不稳定 → 等10分钟再试
2. 域名解析偶尔失败 → dig查DNS，等2分钟再dig对比
3. 用户本地网络问题 → 让用户清DNS缓存或换浏览器确认

处理顺序：
① 确认不是我们的问题（服务器端curl正常）
② 告知总裁这是Vercel路由问题，不是代码问题
③ 联系Vercel支持（vercel.com/help）
④ 如频繁发生 → 考虑备用域名或CDN方案
```

#### 🔵 类型D：代码级问题
**判断**：网站能打开，但具体功能报错（按钮不工作/表单提交失败）

```
常见根因：
1. JavaScript运行时错误 → 检查浏览器Console（F12）
2. API端点路径错误 → 检查 Network 面板的请求
3. 环境变量值错误 → Vercel环境变量里的值是否正确

处理顺序：
① 用camofox或browser工具打开网站截图
② 打开Console检查错误
③ 根据错误信息定位代码文件
④ 修复后重新部署
```

---

### Step 3：生成修复计划

基于以上诊断，输出：

```markdown
## 部署问题诊断报告

**问题类型**：<A/B/C/D>
**严重程度**：🔴 紧急 / 🟡 中等 / 🟢 低

**根因**：<具体是哪行代码/哪个配置问题>

**证据**：
```
<粘贴关键日志/错误信息>
```

**修复计划**：
1. <第一步做什么>
2. <第二步做什么>
3. <第三步做什么>

**验证方式**：<如何确认修复成功>

**回滚方案**：<如果修复失败怎么回退>
```

---

### Step 4：执行修复

按修复计划执行，每一步都要验证后再下一步。

---

### Step 5：通知总裁

修复完成后：
```
✅ 部署问题已修复

问题：<简单描述>
根因：<一句话说明>
修复：<做了什么>
验证：<确认方式>
```

---

## 常见错误速查表

| 错误现象 | 最可能根因 | 第一动作 |
|---|---|---|
| 部署失败，lint报错 | ESLint规则未通过 | 本地跑 npm run lint 修错误 |
| 部署失败，依赖报错 | node_modules版本不一致 | 删除重装 + --force |
| 部署成功但网站白屏 | Vercel缓存旧代码 | npx vercel --prod --force |
| 网站能ping通但打不开 | Vercel边缘节点问题 | 等10分钟再试 |
| 内容是旧版本 | 没有--force | npx vercel --prod --force |
| 按钮点不了 | JS运行时错误 | 浏览器Console查错误 |

---

## 回滚命令

```bash
# 查看可用版本
git log --oneline -10

# 回滚到指定版本
git reset --hard <commit-hash>
npx vercel --prod --force
```

---

*参考：mattpocock/skills - triage-issue skill*
*适配：TradeGo Vercel部署场景*
*融合：根因分析流程 + 已知Vercel部署坑*