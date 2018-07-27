<template>
  <div
    v-if="active"
    class="tab-content">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'NeroTabItem',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    isValidParent () {
      return this.$parent.$options.name === 'NeroTabList'
    }
  },
  mounted () {
    if (this.isValidParent) {
      this.$parent.addTab(this)
    }
  },
  beforeDestroy () {
    if (this.isValidParent) {
      this.$parent.removeTab(this)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.tab-content {
  padding-top: 10px;
}
</style>
