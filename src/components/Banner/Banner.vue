<template>
  <nav class="banner">
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
    <div class="right-section">
      <BannerServices />
      <BannerUserProfile />
    </div>
  </nav>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import BannerServices from '@/components/Banner/BannerServices'
import BannerUserProfile from '@/components/Banner/BannerUserProfile'
import dayjs from 'dayjs'

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
        this.$router.push({ name: 'Authentication' })
      }
    }, 1000)
  },
  unmounted () {
    clearInterval(this.interval)
  },
  methods: {
    onShowMobileMenu () {
      // TODO change to teleport body ?
      this.$store.dispatch('nero/toggleMobileMenu')
    },
    extendSession () {
      fetch('/html/portal/extend_session.jsp').then(response => response.text()).then(response => {
        const extendSessionResult = response.trim()
        console.log('result = ', extendSessionResult)
        if (extendSessionResult === '0') {
          console.log('extend ok')
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
