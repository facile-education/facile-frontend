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
      <img
        src="@/assets/images/menu/icon-reduction-nav.svg"
        :class="{'rotated': !expanded}"
      >
    </div>
  </nav>
</template>

<script>
import SideMenuRootEntry from '@/components/Menu/SideMenuRootEntry'

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
@import "@design";

.side-menu {
  height: 100%;
  z-index: $side-menu-z-index;
  position: relative;
  background-color: $color-menu-bg;
  border-right: $border;
  @extend %no-text-highlight;

  &.open .entry-list {
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.entry-list {
  @include calc(height, '100% - #{$side-menu-entry-height}');
  overflow-y: visible;
  padding-bottom: 10px;
}

.side-menu-caret {
  position: absolute;
  bottom: 0;
  height: $side-menu-entry-height;
  line-height: $side-menu-entry-height;
  font-size: $side-menu-icon-size;
  text-align: center;
  color: $color-menu-text;
  border-top: $border;
  cursor: pointer;
  width: 90%;
  margin-left: 5%;
  background-color: $color-menu-bg;

  img {
    transition: transform .5s;
  }
}

.rotated {
  transform: rotate(180deg);
}
</style>
