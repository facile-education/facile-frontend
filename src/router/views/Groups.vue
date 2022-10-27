<template>
  <Layout
    class="layout"
  >
    <PentilaSpinner v-if="areActionsInProgress" />

    <GroupToolbar />

    <GroupList />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import GroupList from '@/components/Groups/GroupList'
import GroupToolbar from '@components/Groups/GroupToolbar'

export default {
  name: 'Groups',
  components: {
    GroupToolbar,
    Layout,
    GroupList
  },
  computed: {
    selectedGroupId () {
      return this.$route.params.groupId
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    }
  },
  created () {
    // Watch route changes to react on groupId change
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.groupId) {
          // TODO
        } else {
          // TODO
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}
</style>
