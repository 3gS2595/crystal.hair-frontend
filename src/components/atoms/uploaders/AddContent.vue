<template>
  <div class="upload-box">
    <div class="block">
      <div class="uploader">
        <EditorContent :editor="editor" id="textEditor" />
        <label id="fileSelect">
          <button
            class="customFileInput file-upload input-standard text-main-0"
            @click.prevent="triggerFileInput"
          >
            upload
          </button>
          <input
            type="file"
            id="getFile"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
          />
        </label>
      </div>
      <div class="drag-container-1">
        <a class="option text-main-0 edit-opt" @click="close">exit</a>
        <a class="option text-main-0 edit-opt" @click="submitFile">submit</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { InputFileEvent } from '@/types/index'

  import { ref, onMounted, onBeforeUnmount, inject } from 'vue'

  import StarterKit from '@tiptap/starter-kit'
  import { Editor, EditorContent } from '@tiptap/vue-3'

  import { GlobalStore } from '@/stores/GlobalStore'
  import { useKernalStore } from '@/stores/api/KernalStore'

  // Refs and reactive state
  const file = ref<File | null>(null)
  const editor = ref<Editor | null>(null)
  const enteredText = ref('')
  const editorEmpty = ref(true)
  const fileInput = ref<HTMLInputElement | null>(null)
  const toggle_upload = inject('toggle_upload')

  function triggerFileInput() {
    fileInput.value?.click()
  }

  function handleFileUpload(event: InputFileEvent) {
    const element = event.currentTarget as HTMLInputElement
    const fileList = element.files
    if (fileList && fileList.length > 0) {
      file.value = fileList[0]
    }
    submitFile()
  }

  async function submitFile() {
    if (!editor.value) return

    editorEmpty.value = false
    const formData = new FormData()

    if (file.value != null) {
      formData.append('file_type', file.value.type)
      if (file.value.type.includes('pdf')) {
        formData.append('pdf', file.value)
        formData.set('file_type', '.pdf')
      } else {
        formData.append('image', file.value)
      }
    }

    if (GlobalStore().mixtape !== '') {
      formData.append('mixtape', GlobalStore().mixtape)
    }

    if (editor.value.getHTML() !== '<p></p>') {
      const text = editor.value.view.dom.innerText
      if (
        text.match(/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm) &&
        !text.includes(' ')
      ) {
        formData.append('url', text)
        formData.append('file_type', 'link')
      } else {
        formData.append('text', text)
        formData.append('file_type', '.txt')
      }
    }

    if (formData.has('file_type')) {
      GlobalStore().uploadBoxView = false
      useKernalStore().addKernal(formData)
    }
  }

  function esc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close()
    }
  }

  function close() {
    toggle_upload.value = false
    window.removeEventListener('keyup', esc, true)
  }

  onMounted(() => {
    window.addEventListener('keyup', esc, true)
    editor.value = new Editor({
      extensions: [StarterKit],
      content: enteredText.value.split('\n').join('<br />'),
      onUpdate: () => {
        if (!editor.value) return
        editorEmpty.value = editor.value.getHTML() !== '<p></p>'
      },
    })
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })
</script>
