<template>
  <div class="list">
    <DMWidgetItem
      v-for="(widget, index) in sortedWidgetList"
      :key="widget.widgetId"
      :widget="widget"
      :index="index"/>
  </div>
</template>

<script>
import DMWidgetItem from '@/components/DashboardManager/DMWidgetItem'

export default {
  name: 'DMWidgetList',
  components: {
    DMWidgetItem
  },
  computed: {
    sortedWidgetList () {
      // Sort widget list -> bubble up widgets which can be managed or sort by name
      if (this.widgetList) {
        var vm = this
        var localAdminScope = this.$store.state.dashboardManager.scopeList['SCHOOL_INSTANCE']
        var entAdminScope = this.$store.state.dashboardManager.scopeList['ENT_ADMIN_INSTANCE']

        return this.widgetList.slice().sort(function (a, b) {
          if (a.scope !== b.scope) {
            if (vm.$store.state.currentUser.isLocalAdmin && (a.scope === localAdminScope || b.scope === localAdminScope)) {
              return a.scope === localAdminScope ? -1 : 1
            } else if (vm.$store.state.currentUser.isENTAdmin && (a.scope === entAdminScope || b.scope === entAdminScope)) {
              return a.scope === entAdminScope ? -1 : 1
            }
          }
          return a.name.localeCompare(b.name)
        })
      }
    },
    widgetList () {
      return this.$store.state.dashboardManager.widgetList
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.list {
  padding: 0 10px;
  height: calc(100% - #{$toolbar-height});
  overflow-y: auto;
}
</style>
