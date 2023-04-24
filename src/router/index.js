import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: () => import('@/router/views/Menu.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/router/views/Dashboard.vue')
  },
  {
    path: '/dashboard/all-events',
    name: 'AllEvents',
    component: () => import('@/router/views/AllDiaryEvents.vue')
  },
  {
    path: '/dashboard/all-announcements',
    name: 'AllAnnouncements',
    component: () => import('@/router/views/AllAnnouncements.vue')
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
    path: '/user-manager',
    name: 'UserManager',
    component: () => import('@/router/views/UserManagement')
  },
  {
    path: '/mediacenter',
    name: 'Mediacenter',
    component: () => import('@/router/views/Mediacenter')
  },
  {
    path: '/mediacenter-manager',
    name: 'MediacenterManager',
    component: () => import('@/router/views/MediacenterManager')
  },
  {
    path: '/messaging/:messageId(\\d+)?',
    name: 'Messaging',
    component: () => import('@/router/views/Messaging')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/router/views/Maintenance')
  },
  {
    path: '/groups',
    name: 'Groups',
    component: () => import('@/router/views/Groups')
  },
  {
    path: '/planning',
    name: 'Planning',
    component: () => import('@/router/views/Planning.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/router/views/Statistics')
  },
  {
    path: '/viewer/:fileEntryId(\\d+)?',
    name: 'Viewer',
    component: () => import('@/router/views/Viewer')
  },
  {
    path: '/advanced-search',
    name: 'AdvancedSearch',
    component: () => import('@/router/views/AdvancedSearch')
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
