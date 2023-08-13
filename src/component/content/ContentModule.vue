<template>
  <div class="contentView">
    <DataView :value="props.contentData" ref="dv"  scrollable :layout="layout" :columns="4" :sortOrder="-1" >

      <template #header>
        <div class="flex justify-content-start">
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div v-if="slotProps.data.file_type === '.txt'">
              <div class="cgb-0-txt">
                <a>{{ slotProps.data.description }}</a>
              </div>
            </div>
          <div v-else >
            <vue-load-image>
              <template v-slot:image>
                <img class="w-9" :src="`${slotProps.data.signed_url}`"/>
              </template>
              <template v-slot:preloader>
                <img class="w-9" src="image-loader.gif" rel='preload'/>
              </template>
              <template v-slot:error>
                Image load fails
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
            <div class="cgb-0-txt">
                  <a @click="overlayMilky(slotProps.index)">{{ slotProps.data.description }}</a>
            </div>
          </div>
          <div v-else >
            <v-lazy-image v-on:click="overlayMilky(slotProps.index)" class="cgb-0-img" :src="`${slotProps.data.signed_url_nail}`"/>
          </div>

          <div class="cgb-0-info">
            <div class="file_path" >
              {{ slotProps.data.time_posted }}
            </div>
            <div class="file_path" >
              <a>{{ slotProps.data.author }}</a>
            </div>
          </div>
        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineComponent } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import VLazyImage from 'v-lazy-image'

import sessionManager from '../../store/modules/session_manager.js'
import axios from 'axios'
import { filterStore } from '@/store/FilterStore'
import { ApiStore } from '@/store/ApiStore'

const store = filterStore()
const base = store.urlRails
const contentData = ref([])
const layout = ref('grid')

const  pageNumber = ref(2)
const props = defineProps({
  contentData: {
    type: Array,
    default: () => [],
    required: true
  }
})
onMounted(() => {
  intersectWatch()
  const targetNode = document.getElementsByClassName("p-grid")[0]
  MutateObserver.observe(targetNode, config);
})

const onPage = async (event) => {
  pageNumber.value = pageNumber.value + 1
  const newPage =  ApiStore().fetchKernals(pageNumber.value)
}

const intersecting = (event) => {
  if (event[0].isIntersecting) {
    onPage()
  }
}
const intersectWatch = () =>{
    const el1 = document.getElementsByClassName("cgb-0")[(pageNumber.value-1)*25-20]
    if (el1){ observer.observe(el1) } 
    if (pageNumber.value - 2 !== 0) {
      const el2 = document.getElementsByClassName("cgb-0")[(pageNumber.value-2)*25-20]
      if (el2) { observer.unobserve(el2) }
    }
}
const options = { root: document.getElementsByClassName("p-grid")[0] }
const observer = new IntersectionObserver(intersecting, options);

const callback = (mutationList, MutateObserver) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      observer.disconnect()
      intersectWatch()
    }
  }
}
const config = { childList: true };
const MutateObserver = new MutationObserver(callback);

watch(
  () => props.contentData,
  () => { 
    if(props.contentData.length < 20){
      pageNumber.value = 2
    }
  }
)

let numClicks = 0
const overlayMilky = (ind) => {
  numClicks++;
  if (numClicks === 1) {
    setTimeout(function() {
      switch(numClicks) {
        case 1:
          if (store.lightBoxIndex === -1) {
            store.setLightBoxView(!store.lightBoxView)
          }
          store.setLightBoxIndex(ind)
        console.log('sig')
          break;
        default:
        console.log('dub')
          break;
      }
    numClicks = 0;
  }, 200);
 }
}
</script>
