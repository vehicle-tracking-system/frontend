import Vue from 'vue'
import VueRouter from 'vue-router'
import VehiclesLive from '@/views/VehiclesLive'
import Vehicles from '@/views/Vehicles'
import Home from '@/views/Home'
import Login from '@/views/Login'
import User from '@/views/User'
import Users from '@/views/Users'
import History from '@/views/History'
import NotFound from '@/views/NotFound'
import Trackers from '@/views/Trackers'
import store from '../store'
import Live from '@/views/Live'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
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
    path: '/vehicles-live',
    name: 'VehiclesLive',
    component: VehiclesLive,
    meta: { requiresAuth: true }

  },
  {
    path: '/live',
    name: 'Live',
    component: Live,
    meta: { requiresAuth: true }

  },
  {
    path: '/profile',
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
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      requiresAuth: true
      // roles: ['READER', 'ADMIN']
    }
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: Vehicles,
    meta: {
      requiresAuth: true
      // roles: ['READER', 'ADMIN']
    }
  },
  {
    path: '/unatuhorized',
    name: 'Unautorized',
    component: NotFound
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
    if (store.getters.isExpired) {
      store.dispatch('LogOut')
      next('/login')
      return
    }
    // if (to.meta.roles) { // route require some role(s)
    //   let isAuthorized = true
    //   to.meta.roles.forEach(role => {
    //     if (!store.getters.StateUser.roles.includes(role)) {
    //       isAuthorized = false
    //     }
    //   })
    //   if (isAuthorized) {
    //     next()
    //     return
    //   } else {
    //     next('/unauthorized')
    //     return
    //   }
    // }
    if (store.getters.isAuthenticated && !store.getters.isExpired) {
      store.dispatch('RefreshToken').then()
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
