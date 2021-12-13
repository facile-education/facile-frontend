<template>
  <Layout
    class="layout"
  >
    <DashboardPanel />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import DashboardPanel from '@/components/Dashboard/DashboardPanel'

export default {
  name: 'Progression',
  components: {
    Layout,
    DashboardPanel
  },
  computed: {
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

}
</style>
