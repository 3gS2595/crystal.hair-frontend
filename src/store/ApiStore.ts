import { defineStore } from 'pinia'
import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.180:3000'
})

export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    rss: [],
    sites: [],
    names: []
  }),
  getters: {
    getUsers (state) {
      return state.rss
    }
  },
  actions: {
    async fetchRss () {
      return api
        .get('/rsses')
        .then((res) => (this.rss = res.data))
    },
    async fetchNames () {
      return api
        .get('/names')
        .then((res) => (this.names = res.data))
    },
    async fetchSites () {
      return api
        .get('/sites')
        .then((res) => (this.sites = res.data))
    }
  }
})
