<template>
  <Layout>
    <RouterLink to="/application-manager">
      App
    </RouterLink>
    <RouterLink to="/communication-manager">
      Comm
    </RouterLink>
    <RouterLink to="/dashboard-manager">
      Dashboard
    </RouterLink>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'

export default {
  name: 'Menu',
  components: {
    Layout
  }
}
</script>

<style lang="scss" scoped>
</style>
