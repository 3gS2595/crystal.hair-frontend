import { defineStore } from 'pinia'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import type { connectionsMixType, connectionsSrcType} from '@/assets/types/ApiTypes'

const sessionStore = SessionStore()
const base = sessionStore.getUrlRails

export const useConnectionsStore = defineStore({
  id: 'useConnectionsStore',
  state: () => ({
    connections_mix: <connectionsMixType[]>[],
    connections_src: <connectionsSrcType[]>[],
  }),

  actions: {
    async fetchConnections () {
      let params = '?mix=true'
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const mixtapes = await axios.get(base + 'contents' + params, config)
        this.connections_mix = mixtapes.data
      } catch (e) {
        console.error(e);
      }
    },
    async patchMixAddKernal(cid: string, kid: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        const [ connections ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'contents/' + cid + '?kid=' + kid + '&add=true', {}, config)
        ])
        this.connections_mix = connections.data
      } catch (e) {
        console.error(e);
      }
    },
    async patchMixRemKernal(cid: string, kid: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        const [ connections ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'contents/' + cid + '?kid=' + kid + '&remove=true', {}, config)
        ])
        this.connections_mix = connections.data
      } catch (e) {
        console.error(e);
      }
    }
  }
})
