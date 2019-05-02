<template>
  <div class="service-container">
    <DMToolbar />
    <WidgetList />
    <WidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </div>
</template>

<script>
import dashboardManagerStore from '@/store/modules/dashboardManager.store'

import DMToolbar from '@/components/DashboardManager/DMToolbar'
import WidgetList from '@/components/DashboardManager/WidgetList'
import WidgetEditionModal from '@/components/DashboardManager/WidgetEditionModal'

export default {
  name: 'DashboardManager',
  components: {
    DMToolbar,
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
  destroyed () {
    this.$store.unregisterModule('dashboardManager')
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  height: 100%;
  overflow: auto;
}
</style>
