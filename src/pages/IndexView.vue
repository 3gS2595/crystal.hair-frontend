<template>
  <div class='contentMain' id="contentMain" @drop.prevent="dragInFile" @dragenter.prevent @dragover.prevent>
    <ProgressBar v-if="store.uploadView" :value="store.uploadPercent"></ProgressBar>
    <LightBox v-if='store.lightBoxView' :viewerData="kernals"/>


    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >

  <!-- NAVIGATION PANE-->
      <pane id="main-l" :size="paneSize + paneSizeOffSet">
        <div class="mixtape-pane">
          <div class="tabs">
            <div class="tabs-l">
              <div class="tab tab-width-standard" :class="{'tab-active': currentTab === 1}" @click='currentTab = 1; changeTab()'>
                <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"/>
              </div>
              <div class="tab tab-width-standard" :class="{'tab-active': currentTab === 2}" @click='currentTab = 2; changeTab()'>
                <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-src.png"/>
              </div>
            </div>
            <div class="tabs-r">
              <div class="tab tab-active tab-width-standard" v-if="currentTab == 1" @click='store.addMixtapeBoxView = !this.store.addMixtapeBoxView'>
                <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
              </div>
              <div class="tab tab-active tab-width-standard" v-if="currentTab == 2" @click='store.addSrcUrlSubset = !this.store.addSrcUrlSubset'>
                <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
              </div>
            </div>
          </div>
          <div class="tab-content-mixtape" v-if='currentTab === 1'>
            <MixtapeModule class='mixtapes' :id="1"/>
<!--
            <div class="data-grid-splitter">
              <a></a>
            </div>
            <FolderModule class='folders' :id="0"/>
-->
          </div>
          <div class="tab-content-mixtape" v-if='currentTab === 2'>
            <ScrapersModule :id="0"/>
          </div>
        </div>

        <div  class="forceGraph" >
          <ForceGraph :propKernals="forceGraph" :propMixtapes="mixtapes" :propMixtape="mixtape" :propConnections="connections_mix"/>
        </div>

        <nav class='nav'>
          <img class='navItem' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/logout.png" @click="logout"/>
          <input class='search input-standard text-main-0' v-model="searchValue" placeholder="&#9765;&#xFE0E;" @keyup.enter="search(searchValue)" />
        </nav>
      </pane>

  <!-- CONTENT PANE -->
      <pane id="main-r" @paste.prevent="pasteInFile()" :size="100 - (paneSize + paneSizeOffSet)">
        <div class="tabs tabs-content">
          <div class="tabs-l">
            <div class="tab tab-active tab-width-standard" @click='viewSettings = !viewSettings'>
              <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"/>
            </div>
            <a class="tab tab-active current-dir" v-if="store.filter!=''" @click='store.filter = ""'>{{store.filter}}</a>
            <a class="tab tab-active current-dir" v-if="mixtapeHeader!=''" @click='closeHeader()'>{{mixtapeHeader}}</a>
            <a class="tab tab-active current-dir" v-if="mixtapeHeader!='' && mixtape != ''" @click='store.editMixtapeBoxView = !this.store.editMixtapeBoxView'>edit</a>
          </div>
          <div class="tabs-r">
            <div class="tab tab-active tab-width-standard" @click='store.setUploadBoxView(!this.store.uploadBoxView)'>
              <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
            </div>
          </div>

          <div class="settings-overlay" v-if="viewSettings" >
            <div class='settings' v-click-away='onClickAway'>
              <div class='options'>
                <a class="set-btn" id="set-btn-4" v-if="store.mixtape!='' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset == '=1')" @click="userFeedStore.patchFeedToggleMix(store.mixtape)">add to feed</a>
                <a class="set-btn" id="set-btn-4" v-if="store.srcUrlSubset.length > 2 && store.srcUrlSubset != '=1'" @click="userFeedStore.patchFeedToggleSrc(store.srcUrlSubset)">add to feed</a>
                <a class="set-btn" id="set-btn-1" @click="darkToggle()">dark mode</a>
                <a class="set-btn" id="set-btn-2" @click="stepContentFit(1)">+</a>
                <a class="set-btn" id="set-btn-3" @click="stepContentFit(-1)">-</a>
                <a class="set-btn" id="set-btn-4" v-if="store.mixtape!='' || store.srcUrlSubset.length > 2" @click="deleteMixSrc()">delete mixtape</a>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-content-kernal">
          <ContentModule v-on:dblclick="resize(0)" :id="1"/>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { directive } from 'vue3-click-away'

import { darkToggle, darkSet } from '@/lib/DarkMode'
import { dragInFile, pasteInFile } from '@/lib/UploadKernal'
import ForceGraph from '@/components/forceGraph/ForceGraph.vue'
import ContentModule from '@/components/dataGrids/ContentModule.vue'
import MixtapeModule from '@/components/dataGrids/MixtapeModule.vue'
import FolderModule from '@/components/dataGrids/FoldersModule.vue'
import ScrapersModule from '@/components/dataGrids/ScrapersModule.vue'
import LightBox from '@/components/contentViewers/LightBox.vue'


