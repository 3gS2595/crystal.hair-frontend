<template>
  <div class="pane-nav">
    <NavPaneTabs/>
    <div class="tab-content-nav">
      <MixtapeModule :id="0" v-if='currentTab === 1'/>
      <ScrapersModule :id="0" v-if='currentTab === 2'/>
    </div>
  </div>

  <div  class="forceGraph" >

    <ForceGraph :forceGraph="forceGraph" :mixtapes="mixtapes" :connections_mix="connections_mix"/>
  </div>

  <div class="advanced-pane">
    <div class='advanced-pane-inner'>
      <Settings v-if="store.viewSettings"/>
    </div>
  </div>
    <AdvancedTabs/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { darkToggle, darkSet } from '@/lib/DarkMode'
import { toggleExpand } from '@/lib/ResizeContentGrid'
import ForceGraph from '@/components/forceGraph/ForceGraph.vue'
import MixtapeModule from '@/components/dataGrids/MixtapeModule.vue'
import ScrapersModule from '@/components/dataGrids/ScrapersModule.vue'
import NavPaneTabs from '@/components/tabs/NavPaneTabs.vue'
import AdvancedTabs from '@/components/tabs/AdvancedTabs.vue'
import Settings from '@/components/menus/Settings.vue'

import { storeToRefs } from 'pinia'
import { ApiStore } from '@/stores/ApiStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'

export default defineComponent({
  components: {
    MixtapeModule,
    ScrapersModule,
    ForceGraph,
    NavPaneTabs,
    Settings,
    AdvancedTabs
  },

  methods: {
    toggleExpand
  },

// Page Variables
  data () {
    return {
      store: GlobalStore(),
      apiStore: ApiStore(),
    }
  },

// Page Lifecycle hooks
  setup () {
    const { connections_mix } = storeToRefs(useConnectionsStore())
    const { forceGraph } = storeToRefs(useForceGraphStore())
    const { mixtapes } = storeToRefs(useMixtapeStore())
    const { currentTab, paneSize } = storeToRefs(GlobalStore());
    return { currentTab, connections_mix, forceGraph, mixtapes, paneSize}
  }
})
</script>
