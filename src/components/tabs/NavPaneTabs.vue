<template>
  <div class="tabs tabs-content">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { ApiStore } from '@/stores/ApiStore'
import { GlobalStore } from '@/stores/GlobalStore'

export default defineComponent({
// Page Variables
  data () {
    return {
      store: GlobalStore(),
      apiStore: ApiStore(),
      searchValue: ''
    }
  },

  // Page Lifecycle hooks
  setup () {
    const { currentTab } = storeToRefs(GlobalStore());
    return { currentTab }
  },

// Page Methods
  methods: {
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
