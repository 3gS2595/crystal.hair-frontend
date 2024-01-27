import { defineStore } from 'pinia'
import { GlobalStore } from '@/services/GlobalStore'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import type { srcUrlSubsetType } from '@/assets/types/ApiTypes'
const defaultState = {
  srcUrlSubsets: <srcUrlSubsetType[]>[]
}

const store = GlobalStore()
export const useSrcUrlSubsetStore = defineStore({
  id: 'useSrcUrlSubsetStore',
  state: () => ({ ...structuredClone(defaultState)}),

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
        headers: { Authorization:  SessionStore().auth_token }
      }
      console.log(this.srcUrlSubsets)
      try { this.srcUrlSubsets  = (await axios.get(SessionStore().getUrlRails + 'src_url_subsets', config)).data }
      catch (e) {console.error(e)}
      console.log(this.srcUrlSubsets)
      console.log(this.srcUrlSubsets)
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
          GlobalStore().srcUrlSubset = src.data.id
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
        this.srcUrlSubsets.splice(this.srcUrlSubsets.findIndex(function(i){
            return i.id === uuid
        }), 1)
        store.srcUrlSubset = ''
      } catch (e) {
        console.error(e);
      }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
