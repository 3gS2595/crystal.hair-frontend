
<template>
 <Suspense>
   <template #default>
     <div class="home">
       <div ref="can" id="can"><TheCanvas /></div>
      <TableModule data="second"/>
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
