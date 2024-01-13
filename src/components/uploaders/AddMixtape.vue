<template>
  <div class='add-overlay' >
    <div class='add-mixtape' v-click-away='onClickAway' >
      <div class="uploader">
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
import type { AddMixtapeBoxState } from '@/assets/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import { directive } from 'vue3-click-away'

import { GlobalStore } from '@/services/GlobalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'

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
