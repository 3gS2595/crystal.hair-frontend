
<template>
  <div class="pdf">
    <div ref="containerEl" class="pdf-container" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Setup the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const props = defineProps<{ modelValue: string | Blob }>() // PDF URL or Blob
const containerEl = ref<HTMLElement | null>(null)

const renderPDF = async (source: string | Blob) => {
  try {
    const loadingTask = pdfjsLib.getDocument(source)
    const pdf = await loadingTask.promise

    if (!containerEl.value) return
    containerEl.value.innerHTML = '' // clear previous pages

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const scale = 1.5
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!

      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({ canvasContext: context, viewport }).promise
      containerEl.value.appendChild(canvas)
    }

    console.log(`Rendered ${pdf.numPages} pages`)
  } catch (error) {
    console.error('PDF render error:', error)
  }
}

// Re-render on modelValue change
watch(() => props.modelValue, (newVal) => {
  if (newVal) renderPDF(newVal)
}, { immediate: true })
</script>

<style scoped>
.pdf {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: #111;
  overflow-y: auto;
  max-height: 100vh;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-container canvas {
  margin-bottom: 1rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  background: white;
  border-radius: 4px;
}
</style>
