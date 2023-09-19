<template>
  <RouterLink
    :to="'/' + $t('Menu.route.' + menuEntry.i18nKey)"
    class="menu-entry"
    :class="{'root-menu-entry': !isSubMenu, 'sub-menu-item': isSubMenu, 'expanded': isExpanded}"
  >
    <CustomIcon
      v-if="menuEntry.icon"
      class="menu-item-icon"
      :icon-name="menuEntry.icon"
    />
    <span
      v-if="isExpanded || isSubMenu"
      v-t="'Menu.' + menuEntry.i18nKey"
      class="label"
    />
    <Pellet
      v-if="notificationCount > 0"
      class="menu-pellet"
      :count="notificationCount"
      :show-count="isExpanded"
    />
    <div
      v-if="!isExpanded && !isSubMenu"
      v-t="'Menu.' + menuEntry.i18nKey"
      class="menu-entry-popover"
    />
  </RouterLink>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))
const Pellet = defineAsyncComponent(() => import('@components/Base/Pellet.vue'))

export default {
  name: 'MenuEntry',
  components: { Pellet, CustomIcon },
  inject: ['mq'],
  props: {
    menuEntry: {
      type: Object,
      required: true
    },
    isSubMenu: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayLikePhone () {
      return this.$store.state.misc.keepPhoneStatus
    },
    isExpanded () {
      return this.mq.phone || this.mq.tablet || this.displayLikePhone || this.$store.state.menu.menuExpanded
    },
    notificationCount () {
      switch (this.menuEntry.i18nKey) {
        case 'messaging':
          return this.$store.state.menu.notifications.messaging
        case 'courses':
          return this.$store.state.menu.notifications.courses
        case 'horaires-hors-cadre':
          return this.$store.state.menu.notifications.schoollife
        default:
          return 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.menu-entry {
  @extend %menu-item;

  &.router-link-active:not(:hover) {
    background-color: $neutral-20;
  }

  &.expanded {
    .menu-pellet {
      margin: auto 10px auto auto;
    }
  }

  &:not(.expanded) {
    .menu-pellet {
      position: absolute;
      top: 25%;
      left: 60%;
    }
  }
}
</style>
