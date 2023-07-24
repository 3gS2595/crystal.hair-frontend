<template>
  <div class="contentView">

      <div class="lightbox">
        <div v-if="showOverlay" class="overlay">
          <button class="btn btn-dark" @click="swipe('left')" >PREV</button>
          <button class="btn btn-dark" @click="swipe('right')" >NEXT</button>
          <button class="btn btn-dark" @click="overlayToggle()" >{{index}}</button>
          <vue-load-image>
            <template v-slot:image>
              <span  v-touch:swipe="swipe">
                <img @click="overlayToggle" class="overlayImg" :src="`http://192.168.1.179:8080/feed/${props.contentData[index].file_path}`"/>
              </span>
            </template>
            <template v-slot:preloader>
              <img class="w-9" src="auxiliaries/image-loader.gif" rel="preload"/>
            </template>
          </vue-load-image>
        </div>
      </div>

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
                <img class="w-9" :src="`http://192.168.1.179:8080/feed/${slotProps.data.file_path}`"/>
              </template>
              <template v-slot:preloader>
                <img class="w-9" src="auxiliaries/image-loader.gif" rel="preload"/>
              </template>
              <template v-slot:error>Image load fails</template>
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
                  <a>{{ slotProps.data.description }}</a>
            </div>
          </div>
          <div v-else >
            <vue-load-image>
              <template v-slot:image>
                <img @click="overlayMilky(slotProps.index)" class="w-9" :src="`http://192.168.1.179:8080/feed/${slotProps.data.file_path}`"/>
              </template>
              <template v-slot:preloader>
                <img class="w-9" src="auxiliaries/image-loader.gif" rel="preload"/>
              </template>
              <template v-slot:error>Image load fails</template>
            </vue-load-image>
          </div>

          <div class="cgb-0-info">
            <div class="file_path" >
              {{ slotProps.data.created_at }}
            </div>
            <div class="file_path" >
              <a :href="slotProps.data.url" target="_blank" >{{ slotProps.data.author }}</a>
            </div>
          </div>
        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup>
import { ref, watch, defineComponent } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import { FilterMatchMode } from 'primevue/api'
import { useCounterStore } from '@/store/GlobalStore'
import VueLoadImage from 'vue-load-image'

const store = useCounterStore()
const props = defineProps({
  size: {
    type: Number,
    default: 30
  },
  contentData: {
    type: Array,
    default: () => [],
    required: true
  }
})
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS }
})
watch(
  () => store.filter,
  () => {
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
<script>
export default defineComponent({
  data: () => ({
    index: -1,
    showOverlay: false
  }),
  methods: {
    swipe (direction) {
      if (direction === 'right') {
        this.index = this.index + 1
      } else if (direction === 'left') {
        this.index = this.index - 1
      }
    },
    overlayMilky (ind) {
      console.log(ind)
      console.log(this.index)
      this.index = ind
      if (!this.showOverlay) {
        this.showOverlay = true
      }
    },
    overlayToggle () {
      this.showOverlay = !this.showOverlay
    }
  }
})</script>

<style lang="css" scoped>
  @import 'primeflex/primeflex.css';
</style>
