import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import store from '@/store/index' // eslint-disable-line
import Vue3TouchEvents from 'vue3-touch-events'
import DraggableResizableVue from 'draggable-resizable-vue3'

/**
 * Load JWT from Local Storage on Refresh.
 */
const localAuthToken = localStorage.auth_token
const cookieExists = localAuthToken !== 'undefined' && localAuthToken !== null
if (cookieExists) {
  const auth_token = localStorage.getItem('auth_token') // eslint-disable-line
  const authTokenExists = auth_token !== 'undefined' && auth_token !== null // eslint-disable-line
  if (authTokenExists) {
    store.dispatch('loginUserWithToken', { auth_token }) // eslint-disable-line
  }
}

const app = createApp(App)
app.use(store)
app.use(router)
app.use(createPinia())
app.use(PrimeVue)
app.use(DraggableResizableVue)
app.use(Vue3TouchEvents, {
  disableClick: false
})

app.mount('#app')
