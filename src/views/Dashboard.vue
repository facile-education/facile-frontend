<template>
  <div>
    <DashboardNewsWidget />
  </div>
</template>

<script>
import DashboardNewsWidget from '@/components/DashboardNewsWidget'

export default {
  name: 'Dashboard',
  components: {
    DashboardNewsWidget
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color: #8b9ea8;
}
</style>
