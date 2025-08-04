<template>
  <div class="overlay">
    <div class="edit-mixtape" v-click-away="close">
      <div class="add-mixtape-title">
        <a class="input-name text-main-0 edit-opt">url:</a>
        <input class="input-standard text-main-0 edit-opt" placeholder="null" v-model="url" />
      </div>
      <div class="add-mixtape-options">
        <a class="option text-main-0 edit-opt" @click="close">exit</a>
        <a class="option text-main-0 edit-opt" @click="submitFile()">save</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AddSrcUrlSubset } from '@/types/index'

  import { defineComponent, type PropType, ref } from 'vue'
  import { directive } from 'vue3-click-away'

  import { GlobalStore } from '@/stores/GlobalStore'
  import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'

  const store = GlobalStore()
  export default defineComponent({
    data(): AddSrcUrlSubset {
      return {
        store: GlobalStore(),
        url: ref(''),
      }
    },
    directives: {
      ClickAway: directive,
    },
    methods: {
      submitFile() {
        useSrcUrlSubsetStore().addSrcUrlSubset(this.url)
        close()
      },
      esc(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          this.close()
        }
      },
      close() {
        store.addSrcUrlSubset = false
        window.removeEventListener('keyup', this.esc, true)
      },
    },
    mounted() {
      window.addEventListener('keyup', this.esc, true)
    },
  })
</script>
