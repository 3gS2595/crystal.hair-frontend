<template>
  <div class='contentMain' id="contentMain" >
    <LightBox v-if='store.lightBoxView' :viewerData="kernals"/>
    <UploadBox v-if='store.uploadBoxView'/>

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; paneSizeOffSet = 0"
      @resized="resizeContentFit()"
    >
      <pane :size="paneSize + paneSizeOffSet">
        <div  class="three" >
          <ForceGraph :propKernals="kernals"/>
        </div>
        <div class='nav'>
          <nav id='nav'>
            <div class='toggles'>
              <a class='navItem' @click="logout">&#9736;</a>
              <a class='navItem' @click="darkToggle">☪</a>
              <a class='navItem' @click="cgbMinus">-</a>
              <a class='navItem' @click="cgbPlus">+</a>
            </div>
            <div class='filters'>
              <DropDown/>
              <a class='navItem' @click="reset">X</a>
              <input class='search' v-model="q" placeholder="search" @keyup.enter="search(q)" />
            </div>
          </nav>
        </div>

        <splitpanes class="data_pane" :horizontal="true">
          <pane :size="60">
            <MixtapeModule
              header = "mixtapes"
              :contentData="mixtapes"
              :id="0"
            />
          </pane>
          <pane :size="40">
            <splitpanes class="default-theme" :vertical="true">
              <pane :size="50">
                <DataModule
                  header = "hypertext"
                  :contentData="hypertexts"
                  :id="1" 
                />
              </pane>
              <pane :size="50">
                <DataModule
                  header = "sourceUrl"
                  :contentData="sourceUrls"
                  :id="2"
                />
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>
      </pane>

      <pane v-on:dblclick="resize(0)" :size="100 - (paneSize + paneSizeOffSet)">
        <ContentModule
          :contentData="kernals"
          :id="3"
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

const DropDown = defineAsyncComponent(() =>
  import('@/component/menuDropDown/DropDown.vue')
)
const ForceGraph = defineAsyncComponent(() =>
  import('@/component/content/three/ForceGraph.vue')
)
const ContentModule = defineAsyncComponent(() =>
  import('@/component/content/dataView/ContentModule.vue')
)
const DataModule = defineAsyncComponent(() =>
  import('@/component/content/dataView/DataModule.vue')
)
const MixtapeModule = defineAsyncComponent(() =>
  import('@/component/content/dataView/MixtapeModule.vue')
)
const LightBox = defineAsyncComponent(() =>
  import('@/component/menuBox/viewer/LightBox.vue')
)
const UploadBox = defineAsyncComponent(() =>
  import('@/component/menuBox/uploader/UploadBox.vue')
)
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
    DropDown
  },
  data () {
    return {
      dataReturned: false,
      scrollWidth: this.findScrollWidth(),
      paneSizeTemp: 0,
      paneSize: 30,
      paneSizeOffSet: 0,
      store: GlobalStore(),
      q: ''
    }
  },
  setup () {
    const { hypertexts, sourceUrls, kernals, linkContents, mixtapes } = storeToRefs(ApiStore())
    return { hypertexts, sourceUrls, kernals, linkContents, mixtapes }
  },
  mounted () {
    window.addEventListener('visibilitychange', this.resizeContentFit)
    window.addEventListener('orientationchange', this.resizeContentFit)
    window.addEventListener('resize', this.resizeContentFit)
    const store = GlobalStore()
    store.setCgbWidth(90)
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
      store.setCgbWidth(store.cgbWidth + 50)
      this.resizeContentFit()
    },
    cgbMinus () {
      const store = GlobalStore()
      store.setCgbWidth(store.cgbWidth - 50)
      this.resizeContentFit()
    },
    search: function (e: string) {
      const store = GlobalStore()
      store.setCgbWidth(300)
      store.setFilter(e)
    },
    reset: function () {
      const store = GlobalStore()
      store.setFilter('')
    },
    resizeContentFit: function () {
      //site width
      const store = GlobalStore()
      const el = document.getElementById('contentMain')

      const cgb_width = store.cgbWidth
      const cgb_margin = 5
      if (this.paneSize !== 100 && this.paneSize !== 0 && el != null) {
        const width = el.offsetWidth
        let extra = ((width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth) % (cgb_width + cgb_margin) 

        if (this.paneSize === 30){
          if (window.innerWidth < 400 && (window.innerHeight > window.innerWidth)){
            extra = extra + cgb_width + cgb_margin
          } else {
            const target = width - 250
            const psize = (width * ((100.0 - this.paneSize) / 100.0)) - this.scrollWidth
            extra = (-1 * (target - psize)) + ((target - psize) % (cgb_width + cgb_margin)) + (psize % (cgb_width + cgb_margin))
          }
        }
        const offset = (extra / width) * 100
        this.paneSizeOffSet = offset
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
    },
    findScrollWidth: function () {
      const el = document.createElement('div')
      el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
      document.body.appendChild(el)
      const width = el.offsetWidth + 1
      el.remove()
      return width
    }
  }
})
</script>
