<template>

  <!-- CONTENT PANE -->
  <div class="tabs tabs-content">
    <div class="tabs-l">
      <div class="tab tab-active tab-width-standard" @click='viewSettings = !viewSettings'>
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"/>
      </div>
      <a class="tab tab-active current-dir" v-if="store.filter!=''" @click='store.filter = ""'>{{store.filter}}</a>
      <a class="tab tab-active current-dir" v-if="mixtapeHeader!=''" @click='closeHeader()'>{{mixtapeHeader}}</a>
      <a class="tab tab-active current-dir" v-if="mixtapeHeader!='' && mixtape != ''" @click='store.editMixtapeBoxView = !this.store.editMixtapeBoxView'>edit</a>
    </div>
    <div v-if="store.mixtape!=''" class="tabs-r">
      <div class="tab tab-active tab-width-standard" @click='store.uploadBoxView = !this.store.uploadBoxView'>
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
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { directive } from 'vue3-click-away'

import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/services/GlobalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'

import { stepContentFit } from '@/lib/ResizeContentGrid'
import { darkToggle, darkSet } from '@/lib/DarkMode'

import type { mixtapeType } from '@/types/ApiTypes'
import type { srcUrlSubsetType } from '@/types/ApiTypes'

export default defineComponent({
// Page Variables
  data () {
    return {
      store: GlobalStore(),
      mixtapeHeader: '',
      userFeedStore: useUserFeedStore(),
      viewSettings: false
    }
  },

  watch: {
    mixtape() {
      const result = this.mixtapes.find((m: mixtapeType) => m.id === this.store.mixtape)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    },
    mixtapes() {
      console.log(this.mixtapes)
      const result = this.mixtapes.find((m: mixtapeType) => m.id === this.store.mixtape)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    },
    srcUrlSubset() {
      const result = this.srcUrlSubsets.find((s: srcUrlSubsetType)  => s.id === this.store.srcUrlSubset)
      this.mixtapeHeader = (result !== undefined) ? result.name : ''
    }
  },

// Page Lifecycle hooks
  setup () {
    const { mixtapes } = storeToRefs(useMixtapeStore())
    const { srcUrlSubsets } = storeToRefs(useSrcUrlSubsetStore())
    const { currentTab, mixtape, srcUrlSubset } = storeToRefs(GlobalStore());
    return { currentTab, mixtapes, mixtape, srcUrlSubsets, srcUrlSubset}
  },

// Page Methods
  methods: {
    darkToggle,
    darkSet,
    stepContentFit,
    closeHeader () {
      this.store.mixtape = ""
      if(this.currentTab === 2){
        this.store.srcUrlSubset = "-1"
      } else {
        this.store.srcUrlSubset = ""
      }
    },
    deleteMixSrc () {
      if (this.store.srcUrlSubset != '-1' && this.store.srcUrlSubset != '' ) {
        useSrcUrlSubsetStore().deleteSrcUrlSubset(this.store.srcUrlSubset);
      } else if (this.store.mixtape != '') {
        useMixtapeStore().deleteMixtape(this.store.mixtape);
      }
      this.viewSettings=!this.viewSettings
    },
    onClickAway () {
      this.viewSettings = false
    }
  },
  directives: {
    ClickAway: directive
  }
})
</script>


