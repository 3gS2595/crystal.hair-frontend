<template>
  <div class="dataView">
    <DataView class='dg-0' :value="props.contentData" :layout="list" >

      <template #list="slotProps">
        <div class="dgb-0">
          <div class="dgb-0-txt">
            <a
              @click="search(slotProps.data.content)"
            >{{ slotProps.data.name }}</a>
            <br/>
            <a>{{convertDate(slotProps.data.updated_at)}}</a>
          </div>
        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import axios from 'axios'

import { filterStore } from '@/store/FilterStore'
import { ApiStore } from '@/store/ApiStore'
const store = filterStore()
const contentData = ref<any[]>([])
const pageNumber = ref<number>(2)
const layout = ref('grid')

const props = withDefaults(defineProps<{
   contentData: any[], 
   gridId: number
 }>(), {
     contentData: []
 })

onMounted(() => {
  const targetNode = document.getElementsByClassName("p-grid")[props.gridId]
  MutateObserver.observe(targetNode, configMutate);
})

const search = (e) => {
  store.setFilter('')
  if(JSON.stringify(store.mixtape) ===JSON.stringify(e)) {
    store.setMixtape('')
    }else {
      store.setMixtape(e)
    }
  }

const convertDate = (datetime) => {
  const endTime = new Date()
  const startTime = new Date(datetime)
  let elapsed = (endTime - startTime)
  elapsed = elapsed / 1000 /60 / 60 / 24
  return ('-' + elapsed.toFixed(0) + 'd-' + startTime)
}

const fetchPage = async () => {
  const newPage =  ApiStore().fetchHypertexts(pageNumber.value)
  pageNumber.value = pageNumber.value + 1
}
const intersecting = (event) => {
  for (const e of event){
    if (e.isIntersecting) {
      observer.disconnect()
      fetchPage()
    }
  }
}
const config = { root: document.getElementsByClassName("p-grid")[props.gridId], threshold: 0.5 }
const observer = new IntersectionObserver(intersecting, config);

const watchIntersect = (pageNum) =>{
    const el1 = document.getElementsByClassName("dgb-0")[(pageNum.value-1)*20-15]
    const el2 = document.getElementsByClassName("dgb-0")[(pageNum.value-1)*20-25]
    if (el1){ observer.observe(el1) } 
    if (el2){ observer.observe(el2) } 
    if (pageNumber.value - 2 !== 0) {
      const elr1 = document.getElementsByClassName("dgb-0")[(pageNum.value-2)*20-15]
      const elr2 = document.getElementsByClassName("dgb-0")[(pageNum.value-2)*20-25]
      if (elr1) { observer.unobserve(elr1) }
      if (elr2) { observer.unobserve(elr2) }
    }
}
const callback = (mutationList, MutateObserver) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      observer.disconnect()
      watchIntersect(pageNumber)
    }
  }
}
const configMutate = { childList: true };
const MutateObserver = new MutationObserver(callback);

watch(
  () => props.contentData,
  () => { 
    if(props.contentData.length < 20){
      pageNumber.value = 2
    }
  }
)
</script>
