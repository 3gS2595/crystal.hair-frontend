import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue)

app.mount('#app')
