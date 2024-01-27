import { defineStore } from 'pinia'

const defaultState = {
  // dark mode
  darkMode : true,

  // viewer box display toggles/ index/ block sizes
  editMixtapeBoxView : false,
  addMixtapeBoxView : false,
  addSrcUrlSubset : false,

  lightBoxView : false,
  lightBoxIndex : -1,

  uploadBoxView : false,
  uploadView : false,
  uploadPercent : 0,

  pageSize : 50,
  cgbWidth : 240,
  cgbWidthSized :240,

  // result filters
  filter : '',
  mixtape : '',
  srcUrlSubset : '',
  sortBy : 'time_posted desc',
  sortByValue : ['time_posted', 'time_scraped' ],
  sortByOrder : 'desc'
}

export const GlobalStore = defineStore({
  id: 'GlobalStore',
  state: () => ({ ...structuredClone(defaultState) }),

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
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
