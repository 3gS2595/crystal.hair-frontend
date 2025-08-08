<template>
  <div class="edit-mixtape" v-click-away="close">
    <div class="add-mixtape-title">
      <a class="input-name text-main-0 edit-opt">{{ label }}</a>
      <input
        class="input-standard text-main-0 edit-opt"
        :placeholder="placeholder"
        v-model="inputValue"
      />
    </div>
    <div class="add-mixtape-options">
      <a class="option text-main-0 edit-opt" @click="close">exit</a>
      <a class="option text-main-0 edit-opt" @click="handleSubmit">save</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { directive as clickAway } from 'vue3-click-away'

const props = defineProps<{
  label: string
  placeholder?: string
  onSubmit: (value: string) => void
}>()

const emit = defineEmits(['close'])
const inputValue = ref('')

function close() {
  emit('close')
  window.removeEventListener('keyup', escHandler, true)
}

function handleSubmit() {
  props.onSubmit(inputValue.value)
  close()
}

function escHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keyup', escHandler, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', escHandler, true)
})

defineExpose({ close })
</script>

<script lang="ts">
export default {
  directives: { clickAway },
}
</script>

