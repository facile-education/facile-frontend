<template>
  <div class="service-body">
    <PentilaSpinner v-if="userId === undefined" />
    <AuthenticationRequired v-else-if="userId === 0" />
    <NotAllowed v-else-if="!isAllowed && !user.isAdministrator" />
    <slot v-else />

    <div
      class="popups-container"
      :class="{'phone': mq.phone}"
    >
      <Popup
        v-for="(popup, index) in popupList"
        :key="index"
        class="popup"
        :type="popup.type"
        :message="popup.message"
        :timeout="popupTimeout"
        @close="closePopup"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { popupDurationTime } from '@/constants/appConstants'

const Popup = defineAsyncComponent(() => import('@components/Base/Popup'))

export default {
  components: { Popup },
  inject: ['mq'],
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
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
  methods: {
    closePopup () {
      this.$store.dispatch('popups/popPopup')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.popups-container {
  z-index: $popup-z-index;
  position: fixed;
  top: 30px;
  right: 15px;
  flex-direction: column-reverse;

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
</style>
