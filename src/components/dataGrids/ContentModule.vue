<template>
  <AddContentBox v-if='uploadBoxView'/>
  <OverlayScrollbarsComponent defer>
    <DataView
      class="contentView"
      :value="kernals"
      layout="grid"
      @drop.prevent="dragInFile"
      @dragenter.prevent
      @dragover.prevent
      @paste.prevent="pasteInFile($event)"
    >
      <template #grid="slotProps">
        <div class="grid">
          <div v-for="(item, index) in slotProps.items" :key="index" class="cgb-0" @click="toggleLightBox(index)">
            <div v-if="item.id === 'page-load'" class="cont-load">
              <img class="nav-loader-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" />
            </div>
            <div v-else>
              <div class="cgb-0-txt" v-if="item.file_type === '.txt'">
                <a class="text-content-0">{{ item.description }}</a>
              </div>
              <vue-load-image v-else>
                <template v-slot:image>
                  <img :id="item.id" class="thumbnail" :src="setSize(item)"/>
                </template>
                <template v-slot:preloader>
                  <div class="loading"/>
                </template>
                <template v-slot:error>
                  <div>*Image load error</div>
                </template>
              </vue-load-image>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import VueLoadImage from 'vue-load-image'
import DataView from 'primevue/dataview'

import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

import AddContentBox from '@/components/uploaders/AddContent.vue'
import { setSize, resizeContentFit } from '@/lib/ResizeContentGrid'
import { dragInFile, pasteInFile } from '@/lib/UploadKernal'

// Props
const props = defineProps<{ id: number }>()

// Reactive references
const store = GlobalStore()
const kernalStore = useKernalStore()
const { kernals, pageNumber } = storeToRefs(useKernalStore())
const { uploadBoxView } = storeToRefs(store)

// Reactive state for lightbox
const toggleLightBox = (index: number) => {
  if (store.lightBoxIndex === -1) {
    store.lightBoxView = !store.lightBoxView
  }
  store.lightBoxIndex = index
}

// Intersection Observer configuration
const config = {
  root: document.getElementsByClassName('p-grid')[props.id] as HTMLElement,
  threshold: 0.5,
}

// Create an Intersection Observer to handle infinite scrolling
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting && kernals.value[kernals.value.length - 1].signed_url_s !== 'https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif') {
      observer.disconnect()
      if (kernals.value.length >= store.pageSize) {
          kernalStore.fetchKernals()
      }
    }
  }
}, config)

// Watch for intersection changes to load more content
const watchIntersect = () => {
  observer.disconnect()
  for (let i = 1; i < 5; i++) {
    const el = document.getElementsByClassName('cgb-0')[(pageNumber.value - 1) * store.pageSize - (5 * i)] as HTMLElement
    if (el) {
      observer.observe(el)
    }
  }
}

onMounted(() => {
  if (window.innerWidth < 400) {
    store.cgbWidth = 86
    store.cgbWidthSized = 60
  }
  window.addEventListener('visibilitychange', resizeContentFit)
  window.addEventListener('orientationchange', resizeContentFit)
  window.addEventListener('paste', pasteInFile)
  window.addEventListener('resize', resizeContentFit)
  resizeContentFit()

  const targetNode = document.getElementsByClassName('grid')[0]
  if (targetNode instanceof HTMLElement) {
    new MutationObserver(watchIntersect).observe(targetNode, { childList: true })
  }
})

// manages reiszing of content grid
onUnmounted(() => {
  window.removeEventListener('visibilitychange', resizeContentFit)
  window.removeEventListener('orientationchange', resizeContentFit)
  window.removeEventListener('paste', pasteInFile)
  window.removeEventListener('resize', resizeContentFit)
})
</script>
