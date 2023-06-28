<template>
  <div class="menu-category-popover">
    <h4 v-t="'Menu.' + menuCategory.i18nKey" />
    <ul>
      <li
        v-for="menuEntry in menuCategory.menu"
        :key="menuEntry.i18nKey"
      >
        <MenuEntry
          class="category-item"
          :menu-entry="menuEntry"
          :is-sub-menu="true"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const MenuEntry = defineAsyncComponent(() => import('@components/Menu/MenuEntry.vue'))

export default {
  name: 'MenuCategoryPopover',
  components: { MenuEntry },
  props: {
    menuCategory: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 8px 0;
  list-style-type: none;
}

h4 {
  margin: 0;
  border-bottom: $border;
  padding: 0 8px;
  text-align: left;
  cursor: default;
}

.menu-category-popover {
  border: $border;
  background-color: #ffffff;
  z-index: $side-menu-z-index;
  border-radius: 0 $border-radius $border-radius 0;
}

.category-item {
  padding: 0 8px;
}

</style>
