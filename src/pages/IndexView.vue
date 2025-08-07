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
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Splitpanes, Pane } from 'splitpanes'

  import { ApiStore } from '@/stores/ApiStore'
  import { GlobalStore } from '@/stores/GlobalStore'

  import mediaPane from '@/components/templates/MediaPane.vue'
  import navPane from '@/components/templates/NavPane.vue'
  import EditMixtapeBox from '@/components/molecules/EditBox.vue'
  import AddFolderBox from '@/components/atoms/uploaders/AddFolder.vue'
  import OverlayBox from '@/components/atoms/OverlayBox.vue'

  const globalStore = GlobalStore()
  const { paneSize, paneSizeOffSet } = storeToRefs(globalStore)

  onMounted(() => {
    const apiStore = ApiStore()
    apiStore.initialize()
  })
</script>
