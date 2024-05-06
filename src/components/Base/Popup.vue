<template>
  <div
    class="popup"
    data-test="popup"
    :class="type"
  >
    <div class="icon">
      <CustomIcon
        v-if="iconName==='icon-check'"
        :icon-name="iconName"
      />
      <FAIcon
        class="fa-icon"
        :name="iconName"
      />
    </div>
    <div class="message">
      {{ message }}
    </div>
    <button
      class="close"
      @click="closePopup"
    >
      <CustomIcon
        icon-name="icon-cross-L"
        class="icon"
      />
    </button>

    <div
      ref="progressBar"
      class="progress-bar"
      :style="'transition: width ' + timeout + 'ms linear;'"
    />
  </div>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import FAIcon from '@components/Base/FAIcon.vue'
export default {
  name: 'Popup',
  components: { CustomIcon, FAIcon },
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
    iconName () {
      switch (this.type) {
        case 'success':
          return 'icon-check'
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
    const vm = this
    setTimeout(function () {
      vm.$el.getElementsByClassName('progress-bar')[0].classList.add('final-state')
    }, 10)
    this.waitBeforeClosure(this.timeout)
  },
  methods: {
    // TODO maybe pause the timer if the popup is hovered (or clicked on mobile)
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
@import "@design";
/* TODO make animation */

.popup {
  position: relative;
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

    .fa-icon, .icon-check {
      font-size: 1.25rem;
    }
  }

  .message {
    flex: 1;
  }

  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      color: white;
      font-weight: bold;
      font-size: 1rem;
    }
  }
}

.info {
  background-color: $info;
}

.success {
  background-color: $success;
}

.warning {
  background-color: $warning;
}

.error {
  background-color: $danger;
}

.progress-bar {
  height: 4px;
  width: 100%;
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  &.final-state {
    width: 0;
  }
}
</style>
