<template>
 <Suspense>

  <template #default>
    <div v-if='loaded'>

      <Splitter  class="mb-5" style="height:calc(100vh - 18px)!important; margin:0px!important;">
        <SplitterPanel class="pane" :size="85">

          <Splitter style="width:3px!important;"  layout="vertical">

            <SplitterPanel style="max-height:110px;">
              <ThreeMain :imageData="sourceUrls"/>
            </SplitterPanel>

            <SplitterPanel :size="65" style="overflow:auto;">
              <div class='lg'>
                <TableModule id="0" :contentData="linkContents"
                  :tableOrder="['name', 'updated_at', 'url']"
                />
              </div>
            </SplitterPanel>

            <SplitterPanel :size="35" style="overflow:auto;" >

              <div class="sm">
                <Splitter  class="mb-5" style="height:100%; margin:0px!important;" >

                  <SplitterPanel class="pane" :size="50" style="overflow:auto;">
                  <button @click='logoutUser' class='logout-button' >logout</button>
                  <div class="subt">
                    <TableModule id="0" :contentData="sites"
                      :tableOrder="['count', 'site']"
                    />
                    </div>
                  </SplitterPanel>

                  <SplitterPanel class="pane" :size="15" style="overflow:auto;">
                  <div class="subt">
                    <TableModule id="2" :contentData="names"
                      :tableOrder="[ 'count', 'name', 'urls']"
                    />
                    </div>
                  </SplitterPanel>

                </Splitter>
              </div>

            </SplitterPanel>
          </Splitter>
        </SplitterPanel>

        <SplitterPanel :size="50">
          <ContentModule :contentData="kernals"/>
        </SplitterPanel>

      </Splitter>

    </div>
    <div v-else><a>loading</a></div>
  </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { mapActions, mapGetters } from 'vuex'

import '@/store/index.ts'
import { ApiStore } from '../store/ApiStore' // eslint-disable-line

import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'

const loaded = ref(false)
export default defineComponent({
  name: 'HomeView',
  components: {
    TableModule,
    Splitter,
    SplitterPanel,
    ContentModule,
    ThreeMain
  },
  methods: {
    ...mapActions(['logoutUser'])
  },
  mounted () {
    if (ApiStore().sourceUrls.length === 0) {
      const userToken = ApiStore().initialize()
      userToken.then(function (data) {
        console.log(data)
        loaded.value = true
      })
    }
  }
})

</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line

const { hypertexts, kernals, linkContents, sourceUrls } = storeToRefs(ApiStore())
</script>
