<template>
  <header class="banner">
    <button
      v-if="mq.phone"
      :aria-label="$t('toggleMenu')"
      :title="$t('toggleMenu')"
      class="menu-icon-button"
    >
      <img
        src="@/assets/icons/menu_burger.svg"
        alt="menu_burger"
        @click="onShowMobileMenu"
      >
    </button>

    <BannerSearch v-if="!mq.phone" />

    <nav class="right-section">
      <BannerServices />
      <BannerUserProfile />
    </nav>
  </header>
</template>

<script>
import BannerServices from '@components/Banner/BannerServices'
import BannerUserProfile from '@components/Banner/BannerUserProfile'
import { defineAsyncComponent } from 'vue'

const BannerSearch = defineAsyncComponent(() => import('@/components/Banner/BannerSearch'))

export default {
  name: 'Banner',
  components: {
    BannerSearch,
    BannerServices,
    BannerUserProfile
  },
  inject: ['mq'],
  data () {
    return {
      interval: undefined,
      inactionTime: 0
    }
  },
  computed: {
    isSessionWarningDisplayed () {
      return this.inactionTime > this.$store.state.menu.sessionTimeout - this.$store.state.menu.sessionTimeoutWarning
    },
    getRemainingTime () {
      const remainingTime = this.$store.state.menu.sessionTimeout - this.inactionTime
      const totalSeconds = Math.floor(remainingTime / 1000)
      const nbMinutes = Math.floor(totalSeconds / 60)
      const nbSeconds = totalSeconds % 60
      const displayedSeconds = nbSeconds < 10 ? '0' + nbSeconds : nbSeconds
      return '' + nbMinutes + ':' + displayedSeconds
    }
  },
  methods: {
    onShowMobileMenu () {
      this.$store.dispatch('menu/toggleMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
  align-items: center;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.menu-icon-button {
  padding: 0 1rem;

  img {
    height: 32px;
  }
}

.menu-icon {
  margin: auto 0;
  height: 32px;
  padding: 0 1rem;
  cursor: pointer;
}

.right-section {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>

<i18n locale="fr">
{
  "toggleMenu": "Menu"
}
</i18n>
