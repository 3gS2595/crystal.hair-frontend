<template>
  <div class='contentMain' id="contentMain" v-if='dataFetched' >

    <LightBox :viewerData="kernals" v-if='store.lightBoxView' />
    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
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
                  :tableOrder="['domain']"
                />
              </pane>
              <pane :size="50">
                <TableModule
                  :contentData="sourceUrls"
                  :tableOrder="['domain']"
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
import { defineComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { storeToRefs } from 'pinia'

import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import LightBox from '@/component/lightBox/LightBox.vue'

import { ApiStore } from '../store/ApiStore'
import { filterStore } from '@/store/FilterStore'

export default defineComponent({
  setup () {
    const { hypertexts, sourceUrls, kernals, linkContents } = storeToRefs(ApiStore())
    return { hypertexts, sourceUrls, kernals, linkContents }
  },
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
      dataFetched: false,
      scrollWidth: -1,
      paneSizeTemp: 0,
      paneSize: 40,
      paneSizeOffSet: 0,
      store: filterStore(),
      searchQ: ''
    }
  },
  mounted () {
    this.findScrollWidth()
    ApiStore().initialize().then(async () => {
      this.dataFetched = true
      window.addEventListener('orientationchange', this.resizeContentFit)
      window.addEventListener('resize', this.resizeContentFit)
    })
  },
  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
  },
  methods: {
    resizeContentFit: function () {
      const el = document.getElementById('contentMain')
      if (this.paneSize !== 0 && this.paneSize !== 100 && el != null) {
        const width = el.offsetWidth - 10
        let extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 90
        if (this.paneSize === 40 && window.innerWidth < 400 && (window.innerHeight > window.innerWidth)){
          extra = extra + 90
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
      this.scrollWidth = el.offsetWidth
      el.remove()
    },
    search: function () {
      this.store.setFilter(this.searchQ)
    }
  }
})
</script>
