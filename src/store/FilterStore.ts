import { defineStore } from 'pinia'
import { ref } from 'vue'

export const filterStore = defineStore('counter', () => {
  const url = 'http://3.130.240.169/'
  const urlRails = 'http://3.130.240.169:3000/'
  const urlS3 = 'https://crystal-hair.nyc3.digitaloceanspaces.com/'
  const urlS3Nail = 'https://crystal-hair-nail.nyc3.digitaloceanspaces.com/'

  const mixtape = ref('')
  const filter = ref('')
  const lightBoxView = ref(false)
  const lightBoxIndex = ref(-1)
  const sortBy = ref('time_posted desc')
  const sortByValue = ref([])
  const sortByOrder = ref('desc')
  function setFilter (newFilter: string) {
    filter.value = newFilter
  }
  function setSortByValue (newSortByValue: []) {
    sortByValue.value = newSortByValue
    console.log(sortByValue)
    console.log(newSortByValue)
  }
  function setSortByOrder (newSortByOrder: string) {
    sortByOrder.value = newSortByOrder
  }

  function setSortBy (newSortBy: string) {
    sortBy.value = newSortBy
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
    lightBoxView, setLightBoxView,
    lightBoxIndex, setLightBoxIndex, 
    sortBy, setSortBy,
    sortByValue, setSortByValue,
    sortByOrder, setSortByOrder,
    mixtape, setMixtape
  }
})
