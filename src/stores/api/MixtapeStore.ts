import type { mixtapeType } from '@/types/ApiTypes'

import axios from 'axios'
import { computed } from 'vue'
import { defineStore } from 'pinia'

import { GlobalStore } from '@/stores/GlobalStore'
import { SessionStore } from '@/stores/SessionStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'
import { useFolderStore } from '@/stores/api/FolderStore'

const base = SessionStore().getUrlRails + 'mixtapes'
const defaultState = {
  mixtapes: [{
    id: "page-0",
    name: "loading...",
    content_id: '',
    created_at: new Date(),
    updated_at: new Date()
  }] as mixtapeType[],
  mixtapeTree: [
    {
      text: 'loading...',
      children: [{}]
    }
  ]
}
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set() {}
})

export const useMixtapeStore = defineStore({
  id: 'useMixtapeStore',
  state: () => ({ ...structuredClone(defaultState)}),
  actions: {
    async fetchMixtapes () {
      try {
        this.mixtapes = (await axios.get(base, auth.value)).data
        this.mixtapeTree = []
        if (useFolderStore().folders != null){
          for (const fold of useFolderStore().folders) {
            this.mixtapeTree.push({text: fold.name, children: []})
            for (const mix of fold.contains) {
              if (this.mixtapes.findIndex(x => x.id === mix) != -1) {
                let name = this.mixtapes[this.mixtapes.findIndex(x => x.id === mix)].name;
                this.mixtapeTree[this.mixtapeTree.length - 1].children.push({text: name, indent: 30})
              }
            }
          }
        }
        this.mixtapeTree.push({text: 'mixtapes', children: []})
        if (this.mixtapes != null){
          for (const mix of this.mixtapes) {
            this.mixtapeTree[this.mixtapeTree.length - 1].children.push({text: mix.name})
          }
        }
      } catch (e) { console.error(e) }
    },

    async addMixtape(title: string) {
      try {
        GlobalStore().addMixtapeBoxView = false
        const mix = (await axios.post(`${base}?name=${title}`, {}, auth.value)).data
        useConnectionsStore().fetchConnections()
        this.mixtapes.unshift(mix)
        GlobalStore().mixtape = mix.id
      } catch (e) { console.error(e) }
    },

    async deleteMixtape (uuid: string) {
      try {
        GlobalStore().mixtape = ''
        this.mixtapes = this.mixtapes.filter(i => i.id !== uuid);
        axios.delete( `${base}/` + uuid, auth.value)
        useConnectionsStore().fetchConnections()
      } catch (e) { console.error(e) }
    },

    async patchMixtape (uuid: string, title: string) {
      try {
        const mix = (await axios.patch( `${base}/` + uuid + '?name=' + title, {}, auth.value)).data
        this.mixtapes = this.mixtapes.filter(i => i.id !== uuid);
        this.mixtapes.unshift(mix)
      } catch (e) { console.error(e) }
    },

    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
