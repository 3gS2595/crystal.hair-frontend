<template>
  <div class="pane-nav-body">
    <div class="pane-nav-header">
      <input
        id="global-search-input"
        class="input-standard text-main-0"
        v-model="q"
        placeholder="search"
        @keyup.enter="search(q)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { GlobalStore } from '@/stores/GlobalStore'
  const store = GlobalStore()
  const q = ref('')
  function search(e: string) {
    store.filter = e
    q.value = ''
  }
</script>
