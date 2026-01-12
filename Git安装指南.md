# Git 安装指南（Windows）

您的系统提示 `git` 命令无法识别，这意味着 Git 还没有安装或没有正确配置。

---

## 方法一：使用 Git 官方安装程序（推荐）

### 步骤 1：下载 Git

1. 访问 Git 官网：https://git-scm.com/download/win
2. 页面会自动检测您的系统（64-bit 或 32-bit）
3. 点击下载按钮，下载安装程序（约 50MB）

### 步骤 2：安装 Git

1. 双击下载的 `.exe` 文件（例如：`Git-2.43.0-64-bit.exe`）
2. 按照安装向导进行安装：
   - **选择组件**：保持默认选择即可
   - **选择默认编辑器**：可以选择 VS Code 或其他编辑器
   - **调整 PATH 环境**：**重要！** 选择 **"Git from the command line and also from 3rd-party software"**（这是默认选项，推荐）
   - **行尾转换**：选择 **"Checkout Windows-style, commit Unix-style line endings"**（默认）
   - **终端模拟器**：选择 **"Use MinTTY"**（默认）
   - **其他选项**：保持默认即可
3. 点击 **"Install"** 开始安装
4. 等待安装完成

### 步骤 3：验证安装

安装完成后，**关闭当前的终端窗口**，然后：

1. **重新打开终端**（VS Code 的终端或 PowerShell）
2. 运行以下命令验证：

```bash
git --version
```

如果显示类似 `git version 2.43.0` 的版本信息，说明安装成功！

---

## 方法二：使用 winget（Windows 包管理器）

如果您的 Windows 10/11 系统已经安装了 winget，可以使用命令行安装：

### 步骤 1：打开 PowerShell（以管理员身份运行）

1. 按 `Win + X`
2. 选择 **"Windows PowerShell (管理员)"** 或 **"终端 (管理员)"**

### 步骤 2：安装 Git

```powershell
winget install --id Git.Git -e --source winget
```

### 步骤 3：验证安装

关闭并重新打开终端，运行：

```bash
git --version
```

---

## 方法三：使用 Chocolatey（如果已安装）

如果您已经安装了 Chocolatey，可以使用：

```powershell
choco install git -y
```

---

## 安装完成后的配置

### 1. 配置 Git 用户名和邮箱

安装完成后，首次使用 Git 前需要配置：

```bash
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"
```

例如：

```bash
git config --global user.name "Zhang San"
git config --global user.email "zhangsan@example.com"
```

**提示：** 这个邮箱应该和您的 GitHub 账号邮箱一致（但不是必须的）。

### 2. 验证配置

```bash
git config --global --list
```

应该能看到您刚才设置的用户名和邮箱。

---

## 如果安装后仍然无法识别 Git 命令

### 问题：安装后终端还是提示找不到 git

**解决方法：**

1. **完全关闭 VS Code**（不只是关闭窗口，而是退出程序）
2. **重新打开 VS Code**
3. **重新打开终端**

如果还是不行：

1. 检查 Git 安装路径（通常是 `C:\Program Files\Git\cmd` 或 `C:\Program Files (x86)\Git\cmd`）
2. 手动添加到 PATH（不推荐，通常不需要）：
   - 按 `Win + R`，输入 `sysdm.cpl`，回车
   - 点击 **"高级"** 标签页
   - 点击 **"环境变量"**
   - 在 **"系统变量"** 中找到 `Path`，点击 **"编辑"**
   - 点击 **"新建"**，添加 Git 的安装路径
   - 点击 **"确定"** 保存
   - **重启电脑**（或至少重启 VS Code）

---

## 快速检查清单

- [ ] Git 安装程序下载完成
- [ ] Git 安装完成
- [ ] **关闭并重新打开终端**
- [ ] 运行 `git --version` 显示版本号
- [ ] 配置了用户名和邮箱
- [ ] 可以正常运行 `git` 命令

---

## 下一步

安装 Git 并配置完成后，您就可以：

1. 初始化 Git 仓库
2. 上传代码到 GitHub
3. 使用所有 Git 命令

参考 `部署指南.md` 继续后续步骤。

---

## 常见问题

### Q: 安装时应该选择哪些选项？
A: 保持默认选项即可，特别是 PATH 环境变量的选择。

### Q: 安装后需要重启电脑吗？
A: 通常不需要。关闭并重新打开终端（VS Code）即可。

### Q: Git 和 GitHub 是什么关系？
A: Git 是版本控制工具（软件），GitHub 是代码托管平台（网站）。Git 可以连接 GitHub 上传代码。

### Q: 安装 Git 后，GitHub Desktop 还需要吗？
A: 不需要。Git 命令行已经足够使用。GitHub Desktop 是图形界面工具，可选。

---

祝您安装顺利！🚀