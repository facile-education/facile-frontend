<template>
  <div
    class="popup"
    :style="'background-color: ' + backgroundColor + ';'"
  >
    <div class="test">
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

export default {
  // TODO: export via pentilaComponents
  name: 'Popup',
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      required: true
    },
    backgroundColor: {
      type: String,
      default: '#f9f9f9'
    }
  },
  // TODO: add close icon and emit 'close' event
  emits: ['close'],
  mounted () {
    this.waitBeforeClosure(this.timeout)
  },
  methods: {
    waitBeforeClosure (time) { // TODO concat
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
  padding-left: 15px;

  .test {
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
