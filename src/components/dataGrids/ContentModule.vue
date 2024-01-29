<template>
  <AddContentBox v-if='store.uploadBoxView'/>
  <OverlayScrollbarsComponent defer>
    <DataView class="contentView" :value="kernals" layout="grid" >
      <template #grid="slotProps">
        <div class="cgb-0" v-on:click="toggleLightBox(slotProps.index)">

          <div class="cgb-0-txt" v-if="slotProps.data.file_type === '.txt'">
            <a class="text-content-0">{{ slotProps.data.description }}</a>
          </div>

          <vue-load-image v-else >
            <template v-slot:image>
              <img :id="`${slotProps.data.id}`" class="thumbnail" :src="`${setSize(slotProps.data)}`"/>
            </template>
            <template v-slot:preloader>
              <div class="loading"/>
            </template>
            <template v-slot:error>
              <div>*Image load error</div>
            </template>
          </vue-load-image>

          <div v-if="setInfo(slotProps.data) != ''" class="cgb-0-info">{{setInfo(slotProps.data)}}</div>

        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import type { kernalType } from '@/assets/types/ApiTypes'
import { ref, watch, onMounted } from 'vue'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import VueLoadImage from 'vue-load-image'
import DataView from 'primevue/dataview'

import { useKernalStore } from '@/services/api/KernalStore'
import { GlobalStore } from '@/services/GlobalStore'

import { setSize, resize, stepContentFit, resizeContentFit } from '@/lib/ResizeContentGrid'
import AddContentBox from '@/components/uploaders/AddContent.vue'

import { storeToRefs } from 'pinia'
const { kernals, pageNumber } = storeToRefs(useKernalStore())
const { cgbWidth } = storeToRefs(GlobalStore())
const store = GlobalStore()

const props = defineProps<{
  id: number
}>()

// LIGHTBOX TOGGLE
const toggleLightBox = (ind: number) => {
  if (store.lightBoxIndex === -1) store.lightBoxView = !store.lightBoxView
  store.lightBoxIndex = ind
}

// GENERATE CGB DESCRIPTION TEXT
const setInfo = (k: kernalType) => {
  if (k.description != null) {
    if (k.description.length > 1) {
      return k.description
    }
  }
  if (k.url != null) {
    if (k.url.length > 0) {
      return k.url.replace('www.', '')
    }
  }
  return ''
}

// INFINITE SCROLL METHODS
const intersecting = (event) => {
  for (const e of event){
    if (e.isIntersecting && kernals.value[kernals.value.length - 1].signed_url_s != "https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif") {
      observer.disconnect()
      if(kernals.value.length >= store.pageSize) {
        console.log('page number')
        useKernalStore().fetchKernals(pageNumber.value)
      }
    }
  }
}
const watchIntersect = () =>{
  observer.disconnect()
  for (let i = 1; i < 5; i++) {
    const el = document.getElementsByClassName("cgb-0")[(pageNumber.value - 1) * store.pageSize - (5 * i)]
    if (el){
      observer.observe(el)
    }
  }
}
const config = {root: document.getElementsByClassName("p-grid")[props.id], threshold: 0.5}
const observer = new IntersectionObserver(intersecting, config);
onMounted(() => {
  window.addEventListener('visibilitychange', resizeContentFit)
  window.addEventListener('orientationchange', resizeContentFit)
  window.addEventListener('resize', resizeContentFit)
  resizeContentFit()
  const targetNode = document.getElementsByClassName("p-grid")[props.id]
  if (typeof(targetNode) == "object"){
    new MutationObserver(watchIntersect).observe(targetNode, {
      childList: true
    })
  }
})
</script>
