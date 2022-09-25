<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SplitArea',
  props: {
    size: {
      type: Number,
      default: 50
    },
    minSize: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    classes () {
      let classes = 'split-area'
      if (this.isValidParent) {
        classes += ' ' + this.$parent.direction
      }
      return classes
    },
    isValidParent () {
      return this.$parent.$options.name === 'Split'
    }
  },
  mounted () {
    if (this.isValidParent) {
      this.$parent.addArea(this)
    }
  },
  beforeUnmount () {
    if (this.isValidParent) {
      this.$parent.removeArea(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.split-area {
  height: 100%;

  &.horizontal {
    display: inline-block;
    vertical-align: top;
  }
}

</style>
