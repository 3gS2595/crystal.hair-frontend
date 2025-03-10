<template>
  <div class ='upload-box'>
    <div class='block'>
      <div class="uploader">
        <editor-content :editor="editor" id="textEditor" />
        <label id="fileSelect">
            <button class="customFileInput file-upload input-standard text-main-0" onclick="document.getElementById('getFile').click()">upload</button>
            <input type='file' id="getFile" style="display:none" @change="handleFileUpload( $event )">
        </label>
      </div>
      <div class='drag-container-1'>
       <a class='option text-main-0 edit-opt' @click='close'>exit</a>
       <a class='option text-main-0 edit-opt' @click='submitFile()'>submit</a>
      </div>

    </div>
  </div>
</template>

<script lang='ts'>
import type { kernalType } from '@/types/ApiTypes'
import type { InputFileEvent } from '@/types/index'
import type { UploadKernalState } from '@/types/index'

import { defineComponent, type PropType, ref } from 'vue'
import axios from 'axios'

import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

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
  data(): UploadKernalState {
    return {
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
      if(GlobalStore().mixtape !== ''){
        formData.append('mixtape', GlobalStore().mixtape)
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
        GlobalStore().uploadBoxView = false
        useKernalStore().addKernal(formData)
      }
    },
    esc (e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.close()
      }
    },
    close () {
      GlobalStore().uploadBoxView = false
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
