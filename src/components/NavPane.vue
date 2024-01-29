<template>
  <div class="mixtape-pane">
    <NavPaneTabs/>
    <div class="tab-content-mixtape" v-if='currentTab === 1'>
      <MixtapeModule :id="0"/>
    </div>
    <div class="tab-content-mixtape" v-if='currentTab === 2'>
      <ScrapersModule :id="0"/>
    </div>
  </div>

  <div  class="forceGraph" >
    <ForceGraph :forceGraph="forceGraph" :mixtapes="mixtapes" :mixtape="mixtape" :connections_mix="connections_mix"/>
  </div>

  <nav class='nav'>
    <img class='navItem' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/logout.png" @click="apiStore.logoutUser()"/>
    <input class='search input-standard text-main-0' v-model="searchValue" placeholder="&#9765;&#xFE0E;" @keyup.enter="search(searchValue)" />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { darkToggle, darkSet } from '@/lib/DarkMode'
import ForceGraph from '@/components/forceGraph/ForceGraph.vue'
import MixtapeModule from '@/components/dataGrids/MixtapeModule.vue'
import ScrapersModule from '@/components/dataGrids/ScrapersModule.vue'
import NavPaneTabs from '@/components/tabs/NavPaneTabs.vue'

import { storeToRefs } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { GlobalStore } from '@/services/GlobalStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'

export default defineComponent({
  components: {
    MixtapeModule,
    ScrapersModule,
    ForceGraph,
    NavPaneTabs
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
    const { mixtape, currentTab } = storeToRefs(GlobalStore());
    return { currentTab, connections_mix, forceGraph, mixtapes, mixtape}
  }
})
</script>
