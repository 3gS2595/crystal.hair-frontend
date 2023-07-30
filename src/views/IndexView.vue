<template>
  <Suspense>
    <template #default>
      <div class='contentMain' id="contentMain" v-if='loaded'>
        <splitpanes
         style="width=100%"
          @ready="init()"
          @resize="paneSize = $event[0].size; paneSizeOffSet = 0"
          @resized="resizeContentFit()"
          class="default-theme"
          >

          <pane v-on:dblclick="resize(100)" :size="paneSize + paneSizeOffSet">
            <ThreeMain :imageData="hypertexts"/>
            <splitpanes
            class="default-theme"
            :horizontal="true"
            >
              <pane :size="40">
                <TableModule
                  :contentData="hypertexts"
                  :tableOrder="['name', 'time_posted', 'url']"
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
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import { ApiStore } from '../store/ApiStore' // eslint-disable-line

const loaded = ref(false)
export default defineComponent({
  data: () => ({
    paneSizeTemp: 0,
    paneSize: 40.0,
    paneSizeOffSet: 0,
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
    init: function () {
      this.resizeContentFit()
      window.addEventListener('orientationchange', this.resizeContentFit)
      window.addEventListener('resize', this.resizeContentFit)
    },
    resize: function (max) {
      if (this.paneSize !== max) {
        this.paneSizeTemp = this.paneSize
        this.paneSize = max
        this.paneSizeOffSet = 0
      } else this.paneSize = this.paneSizeTemp
      this.resizeContentFit()
    },
    scrollWidth: function () {
      if (this.scroll === -1) {
        const el = document.createElement('div')
        el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
        document.body.appendChild(el)
        this.scroll = el.offsetWidth
        el.remove()
      }
      return this.scroll
    },
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
        const width = document.getElementById('contentMain').offsetWidth - 10
        const offset = ((((width * ((100.0 - this.paneSize) / 100.0)) - this.scroll) % 90) / width) * 100
        this.paneSizeOffSet = offset
      }
    }
  },
  mounted () {
    if (ApiStore().sourceUrls.length === 0) {
      this.scrollWidth()
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
