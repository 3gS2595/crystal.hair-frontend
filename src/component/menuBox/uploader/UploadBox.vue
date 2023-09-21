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
          <label>
            <input type="file" class="file-upload" @change="handleFileUpload( $event )"/>
          </label>
          <br>
          <button v-on:click="submitFile()">Submit</button>
        </div>

        <div class='drag-container-2'>
          <a
            style='border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;'
            @click='close'
            >exit</a>
        </div>

      </div>
    </vue-resizable>
  </div>
</template>

<script lang='ts'>
import type { kernalType } from '@/types/index'
import type { InputFileEvent } from '@/types/index'
import type { UploadBoxState } from '@/types/index'

import { defineComponent, PropType } from 'vue'
import axios from 'axios'
import VueResizable from 'vue-resizable'

import sessionManager from '@/store/modules/session_manager'
import { GlobalStore } from '@/store/GlobalStore'

const store = GlobalStore()
export default defineComponent({
  name: 'App',
  components: {
    VueResizable,
  },
  props: {
    viewerData: {
      type: Object as PropType<kernalType[]> ,
      required: true
    }
  },
  data(): UploadBoxState {
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
      file: null 
    }
  },
  methods: {
    handleFileUpload (event: InputFileEvent) {
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList | null = element.files;
      if (fileList && event) {
        this.file = fileList[0]
      }
    },
    submitFile(){
      if(this.file != null){
        let formData = new FormData();
        if (this.file.type.includes('pdf')) {
          formData.append('pdf', this.file)
        } else {
          formData.append('image', this.file)
        }
        formData.append('mixtape', store.mixtape)
        formData.append('file_type', this.file.type)
        axios.post( store.urlRails + 'kernals',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: sessionManager.state.auth_token
            }
          }
        ).then(function(){
          store.setUploadBoxView(false)
        })
        .catch(function(){
          console.log('FAILURE!!')
          window.confirm('failure')
        })
      }
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
      store.setUploadBoxView(false)
      window.removeEventListener('keyup', this.esc, true)
    },
  }
})

</script>
