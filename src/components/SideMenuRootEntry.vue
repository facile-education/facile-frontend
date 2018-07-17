<template>
  <div
    :class="{route: isEntryRoute, expanded: expanded}"
    class="menu-entry theme-hover-text-color">
    <div v-if="isEntryRoute">
      <div
        v-t="'SideMenu.entry.' + entry.key"
        v-if="!expanded"
        class="popover"/>
      <router-link
        :to="entry.route"
        class="entry link">
        <i
          :class="entry.icon"
          class="menu-icon"/>
        <span
          v-t="'SideMenu.entry.' + entry.key"
          v-if="expanded"/>
      </router-link>
    </div>
    <div
      v-else
      @mouseover="togglePopupSubMenu"
      @mouseleave="togglePopupSubMenu">
      <div
        :class="{'is-active theme-text-color': isCategoryActive}"
        class="entry"
        @click="toggleSubMenu">
        <i
          :class="entry.icon"
          class="menu-icon"/>
        <span
          v-t="'SideMenu.category.' + entry.key"
          v-if="expanded"/>
      </div>
      <SideMenuCategory
        :category="entry"
        :show-sub-menu="showSubMenu"
        :popup="!expanded"/>
    </div>
  </div>
</template>

<script>
import SideMenuCategory from '@/components/SideMenuCategory'

export default {
  name: 'SideMenuRootEntry',
  components: {
    SideMenuCategory
  },
  props: {
    entry: {
      type: Object,
      required: true
    },
    expanded: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showSubMenu: false
    }
  },
  computed: {
    isEntryRoute () {
      return this.entry.isLeaf
    },
    isCategoryActive (entry) {
      for (var idx = 0; idx < this.entry.menu.length; ++idx) {
        if (this.entry.menu[idx].route === this.$store.state.nero.activeRoute) {
          return true
        }
      }
    }
  },
  watch: {
    expanded (expandedNewValue) {
      if (!expandedNewValue) {
        this.showSubMenu = false
      }
    }
  },
  mounted () {
    if (this.expanded) {
      this.showSubMenu = true
    }
  },
  methods: {
    toggleSubMenu () {
      if (!this.expanded) {
        this.$emit('open')
        this.showSubMenu = true
      } else {
        this.showSubMenu = !this.showSubMenu
      }
    },
    togglePopupSubMenu (event) {
      if (!this.expanded) {
        this.showSubMenu = (event.type === 'mouseover')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.popover {
  display: none;
  position: absolute;
  background-color: #6b6b6b;
  border-radius: $border-radius;
  height: 20px;
  line-height: 10px;
  left: $side-menu-width + 5px;
  top: 14px;
  font-size: 13px;
  white-space: nowrap;
  color: $text-color-light;
  padding: 5px;
  z-index: $side-menu-z-index;
}

.menu-entry {
  position: relative;
  white-space: nowrap;
  color: $text-color-menu;

  .entry {
    min-height: $side-menu-entry-height;
    line-height: $side-menu-entry-height;
    padding-top: 5px;
    cursor: pointer;
  }

  &.expanded {
    .menu-icon {
      width: $side-menu-width;
    }
  }

  &.route {
    border-bottom: $border;
  }

  &:hover {
    .entry {
      background-color: $menu-selected-background-color;
    }

    .popover {
      display: inherit;
    }
  }
}

.link {
  display: block;
  text-decoration: none;

  &:not(.router-link-active) {
    color: inherit;
  }
}

.is-active,
.link.router-link-active {
  font-weight: bold;
}

.menu-icon {
  font-size: $side-menu-icon-size;
  display: inline-block;
  width: $side-menu-width;
  text-align: center;
}
</style>
