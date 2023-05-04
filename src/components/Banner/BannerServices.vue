<template>
  <div>
    <BannerItem :src="require('@/assets/images/banner/icon-star.svg')" />
    <BannerItem
      :src="require('@/assets/images/banner/icon-letter.svg')"
      @click="$router.push({ name: 'Messagerie' })"
    />
    <BannerItem :src="require('@/assets/images/banner/icon-archives.svg')" />
    <BannerItem
      data-test="open-help-item"
      :src="require('@/assets/images/banner/icon-question.svg')"
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
