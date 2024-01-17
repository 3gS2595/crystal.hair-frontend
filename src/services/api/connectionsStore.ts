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
    async fetchMixtapes () {
      console.log('CONNECTION  FETCH')
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

      console.log('CONNECTION  RETREIVED')
    }
  }
})
