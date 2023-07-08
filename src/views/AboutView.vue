<template>
 <Suspense>

  <template #default>

<Splitter style="height: calc(100vh - 18px);" class="mb-5">
    <SplitterPanel class="flex ">
<Splitter style="height: 300px" layout="vertical">
    <SplitterPanel class="flex align-items-center justify-content-center">
<div class="lg">
          <TableModule id="0" :size="10" :contentData="rss"
            :tableOrder="['date', 'title', 'url']"
          />
        </div>

    </SplitterPanel>
    <SplitterPanel class="flex align-items-center justify-content-center">
         asdf

    </SplitterPanel>
</Splitter>

        </SplitterPanel>
    <SplitterPanel class="flex align-items-center justify-content-center"> Panel 2 </SplitterPanel>
</Splitter>
   </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableModule from '@/component/table/TableModule.vue' // @ is an alias to /src
import ThreeMain from '@/component/three/ThreeMain.vue'
import ThreeModule from '@/component/three/ThreeModule.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
export default defineComponent({
  name: 'HomeView',
  components: {
    TableModule,
    Splitter,
    SplitterPanel
  }
})
</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const store = ApiStore()

const { rss, sites, names, siteImages } = storeToRefs(ApiStore())
</script>
