export interface Video {
  id: string;
  name: string;
  pic: string;
  des: string;
  actor: string;
  director: string;
  type: string;
  area: string;
  year: string;
  state: string;
  vod_url: string;
  vod_play_url: string;
}

export interface Category {
  id: number;
  name: string;
  type_id: number;
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  page: number;
  pagecount: number;
  limit: number;
  total: number;
  list: T[];
}

export type VideoCategory = 'movie' | 'tv' | 'anime' | 'variety';

export interface SearchResult {
  results: Video[];
  query: string;
}
