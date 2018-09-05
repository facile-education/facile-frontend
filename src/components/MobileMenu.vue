<template>
  <div class="menu theme-background-color">
    <div class="gradient">
      <i
        class="close fa fa-times"
        @click="closeMenu"/>
      <i
        class="logout fa fa-power-off"
        @click="closeMenu"/>
    </div>
    <div class="dark">
      <img
        class="picture"
        src="../assets/logo.png">

      <div class="wrapper">
        <router-link
          v-for="entry in menu"
          :key="entry.route"
          :to="entry.route"
          class="entry"
          @click.native="closeMenu">
          <i :class="entry.icon"/>
          <span v-t="'SideMenu.entry.' + entry.key"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileMenu',
  computed: {
    menu () {
      return this.$store.getters['nero/getMobileMenu']
    }
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('nero/toggleMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $mobile-menu-z-index;
  text-align: center;
}

.gradient {
  width: 100%;
  padding-top: 3vh;
  height: 20%;
  $white: rgba(255,255,255,0.1);
  $whiteGradient: rgba(250,250,250,0.4);
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&0+0,0.34+100 */
  background: -moz-linear-gradient(180deg, $white 45%, $whiteGradient 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(180deg, $white 45%, $whiteGradient 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(180deg, $white 45%, $whiteGradient 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}

.dark {
  height: 75%;
  background-color: rgb(59, 59, 63);
}

.close {
  cursor: pointer;
  position: absolute;
  top: 16px;
  left: 16px;
  width: 16px;
  height: 16px;
}

.picture {
  width: 124px;
  height: 124px;
  margin: auto;
  margin-top: -62px;
  border-radius: 50%;
  border: solid 3px #ffffff9f;
}

.wrapper {
  width: 60%;
  margin: auto;
}

.entry {
  display: inline-block;
  vertical-align: top;
  color: inherit;
  text-decoration: none;
  width: 50%;
  height: 100px;
  padding: 15px;

  i {
    display: block;
    font-size: 2em;
  }
}

.logout {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  width: 16px;
  height: 16px;
}
</style>
