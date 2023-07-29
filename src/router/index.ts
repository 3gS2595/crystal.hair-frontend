import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/IndexView.vue')
  },
  {
    path: '/annex',
    component: () => import('@/views/AnnexView.vue')
  },
  {
    path: '/input',
    component: () => import('@/views/InputView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
