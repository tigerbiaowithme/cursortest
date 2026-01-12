# Coolify 部署完整指南

本指南将详细说明如何在 Coolify 中配置和部署 Devos 网站项目。

---

## 📋 前置条件

- ✅ 项目已上传到 GitHub：https://github.com/tigerbiaowithme/cursortest.git
- ✅ 已安装并运行 Coolify
- ✅ MongoDB Atlas 已配置（用于生产环境）

---

## 第一步：创建新应用

1. 登录 Coolify 控制台
2. 点击左侧菜单的 **"Projects"**（项目）
3. 点击 **"Create a new Application"**（创建新应用）

---

## 第二步：Repository（仓库）配置

### 配置说明

**Repository 字段：**
- **填写内容：** `tigerbiaowithme/cursortest`
- **为什么：** 这是您的 GitHub 用户名和仓库名称的组合
  - 格式：`用户名/仓库名`
  - Coolify 会自动识别这是 GitHub 仓库
  - 如果只填写了 `cursortest`，需要点击 "Load Repository" 按钮来加载

**操作步骤：**
1. 在 Repository 输入框中填写：`tigerbiaowithme/cursortest`
2. 点击 **"Load Repository"** 按钮
3. 等待 Coolify 加载仓库信息

**如果仓库没有自动加载：**
- 检查是否已经添加了 GitHub App（点击右上角的 "+ Add GitHub App"）
- 确保 GitHub 仓库是公开的，或者您已经授权 Coolify 访问私有仓库

---

## 第三步：Configuration（配置）详解

### 1. Branch（分支）

**配置选项：**
- **填写内容：** `master`
- **为什么选择 master：**
  - 您的代码已经推送到 `master` 分支
  - 这是默认的主分支
  - 后续本地修改后推送到 `master` 分支，Coolify 会自动部署

**选项说明：**
- `master`：主分支，用于生产环境
- 如果您使用其他分支（如 `main`、`develop`），可以修改

---

### 2. Build Pack（构建包）

**配置选项：**
- **选择：** `Nixpacks`
- **为什么选择 Nixpacks：**
  - Nixpacks 是 Coolify 推荐的智能构建工具
  - 能够自动检测项目类型（Next.js、Node.js 等）
  - 对于 Next.js 项目，Nixpacks 会自动：
    - 识别 `package.json`
    - 运行 `npm install` 安装依赖
    - 运行 `npm run build` 构建项目
    - 配置正确的启动命令

**其他选项（通常不需要修改）：**
- `Dockerfile`：如果项目根目录有 Dockerfile，可以使用此选项
- `Docker Compose`：用于多容器应用
- 我们的项目没有 Dockerfile，所以使用 Nixpacks 最合适

---

### 3. Base Directory（基础目录）

**配置选项：**
- **填写内容：** `/`
- **为什么填写 `/`：**
  - 项目代码直接在仓库根目录
  - 所有配置文件（`package.json`、`next.config.js` 等）都在根目录
  - 如果项目在子目录（如 `projects/devos`），则需要填写 `/projects/devos`

**如何判断：**
- 查看 GitHub 仓库，如果 `package.json` 在根目录，填写 `/`
- 如果 `package.json` 在子目录，填写相对于根目录的路径

---

### 4. Port（端口）

**配置选项：**
- **填写内容：** `3000`
- **为什么填写 3000：**
  - Next.js 默认运行在 3000 端口
  - 项目中的 `ecosystem.config.js` 配置了 `PORT: 3000`
  - `package.json` 中的 `start` 脚本默认使用 3000 端口

**技术说明：**
- Next.js 应用在生产环境使用 `npm start` 启动
- 默认监听 3000 端口
- Coolify 会自动处理端口映射和反向代理

---

### 5. Is it a static site?（这是静态网站吗？）

**配置选项：**
- **选择：** ❌ **不勾选**（保持未选中状态）
- **为什么不勾选：**
  - 这是一个 **Next.js 全栈应用**，不是纯静态网站
  - 项目包含：
    - ✅ API 路由（`/app/api/` 目录）
    - ✅ 服务器端渲染（SSR）
    - ✅ 数据库连接（MongoDB）
    - ✅ 动态内容（后台管理、数据分析等）
  - 静态网站（如纯 HTML/CSS/JS）不包含服务器端功能

