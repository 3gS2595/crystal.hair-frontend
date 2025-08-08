<template>
  <div class="pane-nav">
    <NavPaneTabs />
    <div class="tab-content-nav">
      <NavTreeModule
        v-if="currentTab === 1"
        :treeData="mixtapeStore.mixtapeTree"
        type="mixtape"
      />
      <NavTreeModule
        v-if="currentTab === 2"
        :treeData="srcUrlSubsetStore.srcUrlTree"
        type="scraper"
      />
    </div>
  </div>
  <div class="advanced-pane">
    <div class="advanced-pane-inner">
      <EditMixtapeBox v-if="overlay_edit"/>
      <Settings v-if="toggle_settings" />
    </div>
  </div>
  <AdvancedTabs />
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue'
  import { storeToRefs } from 'pinia'

  import EditMixtapeBox from '@/components/molecules/overlayBox/EditBox.vue'
  import NavTreeModule from '@/components/organisms/NavTreeModule.vue'
  import NavPaneTabs from '@/components/molecules/tabs/NavPaneTabsTop.vue'
  import AdvancedTabs from '@/components/molecules/tabs/NavPaneTabsBot.vue'
  import Settings from '@/components/molecules/tabs/Settings.vue'

  import { GlobalStore } from '@/stores/GlobalStore'
  import { useMixtapeStore } from '@/stores/api/MixtapeStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

  const store = GlobalStore()
  const mixtapeStore = useMixtapeStore()
  const srcUrlSubsetStore = useSrcUrlSubsetStore()

  const { currentTab } = storeToRefs(store)

  const toggle_settings = ref(false)
  provide('toggle_settings', toggle_settings)

  const overlay_edit = ref(false)
  provide('overlay_edit', overlay_edit)
</script>

