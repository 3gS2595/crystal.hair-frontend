<template>

  <!-- CONTENT PANE -->
  <div class="tabs tabs-content">
    <div class="tabs-l">
      <div class="tab tab-width-standard" v-if="currentTab === 1" :class="{'tab-active media-active': currentTab === 1}">
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"/>
      </div>
      <div class="tab tab-width-standard" v-if="currentTab === 2" :class="{'tab-active media-active': currentTab === 2}">
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-src.png"/>
      </div>
      <a class="tab tab-active current-dir" v-if="store.filter!=''" @click='store.filter = ""'>{{store.filter}}</a>
      <a class="tab tab-active current-dir" v-if="mixtapeHeader!=''" @click='closeHeader()'>{{mixtapeHeader}}</a>
      <a class="tab tab-active current-dir" v-if="mixtapeHeader!='' && mixtape != ''" @click='store.editMixtapeBoxView = !this.store.editMixtapeBoxView'>edit</a>
    </div>
    <div class="tabs-r">
      <div v-if="store.mixtape!=''" class="tab tab-active tab-width-standard media-active" @click='store.uploadBoxView = !this.store.uploadBoxView'>
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
      </div>
      <div class="tab tab-active tab-width-standard media-active" @click='`${toggleExpand()}`'>
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { directive } from 'vue3-click-away'

import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { openExpand, toggleExpand } from '@/lib/ResizeContentGrid'


import type { mixtapeType } from '@/types/ApiTypes'
import type { srcUrlSubsetType } from '@/types/ApiTypes'

export default defineComponent({
// Page Variables
  data () {
    return {
      store: GlobalStore(),
      mixtapeHeader: '',
      userFeedStore: useUserFeedStore(),
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
    const { currentTab, mixtape, srcUrlSubset, viewSettings } = storeToRefs(GlobalStore());
    return { currentTab, mixtapes, mixtape, srcUrlSubsets, viewSettings, srcUrlSubset}
  },

// Page Methods
  methods: {
    openExpand,
    toggleExpand,
    closeHeader () {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { openExpand() }
      this.store.mixtape = ""
      if(this.currentTab === 2){
        this.store.srcUrlSubset = "-1"
      } else {
        this.store.srcUrlSubset = ""
      }
    }
  }
})
</script>


