<template>
  <nav class="banner">
    <NeroIcon
      v-if="mq.phone"
      class="menu-icon"
      name="bars"
      @click="onShowMobileMenu"
    />
    <BannerSearch v-if="!mq.phone" />
    <div class="right-section">
      <BannerServices />
      <BannerUserProfile />
    </div>
  </nav>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import BannerServices from '@/components/Banner/BannerServices'
import BannerUserProfile from '@/components/Banner/BannerUserProfile'

const BannerSearch = defineAsyncComponent(() => import('@/components/Banner/BannerSearch'))
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'Banner',
  components: {
    BannerSearch,
    BannerServices,
    BannerUserProfile,
    NeroIcon
  },
  inject: ['mq'],
  methods: {
    onShowMobileMenu () {
      // TODO change to teleport body ?
      this.$store.dispatch('nero/toggleMobileMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
}

.menu-icon {
  margin: auto 0;
  height: 25px;
  width: 25px;
  cursor: pointer;
}

.right-section {
  margin-left: auto;
  display: flex;
}
</style>
