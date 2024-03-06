<template>
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
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { directive } from 'vue3-click-away'

import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'

import { stepContentFit } from '@/lib/ResizeContentGrid'
import { darkToggle, darkSet } from '@/lib/DarkMode'

export default defineComponent({
// Page Variables
  data () {
    return {
      store: GlobalStore(),
      userFeedStore: useUserFeedStore()
    }
  },

// Page Methods
  methods: {
    darkToggle,
    darkSet,
    stepContentFit,
    deleteMixSrc () {
      if (this.store.srcUrlSubset != '-1' && this.store.srcUrlSubset != '' ) {
        useSrcUrlSubsetStore().deleteSrcUrlSubset(this.store.srcUrlSubset);
      } else if (this.store.mixtape != '') {
        useMixtapeStore().deleteMixtape(this.store.mixtape);
      }
      this.store.viewSettings = !this.store.viewSettings
    },
    onClickAway () {
      this.store.viewSettings = false
    }
  },
  directives: {
    ClickAway: directive
  }
})
</script>


