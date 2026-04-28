import axios from 'axios';
import type { Video, ApiResponse, Category } from '../types';

// API基础URL - 使用多个备用源
const API_SOURCES = [
  'https://api.yparse.com/api/json',
  'https://json.paugram.com/category',
  'https://zy.yparse.com/api/json',
];

let currentApiIndex = 0;

const api = axios.create({
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 获取当前API URL
const getCurrentApiUrl = () => API_SOURCES[currentApiIndex];

// 切换到下一个API源
const switchApiSource = () => {
  currentApiIndex = (currentApiIndex + 1) % API_SOURCES.length;
  return getCurrentApiUrl();
};

// 分类映射
const categoryMap: Record<string, number> = {
  'movie': 1,     // 电影
  'tv': 2,        // 电视剧
  'anime': 4,     // 动漫
  'variety': 3,  // 综艺
};

export const categoryNames: Record<string, string> = {
  'movie': '电影',
  'tv': '电视剧',
  'anime': '动漫',
  'variety': '综艺',
  'all': '全部',
};

// 获取首页推荐/最新视频
export const fetchHomeVideos = async (page: number = 1): Promise<ApiResponse<Video>> => {
  try {
    const response = await api.get(getCurrentApiUrl(), {
      params: { page, limit: 20 },
    });
    return response.data;
  } catch (error) {
    // 尝试备用API
    const nextUrl = switchApiSource();
    const response = await api.get(nextUrl, {
      params: { page, limit: 20 },
    });
    return response.data;
  }
};

// 按分类获取视频
export const fetchVideosByCategory = async (
  category: string,
  page: number = 1
): Promise<ApiResponse<Video>> => {
  const typeId = categoryMap[category] || 0;
  
  try {
    const response = await api.get(getCurrentApiUrl(), {
      params: { type: typeId, page, limit: 20 },
    });
    return response.data;
  } catch (error) {
    const nextUrl = switchApiSource();
    const response = await api.get(nextUrl, {
      params: { type: typeId, page, limit: 20 },
    });
    return response.data;
  }
};

// 搜索视频
export const searchVideos = async (keyword: string, page: number = 1): Promise<ApiResponse<Video>> => {
  try {
    const response = await api.get(getCurrentApiUrl(), {
      params: { wd: keyword, page, limit: 20 },
    });
    return response.data;
  } catch (error) {
    const nextUrl = switchApiSource();
    const response = await api.get(nextUrl, {
      params: { wd: keyword, page, limit: 20 },
    });
    return response.data;
  }
};

// 获取视频详情
export const fetchVideoDetail = async (id: string): Promise<Video | null> => {
  try {
    const response = await api.get(getCurrentApiUrl(), {
      params: { ids: id },
    });
    if (response.data.list && response.data.list.length > 0) {
      return response.data.list[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

// 解析视频URL（第三方解析）
export const parseVideoUrl = (url: string): string => {
  // 使用第三方解析服务
  const parsers = [
    `https://jx.jsonplayer.com/player/?url=${encodeURIComponent(url)}`,
    `https://player.bilibili.com/player.html?bvid=${extractBvid(url)}`,
  ];
  
  // 返回第一个解析器链接
  return parsers[0];
};

// 提取B站BV号
const extractBvid = (url: string): string => {
  const match = url.match(/BV[\w]+/);
  return match ? match[0] : '';
};

// 获取直链播放地址
export const getDirectPlayUrl = (video: Video): string => {
  // 如果有直接的播放URL
  if (video.vod_play_url) {
    // 提取第一个播放源
    const urls = video.vod_play_url.split('$');
    if (urls.length > 1) {
      return urls[1] || urls[0];
    }
    return video.vod_play_url;
  }
  
  // 如果有vod_url
  if (video.vod_url) {
    return video.vod_url;
  }
  
  return '';
};
