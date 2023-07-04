import { defineStore } from 'pinia'
import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.180:3000/'
})

export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    rss: [],
    sites: [],
    names: []
  }),
  getters: {
    getRss (state) {
      return state.rss
    }
  },
  actions: {
    async apiFetch (UrlExt: string) {
      return api
        .get(UrlExt)
        .then((res) => (this.rss = res.data))
        .catch((err) => {
          if (err.response) {
            console.log('APIFETCH ERROR: @/' + UrlExt)
            console.log(err.response)
          }
        })
    }
  }
})
