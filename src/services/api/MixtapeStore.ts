import { defineStore } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { useKernalStore } from '@/services/api/KernalStore'
import { useConnectionsStore } from '@/services/api/connectionsStore'
import { GlobalStore } from '@/services/GlobalStore'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import type { mixtapeType } from '@/assets/types/ApiTypes'

const store = GlobalStore()
const connectionsStore = useConnectionsStore()
const sessionStore = SessionStore()
const base = sessionStore.getUrlRails

export const useMixtapeStore = defineStore({
  id: 'useMixtapeStore',
  state: () => ({
    mixtapes: <mixtapeType[]>[],
  }),

  actions: {

    async fetchMixtapes (pageNumber: number) {
      this.mixtapes.push({
        id: "page-" + pageNumber,
        name: "...",
        contents: '',
        permissions: [],
        created_at: new Date(),
        updated_at: new Date()
       })
      let params = '?page=' + pageNumber + '&sort=' + store.sortBy + '&q=' + store.filter
      const config = {
        headers: { Authorization:  sessionStore.auth_token },
        signal: ApiStore().controller.signal
      }
      try {
        const mixtapes = await axios.get(base + 'mixtapes'+ params, config)
        this.mixtapes = this.mixtapes.concat(mixtapes.data)

      this.mixtapes = this.mixtapes.filter(item => item.id !== 'page-' + pageNumber)
        return mixtapes.data
      } catch (e) {
        console.error(e);
      }
      this.mixtapes = this.mixtapes.filter(item => item.id !== 'page-' + pageNumber)
    },

    async addMixtape(title: string) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStore.auth_token }
      }
      let formData = new FormData();
      formData.append('name', title)
      formData.append('include_in_feed', '1')
      if(title !== ''){
        try {
          const [ mix ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'mixtapes', formData, config)
          ])
          this.mixtapes.unshift(mix.data)
          store.setMixtape(mix.data.id)
          connectionsStore.fetchConnections()
        } catch (e) {
          console.error(e);
        }
      }
    },

    async deleteMixtape (uuid: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token },
      }
      try {
        axios.delete( sessionStore.getUrlRails + 'mixtapes/' + uuid, config)
        this.mixtapes = this.mixtapes.filter(item => item.id !== uuid)
        store.setMixtape('')
      } catch (e) {
        console.error(e);
      }
    },
    async patchMixtape (uuid: string, title: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        const [ mix ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'mixtapes/' + uuid + '?name=' + title, {}, config)
        ])
        this.mixtapes = mix.data
        connectionsStore.fetchConnections()
      } catch (e) {
        console.error(e);
      }
    }
  }
})
