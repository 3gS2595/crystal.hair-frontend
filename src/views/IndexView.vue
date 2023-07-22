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

      <pane v-on:dblclick="resizeData()" :size="paneSize">
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

        <pane v-on:dblclick="resizeContent()" :size="100 - paneSize">
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
const contentWidth = ref()
const loaded = ref(false)

export default defineComponent({
  data: () => ({
    paneStateData: 0,
    paneStateContent: 0,
    paneSize: 50
  }),
  components: {
    TableModule,
    ContentModule,
    ThreeMain,
    Splitpanes,
    Pane
  },
  beforeMount () {
    this.resizeContentFit('null')
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
  setup () {
    const state = reactive({
      paneSize: 50
    })
    return {
      ...toRefs(state)
    }
  },
  methods: {
    resizeContent: function (event) {
      if (this.paneSize !== 0) {
        this.paneStateContent = this.paneSize
        this.paneSize = 0
      } else {
        this.paneSize = this.paneStateContent
      }
    },
    resizeData: function (event) {
      if (this.paneSize !== 100) {
        this.paneStateData = this.paneSize
        this.paneSize = 100
      } else {
        this.paneSize = this.paneStateData
      }
    },
    resizeContentFit: function (event) {
      const extra = (window.innerWidth * ((100 - this.paneSize) / 100) - 20) % 90
      if (screen.width <= 760 && this.paneSize < 70) {
        this.paneSize = this.paneSize + ((extra / window.innerWidth) * 100) - 1
      } else if (screen.width >= 760 && this.paneSize < 81) {
        this.paneSize = this.paneSize + ((extra / window.innerWidth) * 100) - 1
      }
    }
  }
})

</script >
<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const { hypertexts, kernals, linkContents, sourceUrls } = storeToRefs(ApiStore())
</script>
