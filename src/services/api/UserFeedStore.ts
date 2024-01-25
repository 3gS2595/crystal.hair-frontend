import type { userFeedType } from '@/assets/types/ApiTypes'

import { defineStore } from 'pinia'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'

  const sessionStore = SessionStore()
const auth = { headers: {"Authorization" : `${sessionStore.auth_token}`} }
const url = SessionStore().getUrlRails + 'user_feeds'

export const useUserFeedStore = defineStore({
  id: 'useUserFeedStore',
  state: () => ({
    user_feed: {
      folders: [],
      feed_mixtape: [],
      feed_sources:[],
    } as userFeedType,
  }),

  actions: {
    async fetchUserFeed () {
      try { this.user_feed = (await axios.get(`${url}`, auth)).data
      } catch (e) { console.error(e) }
    },
    async patchFeedToggleMix(mid: string) {
      try {
        const option = (this.user_feed.feed_mixtape.includes(mid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${url}?mid=${mid}&${option}=true`, {}, auth)).data
      } catch (e) { console.error(e) }
    },
    async patchFeedToggleSrc(sid: string) {
      try {
        const option = (this.user_feed.feed_sources.includes(sid)) ? 'remove' : 'add'
        this.user_feed = (await axios.post(`${url}?sid=$sid}&${option}=true`, {}, auth)).data
      } catch (e) { console.error(e) }
    }
  }
})
