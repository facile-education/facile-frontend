<template>
  <nav class="banner">
    <BannerSearch/>
    <div class="right-section">
      <BannerServices/>
      <BannerUserProfile/>
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
  padding: 0 10px;
}

.right-section {
  display: inline-block;
  position: absolute;
  right: 10px;
}
</style>
