<template>
  <div class ='upload-box'>
    <div class='block'>
      <div class="uploader">
        <div class="txt">
          <editor-content :editor="editor" id="textEditor" />
        </div>
        <label id="fileSelect">
          <input v-show="editorEmpty" type="file" class="file-upload input-standard text-main-0" @change="handleFileUpload( $event )"/>
        </label>
      </div>

      <div class='drag-container-1'>
       <a class='navItem' @click='close'>exit</a>
       <a class='navItem' @click='submitFile()'>submit</a>
      </div>

    </div>
  </div>
</template>

<script lang='ts'>
import type { kernalType } from '@/assets/types/ApiTypes'
import type { InputFileEvent } from '@/assets/types/index'
import type { UploadBoxState } from '@/assets/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import axios from 'axios'

import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import { GlobalStore } from '@/services/GlobalStore'
import { useKernalStore } from '@/services/api/KernalStore'

const store = GlobalStore()
export default defineComponent({
  name: 'App',
  components: {
    EditorContent
  },
  props: {
    viewerData: {
      type: Object as PropType<kernalType[]> ,
      required: true
    }
  },
  data(): UploadBoxState {
    return {
      store: GlobalStore(),
      file: null,
      editor: null,
      enteredText: ref(''),
      editorEmpty: true
    }
  },
  methods: {
    handleFileUpload (event: InputFileEvent) {
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList | null = element.files;
      if (fileList && event) {
        this.file = fileList[0]
      }
      this.submitFile()
    },
    async submitFile(){
      console.log(this.editor.view.dom.innerText)
      this.editorEmpty = false
      let formData = new FormData();
      if(this.file != null){
        formData.append('file_type', this.file.type)
        if (this.file.type.includes('pdf')) {
          formData.append('pdf', this.file)
          formData.set('file_type','.pdf');
        } else {
          formData.append('image', this.file)
        }
      }
      if(store.mixtape !== ''){
        formData.append('mixtape', store.mixtape)
      }
      if(this.editor.getHTML() !== "<p></p>"){
        if(this.editor.view.dom.innerText.match(/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm) && !this.editor.view.dom.innerText.includes(' ')){
          console.log("winner")
          formData.append('url', this.editor.view.dom.innerText)
          formData.append('file_type', 'link')
        } else {
          formData.append('text', this.editor.view.dom.innerText)
          formData.append('file_type', '.txt')
        }
      }
      if(formData.has("file_type")){
        store.setUploadBoxView(false)
        useKernalStore().addKernal(formData)
      }
    },
    esc (e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.close()
      }
    },
    close () {
      store.setUploadBoxView(false)
      window.removeEventListener('keyup', this.esc, true)
    }
  },
  mounted() {
    window.addEventListener('keyup', this.esc, true)
    this.editor = new Editor({
      extensions: [
        StarterKit
      ],
      content: this.enteredText.split("\n").join("<br />"),
      onUpdate: () => {
        this.editorEmpty = (this.editor.getHTML() !== "<p></p>") ? false : true
      }
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  }
})

</script>
