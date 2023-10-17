interface kernalType {
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
  description string,
  key_words: string,
  hashtags: string,
  likes: string,
  reposts: string,
  signed_url: string,
  signed_url_nail: string,
  created_at: Date,
  updated_at: Date
}

interface linkContentType {
  id: string,
  names: string,
  url: string,
  post_date: Date,
  word_count: number,
  author: string,
  text_body: string
}

interface hypertextType {
  id: string,
  url: string,
  name: string,
  scrape_interval: number,
  time_last_scrape: Date,
  time_initial_scrape: Date,
  logo_path: string,
  created_at: Date,
  updated_at: Date
}
interface sourceUrlType {
  id: string,
  domain: string,
  tag_list: string,
  source: string,
  logo_path: string,
  created_at: Date,
  updated_at: Date
}
interface mixtapeType {
  id: string,
  name: string,
  content: string[]
  created_at: Date,
  updated_at: Date
}
