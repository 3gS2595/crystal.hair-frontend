<template>
  <LightBox v-if="store.lightBoxView" />
  <MediaPaneTabs />
  <div class="tab-content-kernal">
    <ContentModule :id="1" />
  </div>
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue'
  import ContentModule from '@/components/organisms/ContentModule.vue'
  import LightBox from '@/components/organisms/LightBox.vue'
  import MediaPaneTabs from '@/components/molecules/tabs/MediaPaneTabs.vue'

  import { GlobalStore } from '@/stores/GlobalStore'
  const store = GlobalStore()

  const toggle_upload = ref(false)
  provide('toggle_upload', toggle_upload)
</script>
