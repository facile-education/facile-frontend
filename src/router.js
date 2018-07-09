import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
  routes: []
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
