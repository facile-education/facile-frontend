<template>
  <nav
    :class="{open: expanded}"
    class="side-menu"
  >
    <div class="entry-list">
      <SideMenuRootEntry
        v-for="entry in menu"
        :key="entry.id"
        :entry="entry"
        :expanded="expanded"
        :open-all="openAll"
        @open="toggleMenu"
      />
    </div>
    <div
      class="side-menu-caret"
      @click="toggleAllMenu"
    >
      <i
        :class="{'fa-caret-right': !expanded, 'fa-caret-left': expanded}"
        class="fa"
      />
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
  data () {
    return {
      openAll: false
    }
  },
  computed: {
    expanded () {
      return this.$store.state.nero.menuExpanded
    },
    menu () {
      return this.$store.state.nero.menu
    }
  },
  methods: {
    toggleMenu () {
      this.$store.dispatch('nero/toggleSideMenu')
    },
    toggleAllMenu () {
      this.openAll = !this.expanded
      this.toggleMenu()
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
  @include calc(height, '100% - #{$side-menu-entry-height}');
  overflow-y: visible;
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
