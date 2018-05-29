import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/views/Home.vue'
// import About from './views/About.vue'

// const About = () => import('./views/About.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/tableau-de-bord'
    },
    {
      path: '/tableau-de-bord',
      name: 'Tableau de bord',
      component: () => import('./views/Dashboard.vue')
    }
  ]
})
