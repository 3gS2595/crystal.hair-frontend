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
  import { storeToRefs } from 'pinia'

  import MixtapeTreeModule from '@/components/organisms/MixtapeTreeModule.vue'
  import ScrapersTreeModule from '@/components/organisms/ScrapersTreeModule.vue'
  import NavPaneTabs from '@/components/molecules/tabs/NavPaneTabsTop.vue'
  import AdvancedTabs from '@/components/molecules/tabs/NavPaneTabsBot.vue'
  import Settings from '@/components/molecules/Settings.vue'

  import { GlobalStore } from '@/stores/GlobalStore'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

  // Access stores
  const store = GlobalStore()
  const mixtapeStore = useMixtapeStore()
  const srcUrlSubsetStore = useSrcUrlSubsetStore()

  const { currentTab } = storeToRefs(store)
</script>
