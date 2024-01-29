import { defineStore } from 'pinia'

import type { GlobalStoreType } from '@/assets/types/index'
const defaultState = <GlobalStoreType>{
  // dark mode
  darkMode : true,

  // display toggles
  uploadBoxView : false,
  lightBoxView : false,
  addSrcUrlSubset : false,
  editMixtapeBoxView : false,
  addMixtapeBoxView : false,

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

  currentTab: 1,
  paneSizeTemp: 0,
  paneSize: 30.0,
  paneSizeOffSet: 0.0,
}

export const GlobalStore = defineStore({
  id: 'GlobalStore',
  state: (): GlobalStoreType => ({
    ...structuredClone(defaultState)
  }),

  actions: {
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
        + 'max-height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
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
