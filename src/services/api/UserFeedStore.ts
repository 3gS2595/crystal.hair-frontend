import { defineStore } from 'pinia'
import { computed } from 'vue'
import axios from 'axios'

import { SessionStore } from '@/services/SessionStore'
const url = SessionStore().getUrlRails + 'user_feeds'
const auth = computed({
  get(){ return { headers: {"Authorization" : SessionStore().auth_token}} },
  set(){}
})

import type { userFeedStoreType } from '@/types/index'
import type { userFeedType } from '@/types/ApiTypes'
const defaultState: userFeedStoreType = {
  user_feed: {
    folders: [],
    feed_mixtape: [],
    feed_sources:[],
  } as userFeedType,
}

export const useUserFeedStore = defineStore({
  id: 'useUserFeedStore',
  state: (): userFeedStoreType => ({
    ...structuredClone(defaultState)
  }),
  actions: {
    async fetchUserFeed () {
      try { this.user_feed = (await axios.get(`${url}`, auth.value)).data
      } catch (e) { console.error(e) }
    },
    async patchFeedToggleMix(mid: string) {
      try {
        const option = (this.user_feed.feed_mixtape.includes(mid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${url}?mid=${mid}&${option}=true`, {}, auth.value)).data
      } catch (e) { console.error(e) }
    },
    async patchFeedToggleSrc(sid: string) {
      try {
        const option = (this.user_feed.feed_sources.includes(sid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${url}?sid=${sid}&${option}=true`, {}, auth.value)).data
      } catch (e) { console.error(e) }
    },
    reset() {
      Object.assign(this, structuredClone(defaultState));
    }
  }
})
