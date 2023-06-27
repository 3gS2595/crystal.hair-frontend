import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './views/HomeView.vue'

createApp(App).use(router).use(createPinia()).mount('#app')
