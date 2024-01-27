import { defineStore } from 'pinia'
import { computed } from 'vue'
import axios from 'axios'

import { useConnectionsStore } from '@/services/api/connectionsStore'
import { GlobalStore } from '@/services/GlobalStore'
import { SessionStore } from '@/services/SessionStore'
const base = SessionStore().getUrlRails + 'mixtapes'
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set(){}
})

import type { mixtapeType } from '@/assets/types/ApiTypes'
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
        this.mixtapes = this.mixtapes.filter(item => item.id !== uuid)
        GlobalStore().mixtape = ''
      } catch (e) { console.error(e) }
    },
    async patchMixtape (uuid: string, title: string) {
      try {
        const mix = (await axios.patch( `${base}/` + uuid + '?name=' + title, {}, auth.value)).data
        this.mixtapes = this.mixtapes.filter(item => item.id !== uuid)
        this.mixtapes.unshift(mix)
      } catch (e) { console.error(e) }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
