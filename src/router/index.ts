
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/IndexView.vue')
  },
  {
    path: '/annex',
    component: () => import('@/views/AnnexView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
