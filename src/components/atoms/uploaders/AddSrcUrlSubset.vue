<template>
  <div class="edit-mixtape" v-click-away="close">
    <div class="add-mixtape-title">
      <a class="input-name text-main-0 edit-opt">url:</a>
      <input class="input-standard text-main-0 edit-opt" placeholder="null" v-model="url" />
    </div>
    <div class="add-mixtape-options">
      <a class="option text-main-0 edit-opt" @click="close">exit</a>
      <a class="option text-main-0 edit-opt" @click="submitFile">save</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import { directive as clickAway } from 'vue3-click-away'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

const url = ref('')
const srcUrlSubsetStore = useSrcUrlSubsetStore()
const overlay_add_src = inject('overlay_add_src')
console.log("??????")

function close() {
  overlay_add_src.value = false
  window.removeEventListener('keyup', escHandler, true)
}

function submitFile() {
  srcUrlSubsetStore.addSrcUrlSubset(url.value)
  close()
}

function escHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keyup', escHandler, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', escHandler, true)
})
</script>

<script lang="ts">
export default {
  directives: {
    clickAway,
  },
}
</script>

