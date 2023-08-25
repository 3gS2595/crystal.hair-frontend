import { defineStore } from 'pinia'
import sessionManager from '../store/modules/session_manager.js'
import axios, { AxiosInstance, CancelTokenStatic } from 'axios'
import { watch, ref } from 'vue'
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
const base = store.urlRails
let controller = new AbortController();

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
        signal: controller.signal
      }
      const params = '?sort=' + store.sortBy
      const [ linkContents ] = await Promise.all([
        axios.get(base + 'link_contents' + params, config),
        this.fetchHypertexts(1)
      ])
      this.linkContents = linkContents.data
      this.fetchSourceUrls(1)
      this.fetchMixtapes(1)
      this.fetchKernals(1)
    },

    async search () {
      controller.abort()
      controller = new AbortController();

      this.mixtapes = []
      this.hypertexts = []
      this.linkContents = []
      this.sourceUrls = []
      this.kernals = []

      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&sort=' + store.sortBy 

      try {
        const [ linkContents ] = await Promise.all([
          axios.get(base + 'link_contents' + params, config),
        ])
        this.linkContents = linkContents.data
        this.fetchSourceUrls(1)
        this.fetchMixtapes(1)
        this.fetchKernals(1)
        this.fetchHypertexts(1)
      } catch (e) {
        console.error(e);
      }
    },
 
    async fetchKernals (pageNumber) {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy 
      if (store.mixtape != '') { params = params + '?mixtape=' + store.mixtape }

      try {
        const kernals = await axios.get(base + 'kernals'+ params +'&q=' + store.filter, config)
        this.kernals = this.kernals.concat(kernals.data)
        
        if(this.kernals.length === 20){ 
          const keys: string[] = []
          for (let k in this.kernals[0]){
            if(k != 'signed_url' && k != 'signed_url_nail' && k != 'id' && k != 'file_path') {
              keys.push(k)
            }
          }
          store.setSortByValue(keys)
        }
      } catch (e) {
        console.error(e);
      }
    },

    async fetchHypertexts (pageNumber) {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy 

      try {
        const hypertexts = await axios.get(base + 'hypertexts'+ params +'&q=' + store.filter, config)
        this.hypertexts = this.hypertexts.concat(hypertexts.data)
      } catch (e) {
        console.error(e);
      }
      return []
    },

    async fetchMixtapes (pageNumber) {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy 

      try {
        const mixtapes = await axios.get(base + 'mixtapes'+ params +'&q=' + store.filter, config)
        this.mixtapes = this.mixtapes.concat(mixtapes.data)
      } catch (e) {
        console.error(e);
      }
      return []
    },

    async fetchSourceUrls (pageNumber) {
      const config = {
        headers: { Authorization: sessionManager.state.auth_token },
        signal: controller.signal
      }
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy 

      try {
        const sourceUrls = await axios.get(base + 'source_urls'+ params +'&q=' + store.filter, config)
        this.sourceUrls = this.sourceUrls.concat(sourceUrls.data)
      } catch (e) {
        console.error(e);
      }
      return []
    },

  }
})
