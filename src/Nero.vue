<template>
  <div id="app">
    <header class="nero-header theme-background-color">
      <Banner/>
    </header>
    <section>
      <SideMenu/>
    </section>
    <section class="nero-body">
      <transition
        name="fade"
        mode="out-in">
        <router-view/>
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
  beforeCreate () {
    this.$store.dispatch('initUserInformations')
  }
}
</script>

<style lang="scss">
@import 'src/assets/css/constants';

body {
  margin: 0;
  background-color: $background-light-color;
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
  height: 36px;
  padding: 6px 0;
  box-shadow: -1px 1px 6px #888;
  position: fixed;
  top: 0;
  z-index: $banner-z-index;
}

.nero-body {
  margin-top: $banner-height; // Banner
  margin-left: $side-menu-width; // Side menu
  padding: 10px;
}

// transition
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="scss" scoped>

</style>
