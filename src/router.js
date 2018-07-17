import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'

Vue.use(Router)

var router = new Router({
  routes: [],
  linkActiveClass: 'router-link-active theme-text-color'
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

router.afterEach((to, from) => {
  store.dispatch('updateActiveRoute', to.path)
})

export default router
