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

        <div class='drag-container-1'>
          <a
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='close'
            >close</a>
        </div>

        <vue-load-image>
          <template v-slot:image>
            <img :src='`${viewerData[store.lightBoxIndex].signed_url}`' @load="handleLoad"/>
          </template>
          <template v-slot:preloader>
              <img src="image-loader.gif" rel='preload'/>
          </template>
          <template v-slot:error>
           <a>{{ viewerData[store.lightBoxIndex].description }}</a>
          </template>
        </vue-load-image>

        <div class='drag-container-2'>
        <a v-if="store.lightBoxIndex != 0"
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='prev'
            >prev----</a>

          <a v-if="store.lightBoxIndex != viewerData.length - 1"
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='next'
            >----next</a>

        </div>

      </div>
    </vue-resizable>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent, PropType } from 'vue'
import { filterStore } from '@/store/FilterStore'
import VueResizable from 'vue-resizable'
import VueLoadImage from 'vue-load-image'
import type { kernalType } from '@/types/index'
const store = filterStore()
const lightBoxUi = ref(false)
export default defineComponent({
  name: 'App',
  components: {
    VueResizable,
    VueLoadImage
  },
  props: {
    viewerData: {
      type: Object as PropType<kernalType[]> ,
      required: true
    }
  },
  setup (props) {
    const viewerData  = ref(props.viewerData)
    console.log(store.lightBoxIndex)
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
      store: filterStore()
    }
  },
  methods: {
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

      const rb = document.createElement('img')
      rb.src = 'rb.png'
      rb.id = 'rb'
      document.getElementsByClassName('resizable-b')[0].appendChild(rb)

      const rt = document.createElement('img')
      rt.src = 'rt.png'
      rt.id = 'rt'
      document.getElementsByClassName('resizable-t')[0].appendChild(rt)

      const rl = document.createElement('img')
      rl.src = 'rl.png'
      rl.id = 'rl'
      document.getElementsByClassName('resizable-l')[0].appendChild(rl)

      const rr = document.createElement('img')
      rr.src = 'rr.png'
      rr.id = 'rr'
      document.getElementsByClassName('resizable-r')[0].appendChild(rr)

      this.orientationChange()
    },
    esc (e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.close()
      } else if (e.key === 'ArrowRight') {
        this.next()
      } else if (e.key === 'ArrowLeft') {
        this.prev()
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
