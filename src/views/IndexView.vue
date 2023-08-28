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
              :contentData="hypertexts"
              :id="0"
           />
          </pane>

          <pane :size="30">
            <splitpanes class="default-theme" :vertical="true">
              <pane :size="50">
                <DataModule
                  :contentData="mixtapes"
                  :id="1" 
                />
              </pane>
              <pane :size="50">
                <DataModule
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
import { defineComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { storeToRefs } from 'pinia'

import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import DataModule from '@/component/content/DataModule.vue'
import LightBox from '@/component/lightBox/LightBox.vue'

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
      paneSize: 40,
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
      const el = document.getElementById('contentMain')
      if (this.paneSize !== 0 && this.paneSize !== 100 && el != null) {
        const width = el.offsetWidth - 13
        let extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 93
        console.log(this.scrollWidth)
        if (this.paneSize === 40 && window.innerWidth < 400 && (window.innerHeight > window.innerWidth)){
          extra = extra + 93
        }
        const offset = (extra / width) * 100
        this.paneSizeOffSet = offset
      }
    },
    resize: function (size) {
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
