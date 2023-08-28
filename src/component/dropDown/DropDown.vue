<script setup lang='ts'>
import { ref, onMounted,watch } from 'vue'
import { filterStore } from '@/store/FilterStore'

const selectedOrder = ref('desc')
const sortOrder = ['asc', 'desc'] 

const selectedData = ref('time_posted')
const store = filterStore()
const getOptions = () => {
  return store.sortByValue
}

watch(
  () => selectedOrder.value,
  () => {
    store.setSortBy(selectedData.value + ' ' + selectedOrder.value)
  }
)
watch(
  () => selectedData.value,
  () => {
    store.setSortBy(selectedData.value + ' ' + selectedOrder.value)
  }
)
</script>

<template>
      <select class='navItem' v-model="selectedData">
        <option v-for="key in getOptions()" :value="key">
          {{key}}
        </option>
      </select>
      <select class='navItem' v-model="selectedOrder">
        <option v-for="key in sortOrder"  :value="key">
          {{key}}
        </option>
      </select>
</template>
