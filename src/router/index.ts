import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { ApiStore } from '../store/ApiStore'
import { storeToRefs } from 'pinia' // eslint-disable-line

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      const { rss } = storeToRefs(ApiStore())
      // avoids refetch on route change
      if (rss.value.length < 1) {
        const apiStore = ApiStore()
        const userToken = apiStore.initialize()
        userToken.then(function (data) {
          console.log(data)
          next()
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
