<template>
  <div class='lightbox'>
    <vue-resizable
      class='resizable'
      ref='resizableComponent'
      :dragSelector='dragSelector'
      :active='handlers'
      :fit-parent='true'
      :max-width='maxW'
      :max-height='maxH'
      :width='width'
      :height='height'
      :left='left'
      :top='top'
      @mount='res'
      @resize:move='eHandler'
      @resize:start='eHandler'
      @resize:end='eHandler'
      @drag:move='eHandler'
      @drag:start='eHandler'
      @drag:end='eHandler'
    >
      <div class='block'>
        <ViewPdf
          v-if="kernals[store.lightBoxIndex].file_type.includes('pdf')"
          v-model="kernals[store.lightBoxIndex].signed_url"
        />
        <ViewImg
          @click='viewInfo = !viewInfo'
          v-if="!kernals[store.lightBoxIndex].file_type.includes('pdf') && kernals[store.lightBoxIndex].file_type != '.txt'"
          v-model="kernals[store.lightBoxIndex]"
        />
        <ViewText
          v-if="kernals[store.lightBoxIndex].file_type == '.txt'"
          v-model="kernals[store.lightBoxIndex]"
        />
        <ViewInfo
          v-if="viewInfo"
          v-model="kernals[store.lightBoxIndex]"
        />

        <div class='drag-container-1'>
          <a class='navItem' style="padding-top:3px;" @click='close'>✕</a>
          <a class='navItem' style="padding-top:3px;" @click='viewInfo = !viewInfo'>&#9432;&#xFE0E;</a>
          <a class='navItem' style="padding-top:3px;" @click='prev' v-if="store.lightBoxIndex != 0">←</a>
          <a class='navItem' style="padding-top:3px;" @click='next' v-if="store.lightBoxIndex != kernals.length - 1">→</a>
        </div>
      </div>
    </vue-resizable>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import VueResizable from 'vue-resizable'
import ViewText from './viewers/TextEditor.vue'
import ViewPdf from './viewers/ViewPdf.vue'
import ViewImg from './viewers/ViewImg.vue'
import ViewInfo from './viewers/ViewInfo.vue'
import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

const store = GlobalStore()
const { kernals } = storeToRefs(useKernalStore())

const left = ref(5)
const top = ref(5)
const height = ref(window.innerHeight - 10)
const width = ref(window.innerWidth - 11)
const maxW = ref(window.innerWidth - 10)
const maxH = ref(window.innerHeight - 10)
const dragSelector = '.drag-container-1'
const viewInfo = ref(false)

const close = () => {
  store.closeViewer()
  viewInfo.value = false
  window.removeEventListener('keyup', keyIn, true)
}

const next = () => {
  if ((GlobalStore().lightBoxIndex + 1) <= (kernals.value.length -1)) {
    store.lightBoxIndex = store.lightBoxIndex + 1
  }
}
const prev = () => {
  if ((store.lightBoxIndex - 1) >= 0) {
    store.lightBoxIndex = store.lightBoxIndex - 1
  }
}

const eHandler = () => {
  maxW.value = window.innerWidth
  maxH.value = window.innerHeight
}

const res = () => {
  window.addEventListener('resize', orientationChange)
  window.addEventListener('orientationchange', orientationChange)
  window.addEventListener('keyup', keyIn, true)
  orientationChange()
}

const orientationChange = () => {
  const orientation = window.orientation
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    if (orientation === 0) {
      width.value = window.innerWidth - 11
      height.value = window.innerHeight - 10
    } else if (orientation === 90 || orientation === -90) {
      width.value = window.innerWidth - 11
      height.value = window.innerHeight - 10
    }
  } else {
    width.value = window.innerWidth - 11
    height.value = window.innerHeight - 10
  }
}

const keyIn = (e: KeyboardEvent) => {
  if (document.getElementsByClassName('tiptap')[0] != document.activeElement) {
    if (e.key === 'Escape') {
      if (viewInfo.value == true) {
        viewInfo.value = false
      } else {
        close()
      }
    } else if (e.key === 'ArrowRight') {
      next()
    } else if (e.key === 'ArrowLeft') {
      prev()
    }
  } else {
    if (e.key === 'Escape') {
      (document.getElementsByClassName('tiptap')[0] as HTMLElement).blur()
    }
  }
}

onMounted(() => {
  res()
})

onUnmounted(() => {
  window.removeEventListener('resize', orientationChange)
  window.removeEventListener('orientationchange', orientationChange)
  window.removeEventListener('keyup', keyIn, true)
})
</script>
