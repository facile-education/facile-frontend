<template>
  <nav class="banner">
    <BannerItem
      v-if="$device.phone"
      icon="fa fa-bars"
      @click="onShowMobileMenu"
    />
    <BannerSearch />
    <div class="right-section">
      <BannerServices />
      <BannerUserProfile v-if="!$device.phone" />
    </div>
  </nav>
</template>

<script>
import BannerSearch from '@/components/Banner/BannerSearch'
import BannerItem from '@/components/Banner/BannerItem'
import BannerServices from '@/components/Banner/BannerServices'
import BannerUserProfile from '@/components/Banner/BannerUserProfile'

export default {
  name: 'Banner',
  components: {
    BannerSearch,
    BannerItem,
    BannerServices,
    BannerUserProfile
  },
  methods: {
    onShowMobileMenu () {
      this.$store.dispatch('nero/toggleMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
}

.right-section {
  display: inline-block;
  position: absolute;
  right: 0;
}
</style>
