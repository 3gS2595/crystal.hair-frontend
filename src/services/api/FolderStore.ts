import { defineStore } from 'pinia'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

const sessionStore = SessionStore()
const base = sessionStore.getUrlRails

import type { folderType } from '@/assets/types/ApiTypes'
const defaultState = {
  folders: [{
    id: '',
    name: '',
    contains: [],
    created_at: new Date(),
    updated_at: new Date()
  }] as folderType[]
}

export const useFolderStore = defineStore({
  id: 'useFolderStore',
  state: () => ({ ...structuredClone(defaultState)}),
  actions: {
    async fetchFolders () {
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const [ folders ] = await Promise.all([
          axios.get(base + 'folders', config)
        ])
        this.folders = folders.data
      } catch (e) {
        console.error(e);
      }
    },
    async patchFolderToggleMix(fid: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        if (this.folders.find((o) => o.id === fid) != undefined) {
          const [ folders ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'folders' + '?fid=' + fid + '&toggle=true', {}, config)
          ])
          this.folders = folders.data
        }
      } catch (e) {
        console.error(e);
      }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
