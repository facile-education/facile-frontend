<template>
  <Layout>
    <ActivityWidget :display-all="true" />
  </Layout>
</template>

<script>
import ActivityWidget from '@components/Dashboard/ActivityWidget/ActivityWidget.vue'
import Layout from '@layouts/BannerLayout.vue'

export default {
  name: 'AllActivities',
  components: { Layout, ActivityWidget }
}
</script>

<style lang="scss" scoped>

</style>
