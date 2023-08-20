import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/index',
    component: () => import('@/views/IndexView.vue')
  },
  {
    path: '/annex',
    component: () => import('@/views/AnnexView.vue')
  },
  {
    path: '/',
    redirect: to => {
      return { path: '/index'}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
