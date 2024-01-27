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
export interface EditMixtapeBoxState {
  store: any,
}

export interface AddSrcUrlSubset {
  store: any,
  url: any,
  name: any
}

export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

import type { userFeedType } from '@/assets/types/ApiTypes'
export interface  userFeedStoreType {
  user_feed: userFeedType
}

import type { kernalType } from '@/assets/types/ApiTypes'
export interface kernalStoreType {
  pageNumber: number,
  kernals: kernalType[]
}

import type { contentType } from '@/assets/types/ApiTypes'
export interface connectionsStoreType {
  connections_mix: contentType[],
  connections_src: contentType[]
}



