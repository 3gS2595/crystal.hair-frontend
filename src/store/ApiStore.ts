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
    ApiStore().search()
  }
)
watch(
  () => store.sortBy,
  () => {
    ApiStore().search()
  }
)

export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    hypertexts: [],
    kernals: [],
    linkContents: [],
    sourceUrls: [],
  }),
  actions: {
    async initialize () {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
      }
      const params = '?sort=' + store.sortBy
      const [hypertexts, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts' + params, config),
        axios.get(base + 'link_contents' + params, config),
        axios.get(base + 'source_urls' + params, config)
      ])
      this.hypertexts = hypertexts.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
      this.fetchKernals(1)
    },

    async search () {
      this.hypertexts = []
      this.linkContents = []
      this.sourceUrls = []
      this.kernals = []
      console.log(store.sortBy)
      const config = {
        headers: { Authorization: sessionManager.state.auth_token }
      }
      const params = '?sort=' + store.sortBy + '&q=' + store.filter
      const [hypertexts, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts' + params, config),
        axios.get(base + 'link_contents' + params, config),
        axios.get(base + 'source_urls' + params, config)
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


      const params = '?page=' + pageNumber + '&sort=' + store.sortBy
      if (store.filter.length > 0) {
        const kernals = await axios.get(base + 'kernals'+ params +'&q=' + store.filter, config)
        this.kernals = this.kernals.concat(kernals.data)
      } else {
        const kernals = await axios.get(base + 'kernals'+ params, config)
        this.kernals = this.kernals.concat(kernals.data)
      }
      if(this.kernals.length===20){ 
        const singledata = this.kernals[0]
        const keys = []
        for (let k in singledata) keys.push(k)
        store.setSortByValue(keys) 
      }
       
    }
  }
})
