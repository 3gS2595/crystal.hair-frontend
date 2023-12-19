<template>
  <div v-click-away='onClickAway' class='add-mixtape'>
    <div class="uploader">
      <div class="add-mixtape-title">
        <input class="input-standard text-main-0" placeholder="enter title" v-model="title">
      </div>
    </div>

    <div class='add-mixtape-options'>
     <a class='option text-main-0' @click='close'>exit</a>
     <a class='option text-main-0' @click='submitFile()'>save</a>
    </div>
  </div>
</template>

<script lang='ts'>
import type { AddMixtapeBoxState } from '@/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import { directive } from 'vue3-click-away'

import { GlobalStore } from '@/store/GlobalStore'
import { useMixtapeStore } from '@/store/api/MixtapeStore'

const store = GlobalStore()
export default defineComponent({
  data(): AddMixtapeBoxState {
    return {
      store: GlobalStore(),
      title: ref("")
    }
  },
  directives: {
    ClickAway: directive
  },
  methods: {
    onClickAway () {
      store.setAddMixtapeBoxView(false)
    },
    submitFile () {
      useMixtapeStore().addMixtape(this.title)
      store.setAddMixtapeBoxView(false)
    },
    close () {
      store.setAddMixtapeBoxView(false)
    }
  }
})
</script>
