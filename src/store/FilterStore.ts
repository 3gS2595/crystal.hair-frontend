import { defineStore } from 'pinia'
import { ref } from 'vue'

export const filterStore = defineStore('counter', () => {
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
  return { filter, setFilter, lightBoxView, setLightBoxView, setLightBoxIndex, lightBoxIndex }
})
