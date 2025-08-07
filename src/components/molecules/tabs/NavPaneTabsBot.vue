<template>
  <div class="tabs advanced-tabs">
    <div class="tabs-l">
      <div
        class="tab tab-active tab-width-standard"
        :class="{ 'tab-active': store.viewSettings === true }"
        @click="store.viewSettings = !store.viewSettings"
      >
        <img
          class="tab-icon"
          src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/icon-settings.png"
        />
      </div>
    </div>

    <div class="tabs-r">
      <div
        class="tab tab-active tab-width-standard"
        :class="{ 'tab-active': curOptionsTab === 1 }"
        @click="stepContentFit(-1)"
      >
        <a class="set-btn">-</a>
      </div>
      <div
        class="tab tab-active tab-width-standard"
        :class="{ 'tab-active': curOptionsTab === 1 }"
        @click="stepContentFit(1)"
      >
        <a class="set-btn">+</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { GlobalStore } from '@/stores/GlobalStore'
  import { stepContentFit } from '@/lib/ResizeContentGrid'

  const store = GlobalStore()
  const { curOptionsTab } = storeToRefs(store)
</script>
