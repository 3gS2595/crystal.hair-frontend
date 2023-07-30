import { defineStore } from 'pinia'
import { ref } from 'vue'

export const filterStore = defineStore('counter', () => {
  const filter = ref('')
  function setFilter (newFilter: string) {
    filter.value = newFilter
  }
  return { filter, setFilter }
})
