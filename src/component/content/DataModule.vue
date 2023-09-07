<template>
  <div class="dataView">
        <div class="header">
              <a>
              {{ props.header }} 
              </a>
        </div>

    <DataView class='dg-0' :value="props.contentData" :layout="list" >
       
      <template #list="slotProps">
        <div class="dgb-0">
          <div @click="search(slotProps.data.content)" class="dgb-0-txt">
              <a style="float:left; max-width:calc(100% - 40px);">
              {{ slotProps.data.name }}
              </a>
              <a style="float:right;">
                {{ convertDate(slotProps.data.created_at) }}
              </a>
          </div>
        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'
import axios from 'axios'
import { filterStore } from '@/store/FilterStore'
import { ApiStore } from '@/store/ApiStore'

const store = filterStore()
const pageNumber = ref<number>(2)
const props = withDefaults(defineProps<{
  header: string
  contentData: any[],
  id: number
}> (), {
  contentData: []
})

onMounted(() => {
  const targetNode = document.getElementsByClassName("p-grid")[props.id]
  new MutationObserver(callback).observe(targetNode, { childList: true });
})
const search = (e) => {
  store.setFilter('')
  if(JSON.stringify(store.mixtape) ===JSON.stringify(e)) {
    store.setMixtape('')
    }else {
      store.setMixtape(e)
    }
  }
const fetchPage = async () => {
  if(props.header == 'mixtape') {
      ApiStore().fetchMixtapes(pageNumber.value)
  }
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
const config = { root: document.getElementsByClassName("p-grid")[props.id], threshold: 0.5 }
const observer = new IntersectionObserver(intersecting, config);

const callback = (mutationList, MutateObserver) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      observer.disconnect()
      watchIntersect(pageNumber)
    }
  }
}

const watchIntersect = (pageNum) =>{
  for (let i = 1; i < 5; i++) {
    const el = document.getElementsByClassName("dgb-0")[(pageNum.value-1)*20-(5*i)]
    if (el){
      observer.observe(el)
    }
  }
}
const configMutate = { childList: true }
const MutateObserver = new MutationObserver(callback)

const convertDate = (datetime) => {
  const elapsed = (new Date() - new Date(datetime)) / 1000 /60 / 60 / 24
  return ( elapsed.toFixed(0) + 'd')
}

watch(
  () => props.contentData,
  () => { 
    if(props.contentData.length < 20){
      pageNumber.value = 2
    }
  }
)
</script>
