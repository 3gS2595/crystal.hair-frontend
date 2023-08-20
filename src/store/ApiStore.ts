import { defineStore } from 'pinia'
import sessionManager from '../store/modules/session_manager.js'
import axios, { AxiosInstance, CancelTokenStatic } from 'axios'
import { watch, ref } from 'vue'
import { filterStore } from '@/store/FilterStore'

let controller = new AbortController();
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
watch(
  () => store.mixtape,
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
    mixtapes: [],
  }),
  actions: {
    async initialize () {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
      }
      const params = '?sort=' + store.sortBy
      const [hypertexts, linkContents, sourceUrls, mixtapes] = await Promise.all([
        axios.get(base + 'hypertexts' + params, config),
        axios.get(base + 'link_contents' + params, config),
        axios.get(base + 'source_urls' + params, config)
        axios.get(base + 'mixtapes' + params, config)
      ])
      this.hypertexts = hypertexts.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
      this.mixtapes = mixtapes.data
      this.fetchKernals(1)
      console.log(this.mixtapes)
    },

    async search () {
    controller.abort()
    controller = new AbortController();
      this.hypertexts = []
      this.linkContents = []
      this.sourceUrls = []
      this.kernals = []
      console.log(store.sortBy)
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&sort=' + store.sortBy 
      if store.mixtape != '' {
        params = '?mixtape=' + store.mixtape + '&sort=' + store.sortBy
      }
      try {
      const [hypertexts, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts' + params, config),
        axios.get(base + 'link_contents' + params, config),
        axios.get(base + 'source_urls' + params, config)
      ])
      this.hypertexts = hypertexts.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data
      this.fetchKernals(1)
      } catch (error) {
        console.error(error);
      }
    },
 
    async fetchKernals (pageNumber) {

      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy 
      if store.mixtape != '' {
        params = '?mixtape=' + store.mixtape + '&page=' + pageNumber + '&sort=' + store.sortBy
      }
      try {
        if (store.filter.length > 0) {
          const kernals = await axios.get(base + 'kernals'+ params +'&q=' + store.filter, config)
          this.kernals = this.kernals.concat(kernals.data)
        } else {
          const kernals = await axios.get(base + 'kernals'+ params, config)
          this.kernals = this.kernals.concat(kernals.data)
        }
      } catch (error) {
        console.error(error);
      }
      // dropdown sort options
      if(this.kernals.length===20){ 
        const singledata = this.kernals[0]
        const keys = []
        for (let k in singledata){
          if(k != 'signed_url' && k != 'signed_url_nail' && k != 'id' && k != 'file_path') {
            keys.push(k)
          }
        }
        store.setSortByValue(keys) 
      }
       
    }
  }
})
