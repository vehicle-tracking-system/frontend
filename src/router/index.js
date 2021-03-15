import Vue from 'vue'
import VueRouter from 'vue-router'
import Vehicles from '@/views/Vehicles'
import Login from '@/views/Login'
import User from '@/views/User'
import History from '@/views/History'
import NotFound from '@/views/NotFound'
import Trackers from '@/views/Trackers'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NotFound.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }

  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: Vehicles,
    meta: { requiresAuth: true }

  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/trackers',
    name: 'Trackers',
    component: Trackers,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: { guest: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
