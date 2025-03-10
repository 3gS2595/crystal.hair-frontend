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
      @paste.prevent="pasteInFile()"
    >
      <template #grid="slotProps">
        <div v-if="slotProps.data.id === 'page-load'" class="nav-loader cont-load">
          <img class="nav-loader-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" />
        </div>

        <div v-else class="cgb-0" @click="toggleLightBox(slotProps.index)">
          <div class="cgb-0-txt" v-if="slotProps.data.file_type === '.txt'">
            <a class="text-content-0">{{ slotProps.data.description }}</a>
          </div>
          <vue-load-image v-else>
            <template v-slot:image>
              <img :id="`${slotProps.data.id}`" class="thumbnail" :src="setSize(slotProps.data)"/>
            </template>
            <template v-slot:preloader>
              <div class="loading"/>
            </template>
            <template v-slot:error>
              <div>*Image load error</div>
            </template>
          </vue-load-image>
        </div>
      </template>
    </DataView>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import VueLoadImage from 'vue-load-image'
import DataView from 'primevue/dataview'

import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

import AddContentBox from '@/components/uploaders/AddContent.vue'
import { setSize, resizeContentFit } from '@/lib/ResizeContentGrid'
import { dragInFile, pasteInFile } from '@/lib/UploadKernal'

import type { kernalType } from '@/types/ApiTypes'

// Props
const props = defineProps<{ id: number }>()

// Store references
const store = GlobalStore()
const { kernals, pageNumber } = storeToRefs(useKernalStore())
const { cgbWidth, uploadBoxView } = storeToRefs(store)

/**
 * Toggles the lightbox view.
 * @param {number} index - Index of the kernal.
 */
const toggleLightBox = (index: number) => {
  if (store.lightBoxIndex === -1) {
    store.lightBoxView = !store.lightBoxView
  }
  store.lightBoxIndex = index
}

/**
 * Sets the information text for the kernal.
 * @param {kernalType} kernal - Kernal object.
 * @returns {string} - The description or URL of the kernal.
 */
const setInfo = (kernal: kernalType): string => {
  if (kernal.description && kernal.description.length > 1) {
    return kernal.description
  }
  if (kernal.url && kernal.url.length > 0) {
    return kernal.url.replace('www.', '')
  }
  return ''
}

// Intersection Observer configuration
const config = {
  root: document.getElementsByClassName('p-grid')[props.id] as HTMLElement,
  threshold: 0.5,
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting && kernals.value[kernals.value.length - 1].signed_url_s !== 'https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif') {
      observer.disconnect()
      if (kernals.value.length >= store.pageSize) {
        useKernalStore().fetchKernals(pageNumber.value)
      }
    }
  }
}, config)

/**
 * Watches for intersections to trigger infinite scroll.
 */
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

  const targetNode = document.getElementsByClassName('p-grid')[0]
  if (targetNode instanceof HTMLElement) {
    new MutationObserver(watchIntersect).observe(targetNode, { childList: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('visibilitychange', resizeContentFit)
  window.removeEventListener('orientationchange', resizeContentFit)
  window.removeEventListener('paste', pasteInFile)
  window.removeEventListener('resize', resizeContentFit)
})
</script>
