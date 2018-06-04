<template>
  <div id="app">
    <header class="nero-header theme-background-color">
      <Banner/>
    </header>
    <section>
      <SideMenu/>
    </section>
    <section class="nero-body">
      <router-view/>
    </section>
  </div>
</template>

<script>
import Banner from '@/components/Banner'
import SideMenu from '@/components/SideMenu'

export default {
  name: 'App',
  components: {
    Banner,
    SideMenu
  },
  beforeCreate () {
    this.$store.dispatch('INIT_CURRENT_USER')
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

.theme-text-color {
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
  margin-top: 48px; // Banner
  margin-left: 220px; // Side menu
  padding: 10px;
}
</style>

<style lang="scss" scoped>

</style>
