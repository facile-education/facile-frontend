<template>
  <nav
    :class="{open: expanded}"
    class="side-menu">
    <div class="entry-list">
      <SideMenuRootEntry
        v-for="entry in menu"
        :key="entry.id"
        :entry="entry"
        :expanded="expanded"
        @open="toggleMenu"/>
    </div>
    <div
      class="side-menu-caret"
      @click="toggleMenu">
      <i
        :class="{'fa-caret-right': !expanded, 'fa-caret-left': expanded}"
        class="fa"/>
    </div>
  </nav>
</template>

<script>
import SideMenuRootEntry from '@/components/SideMenuRootEntry'

export default {
  name: 'SideMenu',
  components: {
    SideMenuRootEntry
  },
  computed: {
    expanded () {
      return this.$store.state.nero.menuExpanded
    },
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
      this.$store.dispatch('nero/initUserMenu')
    }
  },
  methods: {
    setHomeRoute (entry) {
      return {
        path: '/',
        redirect: entry.route
      }
    },
    getRoute (entry) {
      if (entry.component) {
        return {
          path: entry.route,
          name: this.$t('SideMenu.entry.' + entry.key),
          meta: {title: this.$t('SideMenu.entry.' + entry.key)},
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
            routes.push(this.setHomeRoute(menu[idx]))
          }
          var route = this.getRoute(menu[idx])
          if (route !== undefined) {
            routes.push(route)
          }
        } else {
          routes = routes.concat(this.addRoutes(menu[idx].menu))
        }
      }
      return routes
    },
    toggleMenu () {
      this.$store.dispatch('nero/toggleSideMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
@import 'src/assets/css/animations';

.side-menu {
  height: 100vh;
  width: $side-menu-width;
  padding-top: $banner-height;
  box-shadow: 1px 1px 6px #888;
  z-index: $side-menu-z-index;
  position: relative;
  background-color: $menu-background-color;
  @extend %no-text-highlight;

  @extend %side-menu-transition;

  &.open {
    width: $open-side-menu-width;

    .entry-list {
      overflow-y: auto;
    }

/*
    .side-menu-caret {
      $caret-padding: 15px;
      text-align: right;
      width: $open-side-menu-width - $caret-padding;
      padding-right: $caret-padding;
    }
*/
  }
}

.entry-list {
  height: 100%;
  overflow-y: visible;
  padding-bottom: $side-menu-entry-height;
}

.side-menu-caret {
  position: absolute;
  bottom: 0;
  height: $side-menu-entry-height;
  line-height: $side-menu-entry-height;
  font-size: $side-menu-icon-size;
  text-align: center;
  color: $text-color-menu;
  border-top: $border;
  cursor: pointer;
  width: inherit;
  background-color: $menu-background-color;
}
</style>
