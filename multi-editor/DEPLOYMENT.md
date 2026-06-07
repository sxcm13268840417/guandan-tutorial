# 🚀 QB编辑器 - 部署安装完整指南

欢迎使用 **QB编辑器**！这是一个功能强大的 Windows 11 专业多格式文档编辑器。

## 📋 目录

- [快速开始](#快速开始)
- [前置要求](#前置要求)
- [自动安装](#自动安装)
- [手动安装](#手动安装)
- [开发模式](#开发模式)
- [故障排查](#故障排查)

## ⚡ 快速开始

最简单的安装方式：

### 方式1: 使用 Windows Batch 脚本 (推荐)

```bash
# 1. 进入项目目录
cd multi-editor

# 2. 双击运行 deploy.bat
deploy.bat
```

### 方式2: 使用 Python 脚本

```bash
# 1. 进入项目目录
cd multi-editor

# 2. 运行 Python 脚本
python install.py
```

### 方式3: 手动执行命令

```bash
npm install
npm run build
```

## 📦 前置要求

在安装 QB编辑器 之前，请确保已安装：

### 必需

- **Node.js** (版本 14.0 或更高)
  - 下载: https://nodejs.org/
  - 安装 LTS 版本即可

### 可选

- **Git** (用于克隆项目)
  - 下载: https://git-scm.com/

## 🤖 自动安装

### Windows 批处理脚本 (deploy.bat)

**最简单的安装方法！**

1. 下载项目到本地
2. 在 `multi-editor` 目录中找到 `deploy.bat`
3. **双击运行** `deploy.bat`
4. 等待安装完成

脚本会自动执行以下操作：
- ✓ 检查 Node.js 和 npm
- ✓ 清理旧的构建文件
- ✓ 安装项目依赖
- ✓ 构建 React 应用
- ✓ 构建 Electron 应用
- ✓ 生成 Windows 安装程序

完成后，您会在 `dist/` 目录中找到两个可执行文件：
- `QB编辑器 2.0.0.exe` - NSIS 安装程序
- `QB编辑器-2.0.0.exe` - 便携版本（无需安装）

### Python 自动化脚本 (install.py)

```bash
python install.py
```

这个脚本提供了图形化的安装指导，包括：
- 环境检查和诊断
- 自动依赖安装
- 构建过程监控
- 桌面快捷方式创建

## 🔧 手动安装

如果您喜欢手动控制安装过程：

### 步骤 1: 安装依赖

```bash
cd multi-editor
npm install
```

### 步骤 2: 构建应用

```bash
npm run build
```

### 步骤 3: 运行安装程序

1. 打开 `dist/` 文件夹
2. 双击 `QB编辑器 2.0.0.exe`
3. 按照安装向导完成安装

或者直接使用便携版本：
- 双击 `QB编辑器-2.0.0.exe` 直接运行（无需安装）

## 👨‍💻 开发模式

如果您想在开发环境中运行应用：

### 启动开发服务器

```bash
cd multi-editor
npm start
```

这会同时启动：
- React 开发服务器 (http://localhost:3000)
- Electron 应用

### 仅启动 React 开发服务器

```bash
npm run react-start
```

### 仅启动 Electron 应用

```bash
npm run electron-start
```

## 🐛 故障排查

### 问题 1: Node.js 未找到

**症状:** "node: command not found" 或 "'node' 不是内部或外部命令"

**解决方案:**
1. 从 https://nodejs.org/ 下载并安装 Node.js LTS 版本
2. 重启电脑
3. 重新运行部署脚本

### 问题 2: npm 权限错误

**症状:** "permission denied" 或 "EACCES: permission denied"

**解决方案:**
- Windows: 以管理员身份运行命令提示符
- Mac/Linux: 使用 `sudo npm install`

### 问题 3: 构建失败

**症状:** 构建过程中出现错误

**解决方案:**
1. 清理旧文件:
   ```bash
   rm -rf node_modules dist build
   ```

2. 重新安装依赖:
   ```bash
   npm install
   npm run build
   ```

### 问题 4: 生成的 .exe 文件过大

**症状:** 安装程序或便携版本文件很大（>200MB）

**说明:** 这是正常的，因为包含了 Electron 框架和所有依赖

**优化方案:**
- 使用便携版本（通常较小）
- 删除 node_modules 后重新构建

### 问题 5: 桌面快捷方式未创建

**解决方案:**
1. 手动创建快捷方式：
   - 找到安装的 QB编辑器 应用
   - 右键 → 创建快捷方式
   - 将快捷方式移到桌面

2. 或使用便携版本创建快捷方式

## 📝 常见问题

### Q: 应用能否在其他操作系统上运行?

A: 目前专为 Windows 11 优化。Mac 和 Linux 版本需要额外配置。

### Q: 支持哪些文件格式?

A: Markdown (.md), PDF (.pdf), Word (.docx), Excel (.xlsx), PowerPoint (.pptx), 图片 (.png, .jpg, .gif)

### Q: 如何卸载应用?

A: 
- 如果使用了安装程序，进入"控制面板" → "程序" → "程序和功能" → 找到 "QB编辑器" → 卸载
- 如果使用便携版本，直接删除 .exe 文件即可

### Q: 如何更新应用?

A: 重新运行部署脚本或下载最新的安装程序

## 🎯 首次使用建议

1. **创建快捷方式** - 安装完成后，在桌面创建快捷方式方便快速启动
2. **查看帮助** - 点击菜单栏的"帮助"了解详细功能
3. **尝试所有功能** - 打开不同格式的文件体验各项功能
4. **自定义设置** - 在菜单中设置偏好主题和快捷键

## 📞 获取帮助

- 📖 查看完整文档: [INSTALL.html](INSTALL.html)
- 🐙 GitHub 仓库: https://github.com/sxcm13268840417/guandan-tutorial
- 🐛 报告问题: https://github.com/sxcm13268840417/guandan-tutorial/issues
- 💬 讨论区: https://github.com/sxcm13268840417/guandan-tutorial/discussions

## ✨ 功能概览

| 功能 | 说明 |
|------|------|
| **Markdown编辑** | 实时预览、语法高亮、工具栏 |
| **PDF编辑** | 添加文本注释、改字体大小 |
| **格式转换** | PDF↔Word, PDF↔Excel, Word↔PDF 等 |
| **图片编辑** | 缩放、旋转、导出 |
| **文档预览** | 支持 Word、Excel、PPT 预览 |
| **主题切换** | 亮色/暗色模式 |
| **快捷键** | 15+ 常用操作快捷键 |

## 🎉 安装成功标志

当您看到以下情况，说明安装成功：

✓ 桌面出现 "QB编辑器" 图标  
✓ 可以从开始菜单找到 "QB编辑器"  
✓ 双击启动应用，看到主界面  
✓ 可以打开文件并进行编辑  

## 📞 反馈和建议

如果您有任何建议或发现问题，欢迎：
- 提交 Issue: https://github.com/sxcm13268840417/guandan-tutorial/issues
- 参与讨论: https://github.com/sxcm13268840417/guandan-tutorial/discussions

---

**感谢使用 QB编辑器！🎉**

祝您使用愉快！✨