import { storeToRefs } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { SessionStore } from '@/services/SessionStore'
import { GlobalStore } from '@/services/GlobalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useSrcUrlSubsetStore } from '@/services/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    ContentModule,
    MixtapeModule,
    FolderModule,
    ScrapersModule,
    ForceGraph,
    LightBox,
  },

// Page Variables
  data () {
    return {
      paneSizeTemp: 0,
      paneSize: 30.0,
      paneSizeOffSet: 0.0,
      store: GlobalStore(),
      userFeedStore: useUserFeedStore(),
      apiStore: ApiStore(),
      mixStore: useMixtapeStore(),
      srcStore: useSrcUrlSubsetStore(),
      viewSettings: false,
      currentTab: 1,
      searchValue: '',
      mixtapeHeader: '',
    }
  },
  watch: {
    mixtape() {
      const result = this.mixtapes.find(m => m.id === this.store.mixtape)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    },
    mixtapes() {
      const result = this.mixtapes.find(m => m.id === this.store.mixtape)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    },
    srcUrlSubset() {
      const result = this.srcUrlSubsets.find(s => s.id === this.store.srcUrlSubset)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    }
  },


// Page Lifecycle hooks
  setup () {
    console.log(GlobalStore().lightBoxIndex)
    const { connections_mix } = storeToRefs(useConnectionsStore())
    const { mixtapes } = storeToRefs(useMixtapeStore())
    const { srcUrlSubsets } = storeToRefs(useSrcUrlSubsetStore())
    const {forceGraph } = storeToRefs(useForceGraphStore())
    const { mixtape, srcUrlSubset } = storeToRefs(GlobalStore());
    if(window.innerWidth < 400){
      GlobalStore().cgbWidth = 86
      GlobalStore().cgbWidthSized = 60
    }
    return { mixtapes, mixtape, connections_mix, srcUrlSubsets, srcUrlSubset, forceGraph }
  },
  mounted () {
    window.addEventListener('visibilitychange', this.resizeContentFit)
    window.addEventListener('orientationchange', this.resizeContentFit)
    window.addEventListener('resize', this.resizeContentFit)
    window.addEventListener('paste', this.pasteInFile)
    ApiStore().initialize()
    this.resizeContentFit()
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
    dragInFile,
    pasteInFile,
    closeHeader () {
      this.store.mixtape = ""
      if(this.currentTab === 2){
        this.store.srcUrlSubset = "-1"
      } else {
        this.store.srcUrlSubset = ""
      }
    },
    changeTab () {
      this.store.srcUrlSubset = ""
      this.store.mixtape = ""
      if (this.store.mixtape == "" && (this.store.srcUrlSubset == "-1" || this.store.srcUrlSubset == "")) {
        if (this.currentTab === 1){
          this.store.srcUrlSubset = ""
        } else if (this.currentTab === 2){
          this.store.srcUrlSubset = "-1"
        }
      }
    },
    logout () {
      SessionStore().logoutUser()
      ApiStore().delete()
    },
    deleteMixSrc () {
      if (this.store.srcUrlSubset != '-1' && this.store.srcUrlSubset != '' ) {
        this.srcStore.deleteSrcUrlSubset(this.store.srcUrlSubset);
      } else if (this.store.mixtape != '') {
        this.mixStore.deleteMixtape(this.store.mixtape);
      }
      this.viewSettings=!this.viewSettings
    },
    search: function (e: string) {
      this.store.filter = e
      this.searchValue = ''
    },
    resizeContentFit: function () {
      const el = document.getElementById('app')
      const cgb_width = this.store.cgbWidth
      const cgb = document.querySelector('.cgb-0')
      let cgb_margin = 5
      let scroll_width = 5
      let min_pane_left =(window.innerWidth < 400) ? 146 : 203
      if (cgb != null) {
        const width  = window.getComputedStyle(cgb).marginRight
        cgb_margin = Number(width.substring(0, width.length - 2))
      }
      if ( el != null) {
        if (this.paneSize === 30 ){
          const max_cont_width = el.offsetWidth - min_pane_left - scroll_width - (cgb_margin)
          const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 14
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
          this.store.setCcgbWidthSized(this.store.cgbWidth + (extra_width / Math.trunc(tt)))
        }
      }
    },
    stepContentFit: function (step: number) {
      const el = document.getElementById('app')
      const cgb_width = this.store.cgbWidth
      const cgb = document.querySelector('.cgb-0')
      let cgb_margin =  5
      let scroll_width = 5
      let min_pane_left =(window.innerWidth < 400) ? 146 : 203
      if ( el != null) {
        const max_cont_width = el.offsetWidth - min_pane_left - scroll_width - (cgb_margin) - 20
        const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 18
        const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
        if(step + Math.trunc(tt) >= 1){
          const fitWidth = (max_cont_width - (step + Math.trunc(tt)) * cgb_margin) / (step + Math.trunc(tt))
          this.store.cgbWidth = fitWidth - (this.store.cgbWidthSized - this.store.cgbWidth)
          this.store.cgbWidthSized = fitWidth
          this.resizeContentFit()
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
    },
    onClickAway () {
      this.viewSettings = false
    },
  },
  directives: {
    ClickAway: directive
  }
})
</script>
