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
        headers: { Authorization: sessionManager.state.auth_token },
      }
      const [hypertexts, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts', config),
        axios.get(base + 'link_contents', config),
        axios.get(base + 'source_urls', config)
      ])
      this.hypertexts = hypertexts.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
      this.fetchKernals(1)
    },
    async search (searchQ) {
      this.hypertexts = []
      this.linkContents = []
      this.sourceUrls = []
      this.kernals = []
      const config = {
        headers: { Authorization: sessionManager.state.auth_token }
      }
      const [hypertexts, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts?q=' + searchQ, config),
        axios.get(base + 'link_contents?q=' + searchQ, config),
        axios.get(base + 'source_urls?q=' + searchQ, config)
      ])
      this.hypertexts = hypertexts.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
        this.fetchKernals(1)
    },
    async fetchKernals (pageNumber) {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
      }
      if(store.filter.length > 0){
        const kernals = await axios.get(base + 'kernals?page='+pageNumber+'&q=' + store.filter, config)
        this.kernals = this.kernals.concat(kernals.data)
      }else{
        const kernals = await axios.get(base + 'kernals?page='+pageNumber, config)
        this.kernals = this.kernals.concat(kernals.data)
      }
    }
  }
})
