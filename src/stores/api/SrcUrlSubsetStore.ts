import { defineStore } from 'pinia'
import { GlobalStore } from '@/stores/GlobalStore'
import { SessionStore } from '@/stores/SessionStore'
import axios from 'axios'
import { computed } from 'vue'
import { useUserFeedStore } from '@/stores/api/UserFeedStore'

import type { srcUrlSubsetType } from '@/types/ApiTypes'

const userFeedStore = useUserFeedStore()
const base = SessionStore().getUrlRails + 'src_url_subsets'
const auth = computed({
  get() {return { headers: {"Authorization" : SessionStore().auth_token}}},
  set() {}
})
const defaultState = {
  srcUrlSubsets: [{
    id: '',
    src_url_id: '',
    contents: '',
    url: '',
    name: 'loading...',
    scrape_interval: 0,
    time_last_scraped: new Date(),
    permissions: [],
    created_at: new Date(),
    updated_at: new Date()
  }] as srcUrlSubsetType[],
  srcUrlTree: [
    {
      text: 'loading...',
      children: [{}]
    }
  ]
}

export const useSrcUrlSubsetStore = defineStore('srcUrlSubset', {
  state: () => ({ ...structuredClone(defaultState) }),

  actions: {
    async fetchSrcUrlSubsets() {
      try {
      const config = {
          headers: { Authorization:  SessionStore().auth_token }
      }
      try { this.srcUrlSubsets  = (await axios.get(SessionStore().getUrlRails + 'src_url_subsets', config)).data }
      catch (e) {console.error(e)}
        console.log(this.srcUrlSubsets[0])

      this.srcUrlTree = []
      this.srcUrlTree.push({text: "Feed", children: []})
      this.srcUrlTree.push({text: "Last Updated", children: []})
      for (const sub of this.srcUrlSubsets) {
        if(userFeedStore.user_feed.feed_sources.includes(sub.id)){
            this.srcUrlTree[this.srcUrlTree.length - 2].children.push({text:sub.name, id:sub.id, contents: sub.content_id, time_last_entry: sub.time_last_entry})
        }
        this.srcUrlTree[this.srcUrlTree.length - 1].children.push({text:sub.name, id:sub.id, contents: sub.content_id, time_last_entry: sub.time_last_entry})
      }

      } catch (e) {
        console.error(e)
      }
    },

    async addSrcUrlSubset(url: string) {
      if (!url) return

      const sessionStore = SessionStore()
      const globalStore = GlobalStore()

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: sessionStore.auth_token
        }
      }

      const formData = new FormData()
      formData.append('url', url)

      try {
        const response = await axios.post(
          sessionStore.getUrlRails + 'src_url_subsets',
          formData,
          config
        )
        const newSubset = response.data
        this.srcUrlSubsets.unshift(newSubset)
        globalStore.srcUrlSubset = newSubset.id
      } catch (e) {
        console.error(e)
      }
    },

    async deleteSrcUrlSubset(uuid: string) {
      const sessionStore = SessionStore()
      const globalStore = GlobalStore()

      try {
        await axios.delete(
          sessionStore.getUrlRails + 'src_url_subsets/' + uuid,
          {
            headers: { Authorization: sessionStore.auth_token }
          }
        )
        const index = this.srcUrlSubsets.findIndex(i => i.id === uuid)
        if (index !== -1) this.srcUrlSubsets.splice(index, 1)
        globalStore.srcUrlSubset = '-1'
      } catch (e) {
        console.error(e)
      }
    },

    reset() {
      Object.assign(this, structuredClone(defaultState))
    }
  }
})
