<template>
  <div>
    <BannerItem
      :src="require('@/assets/icons/accesses.svg')"
      :title="$t('accesses')"
      @click="openAccessModal"
    />
    <BannerItem
      data-test="open-help-item"
      :src="require('@/assets/icons/help.svg')"
      :title="$t('help')"
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
    openAccessModal () {
      this.$store.dispatch('accessManager/openAccessModal')
    },
    openHelpModal () {
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
}
</style>

<i18n locale="fr">
  {
    "accesses": "Accès",
    "help": "Aide",
  }
  </i18n>
