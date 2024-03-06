<template>
 <div class='pdf'>
  <vue-load-image  >
    <template v-slot:image>
      <img class="lightBox-viewer" :src="modelValue.signed_url_m" :onLoad="srcSetResize()"/>
    </template>
    <template v-slot:preloader>
      <img src="https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/image-loader%20(1).gif" rel='preload'/>
    </template>
    <template v-slot:error>
      <a>{{ viewerData[GlobalStore().lightBoxIndex].description }}</a>
    </template>
  </vue-load-image>
 </div>
</template>

<script lang='ts'>
import { ref, defineComponent, type PropType } from 'vue'
import VueLoadImage from 'vue-load-image'
import { GlobalStore } from '@/stores/GlobalStore'

export default defineComponent({
  name: 'App',
  components: {
    VueLoadImage
  },
  props: ['modelValue'],
  mounted () {
    window.addEventListener('resize', this.srcSetResize)
  },
  methods: {
    srcSetResize () {
      const viewer = document.getElementsByClassName('lightBox-viewer');
      if (viewer[0] !== undefined && viewer[0].parentElement !== null) {
        const width = viewer[0].parentElement.offsetWidth
        for(let i = 0; i < viewer.length; i++) {
          if (width > 140 && width <= 1000){
            viewer[i].setAttribute('src', this.modelValue.signed_url_l);
          } else if (width > 1000) {
            viewer[i].setAttribute('src', this.modelValue.signed_url);
          } else {
            viewer[i].setAttribute('src', this.modelValue.signed_url_s);
          }
        }
      }
    }
  }
})
</script>
