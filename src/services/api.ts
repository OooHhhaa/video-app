import axios from 'axios';
import type { Video, ApiResponse } from '../types';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 模拟数据 - 当API不可用时显示
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

// 分类中文映射
const categoryTypeMap: Record<string, string> = {
  'movie': 'movie',
  'tv': 'tv',
  'anime': 'anime',
  'variety': 'variety',
};

// 尝试获取真实API数据，失败则返回模拟数据
async function fetchWithFallback(fetchFn: () => Promise<ApiResponse<Video>>): Promise<ApiResponse<Video>> {
  try {
    const result = await fetchFn();
    if (result.code === 1 && result.list && result.list.length > 0) {
      return result;
    }
    // API返回空数据，使用模拟数据
    return getMockResponse();
  } catch {
    // API请求失败，使用模拟数据
    return getMockResponse();
  }
}

function getMockResponse(page: number = 1): ApiResponse<Video> {
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    code: 1,
    msg: 'ok',
    page,
    pagecount: Math.ceil(mockVideos.length / pageSize),
    limit: pageSize,
    total: mockVideos.length,
    list: mockVideos.slice(start, end),
  };
}

// 获取首页推荐/最新视频
export const fetchHomeVideos = async (page: number = 1): Promise<ApiResponse<Video>> => {
  return fetchWithFallback(async () => {
    // 尝试多个API源
    const sources = [
      { url: 'https://json.paugram.com/category', params: { page, limit: 20 } },
      { url: 'https://api.yparse.com/api/json', params: { page, limit: 20 } },
      { url: 'https://zy.yparse.com/api/json', params: { page, limit: 20 } },
    ];

    for (const source of sources) {
      try {
        const response = await api.get(source.url, { params: source.params });
        if (response.data && response.data.code === 1 && response.data.list?.length > 0) {
          return response.data;
        }
      } catch {
        continue;
      }
    }
    
    throw new Error('All APIs failed');
  });
};

// 按分类获取视频
export const fetchVideosByCategory = async (
  category: string,
  page: number = 1
): Promise<ApiResponse<Video>> => {
  const typeId = categoryMap[category] || 0;

  return fetchWithFallback(async () => {
    const sources = [
      { url: 'https://json.paugram.com/category', params: { type: typeId, page, limit: 20 } },
      { url: 'https://api.yparse.com/api/json', params: { type: typeId, page, limit: 20 } },
      { url: 'https://zy.yparse.com/api/json', params: { type: typeId, page, limit: 20 } },
    ];

    for (const source of sources) {
      try {
        const response = await api.get(source.url, { params: source.params });
        if (response.data && response.data.code === 1 && response.data.list?.length > 0) {
          return response.data;
        }
      } catch {
        continue;
      }
    }

    // API失败，返回按分类筛选的模拟数据
    const filtered = category === 'all' 
      ? mockVideos 
      : mockVideos.filter(v => v.type === category);
    
    return {
      code: 1,
      msg: 'ok',
      page,
      pagecount: Math.ceil(filtered.length / 20),
      limit: 20,
      total: filtered.length,
      list: filtered.slice((page - 1) * 20, page * 20),
    };
  });
};

// 搜索视频
export const searchVideos = async (keyword: string, page: number = 1): Promise<ApiResponse<Video>> => {
  return fetchWithFallback(async () => {
    const sources = [
      { url: 'https://json.paugram.com/category', params: { wd: keyword, page, limit: 20 } },
      { url: 'https://api.yparse.com/api/json', params: { wd: keyword, page, limit: 20 } },
      { url: 'https://zy.yparse.com/api/json', params: { wd: keyword, page, limit: 20 } },
    ];

    for (const source of sources) {
      try {
        const response = await api.get(source.url, { params: source.params });
        if (response.data && response.data.code === 1 && response.data.list?.length > 0) {
          return response.data;
        }
      } catch {
        continue;
      }
    }

    // API失败，返回搜索模拟数据
    const results = mockVideos.filter(v => 
      v.name.includes(keyword) || 
      v.actor.includes(keyword) ||
      v.des.includes(keyword)
    );

    return {
      code: 1,
      msg: 'ok',
      page,
      pagecount: 1,
      limit: 20,
      total: results.length,
      list: results,
    };
  });
};

// 获取视频详情
export const fetchVideoDetail = async (id: string): Promise<Video | null> => {
  // 先尝试从模拟数据获取
  const mockVideo = mockVideos.find(v => v.id === id);
  if (mockVideo) return mockVideo;

  try {
    const sources = [
      { url: 'https://json.paugram.com/category', params: { ids: id } },
      { url: 'https://api.yparse.com/api/json', params: { ids: id } },
    ];

    for (const source of sources) {
      const response = await api.get(source.url, { params: source.params });
      if (response.data?.list?.length > 0) {
        return response.data.list[0];
      }
    }
  } catch {
    // ignore
  }

  return null;
};

// 解析视频URL（第三方解析）
export const parseVideoUrl = (url: string): string => {
  if (!url) return '';
  // 使用第三方解析服务
  return `https://jx.jsonplayer.com/player/?url=${encodeURIComponent(url)}`;
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
