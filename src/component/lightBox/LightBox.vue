<template>
  <draggable-resizable-vue
    class="test"
    v-model:x="element.x"
    v-model:y="element.y"
    v-model:h="element.height"
    v-model:w="element.width"
    v-model:active="element.isActive"
    parent="#contentMain"
    :z="2"
    drag-handle=".handle"
  >
    <div class="handle">drag here</div>
    <ImgApi/> 
   </draggable-resizable-vue>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DraggableResizableVue from 'draggable-resizable-vue3'
const element = ref({
  x: 20,
  y: 20,
  width: 200,
  height: 200,
  isActive: false,
})
</script>

<script lang="ts">

import ImageApi from '@/component/lightBox/ImageApi'
import { ref } from 'vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    ImageApi
  }
})
</script>

<style>
.handle {
  border: 1px solid white;
  padding: 6px;
}
</style>

