<template>
  <div>
    <DashboardWidget class="news-widget">
      <div class="header theme-text-color">
        <i class="far fa-newspaper" />
        <h4
          v-t="'Dashboard.DashboardHMNewsWidget.widgetHeader'"
        />
      </div>
      <div class="body">
        <NewsList :is-head-master="isHeadMaster" />
      </div>
    </DashboardWidget>
  </div>
</template>

<script>
import DashboardWidget from '@/components/Dashboard/DashboardWidget'
import NewsList from '@/components/News/NewsList'

export default {
  name: 'DashboardHMNewsWidget',
  components: {
    DashboardWidget,
    NewsList
  },
  data () {
    return {
      isHeadMaster: true
    }
  }
}
</script>

<style lang="scss" scoped>
.news-widget {
  background: none;
}
</style>
