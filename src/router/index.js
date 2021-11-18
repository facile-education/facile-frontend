import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: () => import('@/router/views/Menu.vue')
  },
  {
    path: '/application-manager',
    name: 'Application Manager',
    component: () => import('@/router/views/ApplicationManager.vue')
  },
  {
    path: '/dashboard-manager',
    name: 'Dashboard Manager',
    component: () => import('@/router/views/DashboardManager.vue')
  },
  {
    path: '/communication-manager',
    name: 'Communication Manager',
    component: () => import('@/router/views/CommunicationManager.vue')
  },
  {
    path: '/not-usual-slots',
    name: 'Not usual slots',
    component: () => import('@/router/views/NotUsualSlotsManager')
  },
  {
    path: '/horaires',
    name: 'Horaires',
    component: () => import('@/router/views/Horaires')
  },
  {
    path: '/progression/:progressionId(\\d+)?',
    name: 'Progression',
    component: () => import('@/router/views/Progression')
  },
  {
    path: '/progression/seance/:itemId(\\d+)?',
    name: 'Seance',
    component: () => import('@/router/views/ProgressionSeance')
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/router/views/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
