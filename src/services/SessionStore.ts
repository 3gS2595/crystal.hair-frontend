import { defineStore } from "pinia"
import axios from "axios"

export const SessionStore = defineStore("session", {
  state: () => ({
    urlVue: 'http://3.130.240.169/',
    urlRails: 'http://3.130.240.169:3000/',
    urlS3: 'https://crystal-hair.nyc3.digitaloceanspaces.com/',
    urlS3Nail: 'https://crystal-hair-nail.nyc3.digitaloceanspaces.com/',

    auth_token: null as string | null,
    user: {
      id: null,
      username: null,
      email: null
    }
  }),
  getters: {
    getUrlVue: (state) => {
      return state.urlVue
    },
    getUrlRails: (state) => {
      return state.urlRails
    },
    getUrlS3: (state) => {
      return state.urlS3
    },
    getUrlS3Nail: (state) => {
      return state.urlS3Nail
    },
    getAuthToken: (state) => {
      return state.auth_token
    },
    getUserEmail: (state) => {
      return state.user?.email
    },
    getUserID: (state) => {
      return state.user?.id
    },
    isLoggedIn: (state) => {

      state.auth_token = localStorage.getItem("auth_token")
      const loggedOut =
        state.auth_token == null || state.auth_token == JSON.stringify(null)
      return !loggedOut
    }
  },
  actions: {
    registerUser(payload: any) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.urlRails}users`, payload)
          .then((response) => {
            this.setUserInfo(response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    loginUser(payload: any) {
      console.log(payload)
      new Promise((resolve, reject) => {
        axios
          .post(`${this.urlRails}users/sign_in`, payload)
          .then((response) => {
            this.setUserInfo(response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    logoutUser() {
      console.log("logoutUser()")
      console.log(this.auth_token)
      const config = {
        headers: {
          Authorization: this.auth_token
        }
      }
      new Promise<void>((resolve, reject) => {
        axios
          .delete(`${this.urlRails}users/sign_out`, config)
          .then(() => {
            //Reset user info
            this.resetUserInfo()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    loginUserWithToken(payload: any) {
      console.log("loginUserWithToken storeSessions.js")
      const config = {
        headers: {
          Authorization: payload.auth_token,
        }
      }
      new Promise((resolve, reject) => {
        axios
          .get(`${this.urlRails}member-data`, config)
          .then((response) => {
            //setUserInfoFromToken
            this.setUserInfoFromToken(response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    setUserInfo(data: any) {
      this.user = data.data.user;
      this.auth_token = data.headers.authorization;
      axios.defaults.headers.common["Authorization"] =
        data.headers.authorization
      localStorage.setItem("auth_token", data.headers.authorization)
    },
    setUserInfoFromToken(data: any) {
      this.user = data.data.user
      this.auth_token = localStorage.getItem("auth_token")
    },
    resetUserInfo() {
      this.user = {
        id: null,
        username: null,
        email: null
      }
      this.auth_token = null
      localStorage.removeItem("auth_token")
      axios.defaults.headers.common["Authorization"] = null
    },
  }
})
