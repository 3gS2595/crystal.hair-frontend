<template>
  <div class='contentMain' id="contentMain" >
    <LightBox v-if='store.lightBoxView' :viewerData="kernals"/>
    <UploadBox v-if='store.uploadBoxView'/>

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >
      <pane :size="paneSize + paneSizeOffSet">

        <div class='nav'>
          <nav id='nav'>
            <div class='toggles'>
              <a class='navItem' @click="logout">&#9736;</a>
              <a class='navItem' @click="darkToggle">Ͼ</a>
              <a class='navItem' @click="reset">X</a>
              <a class='navItem' @click="cgbMinus">-</a>
              <a class='navItem' @click="cgbPlus">+</a>
            </div>
            <div class='filters'>
              <DropDown/>
              <input class='search' v-model="q" placeholder="search" @keyup.enter="search(q)" />
            </div>
          </nav>
        </div>
        <div class="three" >
          <div v-if='dataReturned'>
            <ThreeMain :imageData="hypertexts"/>
          </div>
        </div>

        <splitpanes class="data_pane" :horizontal="true">
          <pane :size="60" class="mixtape-pane">
            <TabView>
              <TabPanel header="mixtapes">
                <MixtapeModule
                  :contentData="mixtapes"
                  :id="0"
                />
              </TabPanel>
              <TabPanel header="webscrapes">
                <WebscrapeModule
                  :contentData="hypertexts"
                  :id="1"
                />
              </TabPanel>
            </TabView>
          </pane>
        </splitpanes>

        <div  class="forceGraph" >
          <ForceGraph :propKernals="forceGraph" :propMixtapes="mixtapes"/>
        </div>
      </pane>
      <pane v-on:dblclick="resize(0)" :size="100 - (paneSize + paneSizeOffSet)">
        <ContentModule
          :contentData="kernals"
          :id="2"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { storeToRefs } from 'pinia'
import { darkToggle, darkSet } from '@/lib/DarkMode'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import DropDown from '@/component/menuDropDown/DropDown.vue'
import ForceGraph from '@/component/three/ForceGraph.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/dataGrid/ContentModule.vue'
import DataModule from '@/component/dataGrid/DataModule.vue'
import MixtapeModule from '@/component/dataGrid/MixtapeModule.vue'
import WebscrapeModule from '@/component/dataGrid/WebscrapeModule.vue'
import LightBox from '@/component/lightBox/viewer/LightBox.vue'
import UploadBox from '@/component/lightBox/uploader/UploadBox.vue'

import { ApiStore } from '@/store/ApiStore'
import { GlobalStore } from '@/store/GlobalStore'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    ContentModule,
    DataModule,
    MixtapeModule,
    ForceGraph,
    LightBox,
    UploadBox,
    DropDown,
    ThreeMain,
    TabView,
    TabPanel,
    WebscrapeModule
  },
  data () {
    return {
      dataReturned: false,
      paneSizeTemp: 0,
      paneSize: 30.0,
      paneSizeOffSet: 0.0,
      store: GlobalStore(),
      q: ''
    }
  },
  setup () {
    const { hypertexts, sourceUrls, kernals, linkContents, mixtapes, forceGraph } = storeToRefs(ApiStore())
    return { hypertexts, sourceUrls, kernals, linkContents, mixtapes, forceGraph }
  },
  mounted () {
    window.addEventListener('visibilitychange', this.resizeContentFit)
    window.addEventListener('orientationchange', this.resizeContentFit)
    window.addEventListener('resize', this.resizeContentFit)
    const store = GlobalStore()
    store.setCgbWidth(store.cgbWidth)
    this.resizeContentFit()
    ApiStore().initialize().then(async () => {
      this.dataReturned = true
    })

    //load animation removal
    setTimeout (() => {
      var style = document.createElement('style')
      style.innerText = '*{animation-duration:0s; }'
      document.head.appendChild(style)
    }, 1500)
  },
  unmounted () {
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
    window.removeEventListener('visibilitychange', this.resizeContentFit)
  },
  methods: {
    darkToggle,
    darkSet,
    logout () {
      localStorage.removeItem('auth_token')
      location.reload()
    },
    cgbPlus () {
      const store = GlobalStore()
      store.setCgbWidth(store.cgbWidth + 25)
      this.resizeContentFit()
    },
    cgbMinus () {
      const store = GlobalStore()
      store.setCgbWidth(store.cgbWidth - 25)
      this.resizeContentFit()
    },
    search: function (e: string) {
      const store = GlobalStore()
      store.setFilter(e)
    },
    reset: function () {
      const store = GlobalStore()
      store.setFilter('')
      store.setMixtape('')
    },
    resizeContentFit: function () {
      //site width
      const store = GlobalStore()
      const el = document.getElementById('contentMain')
      const cgb_width = store.cgbWidth
      const cgb = document.querySelector('.cgb-0')
      let cgb_margin = 6
      let scroll_width = 6
      if (cgb != null) {
        const width  = window.getComputedStyle(cgb).marginLeft
        cgb_margin = Number(width.substring(0, width.length - 2))
        scroll_width = cgb_margin * 2
      }

      if (this.paneSize !== 100 && this.paneSize !== 0 && el != null) {
        const width = el.offsetWidth
        let extra = ((width * ((100.0 - this.paneSize) / 100.0)) - scroll_width) % (cgb_width + cgb_margin)

        if (this.paneSize === 30){
          if (window.innerWidth < 400 && (window.innerHeight > window.innerWidth)){
            extra = extra + cgb_width + cgb_margin
          } else {
            const max_cont_width = el.offsetWidth - 200 - scroll_width - (cgb_margin)
            const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 14
            const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
            console.log(Math.trunc(tt))
            const content_width_percent = (max_cont_width) / el.offsetWidth
            const offset_size = ((-1 * (content_width_percent - 1)) - .3) * 100
            this.paneSizeOffSet =(offset_size)
            store.setCgbWidthSized(store.cgbWidth + (extra_width / Math.trunc(tt)))
          }
        } else {
          const offset = (extra / width) * 100
          this.paneSizeOffSet = offset
        }
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
    }
  }
})
</script>
