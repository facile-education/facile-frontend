<template>
  <Layout class="menu">
    <RouterLink to="/application-manager">
      App
    </RouterLink>
    <RouterLink to="/communication-manager">
      Comm
    </RouterLink>
    <RouterLink to="/dashboard-manager">
      Dashboard
    </RouterLink>
    <RouterLink to="/not-usual-slots">
      Horaires hors cadre
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
.menu {
  display: flex;
  flex-direction: column;
}
</style>
