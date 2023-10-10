import { defineStore } from 'pinia'
import { ref } from 'vue'

export const GlobalStore = defineStore('counter', () => {

  // viewer box display toggles/ index/ block sizes
  const uploadBoxView = ref<boolean>(false)
  const lightBoxView = ref<boolean>(false)
  const lightBoxIndex = ref(-1)
  const cgbWidth = ref<number>(90)

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
  function setCgbWidth (newCgbWidth: number) {
    cgbWidth.value = newCgbWidth
    var style = document.createElement('style')
    style.innerText = ''
      + '.cgb-loading{'
      + 'max-height:' + newCgbWidth * 1.2666666 + 'px!important;'
      + 'max-width:' + newCgbWidth + 'px!important;'
      + 'min-width:' + newCgbWidth + 'px!important;'
      + '}'
      + '.cgb-loading .cgb-0-img{'
      + 'height:' + (newCgbWidth * 1.2666666 - 20) + 'px!important;'
      + '}'
      + '.cgb-loaded{'
      + 'max-height:' + newCgbWidth * 1.2666666 + 'px!important;'
      + 'max-width:' + newCgbWidth + 'px!important;'
      + 'min-width:' + newCgbWidth + 'px!important;'
      + '}'
      + '.cgb-0-img{'
      + 'max-height:' + (newCgbWidth * 1.2666666 - 20) + 'px!important;'
      + '}'
      + '.cgb-0-txt{'
      + 'max-height:' + (newCgbWidth * 1.2666666 - 20) + 'px!important;'
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
    sortBy, setSortBy,
    sortByValue, setSortByValue,
    sortByOrder, setSortByOrder,
    mixtape, setMixtape,
    cgbWidth, setCgbWidth
  }
})
