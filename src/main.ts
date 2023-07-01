import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(PrimeVue)
app.mount('#app')
