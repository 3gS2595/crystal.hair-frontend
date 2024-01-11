import { defineStore } from 'pinia'
import { GlobalStore } from '@/store/GlobalStore'
import { SessionStore } from '@/store/SessionStore'
import axios from 'axios'

import type { srcUrlSubsetType } from '@/types/ApiTypes'

const store = GlobalStore()
export const useSrcUrlSubsetStore = defineStore({
  id: 'useSrcUrlSubsetStore',
  state: () => ({
    srcUrlSubsets: <srcUrlSubsetType[]>[],
  }),

  actions: {
    async fetchSrcUrlSubsets (pageNumber: number) {
      let params = '?page=' + pageNumber + '&q=' + GlobalStore().filter
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const newSrcUrlSubset = await axios.get(SessionStore().getUrlRails + 'src_url_subsets'+ params, config)
        this.srcUrlSubsets = this.srcUrlSubsets.concat(newSrcUrlSubset.data)
      } catch (e) {
        console.error(e);
      }
    },

    async addSrcUrlSubset(url: string, name:string, scrapeInterval:string) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: SessionStore().auth_token }
      }
      let formData = new FormData();
      formData.append('url', url)
      formData.append('name', name)
      formData.append('scrapeInterval', scrapeInterval)
      if(url !== '' && name !== '' && !isNaN(Number(scrapeInterval))) {
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
