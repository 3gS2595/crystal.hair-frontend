<template>
 <Suspense>

  <template #default>
    <div class="home">
      <TheCanvas />
      <div class="lg">
        <TableModule id="0" :size="20" :apiAccess="['rsses', 'date', 'title', 'url']"/>
      </div>
      <div class="sm">
        <div class='smSub'><TableModule id="0" :size="10" :apiAccess="['sites', 'count', 'site']"/></div>
        <div class='smSub'><TableModule id="2" :size="10" :apiAccess="['names', 'count', 'name']"/></div>
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
</script>
