<template>
 <div class='pdf'>
  <vue-load-image  >
    <template v-slot:image>
      <img :src="modelValue" @load="handleLoad"/>
    </template>
    <template v-slot:preloader>
      <img src="image-loader.gif" rel='preload'/>
    </template>
    <template v-slot:error>
      <a>{{ viewerData[store.lightBoxIndex].description }}</a>
    </template>
  </vue-load-image>
 </div>
</template>

<script lang='ts'>
import { ref, defineComponent, type PropType } from 'vue'
import VueLoadImage from 'vue-load-image'

export default defineComponent({
  name: 'App',
  components: {
    VueLoadImage
  },
  props: ['modelValue'],
  setup (props) {
    console.log(props)
  }
})
</script>
