<template>
  <div>
    <DashboardWidget>
      <div class="header">
        Translate News title + actions buttons
      </div>
      <div class="body">
        <NewsList/>
      </div>
    </DashboardWidget>
  </div>
</template>

<script>
import DashboardWidget from '@/components/DashboardWidget'
import NewsList from '@/components/NewsList'

export default {
  name: 'DashboardNewsWidget',
  components: {
    DashboardWidget,
    NewsList
  }
}
</script>

<style lang="scss" scoped>

</style>
