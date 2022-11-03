<template>
  <Layout
    class="layout"
  >
    <PentilaSpinner v-if="areActionsInProgress" />

    <GroupToolbar />

    <div class="body">
      <GroupList />
      <GroupDetails
        v-if="isPanelDisplayed"
      />
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import GroupList from '@/components/Groups/GroupList'
import GroupToolbar from '@components/Groups/GroupToolbar'
import GroupDetails from '@components/Groups/GroupDetails'

export default {
  name: 'Groups',
  components: {
    GroupDetails,
    GroupToolbar,
    Layout,
    GroupList
  },
  computed: {
    selectedGroupId () {
      return this.$route.params.groupId
    },
    isPanelDisplayed () {
      return this.$store.state.groups.isPanelDisplayed
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

  .body {
    display: flex;
  }
}
</style>
