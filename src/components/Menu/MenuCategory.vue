<template>
  <div class="menu-category">
    <button
      class="category-name root-menu-entry"
      :class="{'expanded': isMenuExpanded, 'show-menu': showSubMenu}"
      :aria-label="isMenuExpanded ? (showSubMenu ? $t('collapse') : $t('extend')) : ''"
      :title="isMenuExpanded ? (showSubMenu ? $t('collapse') : $t('extend')) :''"
      @click="toggleSubMenu"
    >
      <CustomIcon
        v-if="menuCategory.icon"
        class="menu-item-icon"
        :icon-name="menuCategory.icon"
      />
      <span
        v-if="isMenuExpanded"
        v-t="'Menu.' + menuCategory.i18nKey"
        class="label"
      />

      <MenuCategoryPopover
        v-if="!isMenuExpanded"
        class="menu-category-popover"
        :menu-category="menuCategory"
      />
    </button>

    <nav
      v-if="showSubMenu"
      class="sub-menu"
    >
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
    </nav>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'
const MenuEntry = defineAsyncComponent(() => import('@components/Menu/MenuEntry.vue'))
const MenuCategoryPopover = defineAsyncComponent(() => import('@components/Menu/MenuCategoryPopover.vue'))

export default {
  name: 'MenuCategory',
  components: { MenuCategoryPopover, MenuEntry, CustomIcon },
  inject: ['mq'],
  props: {
    menuCategory: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showSubMenu: false,
      showPopover: false
    }
  },
  computed: {
    isMenuExpanded () {
      return this.mq.phone || this.$store.state.menu.menuExpanded
    }
  },
  watch: {
    isMenuExpanded: {
      immediate: true,
      handler (oldValue, newValue) {
        if (oldValue !== newValue) {
          this.showSubMenu = this.isMenuExpanded
        }
      }
    }
  },
  methods: {
    toggleSubMenu () {
      if (this.isMenuExpanded) {
        this.showSubMenu = !this.showSubMenu
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.category-name {
  @extend %menu-item;

  &:hover, &:focus-within {
    .menu-category-popover {
      display: block;
      opacity: 100%;
    }
  }
}

.category-item {
  padding-left: 60px;
}

.menu-category-popover {
  display: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 100%;
}

.sub-menu {
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    @extend %menu-separator;
    bottom: 0;
  }
}

</style>

<i18n locale="fr">
{
  "collapse" : "Réduire",
  "extend" : "Dérouler"
}
</i18n>
