<template>
  <OverlayBox v-if="globalStore.addFolderBoxView || globalStore.editMixtapeBoxView || globalStore.addSrcUrlSubset">
    <AddFolderBox v-if="globalStore.addFolderBoxView" />
    <EditMixtapeBox v-if="globalStore.editMixtapeBoxView" />
    <EditMixtapeBox v-if="globalStore.editMixtapeBoxView" />
  </OverlayBox>
  <div class="contentMain" id="contentMain">
    <splitpanes class="default-theme" @resize="paneSize = $event[0].size">
      <pane :size="paneSize + paneSizeOffSet" id="main-l">
        <navPane />
      </pane>
      <pane :size="100 - (paneSize + paneSizeOffSet)" id="main-r">
        <mediaPane />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, defineAsyncComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Splitpanes, Pane } from 'splitpanes'

  import { ApiStore } from '@/stores/ApiStore'
  import { GlobalStore } from '@/stores/GlobalStore'

  const mediaPane = defineAsyncComponent(() => import( '@/components/templates/MediaPane.vue'))
  const navPane  = defineAsyncComponent(() => import( '@/components/templates/NavPane.vue'))
  const EditMixtapeBox  = defineAsyncComponent(() => import( '@/components/molecules/EditBox.vue'))
  const AddFolderBox  = defineAsyncComponent(() => import( '@/components/atoms/uploaders/AddFolder.vue'))
  const OverlayBox  = defineAsyncComponent(() => import( '@/components/atoms/OverlayBox.vue'))

  const globalStore = GlobalStore()
  const { paneSize, paneSizeOffSet } = storeToRefs(globalStore)

  onMounted(() => {
    const apiStore = ApiStore()
    apiStore.initialize()
  })
</script>
