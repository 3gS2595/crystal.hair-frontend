<template>
  <div class='contentMain' id="contentMain" @drop.prevent="dragInFile" @dragenter.prevent @dragover.prevent>

    <splitpanes class="default-theme"
      style="width=100%"
      @ready="resizeContentFit()"
      @resize="paneSize = $event[0].size; "
      @resized="resizeContentFit()"
    >

  <!-- NAVIGATION PANE-->
      <pane id="main-l" :size="paneSize + paneSizeOffSet">
        <navPane/>
      </pane>

  <!-- CONTENT PANE -->
      <pane id="main-r" @paste.prevent="pasteInFile()" :size="100 - (paneSize + paneSizeOffSet)">
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

import { darkToggle, darkSet } from '@/lib/DarkMode'
import { resize, resizeContentFit } from '@/lib/ResizeContentGrid'
import { dragInFile, pasteInFile } from '@/lib/UploadKernal'
import mediaPane from '@/components/MediaPane.vue'
import navPane from '@/components/NavPane.vue'

export default defineComponent({
  components: {
    Splitpanes,
    Pane,
    mediaPane,
    navPane
  },

// Page Lifecycle hooks
  setup () {
    if(window.innerWidth < 400){
      GlobalStore().cgbWidth = 86
      GlobalStore().cgbWidthSized = 60
    }
    const { paneSizeTemp, paneSize, paneSizeOffSet } = storeToRefs(GlobalStore());
    return { paneSizeTemp, paneSize, paneSizeOffSet }
  },
  mounted () {
    ApiStore().initialize()
    window.addEventListener('paste', this.pasteInFile)
  },
  unmounted () {
    window.removeEventListener('paste', this.pasteInFile, true)
  },

// Page Methods
  methods: {
    pasteInFile,
    dragInFile,
    resizeContentFit
  }
})
</script>
