<template>
 <div class='add-overlay' >
    <div class='add-mixtape' v-click-away='close' >
      <div class="uploader">
        <div class="add-mixtape-title">
          <input class="input-standard text-main-0" placeholder="enter url" v-model="url">
          <input class="input-standard text-main-0" placeholder="enter name" v-model="name">
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
      url: ref(""),
      name: ref("")
    }
  },
  directives: {
    ClickAway: directive
  },
  methods: {
    submitFile () {
      useSrcUrlSubsetStore().addSrcUrlSubset(this.url, this.name)
      close()
    },
    close () {
      store.addSrcUrlSubset = false
    }
  }
})
</script>
