<template>
  <div class="contentView">

    <DataView :value="contentData" ref="dv"  scrollable :layout="layout" :columns="4" :sortOrder="-1" >

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
            <v-lazy-image @click="overlayMilky(slotProps.index)" class="cgb-0-img" :src="`${slotProps.data.signed_url_nail}`"/>
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
import { ref, onMounted, defineComponent } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import VLazyImage from 'v-lazy-image'

import sessionManager from '../../store/modules/session_manager.js'
import axios from 'axios'
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
const base = store.urlRails
const contentData = ref([])
const layout = ref('grid')
let  pageNumber = ref(1)

let options = {
  root: document.getElementsByClassName("p-grid")[0],
  rootMargin: "0px",
  threshold: 1.0
}
onMounted(() => {
  onPage()
})

const fetchKernals = async () => {
  const config = {
    headers: { Authorization: sessionManager.state.auth_token },
    params: { page: pageNumber.value, q:store.filter }
  }
  const kernals =  await axios.get(base + 'kernals', config)
  pageNumber.value = pageNumber.value + 1
  const ret = kernals.data
  return ret
}

const onPage = async (event) => {
  console.log(event)
  console.log(contentData.value)
  const newPage =  await fetchKernals()
  contentData.value = contentData.value.concat(newPage)
  console.log(contentData.value)
  setTimeout(() => {
    const el1 = document.getElementsByClassName("cgb-0")[(pageNumber.value-1)*25-20]
    options.root = el1
    observer.observe(el1)
    if(pageNumber.value - 2 !== 0){
      const el2 = document.getElementsByClassName("cgb-0")[(pageNumber.value-2)*25-20]
      observer.unobserve(el2)
    }
  },100)
}

const intersecting = (event) => {
  if (event[0].isIntersecting) {
    onPage()
  }
}
const observer = new IntersectionObserver(intersecting, options);

const overlayMilky = (ind) => {
  if (store.lightBoxIndex === -1) {
    store.setLightBoxView(!store.lightBoxView)
  }
  store.setLightBoxIndex(ind)
}

</script>
