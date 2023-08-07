import { defineStore } from 'pinia'
import { ref } from 'vue'

export const filterStore = defineStore('counter', () => {
  const url = 'http://3.130.240.169/'
  const urlRails = 'http://3.130.240.169:3000/'
  const urlS3 = 'https://crystal-hair.nyc3.digitaloceanspaces.com/'
  const urlS3Nail = 'https://crystal-hair-nail.nyc3.digitaloceanspaces.com/'

  const filter = ref('')
  const lightBoxView = ref(false)
  const lightBoxIndex = ref(-1)

  function setFilter (newFilter: string) {
    filter.value = newFilter
  }
  function setLightBoxView (newLightBoxView: boolean) {
    lightBoxView.value = newLightBoxView
  }
  function setLightBoxIndex (newLightBoxIndex: number) {
    lightBoxIndex.value = newLightBoxIndex
  }
  return {
    url,
    urlRails,
    urlS3,
    urlS3Nail,
    filter, setFilter,
    lightBoxView, setLightBoxView,
    lightBoxIndex, setLightBoxIndex
  }
})
