import { defineStore } from 'pinia'
import { computed } from 'vue'
import axios from 'axios'

import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { SessionStore } from '@/stores/SessionStore'
const base = SessionStore().getUrlRails + 'mixtapes'
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set(){}
})

import type { mixtapeType } from '@/types/ApiTypes'
const defaultState = {
  mixtapes: <mixtapeType[]>[],
}
export const useMixtapeStore = defineStore({
  id: 'useMixtapeStore',
  state: () => ({ ...structuredClone(defaultState)}),

  actions: {
    async fetchMixtapes () {
      this.mixtapes.push({
        id: "page-0",
        name: "loading...",
        content_id: '',
        created_at: new Date(),
        updated_at: new Date()
       })
      try { this.mixtapes = (await axios.get(base, auth.value)).data }
      catch (e) { console.error(e) }
    },
    async addMixtape(title: string) {
      try {
        const mix = (await axios.post(`${base}?name=${title}`, {}, auth.value)).data
        await useConnectionsStore().fetchConnections()
        this.mixtapes.unshift(mix)
        GlobalStore().mixtape = mix.id
      } catch (e) { console.error(e) }
    },
    async deleteMixtape (uuid: string) {
      try {
        await axios.delete( `${base}/` + uuid, auth.value)
        await useConnectionsStore().fetchConnections()
        this.mixtapes.splice(this.mixtapes.findIndex(function(i){
            return i.id === uuid
        }), 1)
        GlobalStore().mixtape = ''
      } catch (e) { console.error(e) }
    },
    async patchMixtape (uuid: string, title: string) {
      try {
        const mix = (await axios.patch( `${base}/` + uuid + '?name=' + title, {}, auth.value)).data
        this.mixtapes.splice(this.mixtapes.findIndex(function(i){
            return i.id === uuid
        }), 1)
        this.mixtapes.unshift(mix)
      } catch (e) { console.error(e) }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
