<template>
  <div
    class="popup"
    :style="'background-color: ' + backgroundColor + ';'"
  >
    {{ message }}
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
        this.$emit('close')
      }, time)
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
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  box-shadow: 1px 1px 6px #888;
  margin: 10px;
  padding: 15px;
}

</style>
