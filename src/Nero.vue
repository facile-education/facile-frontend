<template>
  <div id="app">
    <header class="nero-header theme-background-color">
      <Banner/>
    </header>
    <section
      v-if="!$device.phone"
      class="nero-menu">
      <SideMenu/>
    </section>
    <section
      :class="{large: !menuExpanded}"
      class="nero-body">
      <transition
        name="fade"
        mode="out-in">
        <div class="nero-container">
          <router-view/>
        </div>
      </transition>
    </section>
    <Hack/>
  </div>
</template>

<script>
import Banner from '@/components/Banner'
import SideMenu from '@/components/SideMenu'
import Hack from '@/components/Hack'

export default {
  name: 'Nero',
  components: {
    Banner,
    SideMenu,
    Hack
  },
  computed: {
    menuExpanded () {
      return this.$store.state.nero.menuExpanded
    }
  },
  beforeCreate () {
    this.$store.dispatch('initUserInformations')
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
  width: -moz-calc(100% - #{$open-side-menu-width});
  width: -webkit-calc(100% - #{$open-side-menu-width});
  width: -o-calc(100% - #{$open-side-menu-width});
  width: calc(100% - #{$open-side-menu-width});

  @extend %side-menu-transition;

  &.large {
    width: -moz-calc(100% - #{$side-menu-width});
    width: -webkit-calc(100% - #{$side-menu-width});
    width: -o-calc(100% - #{$side-menu-width});
    width: calc(100% - #{$side-menu-width});
  }

  .nero-container {
    height: 100%;
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
