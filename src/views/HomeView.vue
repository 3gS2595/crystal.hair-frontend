<template>
  <div class="home">
    <TableModule/>
    <TheCanvas/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableModule from '@/components/TableModule.vue' // @ is an alias to /src
import TheCanvas from '@/components/ThreeCanvas.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    TableModule,
    TheCanvas
  }
})
</script>
