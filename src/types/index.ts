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
  title: any
}
export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}
