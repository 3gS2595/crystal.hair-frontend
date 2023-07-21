<template>
 <Suspense>

  <template #default>
    <div id="contentMain" v-if='loaded'>
      <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: calc(100dvh - 18px); width:100dvw;">
        <pane :size="36">
          <splitpanes :horizontal="true">
              <pane style="min-height: 110px; max-height: 110px;">
                <ThreeMain :imageData="hypertexts"/>
              </pane>
              <pane :size="50">
                <TableModule id="0" :contentData="hypertexts" :tableOrder="['name', 'time_posted', 'url']"/>
              </pane>
              <pane :size="50">
                <splitpanes class="default-theme" :vertical="true">
                  <pane >
                    <TableModule id="2" :contentData="sourceUrls" :tableOrder="[ 'count', 'name', 'urls']" />
                  </pane>
                  <pane >
                    <TableModule id="2" :contentData="sourceUrls" :tableOrder="[ 'count', 'name', 'urls']" />
                  </pane>
                </splitpanes>
              </pane>
          </splitpanes>
        </pane>

        <pane :size="32">
          <ContentModule :contentData="kernals"/>
        </pane>
      </splitpanes>

    </div>
    <div v-else><a>loading</a></div>
  </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'

import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import TableModule from '@/component/table/TableModule.vue'
import ThreeMain from '@/component/three/ThreeMain.vue'
import ContentModule from '@/component/content/ContentModule.vue'
import 'splitpanes/dist/splitpanes.css'

const loaded = ref(false)
export default defineComponent({
  components: {
    TableModule,
    ContentModule,
    ThreeMain,
    Splitpanes,
    Pane
  },
  mounted () {
    if (ApiStore().sourceUrls.length === 0) {
      const userToken = ApiStore().initialize()
      userToken.then(function (data) {
        console.log(data)
        loaded.value = true
      })
    }
  },
  setup () {
    const state = reactive({
      paneSize: 50
    })
    return {
      ...toRefs(state)
    }
  }
})

</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line

const { hypertexts, kernals, linkContents, sourceUrls } = storeToRefs(ApiStore())
</script>
