import type { userFeedType } from '@/assets/types/ApiTypes'

import { defineStore } from 'pinia'
import { SessionStore } from '@/services/SessionStore'
import axios from 'axios'


const sessionStore = SessionStore()
const base = sessionStore.getUrlRails

export const useUserFeedStore = defineStore({
  id: 'useUserFeedStore',
  state: () => ({
    user_feed: {
      id: '',
      folders: [],
      feed_mixtape: [],
      feed_sources:[],
      created_at: new Date(),
      updated_at: new Date()
    } as userFeedType,
  }),

  actions: {
    async fetchUserFeed () {
      const config = {
        headers: { Authorization:  SessionStore().auth_token },
      }
      try {
        const [ user_feed ] = await Promise.all([
          axios.get(base + 'user_feeds', config)
        ])
        this.user_feed = user_feed.data
      } catch (e) {
        console.error(e);
      }
    },
    async patchFeedToggleMix(mid: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        if (this.user_feed.feed_mixtape.includes(mid)) {
          const [ user_feed ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'user_feeds' + '?mid=' + mid + '&remove=true', {}, config)
          ])
          this.user_feed = user_feed.data
        } else {
          const [ user_feed ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'user_feeds'+ '?mid=' + mid + '&add=true', {}, config)
          ])
          this.user_feed = user_feed.data
        }
      } catch (e) {
        console.error(e);
      }
    },
    async patchFeedToggleSrc(sid: string) {
      const config = {headers: { authorization: sessionStore.auth_token }}
      try {
        if (this.user_feed.feed_sources.includes(sid)) {
          const [ user_feed ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'user_feeds' + '?sid=' + sid + '&remove=true', {}, config)
          ])
          this.user_feed = user_feed.data
        } else {
          const [ user_feed ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'user_feeds'+ '?sid=' + sid + '&add=true', {}, config)
          ])
          this.user_feed = user_feed.data
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
})
