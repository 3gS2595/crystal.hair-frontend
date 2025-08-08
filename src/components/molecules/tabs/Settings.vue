<template>
  <div class="settings" v-click-away="onClickAway">
    <div class="options">
      <a
        class="set-btn font-s-title"
        id="set-btn-1"
        v-if="
          store.mixtape !== '' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset === '=1')
        "
        @click="store.addMixToFolderView = !store.addMixToFolderView"
      >
        add to folder
      </a>

      <a
        class="set-btn font-s-title"
        id="set-btn-1"
        v-if="
          store.mixtape !== '' && !(store.srcUrlSubset.length > 2 || store.srcUrlSubset === '=1')
        "
        @click="userFeedStore.patchFeedToggleMix(store.mixtape)"
      >
        add to feed
      </a>

      <a
        class="set-btn font-s-title"
        id="set-btn-2"
        v-if="store.srcUrlSubset.length > 2 && store.srcUrlSubset !== '=1'"
        @click="userFeedStore.patchFeedToggleSrc(store.srcUrlSubset)"
      >
        add to feed
      </a>

      <a
        class="set-btn font-s-title"
        id="set-btn-4"
        v-if="store.mixtape !== '' || store.srcUrlSubset.length > 2"
        @click="toggle_edit"
      >
        edit
      </a>
      <a class="set-btn font-s-title" id="set-btn-3" @click="darkToggle()">night toggle</a>
      <a class="set-btn font-s-title" id="set-btn-3" @click="apiStore.logoutUser()">logout</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue'

  // Import: Components

  // Import: Composables
  import { darkToggle } from '@/lib/DarkMode'

  // Import: Pinia Stores
  import { ApiStore } from '@/stores/ApiStore'
  import { GlobalStore } from '@/stores/GlobalStore'
  import { useUserFeedStore } from '@/stores/api/UserFeedStore'

  // Stores
  const store = GlobalStore()
  const apiStore = ApiStore()
  const userFeedStore = useUserFeedStore()

  const toggle_settings: any = inject('toggle_settings')
  function onClickAway() {
    toggle_settings.value = false
  }
  const overlay_edit = inject('overlay_edit')
  function toggle_edit() {
    overlay_edit.value = true
  }

</script>
