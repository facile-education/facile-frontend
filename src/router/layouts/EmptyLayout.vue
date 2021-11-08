<template>
  <div class="service-body">
    <PentilaSpinner v-if="userId === undefined" />
    <h2
      v-else-if="userId === 0"
      class="msg"
    >
      {{ $t('Layout.authRequired') }}
    </h2>
    <h2
      v-else-if="!isAllowed && !user.isAdministrator"
      class="msg"
    >
      {{ $t('Layout.notAllowed') }}
    </h2>
    <slot v-else />

    <teleport
      v-if="isWarningModalDisplayed"
      to="body"
    >
      <WarningModal
        win-width="500px"
      />
    </teleport>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const WarningModal = defineAsyncComponent(() => import('@/components/Nero/WarningModal'))

export default {
  components: { WarningModal },
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    user () {
      return this.$store.state.user
    },
    userId () {
      return this.user.userId
    }
  },
  created () {
    this.$store.dispatch('user/initUserInformations')
  }
}
</script>

<style lang="scss" scoped>
.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.msg {
  text-align: center;
}
</style>
