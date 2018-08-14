<template>
  <nav class="banner">
    <BannerItem
      v-if="$device.phone"
      icon="fa fa-bars"/>
    <BannerSearch/>
    <div class="right-section">
      <BannerServices/>
      <BannerUserProfile v-if="!$device.phone"/>
    </div>
  </nav>
</template>

<script>
import BannerSearch from '@/components/BannerSearch'
import BannerItem from '@/components/BannerItem'
import BannerServices from '@/components/BannerServices'
import BannerUserProfile from '@/components/BannerUserProfile'

export default {
  name: 'Banner',
  components: {
    BannerSearch,
    BannerItem,
    BannerServices,
    BannerUserProfile
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
