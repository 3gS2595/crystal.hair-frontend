<template>
  <div class="contentView">
    <DataView :value="props.contentData" :layout="layout" :columns="4" sortField="created_at" :sortOrder="-1" scrollable >
      <template #header>
        <div class="flex justify-content-start">
          <DataViewLayoutOptions v-model="layout" />
        </div>

      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div
            class="flex flex-column xl:flex-column  xl:align-items-end p-4 gap-4"
          >
            <vue-load-image>
                <template v-slot:image>
                  <img class="w-9" :src="`http://192.168.1.180:8080/feed/${slotProps.data.file_path}`"/>
                </template>
                <template v-slot:preloader>
                  <img class="w-9" src="auxilaries/image-loader.gif" rel="preload"/>
                </template>
                <template v-slot:error>{{slotProps.data.file_path}}</template>
              </vue-load-image>
              <div
              class="test-6 flex flex-column sm:flex-row justify-content-left align-items-left xl:align-items-start flex-1 gap-4"
            >
              <div
                class="flex flex-column align-items-left sm:align-items-start gap-3"
              >

<!-- three main
                :modelValue="slotProps.data.rating"
                  readonly
                  :cancel="false"
                 ></Rating>
-->
                <div class="flex align-items-left gap-3">
                  <span class="flex align-items-left gap-2">
                    <span>{{ slotProps.data.created_at }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div class="p-4 border-1 surface-border surface-card border-round">

            <div class="flex flex-wrap align-items-left justify-content-between gap-2">
              <div class="flex align-items-left gap-2">
                <i class="pi pi-tag"></i>
                <span>{{ slotProps.data.file_type }}</span>
              </div>
            </div>

            <div class="flex flex-column align-items-left gap-3 py-5">
              <vue-load-image>
                <template v-slot:image>
                  <img class="w-9" :src="`http://192.168.1.180:8080/feed/${slotProps.data.file_path}`"/>
                </template>
                <template v-slot:preloader>
                  <img class="w-9" src="auxilaries/image-loader.gif" rel="preload"/>
                </template>
                <template v-slot:error>Image load fails</template>
              </vue-load-image>
              <div class="file_path" >
                {{ slotProps.data.description }}
              </div>
              <div class="file_path" >
                {{ slotProps.data.hashtags }}
              </div>
            </div>

            <div class="flex align-items-left justify-content-between">
              <span class="created_at">
                {{ slotProps.data.created_at}}
              </span>
            </div>
            <div class="author" >
              {{ slotProps.data.author }}
            </div>

          </div>
        </div>
      </template>

    </DataView>
  </div>
</template>
<style lang="css" scoped>
  @import 'primeflex/primeflex.css'
</style>
<script setup>
import { ref, watch } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import { FilterMatchMode } from 'primevue/api'
import { useCounterStore } from '@/store/GlobalStore'
import VueLoadImage from 'vue-load-image'

const store = useCounterStore()
const props = defineProps({
  size: {
    type: Number,
    default: 30,
    validator: function (value) {
      return (
        ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
        -1
      )
    }

  },
  contentData: {
    type: Array,
    default: () => [],
    required: true,
    validator: function (value) {
      return (
        ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
        -1
      )
    }
  }
})
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },

  source_url_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hypertext_id: { value: null, matchMode: FilterMatchMode.CONTAINS },

  updated_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
  created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },

  url: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  scrape_interval: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_last_scrape: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_initial_scrape: { value: null, matchMode: FilterMatchMode.CONTAINS },

  file_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_path: { value: null, matchMode: FilterMatchMode.CONTAINS },
  size: { value: null, matchMode: FilterMatchMode.CONTAINS },
  author: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_posted: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_scraped: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  key_words: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hashtags: { value: null, matchMode: FilterMatchMode.CONTAINS },
  likes: { value: null, matchMode: FilterMatchMode.CONTAINS },
  reposts: { value: null, matchMode: FilterMatchMode.CONTAINS },

  names: { value: null, matchMode: FilterMatchMode.CONTAINS },
  word_count: { value: null, matchMode: FilterMatchMode.CONTAINS },
  text_body: { value: null, matchMode: FilterMatchMode.CONTAINS },

  domain: { value: null, matchMode: FilterMatchMode.CONTAINS },
  tag_list: { value: null, matchMode: FilterMatchMode.CONTAINS },
  source: { value: null, matchMode: FilterMatchMode.CONTAINS },
  logo_path: { value: null, matchMode: FilterMatchMode.CONTAINS },
  post_date: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

watch(
  () => store.filter,
  () => {
    // console.log('store.filter=' + store.filter)
    filters.value.global.value = store.filter
  }
)

watch(
  () => filters.value.global.value,
  () => {
    if ((store.filter !== filters.value.global.value)) {
      store.setFilter(filters.value.global.value)
    }
  }
)
const layout = ref('grid')

</script>
