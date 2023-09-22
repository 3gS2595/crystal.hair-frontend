export interface kernalType {
    id:              string,
    source_url_id:   string,
    hypertext_id:    string,
    file_type:       string,
    file_name:       string,
    file_path:       string,
    url:             string,
    size:            number,
    author:          string,
    time_posted:     Date,
    time_scraped:    string,
    description:     string,
    key_words:       string,
    hashtags:        string,
    likes:           string,
    reposts:         string,
    signed_url:      string,
    signed_url_nail: string,
    created_at:      Date,
    updated_at:      Date
}

export interface UploadBoxState {
  handlers: string[];
  left: number,
  top: number,
  height: number,
  width: number,
  maxW: number,
  maxH: number,
  dragSelector: string,
  index: number,
  store: any,
  sessionStore:any,
  file: File | null 
}
export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}
