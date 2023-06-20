import { createRouter, createWebHistory } from 'vue-router'

import { DOCUMENTS, MESSAGING, PROGRESSION } from '@/constants/appConstants'
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
    component: () => import('@/router/views/Authentication'),
    props: route => ({ redirect: route.query.redirect })
  },
  {
    path: '/agree-terms-of-use',
    name: 'AgreeTermsOfUse',
    component: () => import('@/router/views/AgreeTermsOfUse')
  },
  {
    path: '/password-change',
    name: 'PasswordChange',
    component: () => import('@/router/views/PasswordChange')
  },
  {
    path: '/tableau-de-bord/all-events',
    name: 'AllEvents',
    component: () => import('@/router/views/AllDiaryEvents')
  },
  {
    path: '/tableau-de-bord/all-announcements',
    name: 'AllAnnouncements',
    component: () => import('@/router/views/AllAnnouncements')
  },
  {
    path: '/tableau-de-bord/all-activities',
    name: 'AllActivities',
    component: () => import('@/router/views/AllActivities')
  },
  {
    path: '/progression/:progressionId(\\d+)?',
    name: PROGRESSION,
    component: () => import('@/router/views/Progression')
  },
  {
    path: '/progression/seance/:itemId(\\d+)?',
    name: 'Seance',
    component: () => import('@/router/views/ProgressionSeance')
  },
  {
    path: '/documents/:folderId(\\d+)',
    name: DOCUMENTS,
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
    path: '/messagerie/:messageId(\\d+)',
    name: MESSAGING,
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

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replaceAll('-', ' ')
}

router.beforeEach((to, from, next) => {
  // Update browser tab title
  const name = capitalize(i18n.global.t('Menu.' + to.name))
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
