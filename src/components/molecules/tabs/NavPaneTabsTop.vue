<template>
   <OverlayBox v-if="overlay_add_mix || overlay_add_src">
    <AddMixtapeBox v-if="overlay_add_mix" @close="handleOverlayClose" />
    <AddSrcUrlSubset v-if="overlay_add_src" @close="handleOverlayClose" />
  </OverlayBox>
  <div class="tabs tabs-content">
    <div class="tabs-l">
      <div
        class="tab tab-width-standard"
        :class="{ 'tab-active': currentTab === 1 }"
        @click="setTab(1)"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"
        />
      </div>
      <div
        class="tab tab-width-standard"
        :class="{ 'tab-active': currentTab === 2 }"
        @click="setTab(2)"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-src.png"
        />
      </div>
    </div>
    <div class="tabs-r">
      <div
        class="tab tab-active tab-width-standard"
        v-if="currentTab === 1"
        @click="overlay_add_mix = !overlay_add_mix"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"
        />
      </div>
      <div
        class="tab tab-active tab-width-standard"
        v-if="currentTab === 2"
        @click="overlay_add_src = !overlay_add_src"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { GlobalStore } from '@/stores/GlobalStore'
  import AddMixtapeBox from '@/components/molecules/overlayBox/AddMixtape.vue'
  import AddSrcUrlSubset from '@/components/molecules/overlayBox/AddSrcUrlSubset.vue'
  import OverlayBox from '@/components/atoms/OverlayBox.vue'

  const store = GlobalStore()

  const { currentTab } = storeToRefs(store)

  const overlay_add_mix = ref(false)
  const overlay_add_src = ref(false)
  function handleOverlayClose() {
    overlay_add_mix.value = false
    overlay_add_src.value = false
  }

  function changeTab() {
    store.srcUrlSubset = ''
    store.mixtape = ''
    if (store.mixtape === '' && (store.srcUrlSubset === '-1' || store.srcUrlSubset === '')) {
      if (currentTab.value === 1) {
        store.srcUrlSubset = ''
      } else if (currentTab.value === 2) {
        store.srcUrlSubset = '-1'
      }
    }
  }

  function setTab(tab: number) {
    currentTab.value = tab
    changeTab()
  }
</script>
