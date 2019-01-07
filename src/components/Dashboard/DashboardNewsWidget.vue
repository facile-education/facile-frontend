<template>
  <div>
    <DashboardWidget class="news-widget">
      <div class="header theme-text-color">
        <i class="far fa-newspaper" />
        <h4
          v-t="'Dashboard.DashboardNewsWidget.widgetHeader'"
        />
      </div>
      <div class="body">
        <NewsList />
      </div>
    </DashboardWidget>
  </div>
</template>

<script>
import DashboardWidget from '@/components/Dashboard/DashboardWidget'
import NewsList from '@/components/News/NewsList'

export default {
  name: 'DashboardNewsWidget',
  components: {
    DashboardWidget,
    NewsList
  }
}
</script>

<style lang="scss" scoped>
.news-widget {
  background: none;
}
</style>
