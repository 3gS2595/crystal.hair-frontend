import { defineStore } from 'pinia'
import { ref } from 'vue'

export const GlobalStore = defineStore('counter', () => {
  const url = 'http://3.130.240.169/'
  const urlRails = 'http://3.130.240.169:3000/'
  const urlS3 = 'https://crystal-hair.nyc3.digitaloceanspaces.com/'
  const urlS3Nail = 'https://crystal-hair-nail.nyc3.digitaloceanspaces.com/'

  const mixtape = ref<string>('')
  const filter = ref<string>('')
  const uploadBoxView = ref<boolean>(false)
  const lightBoxView = ref<boolean>(false)
  const lightBoxIndex = ref(-1)
  const sortBy = ref<string>('time_posted desc')
  const sortByValue = ref<string[]>(['time_posted', 'time_scraped' ])
  const sortByOrder = ref<string>('desc')

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

  return {
    url,
    urlRails,
    urlS3,
    urlS3Nail,
    filter, setFilter,
    uploadBoxView, setUploadBoxView,
    lightBoxView, setLightBoxView,
    lightBoxIndex, setLightBoxIndex, 
    sortBy, setSortBy,
    sortByValue, setSortByValue,
    sortByOrder, setSortByOrder,
    mixtape, setMixtape
  }
})
