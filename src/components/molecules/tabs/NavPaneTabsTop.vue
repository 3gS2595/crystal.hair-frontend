<template>
  <OverlayBox v-if="overlay_add_mix || overlay_add_src">
    <AddMixtapeBox v-if="overlay_add_mix" />
    <AddSrcUrlSubset v-if="overlay_add_src" />
    <EditMixtapeBox v-if="store.editMixtapeBoxView" />
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
  import { ref, provide } from 'vue'
  import { storeToRefs } from 'pinia'
  import { GlobalStore } from '@/stores/GlobalStore'
  import AddMixtapeBox from '@/components/atoms/uploaders/AddMixtape.vue'
  import AddSrcUrlSubset from '@/components/atoms/uploaders/AddSrcUrlSubset.vue'
  import EditMixtapeBox from '@/components/molecules/EditBox.vue'
  import OverlayBox from '@/components/atoms/OverlayBox.vue'

  const store = GlobalStore()

  const { currentTab } = storeToRefs(store)

  const overlay_add_mix = ref(false)
  provide('overlay_add_mix', overlay_add_mix)
  const overlay_add_src = ref(false)
  provide('overlay_add_src', overlay_add_src)

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
