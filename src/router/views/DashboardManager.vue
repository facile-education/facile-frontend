<template>
  <Layout>
    <DMToolbar />
    <WidgetList />
    <WidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import DMToolbar from '@/components/DashboardManager/DMToolbar'
import WidgetList from '@/components/DashboardManager/WidgetList'
import WidgetEditionModal from '@/components/DashboardManager/WidgetEditionModal'

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
