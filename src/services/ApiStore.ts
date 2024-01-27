import { defineStore } from 'pinia'
import { watch } from 'vue'
import { SessionStore } from '@/services/SessionStore'
import { GlobalStore } from '@/services/GlobalStore'
import { useForceGraphStore } from '@/services/api/ForceGraphStore'
import { useKernalStore } from '@/services/api/KernalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useSrcUrlSubsetStore } from '@/services/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { useUserFeedStore } from '@/services/api/UserFeedStore'
import { useFolderStore } from '@/services/api/FolderStore'

const defaultState = {
  controller: new AbortController()
}

export const ApiStore = defineStore({
  id: 'apiStore',
  state: () => ({ ...defaultState }),

  actions: {
    initialize () {
      useConnectionsStore().fetchConnections()
      useUserFeedStore().fetchUserFeed()
      useMixtapeStore().fetchMixtapes()
      useSrcUrlSubsetStore().fetchSrcUrlSubsets()
      useFolderStore().fetchFolders()
      useForceGraphStore().fetchForceGraph()
      useKernalStore().fetchKernals()
    },
    async reset () {
      Object.assign(this, defaultState);
      useConnectionsStore().$reset()
      useUserFeedStore().$reset()
      useMixtapeStore().$reset()
      useSrcUrlSubsetStore().$reset()
      useForceGraphStore().$reset()
      useFolderStore().$reset()
      useKernalStore().$reset()
      GlobalStore().$reset()
    },
    async update () {
      this.controller.abort()
      this.controller = new AbortController();
      useKernalStore().$reset()
      useKernalStore().fetchKernals()
    },
    async logoutUser () {
      await SessionStore().logoutUser()
      this.reset()
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

