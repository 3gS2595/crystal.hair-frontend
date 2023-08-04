<template>
  <div class ='lightbox'>
    <vue-resizable
      class='resizable'
      ref='resizableComponent'
      :dragSelector='dragSelector'
      :active='handlers'
      :fit-parent='fit'
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
          drag_1
          <a
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='close'
            >close</a>
        </div>

        <vue-load-image>
          <template v-slot:image>
            <img :src='`https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/${props.viewerData[store.lightBoxIndex].file_path}`'/>
          </template>
          <template v-slot:preloader>
              <img src='http://3.130.240.169/image-loader.gif' rel='preload'/>
          </template>
          <template v-slot:error>
            Image load fails
          </template>
        </vue-load-image>

        <div class='drag-container-2'>drag_2</div>

      </div>
    </vue-resizable>
  </div>
</template>

<script setup>
import VueResizable from 'vue-resizable'
import VueLoadImage from 'vue-load-image'
const props = defineProps({
  viewerData: {
    type: Array,
    default: () => [],
    required: true
  }
})
</script>

<script>
import { ref } from 'vue'
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
const lightBoxUi = ref(false)

export default {
  name: 'App',
  components: {
    VueResizable
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
      fit: true,
      event: '',
      dragSelector: '.drag-container-1, .drag-container-2',
      index: 9
    }
  },
  methods: {
    eHandler () {
      this.maxW = window.innerWidth
      this.maxH = window.innerHeight
    },
    orientationChange () {
      const orientation = window.orientation
      if (orientation === 0) {
        this.width = window.innerWidth
        this.height = window.innerHeight - 180
        this.left = 0
        this.top = 50
      } else if (orientation === 90 || orientation === -90) {
        this.width = window.innerWidth - 160
        this.height = window.innerHeight - 17
        this.left = 50
        this.top = 0
      } else {
        this.width = window.innerWidth - 103
        this.height = window.innerHeight - 180
        this.left = 50
        this.top = 50
      }
    },
    res (data) {
      window.addEventListener('resize', this.orientationChange)
      window.addEventListener('orientationchange', this.orientationChange)
      document.addEventListener('keyup', this.esc, true)

      const rb = document.createElement('img')
      rb.src = 'http://3.130.240.169/rb.png'
      rb.id = 'rb'
      document.getElementsByClassName('resizable-b')[0].appendChild(rb)

      const rt = document.createElement('img')
      rt.src = 'http://3.130.240.169/rt.png'
      rt.id = 'rt'
      document.getElementsByClassName('resizable-t')[0].appendChild(rt)

      const rl = document.createElement('img')
      rl.src = 'http://3.130.240.169/rl.png'
      rl.id = 'rl'
      document.getElementsByClassName('resizable-l')[0].appendChild(rl)

      const rr = document.createElement('img')
      rr.src = 'http://3.130.240.169/rr.png'
      rr.id = 'rr'
      document.getElementsByClassName('resizable-r')[0].appendChild(rr)

      this.eHandler(data)
      this.orientationChange()
    },
    esc (e) {
      if (e.key === 'Escape') {
        this.close()
      }
    },
    close () {
      store.setLightBoxView(false)
      store.setLightBoxIndex(-1)
      lightBoxUi.value = false
      window.removeEventListener('keypress', this.resizeContentFit, true)
    }
  }
}

</script>
