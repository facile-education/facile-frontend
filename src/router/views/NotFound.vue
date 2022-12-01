<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <h2 v-t="'message'" />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'

export default {
  name: 'NotFound',
  components: {
    Layout
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "message": "Oups, cette page n'existe pas",
  "serviceTitle": "Erreur 404 : ressource introuvable"
}
</i18n>
