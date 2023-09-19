<template>
  <div class="contentView">
    <DataView :value="props.contentData" :layout="layout" >

      <template #header>
        <div class="conten-head flex justify-content-start">
          <DataViewLayoutOptions v-model="layout" />
          <button @click="toggleUploadBox()">+</button>
        </div>

      </template>

      <template #list="slotProps">
        <div class="clb-0">
          <div v-if="slotProps.data.file_type === '.txt'">
              <div class="clb-0-txt">
                <a>{{ slotProps.data.description }}</a>
              </div>
            </div>
          <div v-else >
            <vue-load-image>
              <template v-slot:image>
                <img class="clb-0-img" :src="`${slotProps.data.signed_url}`"/>
              </template>
              <template v-slot:preloader>
                <img class="clb-0-img" src="`${slotProps.data.signed_url_nail}`"/>
              </template>
              <template v-slot:error>
                <img class="clb-0-img" src="`${slotProps.data.signed_url_nail}`"/>
              </template>
            </vue-load-image>
          </div>
          <span class="flex align-items-left gap-2">
            <span>{{ slotProps.data.created_at }}</span>
          </span>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="cgb-0" id="contentBlock">

          <div v-if="slotProps.data.file_type === '.txt'">
            <div class='cgb-loaded'>
              <div class="cgb-0-txt">
                <a @click="toggleLightBox(slotProps.index)">{{ slotProps.data.description }}</a>
              </div>
              <div class="cgb-0-info">
                <div class="file_path" style="font-size:10px;">
                  {{ slotProps.data.time_posted }}
                </div>
              </div>
            </div>
          </div>

          <div v-else >
            <vue-load-image>
              <template v-slot:image>
                <div class='cgb-loaded'>
                  <img 
                    class="cgb-0-img" 
                    :src="`${slotProps.data.signed_url_nail}`" 
                    v-on:click="toggleLightBox(slotProps.index)"
                  />
                  <div class="cgb-0-info">
                    <div class="file_path" style="font-size:11px;">
                      {{ convertDate(slotProps.data.time_posted) }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-slot:preloader>
                <div class ='cgb-loading' >
                  <div class="cgb-0-info">
                    <div class="file_path" style="font-size:11px;">
                      {{ convertDate(slotProps.data.time_posted) }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-slot:error>
                <div class='cgb-loaded'>
                  <div class="cgb-0-txt">
                    <a v-on:click="toggleLightBox(slotProps.index)">
                      {{ slotProps.data.description }}
                    </a>
                  </div>
                  <div class="cgb-0-info">
                    <div class="file_path" style="font-size:11px;">
                      {{slotProps.data.file_type }}
                    </div>
                  </div>
                </div>
              </template>
            </vue-load-image>
          </div>

        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup lang="ts">
import type { InputFileEvent } from '@/types/index'
import type { kernalType } from '@/types/index'
import { ref, watch, onMounted } from 'vue'
import { ApiStore } from '@/store/ApiStore'
import { GlobalStore } from '@/store/GlobalStore'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import VueLoadImage from 'vue-load-image'

const store = GlobalStore()
const pageNumber = ref<number>(2)
const layout = ref('grid')
const props = withDefaults(defineProps<{
  contentData: PropType<kernalType[]>,
  id: number
}>(), {
  contentData: [],
  id:-1
})

const toggleUploadBox = () => {
  store.setUploadBoxView(!store.uploadBoxView)
}
let numClicks = 0
const toggleLightBox = (ind) => {
  numClicks++
  if (numClicks === 1) {
    setTimeout(function() {
      if (numClicks === 1) {
          if (store.lightBoxIndex === -1) {
            store.setLightBoxView(!store.lightBoxView)
          }
          store.setLightBoxIndex(ind)
      }
    numClicks = 0
  }, 200)
 }
}
const convertDate = (datetime) => {
  const elapsed = (new Date() - new Date(datetime))/1000/60/60/24
  return (new Date(datetime))
}
watch(
  () => props.contentData,
  () => { 
    if (props.contentData.length < store.pageSize  ) {
      pageNumber.value = 2
    }
  }
)

// infinite scrollling intersectionObserver
const fetchPage = async () => {
  observer.disconnect()
  ApiStore().fetchKernals(pageNumber.value)
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
  console.log(store.pageSize)
  for (let i = 1; i < 5; i++) {
    const el = document.getElementsByClassName("cgb-0")[(pageNumber.value-1)*store.pageSize-(5*i)]
    if (el){
      observer.observe(el)
    }
  }
}
const config = { root: document.getElementsByClassName("p-grid")[props.id], threshold: 0.5 }
const observer = new IntersectionObserver(intersecting, config);
onMounted(() => {
  const targetNode = document.getElementsByClassName("p-grid")[props.id]
  new MutationObserver(watchIntersect).observe(targetNode, { childList: true });
})
</script>
