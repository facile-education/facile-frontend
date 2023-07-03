<template>
  <header class="banner">
    <NeroIcon
      v-if="mq.phone"
      class="menu-icon"
      name="bars"
      @click="onShowMobileMenu"
    />
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
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'Banner',
  components: {
    BannerSearch,
    BannerServices,
    BannerUserProfile,
    NeroIcon
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
}

.menu-icon {
  margin: auto 0;
  height: 25px;
  width: 25px;
  cursor: pointer;
}

.right-section {
  margin-left: auto;
  display: flex;
}
</style>

<i18n locale="fr">
  {
    "session-is-expiring": "Votre session va expirer dans ",
    "extend-session": "Etendre"
  }
</i18n>
