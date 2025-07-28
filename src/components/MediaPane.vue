<template>
  <LightBox v-if="store.lightBoxView" />
  <MediaPaneTabs />
  <div class="tab-content-kernal">
    <ContentModule :id="1" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ContentModule from '@/components/dataGrids/ContentModule.vue'
import LightBox from '@/components/dataViewers/LightBox.vue'
import MediaPaneTabs from '@/components/tabs/MediaPaneTabs.vue'

import { GlobalStore } from '@/stores/GlobalStore'

// initialize store
const store = GlobalStore()

onMounted(() => {
  if (window.innerWidth < 400) {
    store.cgbWidth = 86
    store.cgbWidthSized = 60
  }
})
</script>

