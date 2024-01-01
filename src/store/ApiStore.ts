import { defineStore } from 'pinia'
import { watch } from 'vue'
import { GlobalStore } from '@/store/GlobalStore'
import { useForceGraphStore } from '@/store/api/ForceGraphStore'
import { useKernalStore } from '@/store/api/KernalStore'
import { useMixtapeStore } from '@/store/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/store/api/SrcUrlSubsetStore'

export const ApiStore = defineStore({
  id: 'apiStore',
  state: () => ({
    controller: new AbortController()
  }),

  actions: {
    async initialize () {
      useMixtapeStore().fetchMixtapes(1)
      useSrcUrlSubsetStore().fetchSrcUrlSubsets(1)
      useForceGraphStore().fetchForceGraph()
      useKernalStore().pageNumber = 1
      useKernalStore().fetchKernals()
    },

    async update () {
      this.controller.abort()
      this.controller = new AbortController();
      useKernalStore().pageNumber = 1
      useKernalStore().kernals = []
      try {
        useKernalStore().fetchKernals()
      } catch (e) {
        console.error(e);
      }
    }
  }
})

const store = GlobalStore()
watch(
  () => store.filter,
  () => { ApiStore().update() }
)
watch(
  () => store.sortBy,
  () => { ApiStore().update() }
)
watch(
  () => store.mixtape,
  () => { ApiStore().update() }
)
watch(
  () => store.srcUrlSubset,
  () => { ApiStore().update() }
)

