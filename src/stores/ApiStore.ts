import { defineStore } from 'pinia'
import { watch } from 'vue'

import { SessionStore } from '@/stores/SessionStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
import { useKernalStore } from '@/stores/api/KernalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useFolderStore } from '@/stores/api/FolderStore'
import { useSrcUrlSubsetStore } from '@/stores/api/SrcUrlSubsetStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'


import type { apiStoreType } from '@/types/index'
const globalStore = GlobalStore()
export const ApiStore = defineStore({
  id: 'apiStore',
  state: (): apiStoreType => ({ controller: new AbortController() }),
  actions: {
    async initialize () {
      await Promise.all([
        useUserFeedStore().fetchUserFeed(),
        useFolderStore().fetchFolders(),
        useSrcUrlSubsetStore().fetchSrcUrlSubsets()
      ])
      await Promise.all([
        useKernalStore().fetchKernals(),
        useMixtapeStore().fetchMixtapes()
      ])
      useConnectionsStore().fetchConnections()
    },

    async update () {
      this.abortRequests ()
      useKernalStore().reset()
      useKernalStore().fetchKernals()
    },

    async logoutUser () {
      this.abortRequests()
      await SessionStore().logoutUser()
      this.reset()
    },

    async reset () {
      this.abortRequests()
      useConnectionsStore().$reset()
      useUserFeedStore().$reset()
      useMixtapeStore().$reset()
      useFolderStore().$reset()
      useSrcUrlSubsetStore().$reset()
      useKernalStore().$reset()
    },

    async abortRequests () {
      this.controller.abort()
      this.controller = new AbortController()
    }
  }
})
watch(
  () => [
    globalStore.mixtape
  ],
  () => {
    if (SessionStore().auth_token != null) {
      ApiStore().update()
    }
  }
)
watch(
  () => [
    globalStore.filter,
    globalStore.tags,
    globalStore.feed,
    globalStore.sortBy,
    globalStore.srcUrlSubset
  ],
  () => {
    if (SessionStore().auth_token != null) {
      ApiStore().update()
    }
  }
)


