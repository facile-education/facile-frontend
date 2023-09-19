<template>
  <div class="banner-services">
    <BannerItem
      :src="require('@/assets/icons/accesses.svg')"
      :title="$t('accesses')"
      @click="toggleAccesses"
    />
    <BannerItem
      data-test="open-help-item"
      :src="require('@/assets/icons/help.svg')"
      :title="$t('help')"
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
  methods: {
    toggleAccesses () {
      this.$store.dispatch('menu/closeMobileMenu')
      this.isAccessPopoverDisplayed = !this.isAccessPopoverDisplayed
    },
    openHelpModal () {
      this.$store.dispatch('menu/closeMobileMenu')
      this.$store.dispatch('help/openHelpModal')
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

<i18n locale="fr">
  {
    "accesses": "Accès",
    "help": "Aide",
  }
  </i18n>
