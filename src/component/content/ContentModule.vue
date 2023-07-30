<template>
  <div class="contentView">

    <div v-if="showOverlay" class="lightbox">
      <button class="btn btn-dark" @click="swipe('left')" >PREV</button>
      <button class="btn btn-dark" @click="swipe('right')" >NEXT</button>
      <button class="btn btn-dark" @click="overlayToggle()" >{{index}}</button>
      <vue-load-image>
        <template v-slot:image>
          <span  v-touch:swipe="swipe">
            <img @click="overlayToggle" class="overlayImg" :src="`https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/${props.contentData[index].file_path}`"/>
          </span>
        </template>
        <template v-slot:preloader>
          <img class="w-9-load" src="http://3.130.240.169/image-loader.gif" rel="preload"/>
        </template>
      </vue-load-image>
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
                <img class="w-9" :src="`https://crystal-hair-nail.nyc3.digitaloceanspaces.com/${slotProps.data.file_path}`"/>
              </template>
              <template v-slot:preloader>
                <img class="w-9" src="http://3.130.240.169/image-loader.gif" rel="preload"/>
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
        <div v-if="slotProps.data.url != null">
          <div class="cgb-0" id="contentBlock"  v-if="slotProps.data.url.includes(store.filter)">
            <div v-if="slotProps.data.file_type === '.txt'">
              <div class="textContent">
                    <a>{{ slotProps.data.description }}</a>
              </div>
            </div>
            <div v-else >
              <v-lazy-image @click="overlayMilky(slotProps.index)" class="cgb-0-img" :src="`https://crystal-hair-nail.nyc3.digitaloceanspaces.com/${slotProps.data.file_path}`"/>
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
        </div>
      </template>

    </DataView>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import { filterStore } from '@/store/FilterStore'
import VueLoadImage from 'vue-load-image'
import VLazyImage from 'v-lazy-image'

const layout = ref('grid')
const store = filterStore()
const props = defineProps({
  contentData: {
    type: Array,
    default: () => [],
    required: true
  }
})
</script>

<script>
export default defineComponent({
  data: () => ({
    index: -1,
    showOverlay: false
  }),
  created () {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === '37') {
        this.swipe('left')
      } else if (e.keyCode === '39') {
        this.swipe('right')
      }
    })
  },
  methods: {
    swipe (direction) {
      if (direction === 'right') {
        this.index = this.index + 1
      } else if (direction === 'left') {
        this.index = this.index - 1
      }
    },
    overlayMilky (ind) {
      this.index = ind
      if (!this.showOverlay) {
        this.showOverlay = true
      }
    },
    overlayToggle () {
      this.showOverlay = !this.showOverlay
    }
  }
})
</script>
