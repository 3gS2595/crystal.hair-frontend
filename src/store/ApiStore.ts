import { defineStore } from 'pinia'
import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.180:3000/'
})
const base = 'http://192.168.1.180:3000/'
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
      // Make first two requests
      const [hypertexts, kernals, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts'),
        axios.get(base + 'kernals'),
        axios.get(base + 'link_contents'),
        axios.get(base + 'source_urls')
      ])

      // Update state once with all 3 responses
      this.hypertexts = hypertexts.data
      this.kernals = kernals.data
      this.linkContents = linkContents.data
      this.sourceUrls = sourceUrls.data

      return [hypertexts, kernals, linkContents, sourceUrls]
    }
  }
})
