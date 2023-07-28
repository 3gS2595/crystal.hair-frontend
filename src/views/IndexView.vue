<template>
  <Suspense>

    <template #default>
      <div id="contentMain" v-if='loaded'>
        <splitpanes
          @resize="paneSize = $event[0].size"
          @resized="resizeContentFit()"
          style="height: calc(100vh - 18px); width:100vw;"
          class="default-theme"
          >
          <pane v-on:dblclick="resize(100)" :size="paneSize + paneSizeOffSet">
            <ThreeMain :imageData="hypertexts"/>

          <span>{{testing0}}</span>
          <span>{{testing1}}</span>
          <span>{{testing2}}</span>
          <span>{{testing3}}</span>
            <splitpanes :horizontal="true">
              <pane :size="70">
                <TableModule
                  :contentData="hypertexts"
                  :tableOrder="['name', 'time_posted', 'url']"
                />
              </pane>
              <pane :size="30">
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
                      :tableOrder="[ 'count', 'name', 'urls']"
                    />
                  </pane>
                </splitpanes>
              </pane>
            </splitpanes>
          </pane>

          <pane v-on:dblclick="resize(0)" :size="(100 - (paneSize + paneSizeOffSet))">
            <ContentModule :contentData="kernals"/>
          </pane>

        </splitpanes>
      </div>

      <div v-else>
        <a>loading</a>
      </div>
    </template>

    <template #fallback>
      <span>Loading</span>
    </template>

  </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
const testing0 = getComputedStyle(document.documentElement).getPropertyValue("--sat")
const testing1 = getComputedStyle(document.documentElement).getPropertyValue("--sar")
const testing2 = getComputedStyle(document.documentElement).getPropertyValue("--sab")
const testing3 = getComputedStyle(document.documentElement).getPropertyValue("--sal")
const loaded = ref(false)
export default defineComponent({
  data: () => ({
    paneStateContent: 0,
    paneSize: 50,
    paneSizeOffSet: 0,
    paneSizeOffSetTemp: 0,
    scroll: -1
  }),
  components: {
    TableModule,
    ContentModule,
    ThreeMain,
    Splitpanes,
    Pane
  },
  methods: {
    resize: function (max) {
      if (this.paneSize !== max) {
        this.paneSizeOffSetTemp = this.paneSizeOffSet
        this.paneStateContent = this.paneSize
        this.paneSize = max
        this.paneSizeOffSet = 0
      } else {
        this.paneSizeOffSet = this.paneSizeOffSetTemp
        this.paneSize = this.paneStateContent
      }
      this.resizeContentFit()
    },
    scrollWidth: function () {
      if (this.scroll === -1) {
        const el = document.createElement('div')
        el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
        document.body.appendChild(el)
        const width = el.offsetWidth - el.clientWidth + 8
        el.remove()
        this.scroll = width
      }
      return this.scroll
    },
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
        if (screen.width <= 760) {
          const extra = (window.innerWidth * ((100 - this.paneSize) / 100) - this.scrollWidth()) % 90
          const offset = (extra / window.innerWidth) * 100
          this.paneSizeOffSet = offset
        } else if (screen.width >= 760) {
          const extra = (window.innerWidth * ((100 - this.paneSize) / 100) - this.scrollWidth()) % 90
          const offset = (extra / window.innerWidth) * 100
          console.log(this.paneSizeOffSet)
          this.paneSizeOffSet = offset
        }
      }
    }
  },
  beforeMount () {
    this.resizeContentFit()
  },
  mounted () {
    if (ApiStore().sourceUrls.length === 0) {
      window.addEventListener('resize', this.resizeContentFit)
      window.addEventListener('orientationchange', this.resizeContentFit)
      const userToken = ApiStore().initialize()
      userToken.then(function (data) {
        console.log(data)
        loaded.value = true
      })
    }
  },
  unmounted () {
    window.removeEventListener('resize', this.resizeContentFit)
    window.removeEventListener('orientationchange', this.resizeContentFit)
  }
})
</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const { hypertexts, kernals } = storeToRefs(ApiStore())
</script>
