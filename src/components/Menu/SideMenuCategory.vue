<template>
  <Transition
    name="unfold"
    mode="out-in"
  >
    <div
      v-if="showSubMenu"
      :class="{popup}"
    >
      <h4
        v-if="popup"
        v-t="'Menu.' + category.i18nKey"
        class="popup-header"
      />
      <ul class="sub-menu">
        <li
          v-for="entry in category.menu"
          :key="entry.id"
          class="entry"
        >
          <a
            v-if="isEntryInternetLink(entry)"
            :href="entry.href"
            class="link"
            target="_blank"
          >
            {{ entry.label }}
          </a>
          <RouterLink
            v-else
            v-t="'Menu.' + entry.i18nKey"
            :to="'/' + entry.i18nKey"
            class="link"
          />
        </li>
      </ul>
    </div>
  </Transition>
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
      return entry.href
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.popup {
  position: absolute;
  left: $side-menu-width;
  top: 0px;
  /* bottom: 0px; */
  background-color: #ffffff;
  border: $border;
  z-index: $side-menu-z-index;
  border-radius: 0 $border-radius $border-radius 0;

  .link,
  .popup-header {
    margin: 0;
    padding: 3px 15px;
  }

  .popup-header {
    color: $color-text;
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
    background-color: $color-hover-bg;
  }
}

.link {
  display: block;
  padding-left: $side-menu-width;
  padding-top: 2px;
  padding-bottom: 2px;
  text-decoration: none;

  &:not(.router-link-active) {
    color: $color-dark-text;
  }

  &.router-link-active {
    font-weight: bold;
  }
}
</style>
