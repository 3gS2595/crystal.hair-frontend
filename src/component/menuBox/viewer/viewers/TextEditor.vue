<template>
  <div class="txt">
    <editor-content :editor="editor" id="textEditor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import HardBreak from '@tiptap/extension-hard-break'

export default defineComponent({
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  data() : {
    editor: any
    } { return {
      editor: null
    }
  },

  watch: {
    modelValue(value: string) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        HardBreak
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      }
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  }
})
</script>
