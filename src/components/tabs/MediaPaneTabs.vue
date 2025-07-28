<template>
  <!-- CONTENT PANE -->
  <div class="tabs tabs-content">
    <div class="tabs-l">
      <div
        v-if="currentTab === 1 && mixtapeHeader === ''"
        :class="{'tab-active media-active': store.feed === true}"
        class="tab tab-width-standard"
        @click="store.feed = true"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"
        />
      </div>
      <div
        v-if="currentTab === 1 && mixtapeHeader === ''"
        :class="{'tab-active media-active': store.feed === false}"
        class="tab tab-width-standard"
        @click="store.feed = false"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"
        />
      </div>
      <div
        v-if="currentTab === 2 && mixtapeHeader === ''"
        :class="{'tab-active media-active': store.feed === true}"
        class="tab tab-width-standard"
        @click="store.feed = true"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-src.png"
        />
      </div>
      <div
        v-if="currentTab === 2 && mixtapeHeader === ''"
        :class="{'tab-active media-active': store.feed === false}"
        class="tab tab-width-standard"
        @click="store.feed = false"
      >
        <img
          class="tab-icon tab-icon-media"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"
        />
      </div>

      <a
        v-if="mixtapeHeader"
        class="tab tab-active current-dir"
        @click="store.closeHeader"
      >{{ mixtapeHeader }}</a>

      <Dropdown />
      <AppendFolderBox />

      <a
        v-if="store.tags !== ''"
        class="tab tab-active current-dir"
        @click="store.tags = ''"
      >{{ store.tags }}</a>

      <a
        v-if="store.filter !== ''"
        class="tab tab-active current-dir"
        @click="() => (store.filter = '')"
      >{{ store.filter }}</a>
    </div>

    <div class="tabs-r">
      <div
        v-if="store.mixtape !== ''"
        class="tab tab-active tab-width-standard media-active"
        @click="() => (store.uploadBoxView = !store.uploadBoxView)"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"
        />
      </div>
      <div
        class="tab tab-active tab-width-standard media-active"
        @click="toggleExpand"
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
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

import Dropdown from '@/components/menus/dropdown/Dropdown.vue'
import AppendFolderBox from '@/components/menus/dropdown/AppendFolderBox.vue'

import { openExpand, toggleExpand } from '@/lib/ResizeContentGrid'

// Pinia stores
const store = GlobalStore()
const { currentTab, mixtape, srcUrlSubset, mixtapes, srcUrlSubsets } = {
  ...storeToRefs(store),
  ...storeToRefs(useMixtapeStore()),
  ...storeToRefs(useSrcUrlSubsetStore()),
}

// Watchers to update mixtapeHeader based on changes
const mixtapeHeader = computed(() => {
  const mixtapeObj = mixtapes.value.find((m) => m.id === store.mixtape)
  const srcSubsetObj = srcUrlSubsets.value.find((s) => s.id === store.srcUrlSubset)
  return mixtapeObj?.name || srcSubsetObj?.name || ''
})
</script>

