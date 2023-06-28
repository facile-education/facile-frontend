<template>
  <div class="menu-item-list">
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="menuError"
      v-t="'errorPlaceholder'"
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
const MenuCategory = defineAsyncComponent(() => import('@components/Menu/MenuCategory.vue'))
const MenuEntry = defineAsyncComponent(() => import('@components/Menu/MenuEntry.vue'))

export default {
  name: 'MenuItemList',
  components: { MenuCategory, MenuEntry },
  computed: {
    isLoading () {
      return this.$store.state.nero.isLoadingMenu
    },
    menuError () {
      return this.$store.state.nero.menuError
    },
    menu () {
      return this.$store.state.nero.menu
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

<i18n locale="fr">
{
  "errorPlaceholder": "Une erreur est survenue lors du chargement du menu"
}
</i18n>
