<template>
  <div class="service-container">
    <DMToolbar />
    <DMWidgetList />
    <DMWidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </div>
</template>

<script>
import dashboardManagerStore from '@/store/modules/dashboardManager.store'

import DMToolbar from '@/components/DashboardManager/DMToolbar'
import DMWidgetList from '@/components/DashboardManager/DMWidgetList'
import DMWidgetEditionModal from '@/components/DashboardManager/DMWidgetEditionModal'

export default {
  name: 'DashboardManager',
  components: {
    DMToolbar,
    DMWidgetList,
    DMWidgetEditionModal
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
