<template>
  <Layout
    :is-allowed="!$store.state.user.isStudent && !$store.state.user.isParent"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />
    <p>Gestion des accès TODO</p>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'AccessManager',
  components: {
    Layout
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

<i18n locale="fr">
{
  "serviceTitle": "Gestion des accès"
}
</i18n>
