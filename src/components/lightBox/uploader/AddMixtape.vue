<template>
  <div class ='lightbox'>
    <vue-resizable
      class='resizable'
      ref='resizableComponent'
      :dragSelector='dragSelector'
      :fit-parent='true'
      :max-width='maxW'
      :max-height='maxH'
      :width='width'
      :height='height'
      :left='left'
      :top='top'
      @mount='res'
      @resize:move='eHandler'
      @resize:start='eHandler'
      @resize:end='eHandler'
      @drag:move='eHandler'
      @drag:start='eHandler'
      @drag:end='eHandler'
    >
      <div class='block'>
        <div class="uploader">
          <div class="txt">
            <input class="input-standard" placeholder="enter title" v-model="title">
          </div>
        </div>

        <div class='drag-container-1'>
         <a class='navItem' @click='close'>exit</a>
         <a class='navItem' @click='submitFile()'>save</a>
        </div>

      </div>
    </vue-resizable>
  </div>
</template>

<script lang='ts'>
import type { InputFileEvent } from '@/types/index'
import type { AddMixtapeBoxState } from '@/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import axios from 'axios'
import VueResizable from 'vue-resizable'

import { GlobalStore } from '@/store/GlobalStore'
import { ApiStore } from '@/store/ApiStore'
import { SessionStore } from '@/store/SessionStore'

const sessionStore = SessionStore()
const store = GlobalStore()
export default defineComponent({
  name: 'App',
  components: {
    VueResizable,
  },
  data(): AddMixtapeBoxState {
    return {
      left: 4,
      top: 144,
      height: 55,
      width: 204,
      maxW: window.innerWidth,
      maxH: window.innerHeight,
      dragSelector: '.drag-container-1, .drag-container-2',
      index: 9,
      store: GlobalStore(),
      sessionStore: SessionStore(),
      title: ref("")
    }
  },
  methods: {
    submitFile(){
      ApiStore().addMixtape(this.title)
      store.setAddMixtapeBoxView(false)
    },
    eHandler () {
      this.maxW = window.innerWidth
      this.maxH = window.innerHeight
    },
    res () {
      window.addEventListener('keyup', this.esc, true)
    },
    esc (e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.close()
      }
    },
    close () {
      store.setAddMixtapeBoxView(false)
      window.removeEventListener('keyup', this.esc, true)
    }
  },
})

</script>
