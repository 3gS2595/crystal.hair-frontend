import { defineStore } from 'pinia'
import { watch } from 'vue'
import { GlobalStore } from '@/services/GlobalStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useKernalStore } from '@/services/api/KernalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/services/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'

export const ApiStore = defineStore({
  id: 'apiStore',
  state: () => ({
    controller: new AbortController()
  }),

  actions: {
    async initialize () {
      await useConnectionsStore().fetchMixtapes()
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

