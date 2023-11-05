import { defineStore } from 'pinia'
import { ref } from 'vue'

export const GlobalStore = defineStore('counter', () => {

  // dark mode
  const darkMode = ref<boolean>(true)

  // viewer box display toggles/ index/ block sizes
  const uploadBoxView = ref<boolean>(false)
  const lightBoxView = ref<boolean>(false)
  const lightBoxIndex = ref(-1)
  const cgbWidth = ref<number>(120)
  const cgbWidthSized = ref<number>(120)

  // result filters
  const filter = ref<string>('')
  const mixtape = ref<string>('')
  const sortBy = ref<string>('time_posted desc')
  const sortByValue = ref<string[]>(['time_posted', 'time_scraped' ])
  const sortByOrder = ref<string>('desc')
  const pageSize = ref<number>(40)

  function setFilter (newFilter: string) {
    filter.value = newFilter
  }
  function setSortByValue (newSortByValue: string[]) {
    sortByValue.value = newSortByValue
  }
  function setSortByOrder (newSortByOrder: string) {
    sortByOrder.value = newSortByOrder
  }
  function setSortBy (newSortBy: string) {
    sortBy.value = newSortBy
  }
  function setUploadBoxView (newUploadBoxView: boolean) {
    uploadBoxView.value = newUploadBoxView
  }
  function setLightBoxView (newLightBoxView: boolean) {
    lightBoxView.value = newLightBoxView
  }
  function setLightBoxIndex (newLightBoxIndex: number) {
    lightBoxIndex.value = newLightBoxIndex
  }
  function setMixtape (newMixtape: string) {
    mixtape.value = newMixtape
  }
  function setDarkMode (newDarkMode: boolean) {
    darkMode.value = newDarkMode
  }
  function setCgbWidth (newCgbWidth: number) {
    cgbWidth.value = newCgbWidth
  }
  function setCgbWidthSized (newCgbWidthSized: number) {
    cgbWidthSized.value = newCgbWidthSized
    const cgbHeightRatio = 1.2896666
    const style = document.createElement('style')
    style.innerText = ''
      + '.cgb-loading{'
      + 'max-height:' + newCgbWidthSized * cgbHeightRatio + 'px!important;'
      + 'max-width:' + newCgbWidthSized + 'px!important;'
      + 'min-width:' + newCgbWidthSized + 'px!important;'
      + '}'
      + '.cgb-loading .cgb-0-img{'
      + 'height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
      + '}'
      + '.cgb-loaded{'
      + 'max-height:' + newCgbWidthSized *cgbHeightRatio + 'px!important;'
      + 'max-width:' + newCgbWidthSized + 'px!important;'
      + 'min-width:' + newCgbWidthSized + 'px!important;'
      + '}'
      + '.cgb-0-img{'
      + 'max-height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
      + '}'
      + '.cgb-0-txt{'
      + 'max-height:' + (newCgbWidthSized * cgbHeightRatio - 25) + 'px!important;'
      + '}'
      + '.cgb-0-info{'
      + 'height:' +  12 + 'px!important;'
      + '}'
      + '.cgb-0{'
      + 'max-height:' + (newCgbWidthSized * cgbHeightRatio) + 'px!important;'
      + '}'
    document.head.appendChild(style)
  }

  return {
    pageSize,
    filter, setFilter,
    uploadBoxView, setUploadBoxView,
    lightBoxView, setLightBoxView,
    lightBoxIndex, setLightBoxIndex,
    sortBy, setSortBy,
    sortByValue, setSortByValue,
    sortByOrder, setSortByOrder,
    mixtape, setMixtape,
    cgbWidth, setCgbWidth,
    cgbWidthSized, setCgbWidthSized,
    darkMode, setDarkMode
  }
})
