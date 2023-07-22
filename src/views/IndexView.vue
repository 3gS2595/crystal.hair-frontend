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

      <pane v-on:dblclick="resizeContent(100)" :size="paneSize + paneSizeOffSet">
        <ThreeMain :imageData="hypertexts"/>

          <splitpanes :horizontal="true">
              <pane :size="70">
                <TableModule
                  id="0"
                  :contentData="hypertexts"
                  :tableOrder="['name', 'time_posted', 'url']"
                />
              </pane>

              <pane :size="30">
                <splitpanes class="default-theme" :vertical="true">
                  <pane :size="50">
                    <TableModule
                      id="2"
                      :contentData="sourceUrls"
                      :tableOrder="[ 'count', 'name', 'urls']"
                    />
                  </pane>
                  <pane :size="50">
                    <TableModule
                      id="2"
                      :contentData="sourceUrls"
                      :tableOrder="[ 'count', 'name', 'urls']"
                    />
                  </pane>
                </splitpanes>
              </pane>
          </splitpanes>
        </pane>

        <pane v-on:dblclick="resizeContent(0)" :size="(100 - (paneSize + paneSizeOffSet))">
          <ContentModule :contentData="kernals"/>
        </pane>
      </splitpanes>

    </div>
    <div v-else><a>loading</a></div>
  </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'

import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import 'splitpanes/dist/splitpanes.css'
const loaded = ref(false)

export default defineComponent({
  data: () => ({
    paneStateData: 0,
    paneStateContent: 0,
    paneSize: 50,
    paneSizeOffSet: 0,
    paneSizeOffSetTemp: 0
  }),
  components: {
    TableModule,
    ContentModule,
    ThreeMain,
    Splitpanes,
    Pane
  },
  beforeMount () {
    this.resizeContentFit()
  },
  mounted () {
    if (ApiStore().sourceUrls.length === 0) {
      window.addEventListener('resize', this.resizeContentFit)
      const userToken = ApiStore().initialize()
      userToken.then(function (data) {
        console.log(data)
        loaded.value = true
      })
    }
  },
  unmounted () {
    window.removeEventListener('resize', this.resizeContentFit)
  },
  methods: {
    resizeContent: function (max) {
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
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
        const extra = (window.innerWidth * ((100 - this.paneSize) / 100) - 20) % 90
        if (screen.width <= 760 && this.paneSize < 70) {
          this.paneSize = this.paneSize + ((extra / window.innerWidth) * 100) - 1
        } else if (screen.width >= 760 && this.paneSize < 81) {
          this.paneSizeOffSet = ((extra / window.innerWidth) * 100)
        }
      }
    }
  }
})

</script >
<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const { hypertexts, kernals, sourceUrls } = storeToRefs(ApiStore())
</script>
