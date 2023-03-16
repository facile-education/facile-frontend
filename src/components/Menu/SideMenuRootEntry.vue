<template>
  <div
    :class="{route: isEntryRoute, expanded: expanded}"
    class="menu-entry theme-hover-text-color"
    tabindex="0"
  >
    <div v-if="isEntryRoute">
      <div
        v-if="!expanded"
        v-t="'Menu.' + entry.i18nKey"
        class="popover"
      />
      <RouterLink
        :to="$t('Menu.route.' + entry.i18nKey)"
        class="entry link"
      >
        <img
          :src="'/nero/img/menu/' + entry.icon"
          class="menu-icon"
        >
        <span
          v-if="expanded"
          v-t="'Menu.' + entry.i18nKey"
        />
      </RouterLink>
    </div>
    <div
      v-else
      @mouseover="togglePopupSubMenu"
      @mouseleave="togglePopupSubMenu"
    >
      <div
        :class="{'is-active theme-text-color': isCategoryActive}"
        class="entry"
        @click="toggleSubMenu"
      >
        <img
          :src="'/nero/img/menu/' + entry.icon"
          class="menu-icon"
        >
        <span
          v-if="expanded"
          v-t="'Menu.' + entry.i18nKey"
        />
      </div>
      <SideMenuCategory
        :category="entry"
        :show-sub-menu="showSubMenu"
        :popup="!expanded"
      />
    </div>
  </div>
</template>

<script>
import SideMenuCategory from '@/components/Menu/SideMenuCategory'

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
    },
    openAll: {
      type: Boolean,
      required: true
    }
  },
  emits: ['open'],
  data () {
    return {
      showSubMenu: false
    }
  },
  computed: {
    isEntryRoute () {
      return this.entry.menu === undefined || this.entry.menu.length === 0
    },
    isCategoryActive () {
      for (let idx = 0; idx < this.entry.menu.length; ++idx) {
        if (this.entry.menu[idx].route === this.$store.state.nero.activeRoute) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    expanded (expandedNewValue) {
      if (expandedNewValue && this.openAll) {
        this.showSubMenu = true
      } else if (!expandedNewValue) {
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
@import "@design";

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
  color: $color-light-text;
  padding: 5px;
  z-index: $side-menu-z-index;
}

.menu-entry {
  position: relative;
  white-space: nowrap;
  color: $color-menu-text;

  .entry {
    min-height: $side-menu-entry-height;
    line-height: $side-menu-entry-height;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  &.expanded {
    .entry {
      justify-content: flex-start;
    }

    .menu-icon {
      padding: 0 15px;
    }
  }

  &.route {
    border-bottom: $border;
  }

  &:hover {
    .entry {
      background-color: $color-hover-bg;
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
  flex-basis: 25px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: padding .5s;
}
</style>
