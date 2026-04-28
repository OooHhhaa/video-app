import type { Video, ApiResponse } from '../types';

export const categoryNames: Record<string, string> = {
  'movie': '电影',
  'tv': '电视剧',
  'anime': '动漫',
  'variety': '综艺',
  'all': '全部',
};

const mockVideos: Video[] = [
  { id: '1', name: '流浪地球2', pic: 'https://picsum.photos/seed/movie1/300/400', des: '太阳即将毁灭，人类在地球表面建造出巨大的推进器...', actor: '吴京,刘德华', director: '郭帆', type: 'movie', area: '大陆', year: '2023', state: '1', vod_url: '', vod_play_url: 'https://example.com/movie1.mp4' },
  { id: '2', name: '庆余年2', pic: 'https://picsum.photos/seed/tv1/300/400', des: '范闲历经重重考验，守护内心正义...', actor: '张若昀,李沁', director: '孙浩', type: 'tv', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://example.com/tv1.mp4' },
  { id: '3', name: '海贼王', pic: 'https://picsum.photos/seed/anime1/300/400', des: '路飞带领草帽海贼团在伟大航路上冒险...', actor: '田中真弓', director: '富冈淳广', type: 'anime', area: '日本', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://example.com/anime1.mp4' },
  { id: '4', name: '奔跑吧兄弟', pic: 'https://picsum.photos/seed/variety1/300/400', des: '兄弟团成员团结协作...', actor: '李晨,郑恺', director: '浙江卫视', type: 'variety', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://example.com/variety1.mp4' },
  { id: '5', name: '复仇者联盟5', pic: 'https://picsum.photos/seed/movie2/300/400', des: '超级英雄们再次集结...', actor: '小罗伯特·唐尼', director: '罗素兄弟', type: 'movie', area: '美国', year: '2025', state: '1', vod_url: '', vod_play_url: 'https://example.com/movie2.mp4' },
  { id: '6', name: '斗破苍穹', pic: 'https://picsum.photos/seed/anime2/300/400', des: '萧炎修炼焚决，成为斗帝...', actor: '刘三木', director: '万丈光芒', type: 'anime', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://example.com/anime2.mp4' },
  { id: '7', name: '繁花', pic: 'https://picsum.photos/seed/tv2/300/400', des: '上海滩的传奇故事...', actor: '胡歌,唐嫣', director: '王家卫', type: 'tv', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://example.com/tv2.mp4' },
  { id: '8', name: '你好，李焕英', pic: 'https://picsum.photos/seed/movie3/300/400', des: '女儿意外穿越回八十年代...', actor: '贾玲,张小斐', director: '贾玲', type: 'movie', area: '大陆', year: '2021', state: '1', vod_url: '', vod_play_url: 'https://example.com/movie3.mp4' },
];

function getMockResponse(page = 1, data = mockVideos): ApiResponse<Video> {
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  return { code: 1, msg: 'ok', page, pagecount: Math.ceil(data.length / pageSize), limit: pageSize, total: data.length, list: data.slice(start, start + pageSize) };
}

export const fetchHomeVideos = async (page = 1) => getMockResponse(page);

export const fetchVideosByCategory = async (category: string, page = 1) => {
  const filtered = category === 'all' ? mockVideos : mockVideos.filter(v => v.type === category);
  return getMockResponse(page, filtered);
};

export const searchVideos = async (keyword: string, page = 1) => {
  const results = mockVideos.filter(v => v.name.includes(keyword) || v.actor.includes(keyword) || v.des.includes(keyword));
  return getMockResponse(page, results);
};

export const fetchVideoDetail = async (id: string) => mockVideos.find(v => v.id === id) || null;

export const parseVideoUrl = (url: string) => {
  if (!url) return '';
  return `https://www.yiguoyy.com/jx/?url=${encodeURIComponent(url)}`;
};

export const getDirectPlayUrl = (video: Video) => {
  if (video.vod_play_url) {
    const urls = video.vod_play_url.split('$');
    return urls[1] || urls[0];
  }
  return video.vod_url || '';
};
