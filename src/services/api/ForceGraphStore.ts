import { defineStore } from 'pinia'
import { GlobalStore } from '@/services/GlobalStore'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

import type { kernalType } from '@/assets/types/ApiTypes'
const defaultState = {
    forceGraph: <kernalType[]>[],
}
export const useForceGraphStore = defineStore({
  id: 'useForceGraphStore',
  state: () => ({ ...structuredClone(defaultState)}),

  actions: {
    async fetchForceGraph () {
      let params = '?q=' + GlobalStore().filter + '&forceGraph=true'
      const config = {
        headers: { Authorization: SessionStore().auth_token },
      }
      if (GlobalStore().mixtape != '') { params = params + '&mixtape=' +  GlobalStore().mixtape }
      try {
        const forceGraph = await axios.get(SessionStore().getUrlRails + 'kernals'+ params, config)
        this.forceGraph = forceGraph.data
      } catch (e) {
        console.error(e);
      }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
