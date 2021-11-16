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

    <div
      class="popups-container"
      :class="{'phone': mq.phone}"
    >
      <Popup
        v-for="(popup, index) in popupList"
        :key="index"
        class="popup"
        background-color="#0B3C5F"
        :message="popup.message"
        :timeout="popupTimeout"
        @close="closePopup"
      />
    </div>

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
import Popup from '@components/Base/Popup'
import { popupDurationTime } from '@/constants/appConstants'
const WarningModal = defineAsyncComponent(() => import('@/components/Nero/WarningModal'))

export default {
  components: { Popup, WarningModal },
  inject: ['mq'],
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
    popupTimeout () {
      return popupDurationTime
    },
    popupList () {
      return this.$store.state.popups.currentPopupList
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
  },
  methods: {
    closePopup () {
      this.$store.dispatch('popups/popPopup')
    }
  }
}
</script>

<style lang="scss" scoped>
.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.popups-container {
  position: fixed;
  top: 30px;
  right: 15px;
  flex-direction: column;

  .popup {
    color: white;
  }

  &.phone {
    top: 16px;
    right: 50%;
    transform: translate(50%, 0);

    .popup {
      width: 90vw;
      height: 50px;
    }
  }
}

.msg {
  text-align: center;
}
</style>
