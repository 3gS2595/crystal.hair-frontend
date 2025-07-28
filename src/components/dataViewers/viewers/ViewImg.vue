<template>
  <div class='pdf'>
    <vue-load-image>
      <template v-slot:image>
        <img class="lightBox-viewer" :src="modelValue.signed_url_m" @load="srcSetResize"/>
      </template>
      <template v-slot:preloader>
        <img src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" rel='preload'/>
      </template>
      <template v-slot:error>
        <a>{{ viewerData[store.lightBoxIndex].description }}</a>
      </template>
    </vue-load-image>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import VueLoadImage from 'vue-load-image'
import { GlobalStore } from '@/stores/GlobalStore'
import { debounce } from 'lodash-es'

const store = GlobalStore()

const props = defineProps<{
  modelValue: {
    signed_url: string;
    signed_url_l: string;
    signed_url_m: string;
    signed_url_s: string;
  }
}>()

/**
 * Function to set the appropriate image source based on the viewer's width.
 */
const srcSetResize = () => {
  const viewers = document.getElementsByClassName('lightBox-viewer')
  if (viewers.length > 0 && viewers[0].parentElement) {
    const width = viewers[0].parentElement.offsetWidth
    for (let i = 0; i < viewers.length; i++) {
      const viewer = viewers[i] as HTMLImageElement
      if (width > 140 && width <= 1000) {
        viewer.src = props.modelValue.signed_url_l
      } else if (width > 1000) {
        viewer.src = props.modelValue.signed_url
      } else {
        viewer.src = props.modelValue.signed_url_s
      }
    }
  }
}

// Debounced version of srcSetResize to optimize performance on resize events
const debouncedSrcSetResize = debounce(srcSetResize, 100)

onMounted(() => {
  window.addEventListener('resize', debouncedSrcSetResize)
  // Initial call to set the correct image source
  srcSetResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedSrcSetResize)
})
</script>
