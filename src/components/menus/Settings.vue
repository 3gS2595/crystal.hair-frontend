<template>
  <div class='settings' v-click-away='onClickAway'>
    <div class='options'>
      <a class="set-btn font-s-title" id="set-btn-1"
        v-if="store.mixtape!='' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset == '=1')"
        @click='store.addMixToFolderView = !this.store.addMixToFolderView'
      >add to folder</a>

      <a class="set-btn font-s-title" id="set-btn-1"
        v-if="store.mixtape!='' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset == '=1')"
        @click="userFeedStore.patchFeedToggleMix(store.mixtape)"
      >add to feed</a>

      <a class="set-btn font-s-title" id="set-btn-2"
        v-if="store.srcUrlSubset.length > 2 && store.srcUrlSubset != '=1'"
        @click="userFeedStore.patchFeedToggleSrc(store.srcUrlSubset)"
      >add to feed</a>

      <a class="set-btn font-s-title" id="set-btn-4"
        v-if="store.mixtape!='' || store.srcUrlSubset.length > 2"
        @click='store.editMixtapeBoxView = !this.store.editMixtapeBoxView'
      >edit</a>

      <a class="set-btn font-s-title" id="set-btn-3"
        @click='apiStore.logoutUser()'
      >logout</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { directive } from 'vue3-click-away'

import { ApiStore } from '@/stores/ApiStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'

import { stepContentFit } from '@/lib/ResizeContentGrid'

export default defineComponent({
// Page Variables
  data () {
    return {
      store: GlobalStore(),
      apiStore: ApiStore(),
      userFeedStore: useUserFeedStore()
    }
  },

// Page Methods
  methods: {
    stepContentFit,
    onClickAway () {
      this.store.viewSettings = false
    }
  },
  directives: {
    ClickAway: directive
  }
})
</script>


