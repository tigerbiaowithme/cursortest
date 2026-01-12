# Coolify 部署问题解决方案

## 🔴 当前问题

### 问题 1：构建失败 - package-lock.json 不同步

**错误信息：**
```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: yaml@2.8.2 from lock file
```

**原因：**
- `package.json` 和 `package-lock.json` 文件不同步
- 可能有依赖被添加或修改，但没有更新 `package-lock.json`

**解决方案：**
1. 在本地运行 `npm install` 更新 `package-lock.json`
2. 提交并推送到 GitHub
3. 重新部署

---

### 问题 2：环境变量配置警告

**警告信息：**
```
⚠️ Build-time environment variable warning: NODE_ENV=production
Issue: Skips devDependencies installation which are often required for building (webpack, typescript, etc.)
Recommendation: Uncheck "Available at Buildtime" or use "development" during build
```

**原因：**
- `NODE_ENV=production` 在构建时可用
- 当 `NODE_ENV=production` 时，npm 会跳过安装 `devDependencies`
- Next.js 构建需要 `devDependencies`（如 TypeScript、ESLint 等）

**解决方案（两种方法）：**

#### 方法一：取消 "Available at Buildtime"（推荐）

1. 在 Coolify 环境变量页面
2. 找到 `NODE_ENV` 变量
3. **取消勾选 "Available at Buildtime"**
4. 保持 "Available at Runtime" 勾选
5. 保存

这样 `NODE_ENV=production` 只在运行时生效，构建时不会影响依赖安装。

#### 方法二：构建时使用 development（不推荐）

1. 添加两个环境变量：
   - `NODE_ENV_BUILD=development`（构建时使用）
   - `NODE_ENV=production`（运行时使用）
2. 配置构建命令使用 `NODE_ENV_BUILD`

**不推荐原因：** 方法一更简单，推荐使用方法一。

---

## ✅ 解决步骤

### 步骤 1：修复 package-lock.json

在本地项目目录运行：

```bash
npm install
```

这会更新 `package-lock.json` 文件，确保与 `package.json` 同步。

### 步骤 2：提交并推送

```bash
git add package-lock.json
git commit -m "Fix package-lock.json sync"
git push
```

### 步骤 3：修复环境变量配置

1. 在 Coolify 中，进入 **Environment Variables** 页面
2. 找到 `NODE_ENV` 变量
3. 点击 **"Update"** 按钮
4. **取消勾选 "Available at Buildtime"**
5. **保持勾选 "Available at Runtime"**
6. 保存

### 步骤 4：重新部署

在 Coolify 中触发新的部署。

---

## 📋 环境变量配置总结

### 正确的环境变量配置

| 变量名 | 值 | Available at Buildtime | Available at Runtime |
|--------|-----|----------------------|---------------------|
| `MONGODB_URI` | `mongodb+srv://...` | ✅ 勾选 | ✅ 勾选 |
| `JWT_SECRET` | `your-secret-key` | ✅ 勾选 | ✅ 勾选 |
| `NODE_ENV` | `production` | ❌ **不勾选** | ✅ 勾选 |

**为什么 NODE_ENV 不勾选 Buildtime？**
- 构建时需要 `devDependencies`（TypeScript、ESLint 等）
- 如果 `NODE_ENV=production` 在构建时可用，npm 会跳过 `devDependencies`
- 只在运行时需要 `NODE_ENV=production`（用于性能优化）

---

## 🔍 验证

部署成功后，检查：
- ✅ 构建日志中不再有 `NODE_ENV=production` 警告
- ✅ `npm ci` 成功执行
- ✅ 应用正常启动
- ✅ 可以访问网站

---

## 💡 额外提示

### 如果还有其他构建问题

1. **查看完整构建日志**
   - 在 Coolify 中点击 "Show Debug Logs"
   - 查看具体错误信息

2. **检查 Node.js 版本**
   - 当前使用 Node.js 22
   - 确保项目兼容此版本

3. **清理缓存**
   - 在 Coolify 中可能需要清理构建缓存
   - 或者在 General 设置中调整缓存策略

---

## 📚 参考

- [Coolify部署完整指南.md](./Coolify部署完整指南.md)
- [环境变量详细说明.md](./环境变量详细说明.md)
