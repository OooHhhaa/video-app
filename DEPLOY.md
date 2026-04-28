# 云影视频 - 部署指南

一个 iOS 风格的移动端影视视频播放网站。

## 快速部署到 Vercel

### 方法一：使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
cd "d:\Video App"
vercel

# 4. 生产环境部署
vercel --prod
```

### 方法二：GitHub + Vercel 自动部署

#### 1. 创建 GitHub 仓库

```bash
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/video-app.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 2. 连接 Vercel

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `video-app` 仓库
4. Framework: **Vite**
5. 点击 **Deploy**

#### 3. 自动部署设置（可选）

1. 在 GitHub 仓库 **Settings** > **Secrets and variables** > **Actions** 添加：
   - `VERCEL_TOKEN`: https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: Vercel 项目 Settings > General > Organization ID
   - `VERCEL_PROJECT_ID`: Vercel 项目 Settings > General > Project ID

2. 之后每次 push 到 `main` 分支会自动部署

## 项目结构

```
video-app/
├── src/
│   ├── components/     # UI组件
│   ├── pages/         # 页面
│   ├── services/      # API服务
│   └── types/         # TypeScript类型
├── .github/workflows/ # GitHub Actions
├── vercel.json        # Vercel配置
└── package.json
```

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## 本地开发

```bash
npm install
npm run dev
```

## 注意事项

- 视频数据来源于第三方影视API
- 部分API可能存在跨域问题（Vercel已配置代理）
- 视频播放依赖第三方解析服务
