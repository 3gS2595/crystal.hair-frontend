import { defineStore } from 'pinia'
import { watch } from 'vue'
import { GlobalStore } from '@/services/GlobalStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useKernalStore } from '@/services/api/KernalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/services/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'
import { useFolderStore } from '@/services/api/FolderStore'

export const ApiStore = defineStore({
  id: 'apiStore',
  state: () => ({
    controller: new AbortController()
  }),

  actions: {
    async initialize () {
      useConnectionsStore().fetchConnections()
      useUserFeedStore().fetchUserFeed()
      useMixtapeStore().fetchMixtapes()
      useSrcUrlSubsetStore().fetchSrcUrlSubsets()
      useForceGraphStore().fetchForceGraph()
      useFolderStore().fetchFolders()
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

