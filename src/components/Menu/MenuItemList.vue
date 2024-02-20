<template>
  <div class="menu-item-list">
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="menuError"
      v-t="'Menu.MenuItemList.errorPlaceholder'"
      class="placeholder"
    />

    <nav v-else>
      <ul>
        <li
          v-for="menuItem in menu"
          :key="menuItem.i18nKey"
        >
          <MenuEntry
            v-if="menuItem.component"
            :menu-entry="menuItem"
          />
          <MenuCategory
            v-else
            :menu-category="menuItem"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const MenuCategory = defineAsyncComponent(() => import('@components/Menu/MenuCategory.vue'))
const MenuEntry = defineAsyncComponent(() => import('@components/Menu/MenuEntry.vue'))

export default {
  name: 'MenuItemList',
  components: { MenuCategory, MenuEntry, WeprodeSpinner },
  computed: {
    isLoading () {
      return this.$store.state.menu.isLoadingMenu
    },
    menuError () {
      return this.$store.state.menu.menuError
    },
    menu () {
      return this.$store.state.menu.menu
    }
  }
}
</script>

<style lang="scss" scoped>

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
}
</style>
