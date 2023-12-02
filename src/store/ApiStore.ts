import { defineStore } from 'pinia'
import { watch } from 'vue'
import { GlobalStore } from '@/store/GlobalStore'
import { SessionStore } from '@/store/SessionStore'
import axios from 'axios'

import type {
  kernalType,
  mixtapeType,
  srcUrlSubsetType
} from '@/types/ApiTypes'

const store = GlobalStore()
const sessionStore = SessionStore()
const base = sessionStore.getUrlRails
let controller = new AbortController();

watch(
  () => store.filter,
  () => { ApiStore().search() }
)
watch(
  () => store.sortBy,
  () => { ApiStore().search() }
)
watch(
  () => store.mixtape,
  () => { ApiStore().mixtapeSearch() }
)
watch(
  () => store.srcUrlSubset,
  () => { ApiStore().mixtapeSearch() }
)

export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    kernals: <kernalType[]>[],
    mixtapes: <mixtapeType[]>[],
    forceGraph: <kernalType[]>[],
    srcUrlSubsets: <srcUrlSubsetType[]>[]
  }),

  actions: {
    async initialize () {
      this.fetchKernals(1)
      this.fetchMixtapes(1)
      this.fetchSrcUrlSubsets(1)
      this.fetchForceGraph()
    },

    async search () {
      controller.abort()
      controller = new AbortController();
      this.kernals = []
      this.forceGraph = []

      try {
        this.fetchKernals(1)
        this.fetchForceGraph()
      } catch (e) {
        console.error(e);
      }
    },
    async mixtapeSearch () {
      controller.abort()
      controller = new AbortController();
      this.kernals = []
      this.forceGraph = []

      try {
        this.fetchKernals(1)
        this.fetchForceGraph()
      } catch (e) {
        console.error(e);
      }
    },

    async fetchKernals (pageNumber: number) {
      let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy
      if (store.mixtape != '') { params = params + '&mixtape=' + store.mixtape }
      if (store.srcUrlSubset != '') { params = params + '&src_url_subset_id=' + store.srcUrlSubset }
      const config = {
        headers: { Authorization: sessionStore.auth_token },
        signal: controller.signal
      }
      try {
        const kernals = await axios.get(base + 'kernals'+ params, config)
        this.kernals = this.kernals.concat(kernals.data)
        if(this.kernals.length === store.pageSize){
          const keys: string[] = []
          for (let k in this.kernals[0]){
            if(k != 'signed_url' && k != 'signed_url_s' && k != 'signed_url_m' && k != 'signed_url_l' && k != 'id' && k != 'file_path') {
              keys.push(k)
            }
          }
          store.setSortByValue(keys)
        }
      } catch (e) {
        console.error(e);
      }
    },

    async fetchMixtapes (pageNumber: number) {
      let params = '?page=' + pageNumber + '&sort=' + store.sortBy + '&q=' + store.filter
      const config = {
        headers: { Authorization:  sessionStore.auth_token },
        signal: controller.signal
      }
      try {
        const mixtapes = await axios.get(base + 'mixtapes'+ params, config)
        this.mixtapes = this.mixtapes.concat(mixtapes.data)
        return mixtapes
      } catch (e) {
        console.error(e);
      }
    },
    async fetchSrcUrlSubsets (pageNumber: number) {
      let params = '?page=' + pageNumber + '&q=' + store.filter
      const config = {
        headers: { Authorization:  sessionStore.auth_token },
        signal: controller.signal
      }
      try {
        const newSrcUrlSubset = await axios.get(base + 'src_url_subsets'+ params, config)
        this.srcUrlSubsets = this.srcUrlSubsets.concat(newSrcUrlSubset.data)
      } catch (e) {
        console.error(e);
      }
    },

    async fetchForceGraph () {
      let params = '?q=' + store.filter + '&forceGraph=true'
      const config = {
        headers: { Authorization: sessionStore.auth_token },
        signal: controller.signal
      }
      if (store.mixtape != '') { params = params + '&mixtape=' + store.mixtape }
      try {
        const forceGraph = await axios.get(base + 'kernals'+ params, config)
        this.forceGraph = forceGraph.data
      } catch (e) {
        console.error(e);
      }
    },

    async addMixtape(title: string) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStore.auth_token }
      }
      let formData = new FormData();
      formData.append('name', title)
      if(title !== ''){
        try {
          const [ mix ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'mixtapes', formData, config)
          ])
          this.mixtapes.unshift(mix.data)
          store.setMixtape(mix.data.id)
        } catch (e) {
          console.error(e);
        }
      }
    },
    async addSrcUrlSubset(url: string, name:string, scrapeInterval:string) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStore.auth_token }
      }
      let formData = new FormData();
      formData.append('url', url)
      formData.append('name', name)
      formData.append('scrapeInterval', scrapeInterval)
      if(url !== '' && name !== '' && !isNaN(Number(scrapeInterval))) {
        try {
          const [ src ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'src_url_subsets', formData, config)
          ])
          this.srcUrlSubsets.unshift(src.data)
          store.setSrcUrlSubset(src.data.id)
        } catch (e) {
          console.error(e);
        }
      }
    },

    async deleteMixtape (uuid: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token },
      }
      try {
        axios.delete( sessionStore.getUrlRails + 'mixtapes/' + uuid, config)
        this.mixtapes = this.mixtapes.filter(item => item.id !== uuid)
        store.setMixtape('')
      } catch (e) {
        console.error(e);
      }
    },

    async addKernal(formData: FormData) {
      store.setUploadView(true)
      const config = {
        onUploadProgress: function(progressEvent: any) {
          let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
          store.setUploadPercent(percentCompleted)
          if(percentCompleted === 100) {
            store.setUploadView(false)
            store.setUploadPercent(0)
          }
        },
        headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStore.auth_token }
      }
      if(formData.has("file_type")){
        try {
          const [ ker ] = await Promise.all([
            axios.post( sessionStore.getUrlRails + 'kernals', formData, config)
          ])
          this.kernals.unshift(ker.data)
          this.forceGraph.unshift(ker.data)
          console.log(ker.data)
          if(store.mixtape !== '') {
            this.mixtapes.find(person => person.id === store.mixtape)!.content.unshift(ker.data.id)
          }
        } catch (e) {
          console.error(e);
        }
      }
    },

    async deleteKernal (uuid: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token },
      }
      try {
        axios.delete( sessionStore.getUrlRails + 'kernals/' + uuid, config)
        this.kernals = this.kernals.filter(item => item.id !== uuid)
        if(store.mixtape !== '') {
          this.remMixCont(uuid, store.mixtape)
        }
      } catch (e) {
        console.error(e);
      }
    },

    async addMixCont(kId: string, mId: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token }
      }
      try {
        const [ mix ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'mixtapes/' + mId + '?addKernal=' + kId, {}, config)
        ])
        this.mixtapes = this.mixtapes.filter(item => item.id !== mix.data.id)
        this.mixtapes.unshift(mix.data)
      } catch (e) {
        console.error(e);
      }
    },
    async remMixCont(kId: string, mId: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token }
      }
      try {
        const [ mix ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'mixtapes/' + mId + '?remKernal=' + kId, {}, config)
        ])
        this.mixtapes = this.mixtapes.filter(item => item.id !== mix.data.id)
        this.mixtapes.unshift(mix.data)
        if(store.mixtape === mix.data.id){
          this.kernals = this.kernals.filter(item => item.id !== kId)
        }
      } catch (e) {
        console.error(e);
      }
    },
    async patchKernalDescr(kId: string, text: string) {
      const config = {
        headers: { Authorization: sessionStore.auth_token }
      }
      try {
        const [ kernal ] = await Promise.all([
          axios.patch( sessionStore.getUrlRails + 'kernals/' + kId + '?description=' + text, {}, config)
        ])
        console.log(Array.prototype.findIndex.call(this.kernals, (x) => x.id = kId))
        this.kernals[store.lightBoxIndex] = kernal.data
      } catch (e) {
        console.error(e);
      }
    },
  }
})

