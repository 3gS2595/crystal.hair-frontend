<template>
  <div class="src-url-subset-view">
    <DataView class='dg-0' :value="srcUrlSubsets" :layout="list" >
      <template #list="slotProps">
        <div @click="search(slotProps.data.id)" class="dgb-src-url-subset">
          <div class="dgb-0-txt">
            <a class='title text text-main-0' style="padding:1px; padding-right:0!important;" >{{ convertTitle(slotProps.data.name) }}</a>
            <a class='descr text text-main-0' style="float:right; padding-top: 2px; text-align: end; width:21%; padding-right:2px;">{{blockCnt(slotProps.data.content)}} 🔗&#xFE0E; </a>
            <a class='descr text text-main-0' style="float:left; width: 100%; padding-left:1px;">&#128198;&#xFE0E; {{convertDate(slotProps.data.updated_at)}}</a>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import type { srcUrlSubsets } from '@/types/ApiTypes'

import { ref, watch, onMounted } from 'vue'
import DataView from 'primevue/dataview'

import { storeToRefs } from 'pinia'
import { useSrcUrlSubsetStore } from '@/store/api/SrcUrlSubsetStore'
import { GlobalStore } from '@/store/GlobalStore'
import VueLoadImage from 'vue-load-image'

const { srcUrlSubsets } = storeToRefs(useSrcUrlSubsetStore())

const pageNumber = ref<number>(2)
const store = GlobalStore()
const props = withDefaults(defineProps<{
  id: number
}> (), {
  id:-1
})
watch(
  () => srcUrlSubsets.value,
  () => {
    if(srcUrlSubsets.value.length < store.pageSize -1 ){
      pageNumber.value = 2
    }
  }
)

const search = (e) => {
  if(JSON.stringify(store.srcUrlSubset) === JSON.stringify(e)) {
    store.setSrcUrlSubset('-1')
  }else {
    store.setSrcUrlSubset(e)
    console.log(e)
  }
}
const convertTitle = (title) => {
  title = title.replace(/^\s+|\s+$/gm,'')
  if(title.length > 20){
    return title.substring(0, 20).replace(/^\s+|\s+$/gm,'') + "_"
  }
  return title
}
const convertDate = (datetime) => {
  const d = Math.trunc((new Date() - new Date(datetime))/1000/60/60/24)
  const h = Math.trunc((new Date() - new Date(datetime))/1000/60/60) - (d * 24)
  const m = Math.trunc((new Date() - new Date(datetime) )/1000/60) - (h * 60) - (d * 24 * 60)

  if (h == 0 && d == 0){
    return (m + ' mins ')
  }
  if (d == 0){
    return (h + ' hrs ')
  }
  return (d + ' days ')
}

const blockCnt = (datetime) => {
  if(datetime != null) {
    return datetime.length
  }
  return null
}

// infinite scrollling intersectionObserver
const fetchPage = async () => {
  useSrcUrlSubsetStore().fetchSrcUrlSubsets(pageNumber.value)
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
const watchIntersect = () =>{
  observer.disconnect()
  for (let i = 1; i <= 2; i++) {
    const el = document.getElementsByClassName("dgb-src-url-subset")[(pageNumber.value-1)*store.pageSize-(5*i)]
    if (el){
      observer.observe(el)
    }
  }
}

const config = { root: document.getElementsByClassName("p-grid")[props.id], threshold: 0.5 }
const observer = new IntersectionObserver(intersecting, config)
onMounted(() => {
  const targetNode = document.getElementsByClassName("p-grid")[props.id]
  if (typeof(targetNode) == "object"){
    new MutationObserver(watchIntersect).observe(targetNode, { childList: true })
  }
})
</script>
