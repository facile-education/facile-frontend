<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <DMToolbar />
    <WidgetList />
    <WidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </Layout>
</template>

<script>

import DMToolbar from '@/components/DashboardManager/DMToolbar'
import WidgetEditionModal from '@/components/DashboardManager/WidgetEditionModal'
import WidgetList from '@/components/DashboardManager/WidgetList'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'DashboardManager',
  components: {
    DMToolbar,
    Layout,
    WidgetList,
    WidgetEditionModal
  },
  computed: {
    isEdtitionModalDisplayed () {
      return this.$store.state.dashboardManager.isWidgetEditionModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "serviceTitle": "Administration des tableau de bords"
}
</i18n>
