<template>
  <div class='contentMain' id="contentMain">
    <splitpanes class="default-theme"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >
      <pane id="main-l" :size="paneSize + paneSizeOffSet">
        <navPane/>
      </pane>
      <pane id="main-r" :size="100 - (paneSize + paneSizeOffSet)">
        <mediaPane/>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'

import { storeToRefs } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { GlobalStore } from '@/services/GlobalStore'

import { resizeContentFit } from '@/lib/ResizeContentGrid'
import mediaPane from '@/components/MediaPane.vue'
import navPane from '@/components/NavPane.vue'

export default defineComponent({
  components: {
    mediaPane,
    navPane,
    Splitpanes,
    Pane
  },
  methods: {
    resizeContentFit
  },
  setup () {
    const { paneSize, paneSizeOffSet } = storeToRefs(GlobalStore());
    return { paneSize, paneSizeOffSet }
  },
  mounted () {
    ApiStore().initialize()
  }
})
</script>
