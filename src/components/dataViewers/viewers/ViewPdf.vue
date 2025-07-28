<template>
  <div class="pdf">
    <VuePdfApp :config="config" theme="dark" :pdf="modelValue" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, defineProps } from 'vue'
import "vue3-pdf-app/dist/icons/main.css"
import VuePdfApp from "vue3-pdf-app"

const props = defineProps<{ modelValue: any }>()

const config = reactive({
  toolbar: false,
  EventBus: false,
  sidebar: false,
})
</script>

<style>
  /* for dark theme */
  .pdf-app.dark {
    --pdf-toolbar-color: black;
    --pdf-app-background-color: black;
    --pdf-loading-bar-color: rgba(194, 194, 73, 0.973);
  }
  /* for light theme */
  .pdf-app.light {
    --pdf-toolbar-color: white;
  }
</style>

