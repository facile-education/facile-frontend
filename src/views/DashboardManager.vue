<template>
  <div class="service-container">
    <DMToolbar />
    <DMWidgetList />
    <DMWidgetEditionModal v-if="isEdtitionModalDisplayed" />
  </div>
</template>

<script>
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
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  height: 100%;
}
</style>
