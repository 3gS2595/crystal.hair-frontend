<template>
 <Suspense>

  <template #default>
    <div class="home">
      <div class="data">
        <!-- three main -->
        <ThreeMain :imageData="siteImages"/>

        <!-- rss main   -->
        <div class="lg">
          <TableModule id="0" :size="200" :contentData="rss"
            :tableOrder="['date', 'title', 'url']"
          />
        </div>

        <!-- rss sub components -->
        <div class="sm">
          <div class='smSub'>
            <TableModule id="0" :size="10" :contentData="sites"
              :tableOrder="['sites', 'count', 'site']"
            />
          </div>
          <div class='smSub'>
            <TableModule id="2" :size="10" :contentData="names"
              :tableOrder="['names', 'count', 'name', 'urls']"
            />
          </div>
        </div>

<!--
        <div class="threeModule" style="width: 200px; height:200px;">
          <ThreeModule :imageData="['/img/halycon.png']" :size="['200', '200']"/>
        </div>
-->

      </div>
      <div class="content">
        <ContentModule :contentData="siteImages"/>
      </div>
    </div>
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
export default defineComponent({
  name: 'HomeView',
  components: {
    TableModule,
    ThreeMain,
    ContentModule
  }
})
window.open('http://192.168.1.180:8080/#/', '_blank', 'toolbar=0,location=0,menubar=0');
</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const store = ApiStore()

const { rss, sites, names, siteImages } = storeToRefs(ApiStore())
</script>
