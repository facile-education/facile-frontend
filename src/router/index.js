import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Authentication',
    component: () => import('@/router/views/Authentication.vue')
  },
  {
    path: '/access-manager',
    name: 'AccessManager',
    component: () => import('@/router/views/AccessManager.vue')
  },
  {
    path: '/agree-terms-of-use',
    name: 'AgreeTermsOfUse',
    component: () => import('@/router/views/AgreeTermsOfUse.vue')
  },
  {
    path: '/password-change',
    name: 'PasswordChange',
    component: () => import('@/router/views/PasswordChange.vue')
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
    path: '/dashboard/all-activities',
    name: 'AllActivities',
    component: () => import('@/router/views/AllActivities.vue')
  },
  {
    path: '/sessions-and-homeworks',
    name: 'SessionsAndHomeworks',
    component: () => import('@/router/views/SessionsAndHomeworks.vue')
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
    path: '/documents/:folderId(\\d+)',
    name: 'Documents',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/documents/groups/:folderId(.*)',
    name: 'GroupDocuments',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/documents/recent',
    name: 'Recent',
    component: () => import('@/router/views/Documents')
  },
  {
    path: '/messagerie/:messageId(\\d+)',
    name: 'Messagerie',
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
  // Matomo stats : use window._paq instead of this.$matomo because this one is not in the context
  if (store.state.user.schoolList !== undefined && store.state.user.schoolList[0] !== undefined) {
    window._paq.push(['setCustomDimension', 1, store.state.user.schoolList[0].schoolId])
    window._paq.push(['setCustomDimension', 2, store.state.user.profileId])
    window._paq.push(['setCustomDimension', 4, to.meta.id])
    window._paq.push(['trackPageView'])
  }
})

export default router
