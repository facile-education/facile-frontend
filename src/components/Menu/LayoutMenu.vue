<template>
  <section
    :class="{'open': expanded, 'phone-menu': (mq.phone || mq.tablet), 'phone-hidden': !isMobileMenuDisplayed}"
    class="menu"
    data-test="menu"
  >
    <MenuItemList class="menu-item-list" />

    <button
      v-if="!mq.phone && !mq.tablet"
      class="expand-menu"
      :aria-label="expanded ? $t('Menu.LayoutMenu.collapse') : $t('Menu.LayoutMenu.extend')"
      :title="expanded ? $t('Menu.LayoutMenu.collapse') : $t('Menu.LayoutMenu.extend')"
      @click="toggleSideMenu"
    >
      <CustomIcon
        class="arrow-icon"
        :class="{'rotated': !expanded}"
        icon-name="icon-double-arrow"
      />
    </button>
  </section>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import MenuItemList from '@components/Menu/MenuItemList.vue'

export default {
  name: 'LayoutMenu',
  components: {
    CustomIcon,
    MenuItemList
  },
  inject: ['mq'],
  computed: {
    expanded () {
      return this.$store.state.menu.menuExpanded
    },
    isMobileMenuDisplayed () {
      return this.$store.state.menu.isMobileMenuDisplayed
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.closeMobileMenu()
      }
    },
    toggleSideMenu () {
      this.$store.dispatch('menu/toggleSideMenu')
    },
    closeMobileMenu () {
      this.$store.dispatch('menu/closeMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.menu {
  height: 100%;
  z-index: $side-menu-z-index;
  position: relative;
  background-color: $color-menu-bg;
  border-right: 1px solid $neutral-40;
  @extend %no-text-highlight;

  &.open .menu-item-list {
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.phone-menu {
  position: absolute;
  top: $banner-height;
  left: 0;
  height: calc(100% - $banner-height);
  width: 100%;
  z-index: $mobile-menu-z-index;
  overflow-y: auto;
  transition: all .35s ease;

  &.phone-hidden {
    transform: translateX(-100%);
  }
}

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.menu-item-list {
  padding-top: 1rem;
  @include calc(height, '100% - #{$side-menu-entry-height}');
  overflow: visible;
}

.close-menu {
  width: 100%;
  text-align: left;
  padding-left: 16px;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.expand-menu {
  position: absolute;
  bottom: 0;
  height: $side-menu-entry-height;
  line-height: $side-menu-entry-height;
  font-size: $side-menu-icon-size;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;

  &::before {
    @extend %menu-separator;
    top: 0;
  }

  .arrow-icon {
    transition: transform .5s;
  }
}

.rotated {
  transform: rotate(180deg);
}
</style>
