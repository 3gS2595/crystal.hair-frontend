<template>
   <OverlayBox v-if="overlay_edit">
    <EditMixtapeBox v-if="overlay_edit" @close="handleOverlayClose" />
  </OverlayBox>
  <div class="settings" v-click-away="onClickAway">
    <input
      id="global-search-input"
      class="input-standard text-main-0"
      v-model="q"
      placeholder="search"
      @keyup.enter="search(q)"
    />
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
        @click="overlay_edit = !overlay_edit"
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
  import OverlayBox from '@/components/atoms/OverlayBox.vue'
  import EditMixtapeBox from '@/components/molecules/overlayBox/EditBox.vue'

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

  // Methods
  const q = ref('')
  function search(e: string) {
    store.filter = e
    q.value = ''
  }

  const overlay_edit = ref(false)
  function handleOverlayClose() {
    overlay_edit.value = false
  }

  const toggle_settings = inject('toggle_settings')
  function onClickAway() {
    toggle_settings.value = false
  }
</script>
