import type { connectionsMixType, connectionsSrcType} from '@/assets/types/ApiTypes'

import { SessionStore } from '@/services/SessionStore'
import { defineStore } from 'pinia'
import axios from 'axios'

const sessionStore = SessionStore()
const auth = { headers: {"Authorization" : `${sessionStore.auth_token}`} }
const url = SessionStore().getUrlRails + 'contents'

export const useConnectionsStore = defineStore({
  id: 'useConnectionsStore',
  state: () => ({
    connections_mix: [{ id: '', contains: [] }] as connectionsMixType[],
    connections_src: [{ id: '', contains: [] }] as connectionsSrcType[]
  }),

  actions: {
    async fetchConnections () {
      try {
        this.connections_mix = (await axios.get(`${url}?mix=true`, auth)).data
        this.connections_src = (await axios.get(`${url}?src=true`, auth)).data
      } catch (e) { console.error(e) }
    },
    async patchMixAddKernal(cid: string, kid: string) {
      try { this.connections_mix = (await axios.patch(`${url}/${cid}?kid=${kid}&add=true`, {}, auth)).data
      } catch (e) { console.error(e) }
    },
    async patchMixRemKernal(cid: string, kid: string) {
      try { this.connections_mix = (await axios.patch(`${url}/${cid}?kid=${kid}&remove=true`, {}, auth)).data
      } catch (e) { console.error(e) }
    }
  }
})
