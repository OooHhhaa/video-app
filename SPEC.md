# 影视视频播放器 - 项目规范

## 1. 项目概述

**项目名称**: 云影视频  
**类型**: 移动端Web应用（iOS风格）  
**核心功能**: 在线浏览和播放影视资源，支持多源解析  
**目标用户**: 移动端用户，偏好iOS设计风格

## 2. 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + 自定义iOS组件
- **路由**: React Router DOM
- **HTTP客户端**: Axios
- **视频播放**: DPlayer.js
- **状态管理**: React Context + useReducer

## 3. 设计规范

### 3.1 视觉风格
- **主题**: iOS风格深色主题
- **主色调**: #1C1C1E（深灰背景）
- **强调色**: #0A84FF（iOS蓝）
- **辅助色**: #30D158（绿色）、#FF9F0A（橙色）
- **文字色**: #FFFFFF（主文字）、#8E8E93（次级文字）

### 3.2 字体
- 系统字体栈: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif

### 3.3 组件样式
- 圆角: 12px（大）、10px（中）、8px（小）
- 阴影: iOS风格柔和阴影
- 间距: 8px为基准单位
- 安全区域: 支持iOS底部安全区

## 4. 数据源

### 主要API（备选多个）
```
# 金蝉官采API
https://zy.yparse.com/api/json

# 其他可用API
https://json.paugram.com/category
```

### 视频解析
- 使用第三方解析接口播放视频

## 5. 页面结构

### 5.1 首页 (Home)
- 搜索栏（iOS风格圆角输入框）
- 分类标签横向滚动
- 影视卡片网格（2列）
- 下拉刷新、上拉加载

### 5.2 分类页 (Category)
- 类别筛选
- 影视列表

### 5.3 详情页 (Detail)
- 封面图
- 影片信息（名称、简介、演员等）
- 剧集列表
- 播放按钮

### 5.4 播放器页 (Player)
- 全屏视频播放
- 播放控制条
- 选集列表

### 5.5 搜索页 (Search)
- 搜索历史
- 搜索结果

## 6. 功能清单

### 核心功能
- [x] 首页展示最新/热门影片
- [x] 分类浏览影片
- [x] 搜索影片
- [x] 查看影片详情
- [x] 播放视频
- [x] 选集切换

### UI特性
- [x] iOS风格设计
- [x] 移动端适配
- [x] 触摸滑动操作
- [x] 加载状态展示
- [x] 空状态处理

## 7. 项目结构

```
video-app/
├── src/
│   ├── components/     # 组件
│   ├── pages/          # 页面
│   ├── hooks/          # 自定义Hooks
│   ├── services/       # API服务
│   ├── types/          # TypeScript类型
│   ├── utils/          # 工具函数
│   └── App.tsx
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 8. 注意事项

1. 部分API可能存在跨域问题，需要通过代理解决
2. 视频解析接口可能不稳定，需要准备备选方案
3. 需要处理网络异常情况
