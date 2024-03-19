import { createRouter, createWebHistory } from 'vue-router'

import i18n from '@/i18n'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Authentication',
    component: () => import(`@/router/views/${import.meta.env.VITE_CLIENT}Authentication`),
    props: route => ({ redirect: route.query.redirect })
  },
  {
    path: '/authentication-required',
    name: 'AuthenticationRequired',
    component: () => import('@/router/views/AuthenticationRequired'),
    props: route => ({ redirect: route.query.redirect })
  },
  {
    path: '/agree-terms-of-use',
    name: 'AgreeTermsOfUse',
    meta: { layout: 'PublicLayout' },
    component: () => import('@/router/views/AgreeTermsOfUse')
  },
  {
    path: '/password-change',
    name: 'PasswordChange',
    component: () => import('@/router/views/PasswordChange')
  },
  {
    path: '/dashboard/all-events',
    name: 'AllEvents',
    component: () => import('@/router/views/AllDiaryEvents')
  },
  {
    path: '/dashboard/all-announcements',
    name: 'AllAnnouncements',
    component: () => import('@/router/views/AllAnnouncements')
  },
  {
    path: '/dashboard/all-activities',
    name: 'AllActivities',
    component: () => import('@/router/views/AllActivities')
  },
  {
    path: '/documents/groups/:folderId(.*)?',
    name: 'GroupDocuments',
    component: () => import('@/router/views/Documents')
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
  },
  {
    path: '/logbook',
    name: 'Logbook',
    component: () => import('@/router/views/Logbook')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Update browser tab title
  const name = i18n.global.t('Menu.' + to.name)
  document.title = name || 'Facile'

  // Handle usurpation
  if (from.query.doAsUserId && !to.query.doAsUserId) {
    next({ ...to, query: { ...to.query, doAsUserId: from.query.doAsUserId } })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // Update menu CSS
  store.dispatch('menu/updateActiveRoute', to.path)

  // Register matomo hit if service changes
  const fromService = from.fullPath.split('/')[1]
  const toService = to.fullPath.split('/')[1]
  if (fromService !== toService) {
    // Matomo stats : use window._paq instead of this.$matomo because this one is not in the context
    if (store.state.user.schoolList !== undefined && store.state.user.schoolList[0] !== undefined) {
      window._paq.push(['setCustomDimension', 1, store.state.user.schoolList[0].schoolId])
      window._paq.push(['setCustomDimension', 2, store.state.user.profileId])
      window._paq.push(['setCustomDimension', 4, to.meta.id])
      window._paq.push(['trackPageView', toService])
    }
  }
})

export default router
