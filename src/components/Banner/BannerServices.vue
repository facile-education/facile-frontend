<template>
  <div>
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-star.svg" />
    <BannerItem
      src="/pentilaBanner-theme/images/icon/banner/icon-letter.svg"
      @click="$router.push({ name: 'Messaging' })"
    />
    <BannerItem src="/pentilaBanner-theme/images/icon/banner/icon-archives.svg" />
    <BannerItem
      data-test="open-help-item"
      src="/pentilaBanner-theme/images/icon/banner/icon-question.svg"
      @click="openHelpModal"
    />
  </div>
</template>

<script>
import BannerItem from '@/components/Banner/BannerItem'

export default {
  name: 'BannerServices',
  components: {
    BannerItem
  },
  methods: {
    openHelpModal () {
      this.$store.dispatch('help/openHelpModal')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
}
</style>
