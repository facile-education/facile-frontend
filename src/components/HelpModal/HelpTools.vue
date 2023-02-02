<template>
  <div class="help-tools">
    <button
      v-if="mq.phone"
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
.help-tools {
  display: flex;
  margin-bottom: 10px;
}

.menu-button {
  margin-right: 1em;
  padding: 0;
  background-color: transparent;
  border: none;
}
</style>
