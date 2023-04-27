<template>
  <Layout :is-allowed="true">
    <h1 :aria-label="$t('serviceTitle')" />
    TODO: Planning
  </Layout>
</template>

<script>
import Layout from '@layouts/EmptyLayout.vue'

export default {
  name: 'HomeworksAndCourses',
  components: { Layout }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "serviceTitle": "Cours et devoirs"
}
</i18n>
