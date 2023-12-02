<template>
  <div v-click-away='onClickAway' class='add-mixtape'>
    <div class="uploader">
      <div class="add-mixtape-title">
        <input class="input-standard text-main-0" placeholder="enter url" v-model="url">
        <input class="input-standard text-main-0" placeholder="enter name" v-model="name">
        <input class="input-standard text-main-0" placeholder="enter scrape interval" v-model="scrapeInterval">
      </div>
    </div>

    <div class='add-mixtape-options'>
     <a class='option text-main-0' @click='close'>exit</a>
     <a class='option text-main-0' @click='submitFile()'>save</a>
    </div>
  </div>
</template>

<script lang='ts'>
import type { AddSrcUrlSubset } from '@/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import { directive } from 'vue3-click-away'

import { GlobalStore } from '@/store/GlobalStore'
import { ApiStore } from '@/store/ApiStore'

const store = GlobalStore()
export default defineComponent({
  data(): AddSrcUrlSubset {
    return {
      store: GlobalStore(),
      url: ref(""),
      name: ref(""),
      scrapeInterval: ref("")
    }
  },
  directives: {
    ClickAway: directive
  },
  methods: {
    onClickAway () {
      store.setAddSrcUrlSubset(false)
    },
    submitFile () {
      ApiStore().addSrcUrlSubset(this.url, this.name, this.scrapeInterval)
      store.setAddSrcUrlSubset(false)
    },
    close () {
      store.setAddSrcUrlSubset(false)
    }
  }
})
</script>
