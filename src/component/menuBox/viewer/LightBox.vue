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
        <ViewImg 
          v-if="viewerData[store.lightBoxIndex].file_type != '.pdf' && viewerData[store.lightBoxIndex].file_type != '.txt'"
          :url="viewerData[store.lightBoxIndex].signed_url"  
        />
        <ViewPdf 
          v-if="viewerData[store.lightBoxIndex].file_type == '.pdf'"
          :url="viewerData[store.lightBoxIndex].signed_url"  
        />
        <ViewText 
          v-if="viewerData[store.lightBoxIndex].file_type == '.txt'"
          v-model="viewerData[store.lightBoxIndex].description" 
        />
        <div class='drag-container-2'>
          <a 
            v-if="store.lightBoxIndex != 0"
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='prev'
            >prev----</a>
          <a
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='close'
            >exit</a>
          <a
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='deleteBlock'
            >delete</a>
          <a 
            v-if="store.lightBoxIndex != viewerData.length - 1"
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='next'
            >----next</a>
        </div>
      </div>
    </vue-resizable>
  </div>
</template>

<script lang='ts'>
import type { kernalType } from '@/types/index'

import { ref, defineComponent, PropType } from 'vue'
import VueResizable from 'vue-resizable'

import ViewText from './viewers/TextEditor.vue'
import ViewPdf from './viewers/ViewPdf.vue'
import ViewImg from './viewers/ViewImg.vue'
import sessionManager from '@/store/modules/session_manager'
import axios, { AxiosInstance, CancelTokenStatic } from 'axios'
import { GlobalStore } from '@/store/GlobalStore'

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
  props: {
    viewerData: {
      type: Object as PropType<kernalType[]> ,
      required: true
    }
  },
  setup (props) {
    const viewerData  = ref(props.viewerData)
       return { viewerData }
  },

  data () {
    const tW = 200
    const tH = 200
    return {
      handlers: ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'],
      left: 50,
      top: 50,
      height: tH,
      width: tW,
      maxW: window.innerWidth,
      maxH: window.innerHeight,
      event: '',
      dragSelector: '.drag-container-1, .drag-container-2',
      index: 9,
      store: GlobalStore(),
      config: {
        toolbar: false
      },
    }
  },
  methods: {
    deleteBlock(){
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
      }
      axios.delete( store.urlRails + 'kernals/' + this.viewerData[store.lightBoxIndex].id, config)
      .then(function(){
        console.log('SUCCESS!!')
      })
      .catch(function(){
        console.log('FAILURE!!')
      })
    },
    handleLoad(){
      const imgP: HTMLImageElement = new Image()
      if (store.lightBoxIndex - 1 >= 0) {
        imgP.src = this.viewerData[store.lightBoxIndex - 1].signed_url
      }
      const imgN: HTMLImageElement = new Image()
      if (store.lightBoxIndex +1 <= this.viewerData.length -1) {
        imgN.src = this.viewerData[store.lightBoxIndex + 1].signed_url
      }
    },
    eHandler () {
      this.maxW = window.innerWidth
      this.maxH = window.innerHeight
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
          this.width = window.innerWidth - 63
          this.height = window.innerHeight - 180
          this.left = 30
          this.top = 30
        
      }
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
    }
  }
})
</script>
