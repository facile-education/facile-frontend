<template>
  <div>{{ count }}</div>
</template>

<script>

export default {
  name: 'AnimatedCounter',
  props: {
    target: {
      type: Number,
      required: true
    },
    animationDuration: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      count: 0
    }
  },
  watch: {
    target: {
      immediate: true,
      handler () {
        this.setCounterValue()
      }
    }
  },
  methods: {
    setCounterValue () {
      const timeOut = 10 * this.animationDuration / Math.abs(this.target - this.count) // Because millisecond is too short for browser
      this.updateCounter(timeOut)
    },
    updateCounter (timeout) {
      const updateCounterMethods = this.updateCounter
      const diff = this.target - this.count
      if (diff > 0 && diff >= 10) {
        this.count = this.count + 10
        setTimeout(function () {
          updateCounterMethods(timeout)
        }, timeout)
      } else if (diff > 0 && diff < 10) {
        this.count++
        setTimeout(function () {
          updateCounterMethods(timeout)
        }, timeout / 10)
      } else if (diff < 0 && diff <= -10) {
        this.count = this.count - 10
        setTimeout(function () {
          updateCounterMethods(timeout)
        }, timeout)
      } else if (diff < 0 && diff > -10) {
        this.count--
        setTimeout(function () {
          updateCounterMethods(timeout)
        }, timeout / 10)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
