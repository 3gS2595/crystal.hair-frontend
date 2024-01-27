<template>
  <div class='overlay' >
    <div class='edit-mixtape' v-click-away='close' >
      <div class="editor">
        <div class="add-mixtape-title">
          <input class="input-standard text-main-0" placeholder="enter title" v-model="title">
        </div>
        <div class='add-mixtape-options'>
          <a class='option text-main-0' @click='close'>exit</a>
          <a class='option text-main-0' @click='submitFile()'>save</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import type { EditMixtapeBoxState } from '@/assets/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import { directive } from 'vue3-click-away'

import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/services/GlobalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
const store = GlobalStore()
export default defineComponent({
  data(): EditMixtapeBoxState {
    return {
      store: GlobalStore(),
    }
  },
  setup () {
    const index = Array.prototype.findIndex.call(useMixtapeStore().mixtapes, (x) => x.id == GlobalStore().mixtape)
    const title = useMixtapeStore().mixtapes[index].name
    return { title }
  },
  methods: {
    submitFile () {
      useMixtapeStore().patchMixtape(GlobalStore().mixtape, this.title)
      store.editMixtapeBoxView = false
    },
    close () {
      store.editMixtapeBoxView = false
    }
  },
  directives: {
    ClickAway: directive
  },
})
</script>
