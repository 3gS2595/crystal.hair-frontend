import { defineStore } from 'pinia'
import sessionManager from '../store/modules/session_manager.js'
import axios from 'axios'
import { watch } from 'vue'
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
const base = store.urlRails 
watch(
  () => store.filter,
  () => {
    ApiStore().search(store.filter)
    console.log(store.filter)
  }
)

export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    hypertexts: [],
    kernals: [],
    linkContents: [],
    sourceUrls: []
  }),
  actions: {

    async initialize () {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token }
      }
      const [hypertexts, kernals, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts', config),
        axios.get(base + 'kernals', config),
        axios.get(base + 'link_contents', config),
        axios.get(base + 'source_urls', config)
      ])
      this.hypertexts = hypertexts.data
      this.kernals = kernals.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
      console.log(this.kernals)
    },
    async search (searchQ) {
      this.hypertexts = []
      this.kernals = []
      this.linkContents = []
      this.sourceUrls = []

      const config = {
        headers: { Authorization: sessionManager.state.auth_token }
      }
      const [hypertexts, kernals, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts?q=' + searchQ, config),
        axios.get(base + 'kernals?q=' + searchQ, config),
        axios.get(base + 'link_contents?q=' + searchQ, config),
        axios.get(base + 'source_urls?q=' + searchQ, config)
      ])
      this.hypertexts = hypertexts.data
      this.kernals = kernals.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
    }
  }
})

