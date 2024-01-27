import { defineStore } from 'pinia'
import { computed } from 'vue'
import axios from 'axios'

import { SessionStore } from '@/services/SessionStore'
import { GlobalStore } from '@/services/GlobalStore'
import { useMixtapeStore } from '@/services/api/MixtapeStore'
import { useKernalStore } from '@/services/api/KernalStore'
const url = SessionStore().getUrlRails + 'contents'
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set(){}
})

import type { mixtapeType } from '@/assets/types/ApiTypes'
import type { contentType } from '@/assets/types/ApiTypes'

import type { connectionsStoreType } from '@/assets/types/index'
const defaultState = <connectionsStoreType>{
  connections_mix: [{ id: '', contains: [] }] as contentType[],
  connections_src: [{ id: '', contains: [] }] as contentType[]
}

export const useConnectionsStore = defineStore({
  id: 'useConnectionsStore',
  state: (): connectionsStoreType => ({ ...structuredClone(defaultState)}),
  actions: {
    async fetchConnections () {
      try {
        this.connections_mix = (await axios.get(`${url}?mix=true`, auth.value)).data
        this.connections_src = (await axios.get(`${url}?src=true`, auth.value)).data
      } catch (e) { console.error(e) }
    },
    async patchMixAddKernal(cid: string, kid: string) {
      try {
        const retNew = (await axios.patch(`${url}/${cid}?kid=${kid}&add=true`, {}, auth.value)).data
        this.connections_mix = this.connections_mix.filter(item => item.id !== cid)
        this.connections_mix.unshift(retNew)
        this.unshiftMixtape(cid)
      } catch (e) { console.error(e) }
    },
    async patchMixRemKernal(cid: string, kid: string) {
      try {
        const retNew = (await axios.patch(`${url}/${cid}?kid=${kid}&remove=true`, {}, auth.value)).data
        this.connections_mix = this.connections_mix.filter(item => item.id !== cid)
        this.connections_mix.unshift(retNew)
        this.unshiftMixtape(cid)
        const mix = <mixtapeType> useMixtapeStore().mixtapes.find((i: mixtapeType) => i.content_id === cid)
        if (GlobalStore().mixtape == mix.id) {
          GlobalStore().closeViewer()
          useKernalStore().kernals = useKernalStore().kernals.filter(item => item.id !== kid)
        }
      } catch (e) { console.error(e) }
    },
    async unshiftMixtape(cid: string){
      const mix = <mixtapeType> useMixtapeStore().mixtapes.find((i: mixtapeType) => i.content_id === cid)
      useMixtapeStore().mixtapes = useMixtapeStore().mixtapes.filter(item => item.id !== mix.id)
      useMixtapeStore().mixtapes.unshift(mix)
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
