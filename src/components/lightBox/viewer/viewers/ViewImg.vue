<template>
 <div class='pdf'>
  <vue-load-image  >
    <template v-slot:image>
      <img class="lightBox-viewer" :src="modelValue.signed_url_m" :onLoad="Load()"/>
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
   methods: {
    Load () {
      const viewer = document.getElementsByClassName('lightBox-viewer');
      for(var i = 0; i < viewer.length; i++) {
        var width = viewer[i].parentElement.offsetWidth;
        console.log(width)
        if (width > 140 && width <= 1000){
          viewer[i].setAttribute('src', this.modelValue.signed_url_l);
        } else if (width > 1000) {
          viewer[i].setAttribute('src', this.modelValue.signed_url);
        } else {
          viewer[i].setAttribute('src', this.modelValue.signed_url_s);
        }
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.Load)
  }
})
</script>
