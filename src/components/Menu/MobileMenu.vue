<template>
  <div class="menu theme-background-color">
    <div class="gradient">
      <NeroIcon
        name="times"
        class="close"
        @click="closeMenu"
      />
      <img
        :src="userPicture"
        class="picture"
        @click="openPreferences"
      >
      <NeroIcon
        name="power-off"
        class="logout"
        @click="closeMenu"
      />
    </div>
    <div class="dark">
      <!--img
        :src="userPicture"
        class="picture"
        @click="openPreferences"
      -->

      <template
        v-for="entry in menu"
        :key="entry.route"
      >
        <RouterLink
          v-if="entry.menu === undefined || entry.menu.length === 0"
          :to="$t('Menu.route.' + entry.i18nKey)"
          class="entry"
          @click="closeMenu"
        >
          <img :src="'/nero/img/menu/' + entry.icon">
          <span v-t="'Menu.' + entry.i18nKey" />
          <div class="notification" />
          <div class="toggle" />
        </RouterLink>
        <template v-else>
          <div class="entry">
            <img :src="'/nero/img/menu/' + entry.icon">
            <span v-t="'Menu.' + entry.i18nKey" />
            <div class="notification">
              n
            </div>
            <NeroIcon
              name="caret-down"
              class="toggle"
            />
          </div>
          <div class="submenu">
            <RouterLink
              v-for="subEntry in entry.menu"
              :key="subEntry.position"
              :to="$t('Menu.route.' + subEntry.i18nKey)"
              class="sub-entry"
              @click="closeMenu"
            >
              <span v-t="'Menu.' + subEntry.i18nKey" />
            </RouterLink>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'MobileMenu',
  components: { NeroIcon },
  computed: {
    menu () {
      return this.$store.state.nero.menu
    },
    userPicture () {
      return this.$store.state.user.picture
    }
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('nero/toggleMobileMenu')
    },
    openPreferences () {
      this.$store.dispatch('nero/toggleMobileMenu')
      // this.$store.dispatch('nero/openPreferencesModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

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
  height: 15%;
}

.dark {
  height: 80%;
  background-color: #494949;
  overflow: auto;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 15px;
  left: 15px;
  width: 25px;
  height: 25px;
}

.picture {
  margin-top: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: solid 2px #ffffff;
}

.entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2% 5%;
  color: inherit;
  text-decoration: none;

  span {
    width: 60%;
    text-align: left;
    text-transform: uppercase;
    font-size: 1.1rem;
  }

  img {
    background-color: color-white-bg;
    border-radius: 50%;
    padding: 7px;
    width: 38px;
  }
}

.notification {
  width: 10%;
}

.toggle {
  width: 5%;
}

.sub-entry {
  background: #383838;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #fff3;
  text-decoration: none;
  padding-left: 15%;
  color: inherit;
}

.logout {
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 25px;
  height: 25px;
}
</style>
