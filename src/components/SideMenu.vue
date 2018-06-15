<template>
  <nav class="side-menu">
    <SideMenuCategory :menu="menu"/>
  </nav>
</template>

<script>
import SideMenuCategory from '@/components/SideMenuCategory'

export default {
  name: 'SideMenu',
  components: {
    SideMenuCategory
  },
  computed: {
    menu () {
      if (this.$store.state.nero.menu !== undefined) {
        var routes = this.addRoutes(this.$store.state.nero.menu)
        this.$router.addRoutes(routes)
      }
      return this.$store.state.nero.menu
    }
  },
  created () {
    if (this.menu === undefined) {
      this.$store.dispatch('initUserMenu')
    }
  },
  methods: {
    getHomeRoute (entry) {
      return {
        path: '/',
        redirect: entry.route
      }
    },
    getRoute (entry) {
      if (entry.component) {
        return {
          path: entry.route,
          name: entry.label,
          component: () => import('@/views/' + entry.component + '.vue')
        }
      }
    },
    addRoutes (menu) {
      var idx
      var routes = []
      for (idx = 0; idx < menu.length; ++idx) {
        if (menu[idx].isLeaf) {
          if (menu[idx].isDefault) {
            routes.push(this.getHomeRoute(menu[idx]))
          }
          var route = this.getRoute(menu[idx])
          if (route !== undefined) {
            routes.push(this.getRoute(menu[idx]))
          }
        } else {
          routes = routes.concat(this.addRoutes(menu[idx].menu))
        }
      }
      return routes
    }
  }
}
</script>

<style lang="scss" scoped>
.side-menu {
  position: fixed;
  top: 48px;
  bottom: 0;
  overflow-y: auto;
  vertical-align: top;
  width: 205px;
  padding-left: 10px;
  padding-right: 3px;
  box-shadow: 1px 1px 6px #888;
  background-color: white;
  padding-bottom: 40px;
}
</style>
