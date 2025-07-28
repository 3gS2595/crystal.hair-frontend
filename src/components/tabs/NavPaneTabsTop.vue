<template>
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
        @click="store.addMixtapeBoxView = !store.addFolderBoxView"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"
        />
      </div>
      <div
        class="tab tab-active tab-width-standard"
        v-if="currentTab === 2"
        @click="store.addSrcUrlSubset = !store.addSrcUrlSubset"
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
import { ApiStore } from '@/stores/ApiStore'
import { GlobalStore } from '@/stores/GlobalStore'

const store = GlobalStore()
const apiStore = ApiStore()
const searchValue = ref('')

const { currentTab } = storeToRefs(store)

function changeTab() {
  store.srcUrlSubset = ''
  store.mixtape = ''
  if (
    store.mixtape === '' &&
    (store.srcUrlSubset === '-1' || store.srcUrlSubset === '')
  ) {
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

function search(e: string) {
  store.filter = e
  searchValue.value = ''
}
</script>

