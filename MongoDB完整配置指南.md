# MongoDB Atlas 完整配置指南

## 第一部分：在 MongoDB Atlas 网站配置（已完成 ✅）

您已经完成了：
- ✅ 创建了免费集群
- ✅ 创建了数据库用户（用户名：devos，密码：123456789qaz）
- ✅ 配置了网络访问（Allow Access from Anywhere）
- ✅ 获取了连接字符串

---

## 第二部分：在项目中配置（现在需要做的）

### 步骤 1：创建 .env 文件

1. **在 VS Code 中，打开项目根目录**
   - 确保您在项目根目录（和 `package.json` 同一目录）

2. **创建 .env 文件**
   - 点击左侧文件列表上方的 **"新建文件"** 图标
   - 输入文件名：`.env`（注意前面有个点，没有扩展名）
   - 如果提示输入文件名，直接输入 `.env` 即可

3. **复制以下内容到 .env 文件中：**

```env
MONGODB_URI=mongodb+srv://devos:123456789qaz@cluster0.d59flm2.mongodb.net/devos?appName=Cluster0
JWT_SECRET=dev-secret-key-change-in-production-please-use-random-string
NODE_ENV=development
```

4. **保存文件**
   - 按 `Ctrl + S` 保存文件

---

### 步骤 2：安装 dotenv 包（已完成 ✅）

您已经安装了 dotenv 包。

---

### 步骤 3：测试连接并初始化管理员

在终端运行以下命令：

```bash
node scripts/init-admin.js
```

**如果成功，您会看到：**
```
Connected to MongoDB
Super admin created: username=admin, password=admin123
Admin created: username=manager, password=manager123
Done!
```

**如果失败，可能的原因：**
- .env 文件不存在或路径不对
- .env 文件内容有错误
- MongoDB Atlas 网络访问未正确配置
- 连接字符串格式错误

---

### 步骤 4：启动开发服务器

连接成功后，启动服务器：

```bash
npm run dev
```

等待服务器启动完成（看到 "Ready" 消息）。

---

### 步骤 5：访问后台管理

在浏览器中访问：
- **后台登录页面**：http://localhost:3000/admin/login

**登录信息：**
- 用户名：`admin`
- 密码：`admin123`

---

## 快速检查清单

- [ ] .env 文件已创建（在项目根目录）
- [ ] .env 文件内容正确（三行配置）
- [ ] dotenv 包已安装
- [ ] 运行 `node scripts/init-admin.js` 成功
- [ ] 运行 `npm run dev` 启动服务器
- [ ] 访问 http://localhost:3000/admin/login 可以看到登录页面

---

## 常见问题

**Q: .env 文件在哪里创建？**
A: 在项目根目录，和 `package.json` 文件同一目录。

**Q: 文件名是什么？**
A: `.env`（前面有个点，没有扩展名）

**Q: 如何确认 .env 文件已创建？**
A: 在 VS Code 的文件列表中可以看到 `.env` 文件。

**Q: 如果连接失败怎么办？**
A: 检查 .env 文件内容是否正确，确认 MongoDB Atlas 的网络访问已配置。

---

## 下一步

完成以上步骤后，您就可以：
1. 访问后台管理系统
2. 查看数据统计面板
3. 管理博客和询盘
4. 使用 AI 营销宝功能

祝您使用愉快！🎉
