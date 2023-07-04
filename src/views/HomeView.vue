<template>
 <Suspense>

  <template #default>
    <div class="home">

      <!-- three main -->
      <TheCanvas :imageData="siteImages"/>

      <!-- rss main   -->
      <div class="lg">
        <TableModule id="0" :size="25" :contentData="rss"
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

    </div>
   </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableModule from '@/table/TableModule.vue' // @ is an alias to /src
import TheCanvas from '@/components/ThreeCanvas.vue'
export default defineComponent({
  name: 'HomeView',
  components: {
    TableModule,
    TheCanvas
  }
})
</script >

<script setup lang="ts">
import { ApiStore } from '../store/ApiStore' // eslint-disable-line
import { storeToRefs } from 'pinia' // eslint-disable-line
const store = ApiStore()

const { rss, sites, names, siteImages } = storeToRefs(ApiStore())
</script>
