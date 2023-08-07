<template>
  <div class="contentView">
    <DataView :value="props.contentData" :layout="layout" :columns="4" :sortOrder="-1" scrollable >

      <template #header>
        <div class="flex justify-content-start">
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div v-if="slotProps.data.file_type === '.txt'">
              <div class="textContent">
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
            <div class="textContent">
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
import { ref, defineComponent } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import VLazyImage from 'v-lazy-image'

import VueLoadImage from 'vue-load-image'
const layout = ref('grid')
const props = defineProps({
  contentData: {
    type: Array,
    default: () => [],
    required: true
  }
})
</script>

<script>
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
export default defineComponent({
  data: () => ({
    index: -1,
    showOverlay: false
  }),
  methods: {
    overlayMilky (ind) {
      if (store.lightBoxIndex === -1) {
        store.setLightBoxView(!store.lightBoxView)
      }
      store.setLightBoxIndex(ind)
    }
  }
})
</script>
