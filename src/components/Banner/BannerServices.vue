<template>
  <div>
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-star.svg" />
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-letter.svg" />
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-archives.svg" />
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-question.svg" />
  </div>
</template>

<script>
import BannerItem from '@/components/Banner/BannerItem'

export default {
  name: 'BannerServices',
  components: {
    BannerItem
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
}
</style>
