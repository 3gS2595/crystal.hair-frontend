<template>
  <div class="tabs advanced-tabs">
    <div class="tabs-l">
      <div class="tab tab-active tab-width-standard" :class="{'tab-active': curOptionsTab === 1}" @click='apiStore.logoutUser()'>
        <img class='tab-icon' src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/logout.png"/>
      </div>
      <div class="tab tab-active tab-width-standard" :class="{'tab-active': this.store.viewSettings === true}" @click='store.viewSettings = !this.store.viewSettings'>
        <img class="tab-icon" src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"/>
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
    }
  },

  // Page Lifecycle hooks
  setup () {
    const { curOptionsTab } = storeToRefs(GlobalStore());
    return { curOptionsTab }
  }
})
</script>
