<template>
  <transition
    name="unfold"
    mode="out-in">
    <div
      v-if="showSubMenu"
      :class="{popup}">
      <h4
        v-t="'SideMenu.category.' + category.key"
        v-if="popup"
        class="popup-header"/>
      <ul class="sub-menu">
        <li
          v-for="entry in category.menu"
          :key="entry.id"
          class="entry">
          <a
            v-if="isEntryInternetLink(entry)"
            :href="entry.href"
            class="link"
            target="_blank">{{ entry.label }}</a>
          <router-link
            v-t="'SideMenu.entry.' + entry.key"
            v-else
            :to="entry.route"
            class="link"/>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SideMenuCategory',
  props: {
    category: {
      type: Object,
      required: true
    },
    showSubMenu: {
      type: Boolean,
      required: true
    },
    popup: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isEntryInternetLink (entry) {
      return (entry.isLeaf && entry.href)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
@import 'src/assets/css/animations';

.popup {
  position: absolute;
  left: $side-menu-width;
  top: 0px;
  background-color: #ffffff;
  border: $border;
  z-index: $side-menu-z-index;
  border-radius: 0 $border-radius $border-radius 0;

  @extend %nero-shadow;

  .link,
  .popup-header {
    margin: 0;
    padding: 3px 15px;
  }

  .popup-header {
    color: $text-color;
    border-bottom: $border;
  }
}

.sub-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.entry {
  font-size: 13px;

  &:hover {
    background-color: $menu-selected-background-color;
  }
}

.link {
  display: block;
  padding-left: $side-menu-width;
  padding-top: 2px;
  padding-bottom: 2px;
  text-decoration: none;

  &:not(.router-link-active) {
    color: $text-color;
  }

  &.router-link-active {
    font-weight: bold;
  }
}
</style>
