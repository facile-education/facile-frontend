<template>
  <div
    :title="label"
    class="banner-item">
    toto
  </div>
</template>

<script>
export default {
  name: 'BannerItem',
  props: {
    label: {
      type: String,
      default: 'Toto'
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
