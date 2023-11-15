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
          v-if="viewerData[store.lightBoxIndex].file_type.includes('pdf')"
          v-model="viewerData[store.lightBoxIndex].signed_url"
        />
        <ViewImg
          v-if="!viewerData[store.lightBoxIndex].file_type.includes('pdf') && viewerData[store.lightBoxIndex].file_type != '.txt'"
          v-model="viewerData[store.lightBoxIndex].signed_url"
        />
        <ViewText
          v-if="viewerData[store.lightBoxIndex].file_type == '.txt'"
          v-model="viewerData[store.lightBoxIndex].description"
        />

        <div class='drag-container-1'>
          <a class='navItem' style="margin-top:-.5px;" @click='deleteBlock'>🗑</a>
          <a class='navItem' style="margin-top:4px;" @click='close'>✕</a>
          <a class='navItem' style="margin-top:3px;" @click='prev' v-if="store.lightBoxIndex != 0">←</a>
          <a class='navItem' style="margin-top:3px;" @click='next' v-if="store.lightBoxIndex != viewerData.length - 1">→</a>
        </div>

      </div>
    </vue-resizable>
  </div>
</template>

<script lang='ts'>
import type { kernalType } from '@/types/ApiTypes'

import { ref, defineComponent, type PropType } from 'vue'
import VueResizable from 'vue-resizable'

import ViewText from './viewers/TextEditor.vue'
import ViewPdf from './viewers/ViewPdf.vue'
import ViewImg from './viewers/ViewImg.vue'
import axios, { type AxiosInstance, type CancelTokenStatic } from 'axios'

import { GlobalStore } from '@/store/GlobalStore'
import { SessionStore } from '@/store/SessionStore'
import { ApiStore } from '@/store/ApiStore'
const sessionStore = SessionStore()
const store = GlobalStore()
const lightBoxUi = ref(false)
export default defineComponent({
  name: 'App',
  components: {
    VueResizable,
    ViewText,
    ViewPdf,
    ViewImg
  },
  data () {
    return {
      viewerData: ApiStore().kernals,
      handlers: ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'],
      left: 50,
      top: 50,
      height: 200,
      width: 200,
      maxW: window.innerWidth,
      maxH: window.innerHeight,
      event: '',
      dragSelector: '.drag-container-1',
      store: GlobalStore(),
      sessionStore: SessionStore()
    }
  },
  methods: {
    deleteBlock(){
      ApiStore().deleteKernal(this.viewerData[store.lightBoxIndex].id)
      this.close()
    },
    esc (e: KeyboardEvent) {
      if(document.getElementsByClassName('tiptap')[0] != document.activeElement) {
        if (e.key === 'Escape') {
          this.close()
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
      store.setLightBoxView(false)
      store.setLightBoxIndex(-1)
      lightBoxUi.value = false
      window.removeEventListener('keyup', this.esc, true)
    },
    next () {
      if ((store.lightBoxIndex + 1) <= (this.viewerData.length -1)) {
        store.setLightBoxIndex(store.lightBoxIndex + 1)
      }
    },
    prev () {
      if ((store.lightBoxIndex - 1) >= 0) {
        store.setLightBoxIndex(store.lightBoxIndex - 1)
      }
      console.log(this.viewerData[store.lightBoxIndex])
    },
    eHandler () {
      this.maxW = window.innerWidth
      this.maxH = window.innerHeight
    },
    res () {
      window.addEventListener('resize', this.orientationChange)
      window.addEventListener('orientationchange', this.orientationChange)
      window.addEventListener('keyup', this.esc, true)
      const identifiers = ['rb', 'rt', 'rl', 'rr']
      for (const id of identifiers) {
        const rb = document.createElement('img')
        rb.src = id + '.png'
        rb.id = id
        document.getElementsByClassName('resizable-' + id.charAt(id.length - 1))[0].appendChild(rb)
      }
      this.orientationChange()
    },
    orientationChange () {
      const orientation = window.orientation
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        if (orientation === 0) {
          this.width = window.innerWidth
          this.height = window.innerHeight - 300
          this.left = 0
          this.top = 40
        } else if (orientation === 90 || orientation === -90) {
          this.width = window.innerWidth - 124
          this.height = window.innerHeight - 17
          this.left = 40
          this.top = 0
        }
      } else {
        this.width = window.innerWidth - 18
        this.height = window.innerHeight
        this.left = 5.55
        this.top = 0
      }
    },
  }
})
</script>
