<template>
  <Layout>
    <h1>Services</h1>
    <RouterLink to="/dashboard">
      Dashboard (0%)
    </RouterLink>
    <RouterLink to="/groups">
      Groups (0%)
    </RouterLink>

    <h2>School life</h2>
    <RouterLink to="/planning">
      Planning (0%)
    </RouterLink>
    <RouterLink to="/horaires">
      Horaires
    </RouterLink>
    <RouterLink to="/not-usual-slots">
      Horaires hors cadre
    </RouterLink>
    <RouterLink to="/progression">
      Progression
    </RouterLink>

    <h2>Documents</h2>
    <RouterLink to="/documents">
      Documents (20%)
    </RouterLink>
    <RouterLink to="/dropbox">
      Dropbox (0%)
    </RouterLink>

    <h2>Communications</h2>
    <RouterLink to="/agenda">
      Agenda (0%)
    </RouterLink>
    <RouterLink to="/contacts">
      Contacts (0%)
    </RouterLink>
    <RouterLink to="/messaging">
      Messaging (0%)
    </RouterLink>

    <h2>Resources</h2>
    <RouterLink to="/resource">
      Resource (0%)
    </RouterLink>
    <RouterLink to="/mediacenter">
      Mediacenter (0%)
    </RouterLink>
    <RouterLink to="/mediacenter-manager">
      Mediacenter Manager (0%)
    </RouterLink>

    <h2>Administration</h2>
    <RouterLink to="/application-manager">
      Application Manager (80% -> image picker, css, animations, loading)
    </RouterLink>
    <RouterLink to="/communication-manager">
      Communication Manager (50% -> date picker, widget types, tests, css, animations)
    </RouterLink>
    <RouterLink to="/dashboard-manager">
      Dashboard Manager (40% -> labels, external rights, css, animations)
    </RouterLink>
    <RouterLink to="/statistics">
      Statistics (0%)
    </RouterLink>
    <RouterLink to="/user-manager">
      User Manager (0%)
    </RouterLink>

    <h2>Super Administration</h2>
    <RouterLink to="/user-management">
      User Management (0%)
    </RouterLink>
    <RouterLink to="/cas-manager">
      Cas Manager (0%)
    </RouterLink>
    <RouterLink to="/menu-manager">
      Menu Manager (0%)
    </RouterLink>
    <RouterLink to="/tools">
      ENT Tools (0%)
    </RouterLink>

    <h2>Calendar Tests</h2>
    <RouterLink to="/full-calendar">
      Full Calendar
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
h1, h2 {
  padding-left: 1rem;
}

p {
  padding-left: 1.5rem;
}

a {
  display: block;
  color: orange;
  padding-left: 1.5rem;
  margin: 0.3rem;
}
</style>
