export interface UploadBoxState {
  store: any,
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
