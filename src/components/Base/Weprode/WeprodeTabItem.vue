<template>
  <div
    v-if="active"
    class="tab-content"
    :disabled="disabled"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WeprodeTabItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: undefined
    },
    nbNotification: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    isValidParent () {
      return this.$parent.$options.name === 'WeprodeTabList'
    }
  },
  mounted () {
    if (this.isValidParent) {
      this.$parent.addTab(this)
    }
  },
  beforeUnmount () {
    if (this.isValidParent) {
      this.$parent.removeTab(this)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
