import type { Video, ApiResponse } from '../types';

export const categoryNames: Record<string, string> = {
  'movie': '电影',
  'tv': '电视剧',
  'anime': '动漫',
  'variety': '综艺',
  'all': '全部',
};

// 使用 The Movie Database (TMDB) 风格的模拟数据
const mockVideos: Video[] = [
  { id: '1', name: '流浪地球2', pic: 'https://picsum.photos/seed/movie1/300/450', des: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园...', actor: '吴京,刘德华,沙溢', director: '郭帆', type: 'movie', area: '大陆', year: '2023', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '2', name: '庆余年2', pic: 'https://picsum.photos/seed/tv1/300/450', des: '范闲历经重重考验，守护内心正义，带领众人开创太平盛世...', actor: '张若昀,李沁,陈道明', director: '孙浩', type: 'tv', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '3', name: '海贼王', pic: 'https://picsum.photos/seed/anime1/300/450', des: '路飞带领草帽海贼团在伟大航路上冒险，寻找传说中的ONE PIECE...', actor: '田中真弓,中井和哉', director: '富冈淳广', type: 'anime', area: '日本', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '4', name: '奔跑吧兄弟', pic: 'https://picsum.photos/seed/variety1/300/450', des: '兄弟团成员团结协作，完成各种有趣的任务挑战...', actor: '李晨,郑恺,Angelababy', director: '浙江卫视', type: 'variety', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '5', name: '复仇者联盟5', pic: 'https://picsum.photos/seed/movie2/300/450', des: '超级英雄们再次集结，对抗强大的灭霸...', actor: '小罗伯特·唐尼,克里斯·埃文斯', director: '罗素兄弟', type: 'movie', area: '美国', year: '2025', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '6', name: '斗破苍穹', pic: 'https://picsum.photos/seed/anime2/300/450', des: '萧炎修炼焚决，不断突破境界，成为斗帝...', actor: '刘三木,陈奕雯', director: '万丈光芒', type: 'anime', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '7', name: '繁花', pic: 'https://picsum.photos/seed/tv2/300/450', des: '上海滩的传奇故事，时代浪潮中的爱恨情仇...', actor: '胡歌,唐嫣,辛芷蕾', director: '王家卫', type: 'tv', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '8', name: '你好，李焕英', pic: 'https://picsum.photos/seed/movie3/300/450', des: '女儿意外穿越回八十年代，与年轻时的妈妈相遇...', actor: '贾玲,张小斐,沈腾', director: '贾玲', type: 'movie', area: '大陆', year: '2021', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '9', name: '灌篮高手', pic: 'https://picsum.photos/seed/anime3/300/450', des: '湘北篮球队冲击全国大赛冠军的热血故事...', actor: '草尾毅,平松广和', director: '西沢信5', type: 'anime', area: '日本', year: '2023', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '10', name: '狂飙', pic: 'https://picsum.photos/seed/tv3/300/450', des: '京海市一线刑警与黑恶势力展开激烈斗争...', actor: '张译,张颂文', director: '徐纪周', type: 'tv', area: '大陆', year: '2023', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '11', name: '速度与激情10', pic: 'https://picsum.photos/seed/movie4/300/450', des: '多米尼克与家人朋友面对最强大的敌人...', actor: '范·迪塞尔,米歇尔·罗德里格兹', director: '路易斯·莱特里尔', type: 'movie', area: '美国', year: '2023', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { id: '12', name: '明星大侦探', pic: 'https://picsum.photos/seed/variety2/300/450', des: '明星玩家破解谜案，找出真凶...', actor: '何炅,撒贝宁', director: '芒果TV', type: 'variety', area: '大陆', year: '2024', state: '1', vod_url: '', vod_play_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' },
];

function getMockResponse(page = 1, data = mockVideos): ApiResponse<Video> {
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  return { 
    code: 1, 
    msg: 'ok', 
    page, 
    pagecount: Math.ceil(data.length / pageSize), 
    limit: pageSize, 
    total: data.length, 
    list: data.slice(start, start + pageSize) 
  };
}

export const fetchHomeVideos = async (page = 1) => getMockResponse(page);

export const fetchVideosByCategory = async (category: string, page = 1) => {
  const filtered = category === 'all' ? mockVideos : mockVideos.filter(v => v.type === category);
  return getMockResponse(page, filtered);
};

export const searchVideos = async (keyword: string, page = 1) => {
  const results = mockVideos.filter(v => 
    v.name.includes(keyword) || 
    v.actor.includes(keyword) || 
    v.des.includes(keyword) ||
    v.director.includes(keyword)
  );
  return getMockResponse(page, results);
};

export const fetchVideoDetail = async (id: string) => mockVideos.find(v => v.id === id) || null;

export const parseVideoUrl = (url: string): string => {
  if (!url) return '';
  // 直接返回原始URL，由播放器原生播放
  return url;
};

export const getDirectPlayUrl = (video: Video): string => {
  if (video.vod_play_url) {
    const urls = video.vod_play_url.split('$');
    return urls[1] || urls[0];
  }
  return video.vod_url || '';
};
