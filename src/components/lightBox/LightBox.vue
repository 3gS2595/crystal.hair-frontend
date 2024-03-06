<template>
  <div class ='lightbox'>
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

<script lang='ts'>
import type { kernalType } from '@/types/ApiTypes'

import { ref, defineComponent, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import VueResizable from 'vue-resizable'

import ViewText from './viewers/TextEditor.vue'
import ViewPdf from './viewers/ViewPdf.vue'
import ViewImg from './viewers/ViewImg.vue'
import ViewInfo from './viewers/ViewInfo.vue'
import axios, { type AxiosInstance, type CancelTokenStatic } from 'axios'

import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

export default defineComponent({
  name: 'App',
  components: {
    VueResizable,
    ViewText,
    ViewPdf,
    ViewImg,
    ViewInfo
  },
  setup () {
    const { kernals } = storeToRefs(useKernalStore())
    return { kernals }
  },
  data () {
    return {
      left: 5,
      top: 5,
      height: window.innerHeight - 10,
      width: window.innerWidth - 11,
      maxW: window.innerWidth - 10,
      maxH: window.innerHeight - 10,
      event: '',
      dragSelector: '.drag-container-1',
      viewInfo:false,
      store: GlobalStore()
    }
  },
  methods: {
    esc (e: KeyboardEvent) {
      if(document.getElementsByClassName('tiptap')[0] != document.activeElement) {
        if (e.key === 'Escape') {
          if(this.viewInfo == true){
            this.viewInfo = false
          } else {
            this.close()
          }
        } else if (e.key === 'ArrowRight') {
          this.next()
        } else if (e.key === 'ArrowLeft') {
          this.prev()
        }
      } else {
        if (e.key === 'Escape') {
          (document.getElementsByClassName('tiptap')[0] as HTMLElement).blur()
        }
      }
    },
    close () {
      GlobalStore().closeViewer()
      this.viewInfo = false
      window.removeEventListener('keyup', this.esc, true)
    },
    next () {
      if ((GlobalStore().lightBoxIndex + 1) <= (this.kernals.length -1)) {
        GlobalStore().lightBoxIndex = GlobalStore().lightBoxIndex + 1
      }
    },
    prev () {
      if ((GlobalStore().lightBoxIndex - 1) >= 0) {
        GlobalStore().lightBoxIndex = GlobalStore().lightBoxIndex - 1
      }
    },
    eHandler () {
      this.maxW = window.innerWidth
      this.maxH = window.innerHeight
    },
    res () {
      window.addEventListener('resize', this.orientationChange)
      window.addEventListener('orientationchange', this.orientationChange)
      window.addEventListener('keyup', this.esc, true)
      this.orientationChange()
    },
    orientationChange () {
      const orientation = window.orientation
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        if (orientation === 0) {
          this.width = window.innerWidth - 11
          this.height = window.innerHeight - 10
        } else if (orientation === 90 || orientation === -90) {
          this.width = window.innerWidth - 11
          this.height = window.innerHeight - 10
        }
      } else {
        this.width = window.innerWidth - 11
        this.height = window.innerHeight - 10
      }
    },
  }
})
</script>
