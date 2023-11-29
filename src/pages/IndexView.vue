<template>
  <div class='contentMain' id="contentMain" >
    <ProgressBar v-if="store.uploadView" :value="store.uploadPercent"></ProgressBar>
    <LightBox v-if='store.lightBoxView' :viewerData="kernals"/>
    <AddContentBox v-if='store.uploadBoxView'/>
    <AddMixtapeBox v-if='store.addMixtapeBoxView'/>

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >

  <!-- NAVIGATION PANE-->
      <pane id="main-left" :size="paneSize + paneSizeOffSet">
        <nav class='nav'>
          <img class='navItem' src="logout.png" @click="logout"/>
          <input class='search input-standard text-main-0' v-model="searchValue" placeholder="search" @keyup.enter="search(searchValue)" />
        </nav>

        <div class="mixtape-pane">
          <div class="tabs">
            <div class="tabs-left">
              <a class="tab-header tab-active tab-add" @click='toggleAddMixtapeBox()'>+</a>
              <a class="tab-header" @click='currentTab = 1'  :class="{'tab-active': currentTab === 1}">※&#xFE0E;</a>
              <a class="tab-header" @click='currentTab = 2' style="padding-top:0px!important; font-size: 18px;" :class="{'tab-active': currentTab === 2}">&#x1F4A2;&#xFE0E;</a>
            </div>
            <div class="tabs-right">
            </div>
          </div>
          <div class="tab-content-mixtape" v-if='currentTab === 1'>
            <MixtapeModule :id="0" :contentData="mixtapes"/>
          </div>
      <!--     <div class="tab-content-mixtape" v-if='currentTab === 2'>
            <WebscrapeModule :id="0" :contentData="hypertexts"/>
          </div> -->
        </div>

        <div  class="forceGraph" >
          <ForceGraph :propKernals="forceGraph" :propMixtapes="mixtapes"/>
        </div>
      </pane>

  <!-- CONTENT PANE -->
      <pane id="main-right" :size="100 - (paneSize + paneSizeOffSet)">
        <div class="tabs" style="margin-top:4px; width:calc(100% - 4px)!important;">
          <div class="tabs-left">
            <a class="tab-header tab-active" style="padding-top:0px!important;" @click='viewSettings = !viewSettings'>⛓&#xFE0E;</a>
            <a class="tab-header tab-active current-dir" v-if="store.filter != ''" @click='store.setFilter("")'>{{store.filter}}</a>
            <a class="tab-header tab-active current-dir" v-if="mixtapeHeader!= ''" @click='store.setMixtape("")'>{{mixtapeHeader}}</a>
          </div>

          <div class="tabs-right">
            <a class="tab-header tab-active tab-add" @click='toggleUploadBox()'>+</a>
          </div>

          <div class="settings" v-if="viewSettings">
            <a class="set-btn" id="set-btn-1" @click="darkToggle()">dark mode</a>
            <a class="set-btn" id="set-btn-2" @click="cgbPlus()">+</a>
            <a class="set-btn" id="set-btn-3" @click="cgbMinus()">-</a>
            <a class="set-btn" id="set-btn-4"
              v-if="store.mixtape != ''"
              @click="apiStore.deleteMixtape(store.mixtape); viewSettings=!viewSettings"
            >delete mixtape</a>
          </div>
        </div>

        <div class="tab-content-kernal">
          <ContentModule
            v-on:dblclick="resize(0)"
            :contentData="kernals"
            :id="1"
          />
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'

import { darkToggle, darkSet } from '@/lib/DarkMode'
import DropDown from '@/components/menuDropDown/DropDown.vue'
import ForceGraph from '@/components/forceGraph/ForceGraph.vue'
import ContentModule from '@/components/dataGrids/ContentModule.vue'
import MixtapeModule from '@/components/dataGrids/MixtapeModule.vue'
import WebscrapeModule from '@/components/dataGrids/WebscrapeModule.vue'
import LightBox from '@/components/contentViewers/LightBox.vue'
import AddContentBox from '@/components/uploaders/AddContent.vue'
import AddMixtapeBox from '@/components/uploaders/AddMixtape.vue'

import { storeToRefs } from 'pinia'
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
    WebscrapeModule
  },


