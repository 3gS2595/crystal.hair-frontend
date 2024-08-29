<template>
  <div class="pane-nav">
    <NavPaneTabs/>
    <div class="tab-content-nav">
      <MixtapeModule v-if='currentTab === 1'/>
      <ScrapersModule :id="0" v-if='currentTab === 2'/>
    </div>
  </div>

  <div class="search">
    <input class='input-standard text-main-0' v-model="q" placeholder="search" @keyup.enter="search(q)" />
  </div>

  <div class="advanced-pane">
    <div class='advanced-pane-inner'>
      <Settings />
    </div>
  </div>
  <AdvancedTabs/>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { darkToggle, darkSet } from '@/lib/DarkMode'
import { toggleExpand } from '@/lib/ResizeContentGrid'
import MixtapeModule from '@/components/dataGrids/MixtapeModule.vue'
import ScrapersModule from '@/components/dataGrids/ScrapersModule.vue'
import NavPaneTabs from '@/components/tabs/NavPaneTabsTop.vue'
import AdvancedTabs from '@/components/tabs/NavPaneTabsBot.vue'
import Settings from '@/components/menus/Settings.vue'

import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/stores/GlobalStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'

export default defineComponent({
  components: {
    MixtapeModule,
    ScrapersModule,
    NavPaneTabs,
    Settings,
    AdvancedTabs
  },

// Page Variables
  data () {
    return {
      q: '',
      store: GlobalStore(),
    }
  },

// Page Lifecycle hooks
  setup () {
    const { connections_mix } = storeToRefs(useConnectionsStore())
    const { forceGraph } = storeToRefs(useForceGraphStore())
    const { mixtapes } = storeToRefs(useMixtapeStore())
    const { currentTab, paneSize } = storeToRefs(GlobalStore());
    return { currentTab, connections_mix, forceGraph, mixtapes, paneSize}
  },

  methods: {
    toggleExpand,
    search: function (e: string) {
      this.store.filter = e
      this.q = ''
    }
  }
})
</script>
