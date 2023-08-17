<template>
  <div
    class="popup"
    :style="'background-color: ' + backgroundColor + ';'"
  >
    <div class="icon">
      <BaseIcon
        class="fa-icon"
        :name="iconName"
      />
    </div>
    <div class="message">
      {{ message }}
    </div>
    <div
      class="close"
      @click="closePopup"
    >
      <img
        src="@/assets/options/icon_cross_white.svg"
        alt="close"
      >
    </div>
  </div>
</template>

<script>

import BaseIcon from '@components/Base/BaseIcon'
export default {
  // TODO: export via pentilaComponents
  name: 'Popup',
  components: { BaseIcon },
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      validator: (val) => ['success', 'info', 'warning', 'error'].includes(val),
      default: 'info'
    }
  },
  emits: ['close'],
  computed: {
    backgroundColor () {
      switch (this.type) {
        case 'success':
          return '#90C864'
        case 'info':
          return '#4489FB'
        case 'warning':
          return '#FFAA28'
        case 'error':
          return '#F94A17'
        default:
          return ''
      }
    },
    iconName () {
      switch (this.type) {
        case 'success':
          return 'check'
        case 'info':
          return 'info-circle'
        case 'warning':
        case 'error':
          return 'exclamation-triangle'
        default:
          return ''
      }
    }
  },
  mounted () {
    this.waitBeforeClosure(this.timeout)
  },
  methods: {
    // TODO maybe pause the timer if the popup is hovered (or clicked on mobile) + add progress bar to show timer status?
    waitBeforeClosure (time) {
      setTimeout(() => {
        this.closePopup()
      }, time)
    },
    closePopup () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
/* TODO make animation */

.popup {
  height: 75px;
  min-width: 300px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  box-shadow: 1px 1px 6px #888;
  margin: 10px;
  padding-left: 5px;

  .icon {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .fa-icon {
      font-size: 1.25rem;
    }
  }

  .message {
    flex: 1;
  }

  .close {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 12px;
    }
  }
}

</style>
