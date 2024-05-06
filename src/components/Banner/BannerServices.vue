<template>
  <div class="banner-services">
    <BannerItem
      :src="require('@/assets/icons/accesses.svg')"
      :title="$t('Banner.BannerServices.accesses')"
      @click="toggleAccesses"
    />
    <BannerItem
      data-test="open-help-item"
      :src="require('@/assets/icons/help.svg')"
      :title="$t('Banner.BannerServices.help')"
      @click="openHelpModal"
    />

    <AccessPopover
      v-if="isAccessPopoverDisplayed"
      @close="isAccessPopoverDisplayed=false"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import BannerItem from '@/components/Banner/BannerItem'
import { appVersion, helpWebsite } from '@/constants/appConstants.js'
const AccessPopover = defineAsyncComponent(() => import('@components/Accesses/AccessVisualization/AccessPopover'))

export default {
  name: 'BannerServices',
  components: {
    AccessPopover,
    BannerItem
  },
  data () {
    return {
      isAccessPopoverDisplayed: false
    }
  },
  computed: {
    currentLocale () {
      return this.$store.state.user.locale.frontId
    }
  },
  methods: {
    toggleAccesses () {
      this.$store.dispatch('menu/closeMobileMenu')
      this.isAccessPopoverDisplayed = !this.isAccessPopoverDisplayed
    },
    openHelpModal () {
      const helpUrl = helpWebsite + '/' + this.currentLocale + '/' + appVersion + '/' + this.$route.name
      window.open(helpUrl, '_blank')
      // this.$store.dispatch('menu/closeMobileMenu')
      // this.$store.dispatch('help/openHelpModal')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
  overflow: visible;
}

.banner-services {
  position: relative;
}
</style>
