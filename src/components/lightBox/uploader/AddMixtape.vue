<template>
  <div class ='lightbox'>
    <vue-resizable
      class='resizable'
      ref='resizableComponent'
      :dragSelector='dragSelector'
      :active='handlers'
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
            <input v-model="title">
          </div>
        </div>

        <div class='drag-container-1'>
         <a class='navItem' @click='close'>exit</a>
         <a class='navItem' @click='submitFile()'>submit</a>
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
      handlers: ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'],
      left: 50,
      top: 50,
      height: 200,
      width: 200,
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
    orientationChange () {
      const orientation = window.orientation

      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        if (orientation === 0) {
          this.width = window.innerWidth
          this.height = window.innerHeight - 300
          this.left = 0
          this.top = 40
        } else if (orientation === 90 || orientation === -90) {
          this.width = window.innerWidth - 124
          this.height = window.innerHeight - 17
          this.left = 40
          this.top = 0
          }
        } else {
          this.width = window.innerWidth - 63
          this.height = window.innerHeight - 180
          this.left = 30
          this.top = 30
      }
    },
    res () {
      window.addEventListener('resize', this.orientationChange)
      window.addEventListener('orientationchange', this.orientationChange)
      window.addEventListener('keyup', this.esc, true)

      const identifiers = ['rb', 'rt', 'rl', 'rr']
      for (const id of identifiers) {
        const rb = document.createElement('img')
        rb.src = id + '.png'
        rb.id = id
        document.getElementsByClassName('resizable-' + id.charAt(id.length - 1))[0].appendChild(rb)
      }
      this.orientationChange()
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
