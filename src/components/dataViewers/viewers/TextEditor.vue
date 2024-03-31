<template>
    <a v-if='save' id="savekernal" @click='saveKernal()'>save</a>
  <div class="txt">
    <editor-content :editor="editor" id="textEditor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { kernalType } from '@/types/ApiTypes'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { useKernalStore } from '@/stores/api/KernalStore'

export default defineComponent({
  components: {
    EditorContent,
  },
  props: ['modelValue'],
  data() : {
    save: boolean,
    editor: any
    } { return {
      save: false,
      editor: null
    }
  },
  watch: {
    modelValue(value: any) {
      value.description = value.description.split("\n").join("<br />")
      const isSame = this.editor.getHTML() === value.description
      if (!isSame) this.editor.commands.setContent(value.description, false)
    }
  },
  methods: {
    saveKernal() {
      useKernalStore().patchKernalDescr(this.modelValue.id, this.editor.view.dom.innerText)
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
      ],
      content: this.modelValue.description.split("\n").join("<br />"),
      onUpdate: () => {
        console.log(this.editor.view.dom.innerText)
        console.log(this.modelValue.description)
        console.log(this.editor.view.dom.innerText != this.modelValue.description)
        if( this.editor.view.dom.innerText != this.modelValue.description){
          this.save = true
        }
        this.$emit('update:modelValue.description', this.editor.getHTML())
      }
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  }
})
</script>
