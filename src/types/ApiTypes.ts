export interface kernalType {
  id?: string,
  src_url_id?: string,
  src_url_subset_id?: string,
  file_type?: string,
  file_name?: string,
  file_path?: string,
  url?: string,
  size?: number,
  author?: string,
  time_posted?: Date,
  time_scraped?: string,
  description?: string,
  key_words?: string,
  hashtags?: string,
  likes?: string,
  reposts?: string,
  signed_url: string,
  signed_url_s: string,
  signed_url_m: string,
  signed_url_l: string,
  created_at?: Date,
  updated_at?: Date,
  permissions?: string[]
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
  content_id: string,
  created_at: Date,
  updated_at: Date
}
export interface srcUrlSubsetType {
  id: string,
  src_url_id: string,
  contents: string,
  url: string,
  name: string,
  scrape_interval: number,
  time_last_scraped: Date,
  permissions: string[]
  created_at: Date,
  updated_at: Date
}

export interface contentType {
  id: string,
  contains: string[],
  created_at?: Date,
  updated_at?: Date
}

export interface userFeedType {
  id?: string,
  folders: string[],
  feed_mixtape: string[],
  feed_sources: string[],
  created_at?: Date,
  updated_at?: Date
}
export interface folderType {
  id: string,
  name: string,
  contains: string[],
  created_at: Date,
  updated_at: Date
}
export interface forceGraph {
  nodes: any,
  links: any,
}
