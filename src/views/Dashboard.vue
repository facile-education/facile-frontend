<template>
  <div>
    <h4>Home > Dashboard</h4>
    <AppButton label="Test"/>
    <DashboardWidget/>
  </div>
</template>

<script>
import AppButton from '@/components/AppButton.vue'
import DashboardWidget from '@/components/DashboardWidget.vue'

export default {
  name: 'Dashboard',
  components: {
    AppButton,
    DashboardWidget
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color: #8b9ea8;
}
</style>
