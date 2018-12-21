<template>
  <div class="list">
    <DMWidgetItem
      v-for="(widget, index) in widgetList"
      :key="widget.widgetId"
      :widget="widget"
      :index="index"
    />
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
    widgetList () {
      return this.$store.getters['dashboardManager/sortedWidgetList']
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.list {
  padding: 0 10px;
}
</style>
