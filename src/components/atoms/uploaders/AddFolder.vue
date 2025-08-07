<template>
    <div class="edit-mixtape" v-click-away="close">
      <div class="add-mixtape-title">
        <a class="input-name text-main-0 edit-opt">folder:</a>
        <input class="input-standard text-main-0 edit-opt" placeholder="null" v-model="title" />
      </div>
      <div class="add-mixtape-options">
        <a class="option text-main-0 edit-opt" @click="close">exit</a>
        <a class="option text-main-0 edit-opt" @click="submitFile()">save</a>
      </div>
    </div>
</template>

<script lang="ts">
  import type { AddFolderBoxState } from '@/types/index'

  import { defineComponent, type PropType, ref } from 'vue'
  import { directive } from 'vue3-click-away'

  import { GlobalStore } from '@/stores/GlobalStore'
  import { useFolderStore } from '@/stores/api/FolderStore'

  const store = GlobalStore()
  export default defineComponent({
    data(): AddFolderBoxState {
      return {
        store: GlobalStore(),
        title: ref(''),
      }
    },
    methods: {
      submitFile() {
        useFolderStore().addFolder(this.title)
        close()
      },
      esc(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          this.close()
        }
      },
      close() {
        store.addFolderBoxView = false
        window.removeEventListener('keyup', this.esc, true)
      },
    },
    mounted() {
      window.addEventListener('keyup', this.esc, true)
    },
  })
</script>
