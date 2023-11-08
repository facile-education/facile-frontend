<template>
  <div class="help-tools">
    <button
      v-if="mq.phone || mq.tablet"
      data-test="toggle-menu-icon"
      class="menu-button"
      @click="toggleMobileMenu"
    >
      <CustomIcon
        :icon-name="isMenuExtended ? 'icon-cross-L' : 'icon-burger'"
        class="icon"
      />
    </button>

    <HelpSearch />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import HelpSearch from '@components/HelpModal/HelpSearch.vue'

export default {
  name: 'HelpTools',
  components: { CustomIcon, HelpSearch },
  inject: ['mq'],
  computed: {
    isMenuExtended () {
      return this.$store.state.help.isMobileMenuDisplayed
    }
  },
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

  .icon {
    font-size: 2rem;
  }
}
</style>
