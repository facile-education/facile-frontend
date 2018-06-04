<template>
  <div
    :title="tooltip"
    class="banner-item">
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
  }
}
</script>

<style lang="scss" scoped>
.banner-item {
  border: 1px rgba(255,255,255,0.3) solid;
  border-radius: 5px;
  display: inline-block;
  vertical-align: top;
  height: 34px;
  width: 34px;
  cursor: pointer;
}
</style>
