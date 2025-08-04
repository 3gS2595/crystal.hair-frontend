<template>
  <vue-load-image>
    <template v-slot:image>
      <div
        class="lightBox-viewer"
        :style="{
          height: '100%',
          backgroundImage: `url(${modelValue.signed_url_s})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }"
        :data-src="srcSetSize()"
        @load="srcSetResize()"
      />
    </template>
    <template v-slot:preloader>
      <img src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif" />
    </template>
    <template v-slot:error>Image load fails</template>
  </vue-load-image>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import VueLoadImage from 'vue-load-image'
  import { debounce } from 'lodash-es'

  const props = defineProps<{
    modelValue: {
      signed_url: string
      signed_url_l: string
      signed_url_m: string
      signed_url_s: string
    }
  }>()

  /**
   * Adjust the backgroundImage based on container width.
   */
  const srcSetResize = () => {
    const viewers = document.getElementsByClassName('lightBox-viewer')
    if (viewers.length > 0 && viewers[0].parentElement) {
      const width = viewers[0].parentElement.offsetWidth
      const viewer = viewers[0] as HTMLElement
      viewer.style.backgroundImage = 'none' // Clear previous background image
      if (width > 140 && width <= 1000) {
        viewer.style.backgroundImage = `url(${props.modelValue.signed_url_l})`
      } else if (width > 1000) {
        viewer.style.backgroundImage = `url(${props.modelValue.signed_url})`
      } else {
        viewer.style.backgroundImage = `url(${props.modelValue.signed_url_m})`
      }
    }
  }
  const srcSetSize = () => {
    const width = window.innerWidth
    if (width > 140 && width <= 1000) {
      return props.modelValue.signed_url_l
    } else if (width > 1000) {
      return props.modelValue.signed_url
    } else {
      return props.modelValue.signed_url_s
    }
  }

  const debouncedSrcSetResize = debounce(srcSetResize, 100)
  let observer: MutationObserver | null = null
  onMounted(() => {
    window.addEventListener('resize', debouncedSrcSetResize)
    srcSetResize()
    observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node as HTMLElement).classList.contains('lightBox-viewer')) {
            srcSetResize()
          }
        }
      }
    })

    const target = document.body
    observer.observe(target, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedSrcSetResize)
    if (observer) observer.disconnect()
  })
</script>
