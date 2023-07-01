import { defineStore, acceptHMRUpdate } from 'pinia'
import { watch, onMounted, ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const filter = ref('')
  function setFilter (newFilter: string) {
    filter.value = newFilter
  }
  function getFilter () {
    return filter.value
  }

  return { filter, setFilter }
})
