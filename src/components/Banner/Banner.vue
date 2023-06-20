<template>
  <header class="banner">
    <NeroIcon
      v-if="mq.phone"
      class="menu-icon"
      name="bars"
      @click="onShowMobileMenu"
    />
    <BannerSearch v-if="!mq.phone" />
    <div
      v-if="isSessionWarningDisplayed"
      class="extend-session"
    >
      <span v-t="'session-is-expiring'" />
      <span>{{ getRemainingTime }}</span>
      <button
        v-t="'extend-session'"
        class="btn"
        :title="$t('extend-session')"
        @click="extendSession"
      />
    </div>
    <nav class="right-section">
      <BannerServices />
      <BannerUserProfile />
    </nav>
  </header>
</template>

<script>
import BannerServices from '@components/Banner/BannerServices'
import BannerUserProfile from '@components/Banner/BannerUserProfile'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import constants from '@/api/constants'

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
      return this.inactionTime > this.$store.state.nero.sessionTimeout - this.$store.state.nero.sessionTimeoutWarning
    },
    getRemainingTime () {
      const remainingTime = this.$store.state.nero.sessionTimeout - this.inactionTime
      const totalSeconds = Math.floor(remainingTime / 1000)
      const nbMinutes = Math.floor(totalSeconds / 60)
      const nbSeconds = totalSeconds % 60
      const displayedSeconds = nbSeconds < 10 ? '0' + nbSeconds : nbSeconds
      return '' + nbMinutes + ':' + displayedSeconds
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.inactionTime = dayjs() - this.$store.state.user.lastActionDate
      if (this.inactionTime > this.$store.state.nero.sessionTimeout) {
        // Logout
        window.location = constants.LOGOUT_URL
      }
    }, 1000)
  },
  unmounted () {
    clearInterval(this.interval)
  },
  methods: {
    onShowMobileMenu () {
      this.$store.dispatch('nero/toggleMobileMenu')
    },
    extendSession () {
      fetch('/html/portal/extend_session.jsp').then(response => response.text()).then(response => {
        const extendSessionResult = response.trim()

        if (extendSessionResult === '0') {
          this.$store.commit('user/setLastActionDate', dayjs())
        }
      })
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
