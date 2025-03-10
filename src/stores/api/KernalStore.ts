import { defineStore } from 'pinia'
import axios from 'axios'

import type { kernalStoreType } from '@/types/index'
import type { kernalType } from '@/types/ApiTypes'
import type { mixtapeType } from '@/types/ApiTypes'

import { ApiStore } from '@/stores/ApiStore'
import { SessionStore } from '@/stores/SessionStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
const url = SessionStore().getUrlRails + 'kernals'
const store = GlobalStore()

const loading_icon = "https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/page-loader.gif"
const icon = {
  id: "page-load",
  file_type: "img",
  signed_url: loading_icon,
  signed_url_s: loading_icon,
  signed_url_m: loading_icon,
  signed_url_l: loading_icon,
}
const defaultState = <kernalStoreType>{
  pageNumber: 1,
  kernals: [icon] as kernalType[]
}

export const useKernalStore = defineStore({
  id: 'useKernalStore',
  state: (): kernalStoreType => ({ ...structuredClone(defaultState) }),
  actions: {
    async fetchKernals () {
      if (this.kernals.length != 1) {
        this.kernals.push(icon)
      }
      let params = `?q=${store.filter}&feed=${store.feed}&page=${this.pageNumber}&sort=${store.sortBy}`
      if (store.tags != '') { params = `${params}&tags=${store.tags}` }
      if (store.folder != '') { params = `${params}&folder=${store.folder}` }
      if (store.mixtape != '') { params = `${params}&mixtape=${store.mixtape}` }
      if (store.srcUrlSubset != '') { params = `${params}&src_url_subset_id=${store.srcUrlSubset}` }
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
        signal: ApiStore().controller.signal
      }
      try {
        const kernals = await axios.get(url + params, config)
        this.kernals = this.kernals.filter(item => item.signed_url_s !== loading_icon)
        this.kernals = this.kernals.concat(kernals.data)
      } catch (e) { console.error(e) }
      this.pageNumber++
    },

    async addKernal(formData: FormData) {
      store.uploadView = true
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: SessionStore().auth_token }}
      if(formData.has("file_type")){
        try {
          const ker = await axios.post(url, formData, config)
          this.kernals.unshift(ker.data)
          useForceGraphStore().forceGraph.unshift(ker.data)
          if (store.mixtape != '') {
            const mix = <mixtapeType> useMixtapeStore().mixtapes.find((i: mixtapeType) => i.id === store.mixtape)
            useMixtapeStore().mixtapes.splice(useMixtapeStore().mixtapes.findIndex(function(i){
                return i.id === store.mixtape
            }), 1);
            useMixtapeStore().mixtapes.unshift(mix)
            useConnectionsStore().fetchConnections()
          }
        } catch (e) { console.error(e) }
      }
    },

    async deleteKernal (uuid: string) {
      const config = {headers: { Authorization: SessionStore().auth_token }}
      try {
        this.kernals = this.kernals.filter(item => item.id !== uuid)
        await axios.delete( `${url}/${uuid}`, config)
        useConnectionsStore().fetchConnections()
      } catch (e) { console.error(e) }
    },

    async patchKernalDescr(kid: string, text: string) {
      const config = {headers: { authorization: SessionStore().auth_token }}
      try {this.kernals[store.lightBoxIndex] = (await axios.patch(`${url}/${kid}?description=${text}`, {}, config)).data
      } catch (e) { console.error(e) }
    },

     reset() {
      this.kernals = []
      Object.assign(this, structuredClone(structuredClone(defaultState)));
    }
  }
})
