import { defineStore } from 'pinia'
import sessionManager from '../store/modules/session_manager.js'
import axios from 'axios'

const base = 'http://3.130.240.169:3000/'
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
        headers: {
          authorization: 'Bearer ' + sessionManager.state.auth_token
        }
      }

      // Make first two requests
      const [hypertexts, kernals, linkContents, sourceUrls] = await Promise.all([
        axios.get(base + 'hypertexts', config),
        axios.get(base + 'kernals', config),
        axios.get(base + 'link_contents', config),
        axios.get(base + 'source_urls', config)
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
