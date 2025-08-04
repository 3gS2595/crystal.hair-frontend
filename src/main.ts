import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'
import VueClickAway from 'vue3-click-away'

const app = createApp(App)
const pinia = createPinia()
app.use(VueClickAway)
app.use(PrimeVue)
app.use(pinia)
app.use(router)

app.mount('#app')
