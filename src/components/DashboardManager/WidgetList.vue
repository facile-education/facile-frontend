<template>
  <div class="list">
    <WidgetItem
      v-for="(widget, index) in widgetList"
      :key="widget.widgetId"
      :widget="widget"
      :index="index"
    />
  </div>
</template>

<script>
import WidgetItem from '@/components/DashboardManager/WidgetItem'

export default {
  name: 'WidgetList',
  components: {
    WidgetItem
  },
  computed: {
    widgetList () {
      return this.$store.getters['dashboardManager/sortedWidgetList']
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding: 0 10px;
}
</style>
