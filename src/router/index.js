import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/Menu.vue')
  },
  {
    path: '/application-manager',
    name: 'Application Manager',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/ApplicationManager.vue')
  },
  {
    path: '/dashboard-manager',
    name: 'Dashboard Manager',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/DashboardManager.vue')
  },
  {
    path: '/communication-manager',
    name: 'Communication Manager',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/CommunicationManager.vue')
  },
  {
    path: '/not-usual-slots',
    name: 'Not usual slots',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/NotUsualSlotsManager')
  },
  {
    path: '/horaires',
    name: 'Horaires',
    component: () => import(/* webpackChunkName: "about" */ '@/router/views/Horaires')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