// Page Variables
  data () {
    return {
      paneSizeTemp: 0,
      paneSize: 30.0,
      paneSizeOffSet: 0.0,
      store: GlobalStore(),
      apiStore: ApiStore(),
      viewSettings: false,
      currentTab: 1,
      searchValue: '',
      mixtapeHeader: '',
    }
  },
  watch: {
    mixtape() {
      const result = this.mixtapes.find(person => person.id === this.store.mixtape)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    }
  },


// Page Lifecycle hooks
  setup () {
    const { kernals, mixtapes, forceGraph } = storeToRefs(ApiStore())
    const { mixtape } = storeToRefs(GlobalStore());
    return { kernals, mixtapes, forceGraph, mixtape }
  },
  mounted () {
    window.addEventListener('visibilitychange', this.resizeContentFit)
    window.addEventListener('orientationchange', this.resizeContentFit)
    window.addEventListener('resize', this.resizeContentFit)
    if (window.innerWidth <= 430 && (window.innerHeight > window.innerWidth)){
      this.store.setCgbWidth(65)
    }
    this.resizeContentFit()
    ApiStore().initialize()
  },
  unmounted () {
    window.removeEventListener('visibilitychange', this.resizeContentFit)
    window.removeEventListener('orientationchange', this.resizeContentFit, true)
    window.removeEventListener('resize', this.resizeContentFit, true)
  },


// Page Methods
  methods: {
    darkToggle,
    darkSet,
    logout () {
      localStorage.removeItem('auth_token')
      location.reload()
    },
    cgbPlus () {
      this.store.setCgbWidth(this.store.cgbWidth + 40)
      this.resizeContentFit()
    },
    cgbMinus () {
      this.store.setCgbWidth(this.store.cgbWidth - 40)
      this.resizeContentFit()
    },
    toggleUploadBox() {
      this.store.setUploadBoxView(!this.store.uploadBoxView)
    },
    toggleAddMixtapeBox() {
      this.store.setAddMixtapeBoxView(!this.store.addMixtapeBoxView)
    },
    search: function (e: string) {
      this.store.setFilter(e)
      this.searchValue = ''
    },
    reset: function () {
      this.store.setFilter('')
      this.store.setMixtape('')
    },
    resizeContentFit: function () {
      const el = document.getElementById('app')
      const cgb_width = this.store.cgbWidth
      const cgb = document.querySelector('.cgb-0')
      let cgb_margin = 5
      let scroll_width = 8
      if (cgb != null) {
        const width  = window.getComputedStyle(cgb).marginLeft
        cgb_margin = Number(width.substring(0, width.length - 2))
        scroll_width = cgb_margin * 2
      }

      if ( el != null) {
        if (this.paneSize === 30 ){
          const max_cont_width = el.offsetWidth - 207 - scroll_width - (cgb_margin)
          const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 18
          const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
          const content_width_percent = (max_cont_width) / el.offsetWidth
          const offset_size = ((-1 * (content_width_percent - 1)) - .3) * 100
          this.paneSizeOffSet =(offset_size)
          this.store.setCgbWidthSized(this.store.cgbWidth + (extra_width / Math.trunc(tt)))
        }
        if (this.paneSize === 0 ){
          const max_cont_width = el.offsetWidth - scroll_width - (cgb_margin + 7)
          const extra_width = max_cont_width % (cgb_width + (cgb_margin))
          const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
          this.store.setCgbWidthSized(this.store.cgbWidth + (extra_width / Math.trunc(tt)))
        }

        const images = document.getElementsByClassName('thumbnail');
        if (images[0] !== undefined && images[0].parentElement !== null) {
          const width = images[0].parentElement.offsetWidth
          for(let i = 0; i < images.length; i++) {
            const f = this.kernals.findIndex(x => x.id === images[i].id)
            if (width > 160 && width <= 400){
              images[i].setAttribute('src', this.kernals[f].signed_url_m);
            } else if (width > 400 && width <= 1000){
              images[i].setAttribute('src', this.kernals[f].signed_url_l);
            } else if (width > 1000) {
              images[i].setAttribute('src', this.kernals[f].signed_url);
            } else {
              images[i].setAttribute('src', this.kernals[f].signed_url_s);
            }
          }
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
