import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Authentication',
    component: () => import('@/router/views/Authentication.vue')
  },
  {
    path: '/dashboard/all-events',
    name: 'AllEvents',
    component: () => import('@/router/views/AllDiaryEvents.vue')
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
    path: '/documents/:folderId(\\d+)?',
    name: 'Documents',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/documents/groups/:folderId(.*)?',
    name: 'GroupDocuments',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/documents/recent',
    name: 'Recent',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/messaging/:messageId(\\d+)?',
    name: 'Messaging',
    component: () => import('@/router/views/Messaging')
  },
  {
    path: '/viewer/:fileEntryId(\\d+)?',
    name: 'Viewer',
    component: () => import('@/router/views/Viewer')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/router/views/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'theme-text-color'
})

// Update browser tab title
router.beforeEach((to, from, next) => {
  document.title = to.name || 'Nero'
  next()
})

// Update menu CSS
router.afterEach((to, from) => {
  store.dispatch('nero/updateActiveRoute', to.path)
})

export default router
