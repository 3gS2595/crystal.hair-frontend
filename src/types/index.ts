export interface UploadBoxState {
  store: any,
  file: File | null,
  editor: any,
  enteredText: any,
  editorEmpty: boolean,
}
export interface UploadKernalState {
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

export interface AddFolderBoxState {
  store: any,
  title: any
}
export interface AddSrcUrlSubset {
  store: any,
  url: any,
}

export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

import type { userFeedType } from '@/types/ApiTypes'
export interface  userFeedStoreType {
  user_feed: userFeedType
}

import type { kernalType } from '@/types/ApiTypes'
export interface kernalStoreType {
  pageNumber: number,
  kernals: kernalType[]
}

import type { contentType } from '@/types/ApiTypes'
export interface connectionsStoreType {
  connections_mix: contentType[],
  connections_src: contentType[]
}
export interface apiStoreType {
  controller: AbortController
}

export interface GlobalStoreType {
  // dark mode
  darkMode : boolean,
  editMixtapeBoxView : boolean,
  addMixtapeBoxView : boolean,
  addFolderBoxView : boolean,
  addSrcUrlSubset : boolean,
  addMixToFolderView : boolean,
  lightBoxView : boolean,
  lightBoxIndex : number,
  uploadBoxView : boolean,
  uploadView : boolean,
  uploadPercent : number,
  pageSize : number,
  cgbWidth : number,
  cgbWidthSized :number,
  filter : string,
  mixtape : string,
  folder : string,
  srcUrlSubset : string,
  sortBy : string,
  sortByValue : string[],
  sortByOrder : string,
  currentTab: number
  paneSizeTemp: number,
  paneSize: number,
  paneSizeOffSet: number,
  viewSettings: boolean,
  curOptionsTab: number,
  feed: boolean,
  tags: string,
  navWidth: number
}

export interface TreeViewItem {
  name: string;
  id?: string | number;
  children?: TreeViewItem[];
  checked?: boolean;
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;// When disabled, an item can neither be selected or checked
  meta?: any;// provides meta-data of any type per node.
}



