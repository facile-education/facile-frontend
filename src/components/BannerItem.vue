<template>
  <div
    :title="tooltip"
    class="banner-item"
    @click="dispatchEvent">
    <i :class="icon"/>
  </div>
</template>

<script>
export default {
  name: 'BannerItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  methods: {
    dispatchEvent () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.banner-item {
  margin-left: 3px;
  border: 1px rgba(255,255,255,0.3) solid;
  border-radius: $border-radius;
  display: inline-block;
  vertical-align: top;
  height: 35px;
  width: 35px;
  cursor: pointer;
  text-align: center;
  line-height: 35px;
}
</style>
