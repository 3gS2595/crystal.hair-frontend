<template>

  <div class='contentMain' id="contentMain" v-if='loaded'>

    <LightBox :viewerData="kernals"/> 
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
    <a>loading</a>
  </div>
</template>

<script setup lang="ts" >
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
import { onMounted, ref } from 'vue'
import { filterStore } from '@/store/FilterStore'
const loaded = ref(false)
onMounted(() => {
  ApiStore().initialize().then(function () {
    loaded.value = true
  })
})
</script>

<script lang="ts">
import { ref } from 'vue'
import { defineComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import LightBox from '@/component/lightBox/LightBox.vue'

const element = ref({
  x: 20,
  y: 20,
  width: 200,
  height: 200,
  isActive: false,
})
const { hypertexts, sourceUrls, kernals } = storeToRefs(ApiStore())
const searchQ = ref('')
const store = filterStore()
export default defineComponent({
  components: {
    Splitpanes,
    Pane,    
    TableModule,
    ContentModule,    
    ThreeMain,
    LightBox
  },
  data: () => ({
    scrollWidth: -1,
    paneSizeTemp: 0,
    paneSize: 40.0,
    paneSizeOffSet: 0
  }),

  methods: {
    search: function() {
      store.setFilter(searchQ.value)
  },
    resizeContentFit: function () {
      if (this.paneSize !== 0 && this.paneSize !== 100) {
          const width = document.getElementById('contentMain').offsetWidth - 10
          const extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % 90
          const offset = ( extra / width) * 100
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

  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
  }
})
</script>
