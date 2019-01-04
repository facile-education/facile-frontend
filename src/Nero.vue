<template>
  <div id="app">
    <header class="nero-header theme-background-color">
      <Banner />
    </header>
    <section
      v-if="!$device.phone"
      class="nero-menu"
    >
      <SideMenu />
    </section>
    <section
      :class="bodyClasses"
      class="nero-body"
    >
      <RouterView />
    </section>
    <Hack />
    <Transition name="fade">
      <MobileMenu v-if="isMobileMenuDisplayed" />
    </Transition>
    <NeroConfirmModal v-if="isConfirmModalDisplayed" />
    <PWPreferencesModal v-if="isPreferencesModalDisplayed" />
    <!-- SendMessageModal / ContactModal? / InformationModal / SupportModal -->
  </div>
</template>

<script>
import 'vue-swatches/dist/vue-swatches.min.css'

import Banner from '@/components/Banner'
import Hack from '@/components/Hack'
import MobileMenu from '@/components/MobileMenu'
import NeroConfirmModal from '@/components/NeroConfirmModal'
import PWPreferencesModal from '@/components/PreferencesWindow/PWPreferencesModal'
import SideMenu from '@/components/SideMenu/SideMenu'

export default {
  name: 'Nero',
  components: {
    Banner,
    Hack,
    MobileMenu,
    NeroConfirmModal,
    PWPreferencesModal,
    SideMenu
  },
  computed: {
    bodyClasses () {
      // TODO replace phone condition by mobile (not only width) test on the last three classes
      return {
        'nero-small': (this.$device.phone || (this.menuExpanded && this.$device.tablet)),
        'nero-medium': (!this.menuExpanded && this.$device.tablet),
        'nero-large': this.$device.desktop,
        'nero-mobile': this.$device.phone,
        'nero-menu-expanded': (this.menuExpanded && !this.$device.phone),
        'nero-menu-retracted': (!this.menuExpanded && !this.$device.phone)
      }
    },
    isConfirmModalDisplayed () {
      return this.$store.state.nero.confirmModal.isDisplayed
    },
    isMobileMenuDisplayed () {
      return this.$store.state.nero.isMobileMenuDisplayed
    },
    isPreferencesModalDisplayed () {
      return this.$store.state.nero.isPreferencesModalDisplayed
    },
    menuExpanded () {
      return this.$store.state.nero.menuExpanded
    }
  },
  beforeCreate () {
    this.$store.dispatch('user/initUserInformations')
    this.$store.dispatch('nero/initUserMenu')
  }
}
</script>

<style lang="scss">
@import 'src/assets/css/constants';
@import 'src/assets/css/animations';

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
}

.theme-background-color {
  background-color: $theme-color;
  color: $text-color-light;
}

.theme-hover-background-color:hover {
  background-color: $theme-color;
  color: $text-color-light;
  cursor: pointer;
}

.theme-text-color {
  color: $theme-color;
}

.theme-hover-text-color:hover {
  color: $theme-color;
}

.nero-separator {
  width: 30%;
  margin: 15px auto;
  border: 0;
  border-top: 1px solid #b7b7b7;
}

.nero-header {
  width: 100%;
  border: 0;
  height: $banner-height;
  padding: 6px 10px;
  box-shadow: -1px 1px 6px #888;
  position: fixed;
  top: 0;
  z-index: $banner-z-index;
}

.nero-menu,
.nero-body {
  display: inline-block;
  vertical-align: top;
}

.nero-body {
  height: 100vh;
  padding-top: $banner-height; // Banner

  @extend %side-menu-transition;

  &.nero-menu-expanded {
    @include calc(width, '100% - #{$open-side-menu-width}');
  }

  &.nero-menu-retracted {
    @include calc(width, '100% - #{$side-menu-width}');
  }

  &.nero-mobile {
    width: 100%;
  }
}

// transition
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>

</style>
