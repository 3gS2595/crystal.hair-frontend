<template>
  <div class="mixtape-pane">
    <div class="tabs">
      <div class="tabs-l">
        <div class="tab tab-width-standard" :class="{'tab-active': currentTab === 1}" @click='currentTab = 1; changeTab()'>
          <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-mix.png"/>
        </div>
        <div class="tab tab-width-standard" :class="{'tab-active': currentTab === 2}" @click='currentTab = 2; changeTab()'>
          <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-src.png"/>
        </div>
      </div>
      <div class="tabs-r">
        <div class="tab tab-active tab-width-standard" v-if="currentTab == 1" @click='store.addMixtapeBoxView = !this.store.addMixtapeBoxView'>
          <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
        </div>
        <div class="tab tab-active tab-width-standard" v-if="currentTab == 2" @click='store.addSrcUrlSubset = !this.store.addSrcUrlSubset'>
          <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-new.png"/>
        </div>
      </div>
    </div>
    <div class="tab-content-mixtape" v-if='currentTab === 1'>
      <MixtapeModule class='mixtapes' :id="1"/>
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

import { storeToRefs } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { SessionStore } from '@/services/SessionStore'
import { GlobalStore } from '@/services/GlobalStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'


export default defineComponent({
  components: {
    MixtapeModule,
    ScrapersModule,
    ForceGraph
  },

// Page Variables
  data () {
    return {
      store: GlobalStore(),
      sessionStore: SessionStore(),
      userFeedStore: useUserFeedStore(),
      apiStore: ApiStore(),
      searchValue: ''
    }
  },
// Page Lifecycle hooks
  setup () {
    const { connections_mix } = storeToRefs(useConnectionsStore())
    const { forceGraph } = storeToRefs(useForceGraphStore())
    const { mixtapes } = storeToRefs(useMixtapeStore())
    const { mixtape, currentTab } = storeToRefs(GlobalStore());
    return { currentTab, connections_mix, forceGraph, mixtapes, mixtape}
  },

// Page Methods
  methods: {
    darkToggle,
    darkSet,
    changeTab () {
      this.store.srcUrlSubset = ""
      this.store.mixtape = ""
      if (this.store.mixtape == "" && (this.store.srcUrlSubset == "-1" || this.store.srcUrlSubset == "")) {
        if (this.currentTab === 1){
          this.store.srcUrlSubset = ""
        } else if (this.currentTab === 2){
          this.store.srcUrlSubset = "-1"
        }
      }
    },
    search: function (e: string) {
      this.store.filter = e
      this.searchValue = ''
    }
  }
})
</script>
