<template>
  <Layout>
    <DMToolbar />
    <WidgetList />
    <WidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </Layout>
</template>

<script>
import dashboardManagerStore from '@/store/modules/dashboardManager.store'

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
  },
  beforeCreate () {
    this.$store.registerModule('dashboardManager', dashboardManagerStore)
  },
  unmounted () {
    this.$store.unregisterModule('dashboardManager')
  }
}
</script>

<style lang="scss" scoped>
</style>