**如果错误地勾选了：**
- Next.js 会尝试导出为静态文件
- API 路由将无法工作
- 数据库连接会失败
- 后台管理功能无法使用

---

## 第四步：点击 Continue（继续）

配置完成后，点击页面底部的 **"Continue"** 按钮。

---

## 第五步：General（常规）配置页面详解

点击 Continue 后，您会进入 **General**（常规）配置页面。这个页面包含了应用的基本设置。

### 当前配置检查

根据您的项目，以下是正确的配置：

#### 1. Name（应用名称）

- **当前值：** `tigerbiaowithme/cursortest:master-xxx`（Coolify 自动生成）
- **说明：** 这是应用的内部名称，由 Coolify 自动生成，通常不需要修改
- **操作：** 保持默认即可

#### 2. Description（描述）

- **当前值：** 空
- **说明：** 可选，用于描述应用的用途
- **操作：** 可以填写 `Devos 外贸独立站 - 多语言支持`，或保持空白

#### 3. Build Pack（构建包）

- **当前值：** `Nixpacks`（应该已选择）
- **说明：** 这是正确的选择
- **操作：** ✅ 保持 `Nixpacks` 不变

#### 4. Is it a static site?（这是静态网站吗？）

- **当前值：** ❌ **未勾选**（正确！）
- **说明：** 这是 Next.js 全栈应用，不是静态网站
- **操作：** ✅ 保持未勾选状态

#### 5. Domains（域名）

- **当前值：** `https://demo.tigerbiao.xyz`（您已配置的域名）
- **说明：** 这是应用的访问域名
- **操作：** ✅ 已配置，保持即可
- **提示：** Coolify 会自动配置 SSL 证书

#### 6. Base Directory（基础目录）

- **当前值：** `/`
- **说明：** 项目在仓库根目录，这是正确的
- **操作：** ✅ 保持 `/` 不变

#### 7. Build Section（构建部分）

##### Install Command（安装命令）

- **当前值：** 空
- **说明：** Nixpacks 会自动检测并使用 `npm install`
- **操作：** ✅ 保持空白，让 Nixpacks 自动处理

##### Build Command（构建命令）

- **当前值：** 空
- **说明：** Nixpacks 会自动检测 `package.json` 中的 `build` 脚本，使用 `npm run build`
- **操作：** ✅ 保持空白，让 Nixpacks 自动处理

**信息提示：** 页面会显示 "Nixpacks will detect the required configuration automatically"，这是正常的。

##### Publish Directory（发布目录）

- **当前值：** `/`
- **说明：** Next.js 不需要指定发布目录，构建后的文件在 `.next` 目录
- **操作：** ✅ 保持 `/` 或空白都可以（Nixpacks 会处理）

##### Watch Paths（监控路径）

- **当前值：** `src/pages/**`（可能显示这个）
- **说明：** 这是用于监控文件变化触发重新部署的路径
- **操作：** 对于 Next.js App Router，可以设置为：
  - `app/**`（监控 app 目录）
  - `components/**`（监控组件目录）
  - `lib/**`（监控工具库目录）
  - 或者保持默认，Coolify 会自动检测

**推荐设置（可选）：**
```
app/**,components/**,lib/**,public/**,*.ts,*.tsx,*.js,*.json
```

##### Start Command（启动命令）

- **当前值：** 空
- **说明：** Nixpacks 会自动检测 `package.json` 中的 `start` 脚本，使用 `npm start`
- **操作：** ✅ 保持空白，让 Nixpacks 自动处理

#### 8. Custom Docker Options（自定义 Docker 选项）

- **当前值：** 可能有一些默认配置
- **说明：** 用于 Docker 容器的自定义选项
- **操作：** ✅ 保持默认即可（除非您有特殊需求）

### 保存配置

检查完所有配置后：

1. **点击页面右上角的 "Save"（保存）按钮**
2. 等待配置保存完成

---

## 第六步：环境变量配置

这是 **最重要的一步**！必须配置环境变量，否则应用无法连接到数据库。

### 必须配置的环境变量

在 Coolify 的环境变量配置页面（通常在应用设置的 "Environment Variables" 部分），添加以下变量：

