import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/IndexView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
