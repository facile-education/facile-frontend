<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :hidden-footer="true"
    :full-screen="false"
    :max-width="456"
    @close="extendSession"
  >
    <template #body>
      <div class="text">
        {{ $t('sessionExpiresIn') + formattedRemainingTime }}
      </div>

      <div class="button-container">
        <PentilaButton
          v-t="('keepSessionAlive')"
          class="extend-session-button"
          @click="extendSession"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'SessionEndAdvertising',
  props: {
    remainingMilliseconds: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'extend-session'],
  computed: {
    remainingSeconds () {
      return Math.floor(this.remainingMilliseconds / 1000)
    },
    formattedRemainingTime () {
      const hours = Math.floor(this.remainingSeconds / 3600)
      const minutes = Math.floor((this.remainingSeconds % 3600) / 60)
      const seconds = this.remainingSeconds % 60

      return ('0' + hours).slice(-2) + ':' +
        ('0' + minutes).slice(-2) + ':' +
        ('0' + seconds).slice(-2)
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    extendSession () {
      fetch('/lfr/html/portal/extend_session.jsp').then(response => response.text()).then(response => {
        const extendSessionResult = response.trim()

        if (extendSessionResult === '0') { // extend_session.jsp has been modified to return custom success code
          this.$store.dispatch('user/setLastActionDate', dayjs())
          // Share last action date to other tabs that share locale storage
          localStorage.setItem('lastActionDate', dayjs().format('YYYY/MM/DD HH:mm:ss'))

          this.onClose()
        } else {
          console.error('Cannot extend session')
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.text {
  @extend %font-heading-s;
}

.button-container {
  margin-top: 40px;
  width: 100%;
  display: flex;
}

.extend-session-button {
  margin: 0 auto;
}
</style>

<i18n locale="fr">
{
  "sessionExpiresIn": "Votre session va expirer dans ",
  "keepSessionAlive": "Garder la session active"
}
</i18n>