#### 1. MONGODB_URI

```
变量名：MONGODB_URI
变量值：mongodb+srv://devos:3N-QDbcSfrFL36j@cluster0.d59flm2.mongodb.net/devos?appName=Cluster0
```

**为什么需要：**
- 应用需要连接 MongoDB Atlas 数据库
- 这是数据库连接字符串
- 包含用户名、密码、集群地址和数据库名

**安全提示：**
- ⚠️ 这是生产环境密码，请确保 Coolify 访问权限安全
- ⚠️ 不要在代码中硬编码此密码（已添加到 `.gitignore`）

---

#### 2. JWT_SECRET

```
变量名：JWT_SECRET
变量值：your-secret-key-change-in-production
```

**为什么需要：**
- 用于加密 JWT（JSON Web Token）
- 后台登录功能需要此密钥
- 建议使用更复杂的随机字符串

**安全建议：**
- 生成一个随机字符串作为密钥
- 可以使用在线工具生成，或使用命令：`openssl rand -base64 32`

---

#### 3. NODE_ENV

```
变量名：NODE_ENV
变量值：production
```

**为什么需要：**
- 告诉 Node.js 这是生产环境
- Next.js 会启用生产优化
- 禁用开发模式的功能（如热重载）

---

### 如何添加环境变量

1. 在 Coolify 应用设置页面，找到 **"Environment Variables"**（环境变量）部分
2. 点击 **"Add Variable"**（添加变量）或 **"+"** 按钮
3. 输入变量名和变量值
4. 点击 **"Save"**（保存）
5. 重复上述步骤，添加所有三个变量

---

## 第七步：部署配置

### 构建命令（通常自动配置）

Nixpacks 会自动检测并使用以下命令：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 启动应用
npm start
```

### 启动命令（通常自动配置）

```bash
npm start
```

Coolify 会自动识别 `package.json` 中的 `start` 脚本。

---

## 第八步：域名和 SSL 配置（可选）

### 配置自定义域名

1. 在应用设置中找到 **"Domains"**（域名）部分
2. 添加您的域名（如 `devos.example.com`）
3. Coolify 会自动配置 SSL 证书（使用 Let's Encrypt）

### 使用 Coolify 提供的域名

Coolify 通常会提供一个默认域名，格式类似：
- `your-app-name.your-coolify-instance.com`

---

## 第九步：启动部署

1. 检查所有配置是否正确
2. 点击 **"Deploy"**（部署）或 **"Save & Deploy"**（保存并部署）按钮
3. 等待部署完成（通常需要 3-5 分钟）

### 部署过程

Coolify 会依次执行：
1. ✅ 克隆 GitHub 仓库
2. ✅ 安装依赖（`npm install`）
3. ✅ 构建项目（`npm run build`）
4. ✅ 启动应用（`npm start`）
5. ✅ 健康检查

### 查看部署日志

- 在 Coolify 应用页面可以查看实时部署日志
- 如果有错误，日志会显示具体的错误信息

---

## 第十步：配置自动部署

这是实现 **"本地修改后自动部署"** 的关键步骤！

### 方法一：Webhook 自动部署（推荐）

1. 在应用设置中找到 **"Deployments"**（部署）或 **"Auto Deploy"**（自动部署）部分
2. 启用 **"Auto Deploy on Push"**（推送时自动部署）
3. Coolify 会自动配置 GitHub Webhook

**工作原理：**
- 当您推送代码到 GitHub 的 `master` 分支时
- GitHub 会发送 Webhook 通知 Coolify
- Coolify 自动触发新的部署

### 方法二：手动触发部署

如果自动部署未启用，可以：
1. 在 Coolify 应用页面
2. 点击 **"Deploy"** 或 **"Redeploy"** 按钮
3. 手动触发部署

---

## 第十一步：验证部署

### 1. 检查部署状态

- 在 Coolify 应用页面，查看部署状态
- 应该显示 **"Running"**（运行中）或 **"Healthy"**（健康）

### 2. 访问网站

- 使用 Coolify 提供的域名或您配置的自定义域名
- 访问首页：`https://your-domain.com/en`
- 访问后台：`https://your-domain.com/admin/login`

### 3. 测试功能

