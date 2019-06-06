<template>
  <div
    id="app"
    :class="bodyClasses"
  >
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
      class="nero-body"
    >
      <RouterView />
    </section>
    <Hack />
    <Transition name="fade">
      <MobileMenu v-if="isMobileMenuDisplayed" />
    </Transition>
    <PentilaConfirmModal v-if="isConfirmModalDisplayed" />
    <PreferencesModal v-if="isPreferencesModalDisplayed" />
    <ImagePickerModal v-if="isImagePickerModalDisplayed" />
    <InformationModal v-if="isInformationModalDisplayed" />
    <SupportModal v-if="isSupportModalDisplayed" />
    <VersionEditionModal v-if="isVersionEditionModalDisplayed" />
    <!-- SendMessageModal / ContactModal? -->
  </div>
</template>

<script>
import Banner from '@/components/Banner/Banner'
import Hack from '@/components/Hack'
import ImagePickerModal from '@/components/ImagePickerWindow/ImagePickerModal'
import MobileMenu from '@/components/MobileMenu'
import PreferencesModal from '@/components/PreferencesWindow/PreferencesModal'
import InformationModal from '@/components/InformationWindow/InformationModal'
import SupportModal from '@/components/SupportWindow/SupportModal'
import VersionEditionModal from '@/components/InformationWindow/VersionEditionModal'
import SideMenu from '@/components/SideMenu/SideMenu'

export default {
  name: 'Nero',
  components: {
    Banner,
    Hack,
    ImagePickerModal,
    MobileMenu,
    PreferencesModal,
    InformationModal,
    SupportModal,
    VersionEditionModal,
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
    isInformationModalDisplayed () {
      return this.$store.state.nero.isInformationModalDisplayed
    },
    isSupportModalDisplayed () {
      return this.$store.state.nero.isSupportModalDisplayed
    },
    isVersionEditionModalDisplayed () {
      return this.$store.state.nero.isVersionEditionModalDisplayed
    },
    isImagePickerModalDisplayed () {
      return this.$store.state.nero.imagePickerModal.isDisplayed
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
  height: 100%;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  overflow: hidden;
  height: 100%;
}

p {
  margin: 0;
}

ul {
  padding: 0;
}

h5 {
  margin-bottom: 0.8em;
}

input[disabled],
button[disabled] {
  @extend %nero-disable
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  display: grid;
  grid-template-rows: $banner-height calc(100% - #{$banner-height});
  height: 100%;

  &.nero-menu-expanded {
    grid-template-columns: $open-side-menu-width calc(100% - #{$open-side-menu-width});
  }

  &.nero-menu-retracted {
    grid-template-columns: $side-menu-width calc(100% - #{$side-menu-width});;
  }

  &.nero-mobile {
    grid-template-columns: auto;
  }
}

.theme-background-color {
  color: $text-color-light;
}

.theme-hover-background-color:hover {
  color: $text-color-light;
  cursor: pointer;
}

.nero-separator {
  width: 30%;
  margin: 15px auto;
  border: 0;
  border-top: 1px solid #b7b7b7;
}

.nero-header {
  grid-column: span 2;
  border: 0;
  padding: 6px 10px;
  box-shadow: -1px 1px 6px #888;
  top: 0;
  z-index: $banner-z-index;
}

/* Not working anymore
.nero-body,
.nero-menu {
  @extend %side-menu-transition;
}
*/

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
