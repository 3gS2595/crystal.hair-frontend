import type { connectionsMixType, connectionsSrcType} from '@/assets/types/ApiTypes'

import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import { defineStore } from 'pinia'
export const useConnectionsStore = defineStore({
  id: 'useConnectionsStore',
  state: () => ({
    connections_mix: [{
      id: '',
      contains: [],
      permissions:[],
      created_at: new Date(),
      updated_at: new Date(),
    }] as connectionsMixType[],
    connections_src: [{
      id: '',
      contains: [],
      permissions:[],
      created_at: new Date(),
      updated_at: new Date()
    }] as connectionsSrcType[]
  }),

  actions: {
    async fetchConnections () {
      let params = '?mix=true'
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const mixtapes = await axios.get(SessionStore().getUrlRails + 'contents' + params, config)
        this.connections_mix = mixtapes.data
      } catch (e) {
        console.error(e);
      }
      params = '?src=true'
      try {
        const srcs = await axios.get(SessionStore().getUrlRails + 'contents' + params, config)
        this.connections_src = srcs.data
        console.log(this.connections_src)
      } catch (e) {
        console.error(e);
      }
    },
    async patchMixAddKernal(cid: string, kid: string) {
      const config = {headers: { authorization: SessionStore().auth_token }}
      try {
        const [ connections ] = await Promise.all([
          axios.patch(SessionStore().getUrlRails + 'contents/' + cid + '?kid=' + kid + '&add=true', {}, config)
        ])
        this.connections_mix = connections.data
//        if (this.connections_mix.find((o) => o.id === cid) != null) {
//        const i = Array.prototype.findIndex.call(this.connections_mix, (x) => x.id = cid)
//          console.log(this.connections_mix[i])
//          console.log(connections.data)
//          this.connections_mix[i] = connections.data
//        }
      } catch (e) {
        console.error(e);
      }
    },
    async patchMixRemKernal(cid: string, kid: string) {
      const config = {headers: { authorization: SessionStore().auth_token }}
      try {
        const [ connections ] = await Promise.all([
          axios.patch(SessionStore().getUrlRails + 'contents/' + cid + '?kid=' + kid + '&remove=true', {}, config)
        ])
        this.connections_mix = connections.data
      } catch (e) {
        console.error(e);
      }
    }
  }
})