- ✅ 前端页面是否正常显示
- ✅ 语言切换是否正常
- ✅ 后台登录是否正常
- ✅ 数据库连接是否正常

---

## 🔄 日常开发工作流

### 本地修改 → GitHub → Coolify 自动部署

#### 1. 本地修改代码

在本地编辑代码，例如修改 `components/Layout/Navbar.tsx`

#### 2. 提交并推送到 GitHub

```bash
# 查看修改
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "更新导航栏样式"

# 推送到 GitHub
git push
```

#### 3. Coolify 自动部署

- GitHub 收到推送后，自动触发 Webhook
- Coolify 检测到代码更新，自动开始部署
- 部署完成后，新代码自动上线

#### 4. 查看部署状态

- 在 Coolify 应用页面查看部署日志
- 等待部署完成（通常 3-5 分钟）

---

## ⚠️ 常见问题和解决方案

### 问题 1：部署失败 - "Build failed"

**可能原因：**
- 环境变量未配置
- 构建命令错误
- 依赖安装失败

**解决方法：**
- 检查环境变量是否全部配置
- 查看部署日志中的错误信息
- 确保 `package.json` 中的脚本正确

---

### 问题 2：应用无法连接数据库

**可能原因：**
- `MONGODB_URI` 环境变量未配置或配置错误
- MongoDB Atlas 网络访问限制

**解决方法：**
- 检查环境变量配置
- 在 MongoDB Atlas 中，将 Coolify 服务器的 IP 地址添加到 IP 白名单
- 或者暂时允许所有 IP 访问（`0.0.0.0/0`，仅用于测试）

---

### 问题 3：自动部署未触发

**可能原因：**
- Webhook 未配置
- GitHub App 权限不足

**解决方法：**
- 检查 Coolify 中的 "Auto Deploy" 设置
- 在 GitHub 仓库设置中，检查 Webhooks 是否正常
- 确保 GitHub App 有仓库访问权限

---

### 问题 4：端口冲突

**可能原因：**
- 端口 3000 被其他应用占用

**解决方法：**
- Coolify 会自动处理端口映射，通常不需要修改
- 如果必须修改，可以在环境变量中设置 `PORT=其他端口`

---

### 问题 5：静态资源加载失败

**可能原因：**
- Next.js 图片域名配置问题

**解决方法：**
- 在 `next.config.js` 中添加生产环境域名到 `images.domains`
- 重新部署应用

---

## 📝 配置检查清单

在部署前，确保以下项目都已配置：

- [ ] Repository 正确配置（`tigerbiaowithme/cursortest`）
- [ ] Branch 设置为 `master`
- [ ] Build Pack 选择 `Nixpacks`
- [ ] Base Directory 设置为 `/`
- [ ] Port 设置为 `3000`
- [ ] "Is it a static site?" **未勾选**
- [ ] 环境变量 `MONGODB_URI` 已配置
- [ ] 环境变量 `JWT_SECRET` 已配置
- [ ] 环境变量 `NODE_ENV` 设置为 `production`
- [ ] 自动部署已启用
- [ ] 域名已配置（可选）

---

## 🔒 安全建议

1. **保护环境变量：**
   - 不要在代码中硬编码密码
   - 使用 Coolify 的环境变量功能
   - 定期更换密码

2. **MongoDB Atlas 安全：**
   - 限制 IP 访问（只允许 Coolify 服务器 IP）
   - 使用强密码
   - 定期备份数据库

3. **JWT Secret：**
   - 使用复杂的随机字符串
   - 不要在 GitHub 上提交

4. **GitHub 仓库：**
   - 确保 `.env` 在 `.gitignore` 中
   - 使用私有仓库（如果可能）

---

## 📚 相关文档

- [Git 安装指南](./Git安装指南.md)
- [部署指南](./部署指南.md)
- [MongoDB Atlas 配置指南](./MongoDB完整配置指南.md)

---

## ✅ 总结

按照本指南配置后，您将实现：

1. ✅ 代码推送到 GitHub
2. ✅ Coolify 自动检测代码更新
3. ✅ 自动构建和部署
4. ✅ 应用自动上线

**工作流程：**
```
本地修改代码 → git push → GitHub → Coolify Webhook → 自动部署 → 上线
```

祝您部署顺利！🚀
