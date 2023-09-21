import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { SessionStore } from "@/store/SessionStore";
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.mount('#app')

const storeSessions = SessionStore();

/**
 * Load JWT from Local Storage on Refresh
 */
console.log("Loading JWT from Local Storage");
let localAuthToken = localStorage.auth_token;
let cookieExists = localAuthToken !== "undefined" && localAuthToken !== null;
if (cookieExists) {
  const auth_token = localStorage.getItem("auth_token");
  const authTokenExists = auth_token !== "undefinde" && auth_token !== null;
  console.log(`authTokenExists?: ${authTokenExists}`);
  if (authTokenExists) {
    storeSessions.loginUserWithToken({ auth_token });
  }
}
