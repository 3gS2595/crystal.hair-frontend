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

<!-- _____________________________________________________NAVIGATION_PANE_ -->
          <pane v-on:dblclick="resize(100)" :size="paneSize + paneSizeOffSet">

            <!-- THREE.JS HEADER-->
            <ThreeMain :imageData="hypertexts"/>
            <splitpanes
            class="default-theme"
            :horizontal="true"
            >

              <!--MAIN_TABLE--> 
              <pane :size="40">
                <TableModule
                  :contentData="hypertexts"
                  :tableOrder="['name', 'time_posted', 'url']"
                />
              </pane>

              <!--SPLIT_PANE_SUB_TABLES-->
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
<!-- ______________________________________________________________________ -->

<!-- _________________________________________________________CONTENT_PANE_ -->
          <pane v-on:dblclick="resize(0)" :size="(100 - (paneSize + paneSizeOffSet))">
            <ContentModule :contentData="kernals"/>
          </pane>
<!-- _______________________________________________________________________-->

        </splitpanes>
      </div>
      <div v-else>
        <a>loading</a>
      </div>
    </template>

    <template #fallback>
      <span>loading</span>
    </template>

  </Suspense>
</template>

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
import { defineComponent, ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
</script>
<script lang="ts">

const { hypertexts, kernals } = storeToRefs(ApiStore())
const loaded = ref(false)
export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    TableModule,
    ContentModule,
    ThreeMain
  },
  data: () => ({
    scrollWidth: -1,
    paneSizeTemp: 0,
    paneSize: 40.0,
    paneSizeOffSet: 0
  }),

  methods: {
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
        const width = document.getElementById('contentMain').offsetWidth - 10
        const offset = ((((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 90) / width) * 100
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
      window.addEventListener('orientationchange', this.resizeContentFit)
      window.addEventListener('resize', this.resizeContentFit)
    }
  },

  mounted () {
    ApiStore().initialize().then(function () {
      loaded.value = true
    })
  },
  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit)
    window.removeEventListener('resize', this.resizeContentFit)
  }
})

</script >
