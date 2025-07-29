import type { folderType } from '@/types/ApiTypes'

import axios from 'axios'
import { computed } from 'vue'
import { defineStore } from 'pinia'

import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { SessionStore } from '@/stores/SessionStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'

const base = SessionStore().getUrlRails + 'folders'
const defaultState = {
  folders: [{
    id: "page-0",
    name: "loading...",
    contains: [],
    created_at: new Date(),
    updated_at: new Date()
  }] as folderType[]
}
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set() {}
})

export const useFolderStore = defineStore({
  id: 'useFolderStore',
  state: () => ({ ...structuredClone(defaultState)}),
  actions: {
    async fetchFolders () {
      try {
        this.folders = (await axios.get(base, auth.value)).data
      } catch (e) { console.error(e) }
    },

    async addFolder(title: string) {
      try {
        GlobalStore().addFolderBoxView = false
        const fold = (await axios.post(`${base}?name=${title}`, {}, auth.value)).data
        useConnectionsStore().fetchConnections()
        this.folders.unshift(fold)
        GlobalStore().folder = fold.id

        useMixtapeStore().fetchMixtapes()
      } catch (e) { console.error(e) }
    },

    async deleteFolder (uuid: string) {
      try {
        GlobalStore().folder = ''
        this.folders = this.folders.filter(i => i.id !== uuid);
        axios.delete( `${base}/` + uuid, auth.value)
        useConnectionsStore().fetchConnections()
      } catch (e) { console.error(e) }
    },

    async patchFolder (folderId: string, mixId: string) {
      try {
        const fold = (await axios.patch( `${base}/` + folderId + '?new_mix_uuid=' + mixId, {}, auth.value)).data
        this.folders = this.folders.filter(i => i.id !== folderId);
        this.folders.unshift(fold)
        useMixtapeStore().fetchMixtapes()
      } catch (e) { console.error(e) }
    },

    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
