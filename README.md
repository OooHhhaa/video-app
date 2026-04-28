# 云影视频

一个 iOS 风格的移动端影视视频播放网站。

## 功能特性

- 🎬 首页推荐 - 展示最新热门影视内容
- 📺 分类浏览 - 电影、电视剧、动漫、综艺
- 🔍 智能搜索 - 支持搜索历史和热门推荐
- 📱 iOS风格 - 适配移动端的精美UI设计
- ▶️ 流畅播放 - 支持多种视频源解析播放

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- React Router DOM
- Axios

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/     # UI组件
│   ├── TabBar.tsx   # 底部导航栏
│   ├── VideoCard.tsx # 视频卡片
│   ├── SearchBar.tsx # 搜索框
│   ├── CategoryTabs.tsx # 分类标签
│   ├── Loading.tsx  # 加载状态
│   └── EmptyState.tsx # 空状态
├── pages/          # 页面组件
│   ├── Home.tsx    # 首页
│   ├── Category.tsx # 分类页
│   ├── Search.tsx  # 搜索页
│   ├── Detail.tsx  # 详情页
│   └── Player.tsx  # 播放器
├── services/       # API服务
├── types/         # TypeScript类型
└── App.tsx        # 应用入口
```

## 注意事项

- 本应用数据来源于第三方影视API，可能存在不稳定情况
- 视频播放依赖第三方解析服务
- 请确保网络连接正常
