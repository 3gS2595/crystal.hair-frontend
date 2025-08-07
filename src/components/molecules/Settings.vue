<template>
  <div v-if="store.viewSettings" class="settings" v-click-away="onClickAway">
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
        @click="store.editMixtapeBoxView = !store.editMixtapeBoxView"
      >
        edit
      </a>
      <a class="set-btn font-s-title" id="set-btn-3" @click="darkToggle()">night toggle</a>
      <a class="set-btn font-s-title" id="set-btn-3" @click="apiStore.logoutUser()">logout</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import { ApiStore } from '@/stores/ApiStore'
  import { GlobalStore } from '@/stores/GlobalStore'
  import { useUserFeedStore } from '@/stores/api/UserFeedStore'

  import { darkToggle } from '@/lib/DarkMode'

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

  function onClickAway() {
    store.viewSettings = false
  }
</script>
