
import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import store from '@/store/index' // eslint-disable-line

const app = createApp(App)

app.use(createPinia())
app.use(store)
app.use(router)
app.use(PrimeVue)

//Load JWT from Local Storage on Refresh.
const localAuthToken = localStorage.auth_token
const cookieExists = localAuthToken !== 'undefined' && localAuthToken !== null
if (cookieExists) {
  const auth_token = localStorage.getItem('auth_token') // eslint-disable-line
  const authTokenExists = auth_token !== 'undefined' && auth_token !== null // eslint-disable-line
  if (authTokenExists) {
    store.dispatch('loginUserWithToken', { auth_token }).then(() => {
      app.mount('#app')
    }) 
  } else {
      app.mount('#app')
  }
}

