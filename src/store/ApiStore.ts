import { defineStore } from 'pinia'
import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.180:3000/'
})
const base = 'http://192.168.1.180:3000/'
export const ApiStore = defineStore({
  id: 'apiData',
  state: () => ({
    rss: [],
    sites: [],
    names: [],
    siteImages: [],
    feeds: []
  }),
  actions: {
    async apiFetch (UrlExt: string) {
      return api
        .get(UrlExt)
        .then((res) => (this.rss = res.data))
        .catch((err) => { console.log(err.response) })
    },
    async initialize () {
      // Make first two requests
      const [rssRes, sitesRes, namesRes, siteImageRes, feeds] = await Promise.all([
        axios.get(base + 'rsses'),
        axios.get(base + 'sites'),
        axios.get(base + 'names'),
        axios.get(base + 'site_images'),
        axios.get(base + 'feeds')
      ])

      // Update state once with all 3 responses
      this.rss = rssRes.data
      this.sites = sitesRes.data
      this.names = namesRes.data
      this.feeds = feeds.data
      this.siteImages = siteImageRes.data
      return [rssRes, sitesRes, namesRes, siteImageRes, feeds]
    }
  }
})
