<template>

  <div class='contentMain' id="contentMain" v-if='loaded' >

    <LightBox :viewerData="kernals" v-if='store.lightBoxView' />
    <splitpanes class="default-theme"
      style="width=100%"
      @ready="init()"
      @resize="paneSize = $event[0].size; paneSizeOffSet = 0"
      @resized="resizeContentFit()"
    >
      <pane v-on:dblclick="resize(100)" :size="paneSize + paneSizeOffSet">
        <ThreeMain :imageData="hypertexts"/>
        <splitpanes class="data_pane" :horizontal="true">

          <pane :size="40">
            <TableModule
              :contentData="hypertexts"
              :tableOrder="['time_posted', 'name', 'url']"
            />
          </pane>

          <pane :size="59">
            <splitpanes class="default-theme" :vertical="true">
              <pane :size="50">
                <TableModule
                  :contentData="sourceUrls"
                  :tableOrder="[ 'url']"
                />
              </pane>
              <pane :size="50">
                <TableModule
                  :contentData="sourceUrls"
                  :tableOrder="['urls']"
                />
              </pane>
            </splitpanes>
          </pane>

        </splitpanes>
        <input class='search' v-model="searchQ" placeholder="edit me" @keyup.enter="search" />
      </pane>

      <pane v-on:dblclick="resize(0)" :size="100 - (paneSize + paneSizeOffSet)">
        <ContentModule :contentData="kernals"/>
      </pane>
    </splitpanes>

  </div>
  <div v-else>
    loading
  </div>
 </template>

<script lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import LightBox from '@/component/lightBox/LightBox.vue'
import { ApiStore } from '../store/ApiStore'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { filterStore } from '@/store/FilterStore'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    TableModule,
    ContentModule,
    ThreeMain,
    LightBox
  },
  data () {
    return {
      scrollWidth: -1,
      paneSizeTemp: 0,
      paneSize: 40.0,
      paneSizeOffSet: 0,
      loaded: false,
      store: filterStore(),
      searchQ: '',
      apiData: []
    }
  },
  setup() {
    const { hypertexts, sourceUrls, kernals } = storeToRefs(ApiStore())
    return { hypertexts, sourceUrls, kernals }
  },
   mounted () {
    ApiStore().initialize().then(async () => {
      this.loaded = true
      window.addEventListener('resize', this.resizeContentFit)
      window.addEventListener('orientationchange', this.resizeContentFit)
    })
  },
  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
  },

  methods: {
    search: function () {
      this.store.setFilter(this.searchQ)
    },
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
        const width = document.getElementById('contentMain').offsetWidth - 10
        const extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 90
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
      this.scrollWidth = el.offsetWidth
      el.remove()
    },
    init: function () {
      this.findScrollWidth()
      this.resizeContentFit()
    }
  }
})
</script>
