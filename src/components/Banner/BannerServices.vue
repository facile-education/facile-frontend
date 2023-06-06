<template>
  <div>
    <BannerItem
      :src="require('@/assets/icons/accesses.svg')"
      @click="openAccessModal"
    />
    <BannerItem
      :src="require('@/assets/images/banner/icon-letter.svg')"
      @click="redirect"
    />
    <BannerItem
      data-test="open-help-item"
      :src="require('@/assets/images/banner/icon-question.svg')"
      @click="openHelpModal"
    />
  </div>
</template>

<script>
import { MESSAGING } from '@/constants/appConstants'
import BannerItem from '@/components/Banner/BannerItem'

export default {
  name: 'BannerServices',
  components: {
    BannerItem
  },
  methods: {
    openAccessModal () {
      this.$store.dispatch('accessManager/openAccessModal')
    },
    openHelpModal () {
      this.$store.dispatch('help/openHelpModal')
    },
    redirect () {
      this.$router.push({ name: MESSAGING })
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
}
</style>
