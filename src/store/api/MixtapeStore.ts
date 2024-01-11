import { defineStore } from 'pinia'
import { ApiStore } from '@/store/ApiStore'
import { useKernalStore } from '@/store/api/KernalStore'
import { GlobalStore } from '@/store/GlobalStore'
import { SessionStore } from '@/store/SessionStore'
import axios from 'axios'

import type { mixtapeType } from '@/types/ApiTypes'

const store = GlobalStore()
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
        content: [],
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

    async addMixCont(kId: string, mId: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token }
      }
      try {
        const [ mix ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'mixtapes/' + mId + '?addKernal=' + kId, {}, config)
        ])
        this.mixtapes = this.mixtapes.filter(item => item.id !== mix.data.id)
        this.mixtapes.unshift(mix.data)
      } catch (e) {
        console.error(e);
      }
    },
    async remMixCont(kId: string, mId: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token }
      }
      try {
        const [ mix ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'mixtapes/' + mId + '?remKernal=' + kId, {}, config)
        ])
        this.mixtapes = this.mixtapes.filter(item => item.id !== mix.data.id)
        this.mixtapes.unshift(mix.data)
        if(store.mixtape === mix.data.id){
          useKernalStore().kernals = useKernalStore().kernals.filter(item => item.id !== kId)
        }
      } catch (e) {
        console.error(e);
      }
    },
    async remMixContLocal(kId: string) {
        this.mixtapes.unshift(mix.data)
        if(store.mixtape === mix.data.id){
          useKernalStore().kernals = useKernalStore().kernals.filter(item => item.id !== kId)
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
})
