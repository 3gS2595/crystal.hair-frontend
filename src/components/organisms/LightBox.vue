<template>
  <div class="lightbox">
    <div class="resizable resizable-component">
      <div class="block">
        <!-- Lazy-loaded PDF viewer -->
        <Suspense>
          <template #default>
            <component
              :is="ViewPdf"
              v-if="isPdf"
              v-model="kernals[store.lightBoxIndex].signed_url"
            />
          </template>
          <template #fallback>
            <div>Loading PDF viewer...</div>
          </template>
        </Suspense>

        <!-- Other viewers remain the same -->
        <ViewImg
          @click="viewInfo = !viewInfo"
          v-if="!isPdf && kernals[store.lightBoxIndex].file_type !== '.txt'"
          v-model="kernals[store.lightBoxIndex]"
        />

        <ViewText
          v-if="kernals[store.lightBoxIndex].file_type === '.txt'"
          v-model="kernals[store.lightBoxIndex]"
        />

        <ViewInfo v-if="viewInfo" v-model="kernals[store.lightBoxIndex]" />

        <!-- Navigation -->
        <div class="drag-container-1">
          <a class="navItem" style="padding-top: 3px" @click="close">✕</a>
          <a class="navItem" style="padding-top: 3px" @click="viewInfo = !viewInfo"
            >&#9432;&#xFE0E;</a
          >
          <a class="navItem" style="padding-top: 3px" @click="prev" v-if="store.lightBoxIndex !== 0"
            >←</a
          >
          <a
            class="navItem"
            style="padding-top: 3px"
            @click="next"
            v-if="store.lightBoxIndex !== kernals.length - 1"
            >→</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import ViewText from '@/components/atoms/viewers/ViewText.vue'
  import ViewImg from '@/components/atoms/viewers/ViewImg.vue'
  import ViewInfo from '@/components/atoms/viewers/ViewInfo.vue'
  import { GlobalStore } from '@/stores/GlobalStore'
  import { useKernalStore } from '@/stores/api/KernalStore'

  // Lazy-load the PDF viewer component
  const ViewPdf = defineAsyncComponent(() => import('@/components/atoms/viewers/ViewPdf.vue'))

  const store = GlobalStore()
  const { kernals } = storeToRefs(useKernalStore())

  const viewInfo = ref(false)

  // Determine if current file is a PDF
  const isPdf = computed(() => {
    const fileType = kernals.value[store.lightBoxIndex]?.file_type
    return fileType?.includes('pdf')
  })

  const close = () => {
    store.closeViewer()
    viewInfo.value = false
    window.removeEventListener('keyup', keyIn, true)
  }

  const next = () => {
    if (store.lightBoxIndex + 1 <= kernals.value.length - 1) {
      store.lightBoxIndex += 1
    }
  }
  const prev = () => {
    if (store.lightBoxIndex - 1 >= 0) {
      store.lightBoxIndex -= 1
    }
  }

  const keyIn = (e: KeyboardEvent) => {
    const isEditing = document.getElementsByClassName('tiptap')[0] === document.activeElement
    if (!isEditing) {
      if (e.key === 'Escape') {
        if (viewInfo.value) {
          viewInfo.value = false
        } else {
          close()
        }
      } else if (e.key === 'ArrowRight') {
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      }
    } else if (e.key === 'Escape') {
      ;(document.getElementsByClassName('tiptap')[0] as HTMLElement).blur()
    }
  }

  onMounted(() => {
    window.addEventListener('keyup', keyIn, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', keyIn, true)
  })
</script>
