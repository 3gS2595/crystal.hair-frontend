<template>
  <div class='contentMain' id="contentMain" >
    <LightBox v-if='store.lightBoxView' :viewerData="kernals"/>
    <AddContentBox v-if='store.uploadBoxView'/>
    <AddMixtapeBox v-if='store.addMixtapeBoxView'/>

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >

      <!-- NAVIGATION -->
      <pane :size="paneSize + paneSizeOffSet">

        <nav id='nav'>
          <div class='filters'>
            <a class='navItem' @click="logout">🔒&#xFE0E;</a>
            <input class='search' v-model="q" placeholder="search" @keyup.enter="search(q)" />
          </div>
        </nav>

        <div class="three" >
          <div v-if='dataReturned'>
            <ThreeMain :imageData="hypertexts"/>
          </div>
        </div>

        <div class="mixtape-pane">
          <div>
            <a class="tab-header" @click='tab = 1' :class="{'tab-active': tab === 1}">mixtapes</a>
            <a class="tab-header" @click='tab = 2' :class="{'tab-active': tab === 2}">webscrapes</a>
            <a class="tab-header" @click='toggleAddMixtapeBox()'>+</a>
          </div>
          <div class="tab-content" v-if='tab === 1'>
            <MixtapeModule
              :contentData="mixtapes"
              :id="0"
            />
          </div>
          <div class="tab-content" v-if='tab === 2'>
            <WebscrapeModule
              :contentData="hypertexts"
              :id="0"
            />
          </div>
        </div>

        <div  class="forceGraph" >
          <ForceGraph :propKernals="forceGraph" :propMixtapes="mixtapes"/>
        </div>
      </pane>

      <!-- CONTENT -->
      <pane v-on:dblclick="resize(0)" :size="100 - (paneSize + paneSizeOffSet)">
        <div id="content-tabs">
          <div id="slide">
            <vue-slider v-model="store.cgbWidth"  min="0" :max="maxSliderWidth" :tooltip="'none'" @change="cgbSlide(0)" ></vue-slider>
          </div>
          <div id="tabAdd" @click="toggleUploadBox()" class= "tab">
            <a>+</a>
          </div>
        </div>
        <ContentModule
          :contentData="kernals"
          :id="1"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { storeToRefs } from 'pinia'
import { darkToggle, darkSet } from '@/ts/DarkMode'
import VueSlider from 'vue-slider-component'

import DropDown from '@/components/menuDropDown/DropDown.vue'
import ForceGraph from '@/components/three/ForceGraph.vue'
import ThreeMain from '@/components/three/ThreeMain.vue'
import ContentModule from '@/components/dataGrid/ContentModule.vue'
import MixtapeModule from '@/components/dataGrid/MixtapeModule.vue'
import WebscrapeModule from '@/components/dataGrid/WebscrapeModule.vue'
import LightBox from '@/components/lightBox/viewer/LightBox.vue'
import AddContentBox from '@/components/lightBox/uploader/AddContent.vue'
import AddMixtapeBox from '@/components/lightBox/uploader/AddMixtape.vue'

import { ApiStore } from '@/store/ApiStore'
import { GlobalStore } from '@/store/GlobalStore'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    ContentModule,
    MixtapeModule,
    ForceGraph,
    LightBox,
    AddContentBox,
    AddMixtapeBox,
    DropDown,
    ThreeMain,
    WebscrapeModule,
    VueSlider
  },
  data () {
    return {
      dataReturned: false,
      paneSizeTemp: 0,
      paneSize: 30.0,
      paneSizeOffSet: 0.0,
      store: GlobalStore(),
      maxSliderWidth: GlobalStore().cgbWidth * 2,
      q: '',
      tab: 1
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
      // window.open('http://3.130.240.169', '_blank', 'toolbar=0,location=0,menubar=0')
    },
   cgbSlide(e: any) {
      setTimeout (() => {
        this.resizeContentFit()
      }, 50)
    },
    toggleUploadBox() {
      const store = GlobalStore()
      store.setUploadBoxView(!store.uploadBoxView)
    },
    toggleAddMixtapeBox() {
      const store = GlobalStore()
      store.setAddMixtapeBoxView(!store.addMixtapeBoxView)
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
      const el = document.getElementById('app')
      const cgb_width = store.cgbWidth
      const cgb = document.querySelector('.cgb-0')
      let cgb_margin = 4
      let scroll_width = 8
      if (cgb != null) {
        const width  = window.getComputedStyle(cgb).marginLeft
        cgb_margin = Number(width.substring(0, width.length - 2))
        scroll_width = cgb_margin * 2
      }
      if ( el != null) {
        if (this.paneSize === 30 ){
            const max_cont_width = el.offsetWidth - 200 - scroll_width - (cgb_margin)
            const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 14
            const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
            const content_width_percent = (max_cont_width) / el.offsetWidth
            const offset_size = ((-1 * (content_width_percent - 1)) - .3) * 100
            this.paneSizeOffSet =(offset_size)
            store.setCgbWidthSized(store.cgbWidth + (extra_width / Math.trunc(tt)))
        }
        if (this.paneSize === 0 ){
            const max_cont_width = el.offsetWidth - scroll_width - (cgb_margin)
            const extra_width = max_cont_width % (cgb_width + (cgb_margin))
            const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
            store.setCgbWidthSized(store.cgbWidth + (extra_width / Math.trunc(tt)))
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
