<template>
  <div>
    <BannerItem/>
    <BannerItem/>
    <BannerItem/>
    <BannerItem/>
    <BannerItem/>
    <BannerItem/>
  </div>
</template>

<script>
import BannerItem from '@/components/BannerItem'

export default {
  name: 'BannerServices',
  components: {
    BannerItem
  }
}
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  vertical-align: top;
}
</style>
