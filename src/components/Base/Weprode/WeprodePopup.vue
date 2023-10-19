<template>
  <div
    class="popup"
    :style="'background-color: ' + color + ';'"
  >
    {{ message }}
  </div>
</template>

<script>

export default {
  name: 'WeprodePopup',
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: '#f9f9f9'
    }
  },
  emits: ['reachTimeout'],
  mounted () {
    this.waitBeforeClosure(this.timeout)
  },
  methods: {
    waitBeforeClosure (time) { // TODO concat
      setTimeout(() => {
        this.$emit('reachTimeout')
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
  border-radius: 20px;
  box-shadow: 1px 1px 6px #888;
  margin: 10px;
  padding: 15px;
}

</style>
