export interface kernalType {
  id: string,
  source_url_id: string,
  hypertext_id: string,
  file_type: string,
  file_name: string,
  file_path: string,
  url: string,
  size: number,
  author: string,
  time_posted: Date,
  time_scraped: string,
  description: string,
  key_words: string,
  hashtags: string,
  likes: string,
  reposts: string,
  signed_url: string,
  signed_url_s: string,
  signed_url_m: string,
  signed_url_l: string,
  created_at: Date,
  updated_at: Date,
  permissions: string[]
}
export interface srcUrlType {
  id: string,
  name: string,
  url: string,
  permissions: string[],
  created_at: Date,
  updated_at: Date
}
export interface mixtapeType {
  id: string,
  name: string,
  content: string[]
  permissions: string[],
  created_at: Date,
  updated_at: Date
}
export interface srcUrlSubsetType {
  id: string,
  src_url_id: string,
  url: string,
  name: string,
  scrape_interval: number,
  time_last_scraped: Date,
  permissions: string[]
  created_at: Date,
  updated_at: Date
}
