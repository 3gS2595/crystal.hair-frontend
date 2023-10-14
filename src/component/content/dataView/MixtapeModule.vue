<template>
  <div class="mixtapeView">
    <DataView class='dg-0' :value="props.contentData" :layout="list" >
      <template #list="slotProps">
        <div  @click="search(slotProps.data.id)" class="dgb-0">
          <div class="dgb-0-txt">
            <a style="float:left; max-width:calc(100% - 40px);">
            {{ slotProps.data.name }}
            </a>

            <br/>
            <a class='descr'>
              {{ convertDate(slotProps.data.updated_at) }}
            </a>
            <a class='descr' style="float:right; ">
              {{ blockCnt(slotProps.data.content) }} kernals
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
import VanillaTilt from 'vanilla-tilt'
import { GlobalStore } from '@/store/GlobalStore'
import { ApiStore } from '@/store/ApiStore'

const store = GlobalStore()
const pageNumber = ref<number>(2)

const props = withDefaults(defineProps<{
  header: string,
  contentData: any[],
  id: number
}> (), {
  contentData: []
})

const search = (e) => {
  store.setFilter('')
  if(JSON.stringify(store.mixtape) === JSON.stringify(e)) {
    store.setMixtape('')
  }else {
    store.setMixtape(e)
  }
}
const convertDate = (datetime) => {
  const elapsed = (new Date() - new Date(datetime))/1000/60/60/24
  return ( elapsed.toFixed(0) + ' days ago')
}
const blockCnt = (datetime) => {
  if(datetime != null) {
    return datetime.length
  }
  return null
}
watch(
  () => props.contentData,
  () => {
    if(props.contentData.length < store.pageSize -1 ){
      pageNumber.value = 2
    }
  }
)

// infinite scrollling intersectionObserver
const fetchPage = async () => {
  if(props.header == 'mixtape') {
    ApiStore().fetchMixtapes(pageNumber.value)
  }
  pageNumber.value = pageNumber.value + 1
}
const intersecting = (event) => {
  VanillaTilt.init(document.querySelectorAll(".dgb-0"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2
  })
  console.log(document.querySelectorAll(".dgb-0"))
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
    const el = document.getElementsByClassName("dgb-0")[(pageNumber.value-1)*store.pageSize-(5*i)]
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
