<template>
 <Suspense>

  <template #default>
    <Splitter  class="mb-5" style="height:calc(100vh - 18px)!important; margin:0px!important;">
      <SplitterPanel class="pane" :size="40">

        <Splitter style="width:3px!important;"  layout="vertical">
          <SplitterPanel style="max-height:110px;">
            <ThreeMain :imageData="siteImages"/>
          </SplitterPanel>
          <SplitterPanel :size="65" style="overflow:scroll;">
            <div class='lg'>
              <TableModule id="0" :size="10" :contentData="rss"
                :tableOrder="['date', 'title', 'url']"
              />
            </div>
          </SplitterPanel>
          <SplitterPanel :size="35" style="overflow:scroll;" >
            <div class="sm">

              <Splitter  class="mb-5" style=" margin:0px!important;">
                <SplitterPanel class="pane" :size="50" style="overflow:scroll;">

                <div class="subt">
                  <TableModule id="0" :size="10" :contentData="sites"
                    :tableOrder="['sites', 'count', 'site']"
                  />
                  </div>
                </SplitterPanel>

                <SplitterPanel class="pane" :size="50" style="overflow-x:scroll;">
                <div class="subt">
                  <TableModule id="2" :size="10" :contentData="names"
                    :tableOrder="['names', 'count', 'name', 'urls']"
                  />
                  </div>
                </SplitterPanel>
              </Splitter>

            </div>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>

      <SplitterPanel :size="65">
        <ContentModule :contentData="siteImages"/>
      </SplitterPanel>

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
    SplitterPanel,
    ContentModule,
    ThreeMain
  }
})
</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const store = ApiStore()

const { rss, sites, names, siteImages } = storeToRefs(ApiStore())
</script>
