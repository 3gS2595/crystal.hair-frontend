import type { kernalType } from '@/types/ApiTypes'

import { defineStore } from 'pinia'
import { ApiStore } from '@/store/ApiStore'
import { useMixtapeStore } from '@/store/api/MixtapeStore'
import { useForceGraphStore } from '@/store/api/ForceGraphStore'
import { GlobalStore } from '@/store/GlobalStore'
import { SessionStore } from '@/store/SessionStore'
import axios from 'axios'

const store = GlobalStore()
const sessionStore = SessionStore()
const base = sessionStore.getUrlRails

export const useKernalStore = defineStore({
  id: 'useKernalStore',
  state: () => ({
    pageNumber: 1,
    kernals: <kernalType[]>[]
  }),

  actions: {
    async fetchKernals () {
      const pn = this.pageNumber
      this.kernals.push({
         id: "page-" + pn,
         src_url_id: "acb5e51f-789e-41a2-bd64-6e95076d1a22",
         src_url_subset_id: "bd10bff3-a7cf-4992-bd0f-6251be7385bc",
         file_type: ".gif",
         file_name: "",
         file_path: "",
         url: "",
         size: 0,
         author: "",
         time_posted: new Date(),
         time_scraped: "",
         description: "",
         key_words: "",
         hashtags: "",
         likes: "",
         reposts: "",
         signed_url: "page-loader.gif",
         signed_url_s: "page-loader.gif",
         signed_url_m: "page-loader.gif",
         signed_url_l: "page-loader.gif",
         permissions: ["01f7aea6-dea7-4956-ad51-6dae41e705ca"],
         created_at: new Date(),
         updated_at: new Date()
      })
      this.pageNumber++
      let params = '?q=' + store.filter + '&page=' + pn + '&sort=' + store.sortBy
      if (store.mixtape != '') { params = params + '&mixtape=' + store.mixtape }
      if (store.srcUrlSubset != '') { params = params + '&src_url_subset_id=' + store.srcUrlSubset }
      const config = {
        headers: { Authorization:  sessionStore.auth_token },
        signal: ApiStore().controller.signal
      }
      try {
        const kernals = await axios.get(base + 'kernals'+ params, config)
        if(this.kernals.length < ((pn-1) * store.pageSize)){
          this.kernals = this.kernals.concat(kernals.data)
        } else {
          this.kernals.splice(((pn - 1) * store.pageSize), 0, ...kernals.data)
        }
        this.kernals = this.kernals.filter(item => item.id !== 'page-' + pn)
        return
      } catch (e) {
        console.error(e);
      }
      this.kernals = this.kernals.filter(item => item.id !== 'page-' + pn)
    },

    async addKernal(formData: FormData) {
      store.setUploadView(true)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStore.auth_token },
        onUploadProgress: function(progressEvent: any) {
          let uploadPercent = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
          store.setUploadPercent(uploadPercent)
          if(uploadPercent === 100) {
            store.setUploadView(false)
            store.setUploadPercent(0)
          }
        }
      }
      if(formData.has("file_type")){
        try {
          const [ ker ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'kernals', formData, config)
          ])
          this.kernals.unshift(ker.data)
          useForceGraphStore().forceGraph.unshift(ker.data)
          console.log(ker.data)
          if(store.mixtape !== '') {
            useMixtapeStore().mixtapes.find(mix => mix.id === store.mixtape)!.content.unshift(ker.data.id)
          }
        } catch (e) {
          console.error(e);
        }
      }
    },

    async deleteKernal (uuid: string) {
      const config = {headers: { Authorization: sessionStore.auth_token }}
      try {
        axios.delete( sessionStore.getUrlRails + 'kernals/' + uuid, config)
        this.kernals = this.kernals.filter(item => item.id !== uuid)
        useMixtapeStore().remMixContAll(uuid)
      } catch (e) {
        console.error(e);
      }
    },

    async patchKernalDescr(kId: string, text: string) {
      const config = {headers: { Authorization: sessionStore.auth_token }}
      try {
        const [ kernal ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'kernals/' + kId + '?description=' + text, {}, config)
        ])
        console.log(Array.prototype.findIndex.call(this.kernals, (x) => x.id = kId))
        this.kernals[store.lightBoxIndex] = kernal.data
      } catch (e) {
        console.error(e);
      }
    },

  }
})
