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
  const addMixtapeBoxView = ref<boolean>(false)
  const addSrcUrlSubset = ref<boolean>(false)

  // result filters
  const filter = ref<string>('')
  const mixtape = ref<string>('')
  const srcUrlSubset = ref<string>('')
  const sortBy = ref<string>('time_posted desc')
  const sortByValue = ref<string[]>(['time_posted', 'time_scraped' ])
  const sortByOrder = ref<string>('desc')
  const pageSize = ref<number>(40)
  const uploadPercent = ref<number>(0)
  const uploadView = ref<boolean>(false)

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
  function setAddMixtapeBoxView (newAddMixtapeBoxView: boolean) {
    addMixtapeBoxView.value = newAddMixtapeBoxView
  }
  function setAddSrcUrlSubset (newAddSrcUrlSubset: boolean) {
    addSrcUrlSubset.value = newAddSrcUrlSubset
  }
  function setLightBoxView (newLightBoxView: boolean) {
    lightBoxView.value = newLightBoxView
  }
  function setLightBoxIndex (newLightBoxIndex: number) {
    lightBoxIndex.value = newLightBoxIndex
  }
  function setUploadPercent (newUploadPercent: number) {
    uploadPercent.value = newUploadPercent
  }
  function setUploadView (newUploadView: boolean) {
    uploadView.value = newUploadView
  }
  function setMixtape (newMixtape: string) {
    mixtape.value = newMixtape
  }
  function setSrcUrlSubset (newSrcUrlSubset: string) {
    srcUrlSubset.value = newSrcUrlSubset
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
  }

  return {
    pageSize,
    filter, setFilter,
    uploadBoxView, setUploadBoxView,
    lightBoxView, setLightBoxView,
    lightBoxIndex, setLightBoxIndex,
    addMixtapeBoxView, setAddMixtapeBoxView,
    addSrcUrlSubset, setAddSrcUrlSubset,
    sortBy, setSortBy,
    sortByValue, setSortByValue,
    sortByOrder, setSortByOrder,
    mixtape, setMixtape,
    srcUrlSubset, setSrcUrlSubset,
    cgbWidth, setCgbWidth,
    cgbWidthSized, setCgbWidthSized,
    darkMode, setDarkMode,
    uploadView, setUploadView,
    uploadPercent, setUploadPercent
  }
})
