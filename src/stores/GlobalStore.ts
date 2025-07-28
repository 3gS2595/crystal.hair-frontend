import { defineStore } from 'pinia'

import type { GlobalStoreType } from '@/types/index'
const defaultState = <GlobalStoreType>{
  // dark mode
  darkMode : false,

  // display toggles
  uploadBoxView : false,
  lightBoxView : false,
  addSrcUrlSubset : false,
  editMixtapeBoxView : false,
  addMixtapeBoxView : false,
  addFolderBoxView : false,
  addMixToFolderView : false,
  viewSettings: false,
  curOptionsTab: 0,

  // content grid & lightbox
  pageSize : 50,
  cgbWidth : 205,
  cgbWidthSized :205,
  lightBoxIndex : -1,

  // result filters
  filter : '',
  mixtape : '',
  srcUrlSubset : '',
  sortBy : 'time_posted desc',
  sortByValue : ['time_posted', 'time_scraped'],
  sortByOrder : 'desc',
  feed: true,
  tags: '',
  folder: '',

  currentTab: 1,
  paneSizeTemp: 0,
  paneSize: 55.0,
  paneSizeOffSet: 0.0,
  navWidth: 225
}

export const GlobalStore = defineStore({
  id: 'GlobalStore',
  state: (): GlobalStoreType => ({
    ...structuredClone(defaultState)
  }),

  actions: {
     closeHeader() {
      this.mixtape = ''
      this.srcUrlSubset = this.currentTab === 2 ? '-1' : ''
    },
    closeViewer () {
      this.lightBoxView = false
      this.lightBoxIndex = -1
    },
    setCgbWidthSized (newCgbWidthSized: number) {
      this.cgbWidthSized = newCgbWidthSized
      const cgbHeightRatio = 1.2896666
      const style = document.createElement('style')
      style.innerText = ''
        + '.cgb-0{'
        + 'max-height:' + newCgbWidthSized *cgbHeightRatio + 'px!important;'
        + 'max-width:' + newCgbWidthSized + 'px!important;'
        + 'min-width:' + newCgbWidthSized + 'px!important;'
        + '}'
        + '.cgb-0 .vue-load-image{'
        + 'max-height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
        + '}'
        + '.cgb-0 .vue-load-image .loading{'
        + 'height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
        + '}'
        + '.cgb-0-txt{'
        + 'height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
        + '}'
        + '.cgb-0-info{'
        + 'height:' +  12 + 'px!important;'
        + '}'
      document.head.appendChild(style)
    },
    reset() {
      Object.assign(this, <GlobalStoreType> structuredClone(defaultState));
    }
  }
})
