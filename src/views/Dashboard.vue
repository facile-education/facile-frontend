<template>
  <div class="dashboard">
    <DashboardNewsWidget class="news" />
    <DashboardHMNewsWidget class="news" />
  </div>
</template>

<script>
import DashboardNewsWidget from '@/components/Dashboard/DashboardNewsWidget'
import DashboardHMNewsWidget from '@/components/Dashboard/DashboardHMNewsWidget'

export default {
  name: 'Dashboard',
  components: {
    DashboardNewsWidget,
    DashboardHMNewsWidget
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color: #8b9ea8;
}

.dashboard {
  background-color: #ebeff5;
  height: 100%;
  overflow-y: auto;
}

.news {
  display: inline-block;
  max-width: 50%;
}
</style>
