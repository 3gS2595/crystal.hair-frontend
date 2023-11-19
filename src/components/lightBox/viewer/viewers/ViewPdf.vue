<template>
 <div class='pdf'>
  <VuePdfApp :config="config" theme="dark" :pdf="modelValue" />
 </div>
</template>

<script lang='ts'>
import { ref, defineComponent, type PropType } from 'vue'
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

export default defineComponent({
  name: 'App',
  components: {
    VuePdfApp
  },
  props: ['modelValue'],
  data () {
    return {
      config: {
        toolbar: false
      }
    }
  }
})
</script>
<style>
  /* for dark theme */
  .pdf-app.dark {
    --pdf-toolbar-color: black;
    --pdf-app-background-color:black;
    --pdf-loading-bar-color:rgba(194, 194, 73, 0.973);
  }
  /* for light theme */
  .pdf-app.light {
    --pdf-toolbar-color: white;
  }
</style>
