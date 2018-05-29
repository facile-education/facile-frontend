<template>
  <ul class="category">
    <li
      v-for="entry in menu"
      :key="entry.id">
      <router-link
        v-if="entry.isLeaf"
        :to="entry.route"
        class="menu-entry">
        {{ entry.label }}
      </router-link>
      <div v-else>
        <h3 class="category-title">{{ entry.label }}</h3>
        <SideMenuCategory :menu="entry.menu"/>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SideMenuCategory',
  props: {
    menu: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.category {
  list-style-type: none;
  padding-left: 10px;
}

.category-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.menu-entry {
  font-weight: bold;
  color: $text-color;
  &.router-link-exact-active {
    color: $theme-color;
  }
}
</style>
