import axios from 'axios';
import type { Video, ApiResponse } from '../types';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 模拟数据
const mockVideos: Video[] = [
  {
    id: '1',
    name: '流浪地球2',
    pic: 'https://picsum.photos/seed/movie1/300/400',
    des: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园...',
    actor: '吴京,刘德华,沙溢',
    director: '郭帆',
    type: 'movie',
    area: '大陆',
    year: '2023',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/movie1.mp4',
  },
  {
    id: '2',
    name: '庆余年2',
    pic: 'https://picsum.photos/seed/tv1/300/400',
    des: '范闲历经重重考验，守护内心正义，带领众人开创太平盛世...',
    actor: '张若昀,李沁,陈道明',
    director: '孙浩',
    type: 'tv',
    area: '大陆',
    year: '2024',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/tv1.mp4',
  },
  {
    id: '3',
    name: '海贼王',
    pic: 'https://picsum.photos/seed/anime1/300/400',
    des: '路飞带领草帽海贼团在伟大航路上冒险，寻找传说中的ONE PIECE...',
    actor: '田中真弓,中井和哉',
    director: '富冈淳广',
    type: 'anime',
    area: '日本',
    year: '2024',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/anime1.mp4',
  },
  {
    id: '4',
    name: '奔跑吧兄弟',
    pic: 'https://picsum.photos/seed/variety1/300/400',
    des: '兄弟团成员团结协作，完成各种有趣的任务挑战...',
    actor: '李晨,郑恺,Angelababy',
    director: '浙江卫视',
    type: 'variety',
    area: '大陆',
    year: '2024',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/variety1.mp4',
  },
  {
    id: '5',
    name: '复仇者联盟5',
    pic: 'https://picsum.photos/seed/movie2/300/400',
    des: '超级英雄们再次集结，对抗强大的灭霸...',
    actor: '小罗伯特·唐尼,克里斯·埃文斯',
    director: '罗素兄弟',
    type: 'movie',
    area: '美国',
    year: '2025',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/movie2.mp4',
  },
  {
    id: '6',
    name: '斗破苍穹年番',
    pic: 'https://picsum.photos/seed/anime2/300/400',
    des: '萧炎修炼焚决，不断突破境界，成为斗帝...',
    actor: '刘三木,陈奕雯',
    director: '万丈光芒',
    type: 'anime',
    area: '大陆',
    year: '2024',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/anime2.mp4',
  },
  {
    id: '7',
    name: '繁花',
    pic: 'https://picsum.photos/seed/tv2/300/400',
    des: '上海滩的传奇故事，时代浪潮中的爱恨情仇...',
    actor: '胡歌,唐嫣,辛芷蕾',
    director: '王家卫',
    type: 'tv',
    area: '大陆',
    year: '2024',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/tv2.mp4',
  },
  {
    id: '8',
    name: '你好，李焕英',
    pic: 'https://picsum.photos/seed/movie3/300/400',
    des: '女儿意外穿越回八十年代，与年轻时的妈妈相遇...',
    actor: '贾玲,张小斐,沈腾',
    director: '贾玲',
    type: 'movie',
    area: '大陆',
    year: '2021',
    state: '1',
    vod_url: '',
    vod_play_url: 'https://example.com/movie3.mp4',
  },
];

// 分类映射
const categoryMap: Record<string, number> = {
  'movie': 1,
  'tv': 2,
  'anime': 4,
  'variety': 3,
};

export const categoryNames: Record<string, string> = {
  'movie': '电影',
  'tv': '电视剧',
  'anime': '动漫',
  'variety': '综艺',
  'all': '全部',
};

// 返回模拟数据
function getMockResponse(page: number = 1, filtered?: Video[]): ApiResponse<Video> {
  const data = filtered || mockVideos;
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  return {
    code: 1,
    msg: 'ok',
    page,
    pagecount: Math.ceil(data.length / pageSize),
    limit: pageSize,
    total: data.length,
    list: data.slice(start, start + pageSize),
  };
}

// 获取首页推荐/最新视频
export const fetchHomeVideos = async (page: number = 1): Promise<ApiResponse<Video>> => {
  // 直接使用模拟数据
  return getMockResponse(page);
};

// 按分类获取视频
export const fetchVideosByCategory = async (
  category: string,
  page: number = 1
): Promise<ApiResponse<Video>> => {
  const filtered = category === 'all' 
    ? mockVideos 
    : mockVideos.filter(v => v.type === category);
  return getMockResponse(page, filtered);
};

// 搜索视频
export const searchVideos = async (keyword: string, page: number = 1): Promise<ApiResponse<Video>> => {
  const results = mockVideos.filter(v => 
    v.name.includes(keyword) || 
    v.actor.includes(keyword) ||
    v.des.includes(keyword)
  );
  return getMockResponse(page, results);
};

// 获取视频详情
export const fetchVideoDetail = async (id: string): Promise<Video | null> => {
  return mockVideos.find(v => v.id === id) || null;
};

// 解析视频URL
export const parseVideoUrl = (url: string): string => {
  if (!url) return '';
  // 使用多个备用解析服务
  const parsers = [
    `https://www.yiguoyy.com/jx/?url=${encodeURIComponent(url)}`,
    `https://jx.iviews.cc/jx.php?url=${encodeURIComponent(url)}`,
    `https://vip.parpaka.com/play.php?url=${encodeURIComponent(url)}`,
  ];
  return parsers[0];
};

// 获取直链播放地址
export const getDirectPlayUrl = (video: Video): string => {
  if (video.vod_play_url) {
    const urls = video.vod_play_url.split('$');
    return urls[1] || urls[0];
  }
  if (video.vod_url) {
    return video.vod_url;
  }
  return '';
};
