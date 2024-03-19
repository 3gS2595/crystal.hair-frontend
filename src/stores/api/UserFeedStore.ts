import { computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

import type { userFeedStoreType } from '@/types/index'
import type { userFeedType } from '@/types/ApiTypes'
import { SessionStore } from '@/stores/SessionStore'

const defaultState: userFeedStoreType = {
  user_feed: {
    folders: [],
    feed_mixtape: [],
    feed_sources:[],
  } as userFeedType,
}
const apiUrl = SessionStore().getUrlRails + 'user_feeds'
const auth = computed({
  get(){ return { headers: {"Authorization" : SessionStore().auth_token}} },
  set(){}
})

export const useUserFeedStore = defineStore({
  id: 'useUserFeedStore',
  state: (): userFeedStoreType => ({ ...structuredClone(defaultState) }),
  actions: {
    reset() {
      Object.assign(this, structuredClone(defaultState));
    },

    async fetchUserFeed () {
      try {
        this.user_feed = (await axios.get(`${apiUrl}`, auth.value)).data
      } catch (e) {
        console.error(e)
      }
    },

    async patchFeedToggleMix(mid: string) {
      try {
        const option = (this.user_feed.feed_mixtape.includes(mid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${apiUrl}?mid=${mid}&${option}=true`, {}, auth.value)).data
      } catch (e) {
        console.error(e)
      }
    },

    async patchFeedToggleSrc(sid: string) {
      try {
        const option = (this.user_feed.feed_sources.includes(sid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${apiUrl}?sid=${sid}&${option}=true`, {}, auth.value)).data
      } catch (e) {
        console.error(e)
      }
    }
  }
})
