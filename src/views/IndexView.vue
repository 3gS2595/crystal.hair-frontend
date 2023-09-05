<template>
  <div class='contentMain' id="contentMain" >
    <LightBox :viewerData="kernals" v-if='store.lightBoxView' />

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; paneSizeOffSet = 0"
      @resized="resizeContentFit()"
    >
      <pane v-on:dblclick="resize(100)" :size="paneSize + paneSizeOffSet">
        <div  class="three" >
          <div v-if='dataReturned'>
            <ThreeMain :imageData="hypertexts"/>
          </div>
        </div>

        <splitpanes class="data_pane" :horizontal="true">
          <pane :size="70">
            <DataModule
              header = "mixtape" 
              :contentData="mixtapes"
              :id="0"
           />
          </pane>

          <pane :size="30">
            <splitpanes class="default-theme" :vertical="true">
              <pane :size="50">
                <DataModule
                  header = "hypertext" 
                  :contentData="hypertexts"
                  :id="1" 
                />
              </pane>
              <pane :size="50">
                <DataModule
                  header = "sourceUrl" 
                  :contentData="sourceUrls"
                  :id="2"
                />
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>
      </pane>

      <pane v-on:dblclick="resize(0)" :size="100 - (paneSize + paneSizeOffSet)">
        <ContentModule
          :contentData="kernals"
          :id="3"
        />
      </pane>
    </splitpanes>
  </div>
 </template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { storeToRefs } from 'pinia'

const ThreeMain = defineAsyncComponent(() =>
  import('@/component/three/ThreeMain.vue')
)
const ContentModule = defineAsyncComponent(() =>
  import('@/component/content/ContentModule.vue')
)
const DataModule = defineAsyncComponent(() =>
  import('@/component/content/DataModule.vue')
)
const LightBox = defineAsyncComponent(() =>
  import('@/component/lightBox/LightBox.vue')
)

import { ApiStore } from '../store/ApiStore'
import { filterStore } from '@/store/FilterStore'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    ContentModule,
    DataModule,
    ThreeMain,
    LightBox
  },
  data () {
    return {
      dataReturned: false,
      scrollWidth: this.findScrollWidth(),
      paneSizeTemp: 0,
      paneSize: 30,
      paneSizeOffSet: 0,
      store: filterStore(),
    }
  },
  setup () {
    const { hypertexts, sourceUrls, kernals, linkContents, mixtapes } = storeToRefs(ApiStore())
    return { hypertexts, sourceUrls, kernals, linkContents, mixtapes }
  },
  mounted () {
    window.addEventListener('orientationchange', this.resizeContentFit)
    window.addEventListener('resize', this.resizeContentFit)
    ApiStore().initialize().then(async () => {
      this.dataReturned = true
    })
    setTimeout(() => {
      var style = document.createElement('style')
      style.innerText = '*{animation-duration:0s; }'
      document.head.appendChild(style)
      }, 1500);
  },
  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
  },
  methods: {
    resizeContentFit: function () {

      //site width
      const el = document.getElementById('contentMain')

      if (this.paneSize !== 0 && this.paneSize !== 100 && el != null) {
        const width = el.offsetWidth - 5
        let extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 93
        if (this.paneSize === 30){
          if (window.innerWidth < 400 && (window.innerHeight > window.innerWidth)){
            extra = extra + 93
          } else {
            const target = width - 240
            const psize = (width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth
            extra = (-1 * (target - psize)) + ((target - psize) % 93) + (psize % 93) 
          }
        }
        const offset = (extra / width) * 100
        this.paneSizeOffSet = offset
      }
    },
    resize: function (size: number) {
      if (this.paneSize !== size) {
        this.paneSizeTemp = this.paneSize
        this.paneSize = size
        this.paneSizeOffSet = 0
      } else {
        this.paneSize = this.paneSizeTemp
      }
      this.resizeContentFit()
    },
    findScrollWidth: function () {
      const el = document.createElement('div')
      el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
      document.body.appendChild(el)
      const width = el.offsetWidth + 2
      el.remove()
      return width
    }

  }
})
</script>
