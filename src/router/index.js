import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Account from '../views/Account.vue'
import Landing from '../views/Landing.vue'
import DishDetail from '../views/DishDetail.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dish/:id',
    name: 'DishDetail',
    component: DishDetail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
    meta: {
      requiresAuth: false
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let user = store.state.user
  if(to.matched.some(rec => rec.meta.requiresAuth)) {
    if(user) {
      next() // User signed in, proceed
    } else {
      next({name: 'Landing'})
    }
  } else if(user && to.name == 'Landing'){
    next({ name: 'Dashboard' })
  }
  else {
    next()
  }

})

export default router
