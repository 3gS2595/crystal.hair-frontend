import { defineStore } from 'pinia'
import { GlobalStore } from '@/services/GlobalStore'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import type { srcUrlSubsetType } from '@/assets/types/ApiTypes'

const store = GlobalStore()
export const useSrcUrlSubsetStore = defineStore({
  id: 'useSrcUrlSubsetStore',
  state: () => ({
    srcUrlSubsets: <srcUrlSubsetType[]>[]
  }),

  actions: {
    async fetchSrcUrlSubsets () {
      this.srcUrlSubsets.push({
        id: '',
        src_url_id: '',
        contents: '',
        url: '',
        name: 'loading...',
        scrape_interval: 0,
        time_last_scraped: new Date(),
        permissions: [],
        created_at: new Date(),
        updated_at: new Date()
       })
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const srcUrlSubsets = await axios.get(SessionStore().getUrlRails + 'src_url_subsets', config)
        this.srcUrlSubsets = srcUrlSubsets.data
      } catch (e) {
        console.error(e);
      }
      this.srcUrlSubsets = this.srcUrlSubsets.filter(item => item.name !== 'loading...')
    },

    async addSrcUrlSubset(url: string, name:string) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: SessionStore().auth_token }
      }
      let formData = new FormData();
      formData.append('url', url)
      formData.append('name', name)
      if(url !== '' && name !== '') {
        try {
          const [ src ] = await Promise.all([
            axios.post( SessionStore().getUrlRails + 'src_url_subsets', formData, config)
          ])
          this.srcUrlSubsets.unshift(src.data)
          GlobalStore().setSrcUrlSubset(src.data.id)
        } catch (e) {
          console.error(e);
        }
      }
    },

    async deleteSrcUrlSubset (uuid: string) {
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        axios.delete(  SessionStore().getUrlRails + 'src_url_subsets/' + uuid, config)
        this.srcUrlSubsets = this.srcUrlSubsets.filter(item => item.id !== uuid)
        store.setSrcUrlSubset('')
      } catch (e) {
        console.error(e);
      }
    },
  }
})
