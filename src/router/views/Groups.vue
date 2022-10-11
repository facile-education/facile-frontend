<template>
  <Layout
    class="layout"
  >
    <PentilaSpinner
      v-if="areActionsInProgress"
    />
    <GroupList
      v-else
      class="group-list"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import GroupList from '@/components/Groups/GroupList'

export default {
  name: 'Groups',
  components: {
    Layout,
    GroupList
  },
  computed: {
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

  .group-list {
    height: 100%;
  }
}
</style>
