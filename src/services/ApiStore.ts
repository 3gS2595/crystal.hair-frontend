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

import type { apiStoreType } from '@/types/index'
export const ApiStore = defineStore({
  id: 'apiStore',
  state: (): apiStoreType => ({
    controller: new AbortController()
  }),

  actions: {
    initialize () {
      useConnectionsStore().fetchConnections()
      useUserFeedStore().fetchUserFeed()
      useMixtapeStore().fetchMixtapes()
      useSrcUrlSubsetStore().fetchSrcUrlSubsets()
      useForceGraphStore().fetchForceGraph()
      useKernalStore().fetchKernals()
    },
    async update () {
      this.abortRequests ()
      useKernalStore().$reset()
      useKernalStore().fetchKernals()
    },
    async logoutUser () {
      this.abortRequests()
      await SessionStore().logoutUser()
      this.reset()
    },
    async reset () {
      this.abortRequests()
      GlobalStore().$reset()
      useConnectionsStore().$reset()
      useUserFeedStore().$reset()
      useMixtapeStore().$reset()
      useSrcUrlSubsetStore().$reset()
      useForceGraphStore().$reset()
      useKernalStore().$reset()
    },
    async abortRequests () {
      this.controller.abort()
      this.controller = new AbortController();
    }
  }
})

watch(
  () => GlobalStore().filter,
  () => { if (SessionStore().auth_token != null) ApiStore().update() }
)
watch(
  () => GlobalStore().sortBy,
  () => { if (SessionStore().auth_token != null) ApiStore().update() }
)
watch(
  () => GlobalStore().mixtape,
  () => { if (SessionStore().auth_token != null) ApiStore().update() }
)
watch(
  () => GlobalStore().srcUrlSubset,
  () => { if (SessionStore().auth_token != null) ApiStore().update() }
)

