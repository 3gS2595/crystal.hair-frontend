import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { SessionStore } from "@/services/SessionStore";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue)
  .mount('#app')

// Load JWT from Local Storage on Refresh
const storeSessions = SessionStore()
let localAuthToken = localStorage.auth_token
let cookieExists = localAuthToken !== "undefined" && localAuthToken !== null
if (cookieExists) {
  const auth_token = localStorage.getItem("auth_token");
  const authTokenExists = auth_token !== "undefinde" && auth_token !== null
  if (authTokenExists) {
    storeSessions.loginUserWithToken({ auth_token })
  }
}
