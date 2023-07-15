import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import { ApiStore } from '../store/ApiStore'
import { storeToRefs } from 'pinia' // eslint-disable-line
import { useDark, useToggle } from '@vueuse/core'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: IndexView,
    beforeEnter: (to, from, next) => {
      const { hypertexts } = storeToRefs(ApiStore())
      // avoids refetch on route change
      if (hypertexts.value.length < 1) {
        const apiStore = ApiStore()
        const userToken = apiStore.initialize()
        userToken.then(function (data) {
          console.log(data)
          console.log(data[0].data)

          const userToken = apiStore.initialize()
          userToken.then(function (data) {
            console.log(data)
            console.log(data[1].data)
            next()
          })
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
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    beforeEnter: (to, from, next) => {
      const { hypertexts } = storeToRefs(ApiStore())
      // avoids refetch on route change
      if (hypertexts.value.length < 1) {
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
