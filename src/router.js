import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import i18n from './lang/lang.js'

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
  store.dispatch('nero/updateActiveRoute', to.path)
})

router.getMobileMenu = (menu) => {
  if (!menu) return []

  var mobileMenu = []
  for (var idx = 0; idx < menu.length; ++idx) {
    if (!menu[idx].isLeaf) {
      mobileMenu = mobileMenu.concat(router.getMobileMenu(menu[idx].menu))
    } else if (menu[idx].isMobile) {
      mobileMenu.push(menu[idx])
    }
  }

  return mobileMenu
}

router.createRoutes = (menu) => {
  router.addRoutes(getRoutes(menu))
}

var setHomeRoute = (entry) => {
  return {
    path: '/',
    redirect: entry.route
  }
}

// TODO get current language ?
var getRouteEntry = (entry) => {
  if (entry.component) {
    return {
      path: entry.route,
      name: i18n.getLocaleMessage('fr').SideMenu.entry[entry.key],
      meta: {title: i18n.getLocaleMessage('fr').SideMenu.entry[entry.key]},
      component: () => import('@/views/' + entry.component + '.vue')
    }
  }
}

var getRoutes = (menu) => {
  if (!menu) return []

  var routes = []
  for (var idx = 0; idx < menu.length; ++idx) {
    if (menu[idx].isLeaf) {
      if (menu[idx].isDefault) {
        routes.push(setHomeRoute(menu[idx]))
      }
      var route = getRouteEntry(menu[idx])
      if (route !== undefined) {
        routes.push(route)
      }
    } else {
      routes = routes.concat(getRoutes(menu[idx].menu))
    }
  }
  return routes
}

export default router
