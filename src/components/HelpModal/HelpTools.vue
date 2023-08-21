<template>
  <div class="help-tools">
    <button
      v-if="mq.phone || mq.tablet"
      data-test="toggle-menu-icon"
      class="menu-button"
      @click="toggleMobileMenu"
    >
      <img
        src="@/assets/icons/menus/icon_menu_burger.svg"
        alt="toggle-menu-icon"
      >
    </button>

    <HelpSearch />
  </div>
</template>

<script>
import HelpSearch from '@components/HelpModal/HelpSearch.vue'

export default {
  name: 'HelpTools',
  components: { HelpSearch },
  inject: ['mq'],
  methods: {
    toggleMobileMenu () {
      this.$store.dispatch('help/toggleMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.help-tools {
  height: $help-toolbar-height;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.menu-button {
  display: flex;
  align-items: center;
  margin-right: 1em;
  padding: 0;
  background-color: transparent;
  border: none;
}
</style>
