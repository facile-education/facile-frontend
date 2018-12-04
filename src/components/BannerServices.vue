<template>
  <div>
    <BannerItem icon="fa fa-star" />
    <BannerItem icon="fa fa-envelope" />
    <BannerItem icon="fa fa-archive" />
    <BannerItem icon="fa fa-comments" />
    <BannerItem icon="fa fa-question" />
    <BannerItem icon="fa fa-utensils" />
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
