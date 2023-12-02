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
  file: File | null,
  editor: any,
  enteredText: any,
  editorEmpty: boolean,
}

export interface AddMixtapeBoxState {
  store: any,
  title: any
}

export interface AddSrcUrlSubset {
  store: any,
  url: any,
  name: any,
  scrapeInterval: any
}

export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}
