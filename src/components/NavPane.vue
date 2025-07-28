<template>
  <div class="pane-nav">
    <NavPaneTabs />
    <div class="tab-content-nav">
      <MixtapeTreeModule :treeData="mixtapeStore.mixtapeTree" v-if="currentTab === 1" />
      <ScrapersTreeModule :treeData="srcUrlSubsetStore.srcUrlTree" v-if="currentTab === 2" />
    </div>
  </div>


  <div class="advanced-pane">
    <div class="advanced-pane-inner">
      <Settings />
    </div>
  </div>
  <AdvancedTabs />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import MixtapeTreeModule from '@/components/dataGrids/MixtapeTreeModule.vue'
import ScrapersTreeModule from '@/components/dataGrids/ScrapersTreeModule.vue'
import NavPaneTabs from '@/components/tabs/NavPaneTabsTop.vue'
import AdvancedTabs from '@/components/tabs/NavPaneTabsBot.vue'
import Settings from '@/components/menus/Settings.vue'

import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

// Reactive search input
const q = ref('')

// Access stores
const store = GlobalStore()
const mixtapeStore = useMixtapeStore()
const srcUrlSubsetStore = useSrcUrlSubsetStore()

const { currentTab } = storeToRefs(store)

// Search method
function search(e: string) {
  store.filter = e
  q.value = ''
}
</script>

