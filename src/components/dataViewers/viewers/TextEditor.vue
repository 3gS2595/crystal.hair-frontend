<template>
  <a v-if="save" id="savekernal" @click="saveKernal()">save</a>
  <div class="txt">
    <EditorContent :editor="editor" id="textEditor" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, defineEmits, defineProps } from 'vue'
import type { kernalType } from '@/types/ApiTypes'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { useKernalStore } from '@/stores/api/KernalStore'

const props = defineProps<{
  modelValue: kernalType
}>()

const emit = defineEmits(['update:modelValue.description'])

const save = ref(false)
const editor = ref<Editor | null>(null)

const kernalStore = useKernalStore()

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    const desc = value.description.split('\n').join('<br />')
    const isSame = editor.value.getHTML() === desc
    if (!isSame) editor.value.commands.setContent(desc, false)
  },
  { immediate: true }
)

function saveKernal() {
  if (!editor.value) return
  kernalStore.patchKernalDescr(props.modelValue.id, editor.value.view.dom.innerText)
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit],
    content: props.modelValue.description.split('\n').join('<br />'),
    onUpdate: () => {
      if (!editor.value) return
      const currentText = editor.value.view.dom.innerText
      const originalDesc = props.modelValue.description
      save.value = currentText !== originalDesc
      emit('update:modelValue.description', editor.value.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
