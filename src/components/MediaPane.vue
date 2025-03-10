<template>
  <LightBox v-if='store.lightBoxView'/>

  <MediaPaneTabs/>
  <div class="tab-content-kernal">
    <ContentModule :id="1"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import ContentModule from '@/components/dataGrids/ContentModule.vue'
import LightBox from '@/components/dataViewers/LightBox.vue'
import MediaPaneTabs from '@/components/tabs/MediaPaneTabs.vue'
import { GlobalStore } from '@/stores/GlobalStore'

export default defineComponent({
  components: {
    ContentModule,
    LightBox,
    MediaPaneTabs
  },
  data () {
    return {
      store: GlobalStore()
    }
  },
  setup () {
    if(window.innerWidth < 400){
      GlobalStore().cgbWidth = 86
      GlobalStore().cgbWidthSized = 60
    }
  }
})
</script>
