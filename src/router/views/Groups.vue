<template>
  <Layout
    class="layout"
  >
    <PentilaSpinner v-if="areActionsInProgress" />

    <GroupToolbar />

    <div class="body">
      <GroupList />
      <GroupDetails
        v-if="isPanelDisplayed && !mq.phone"
      />
    </div>

    <teleport to="body">
      <GroupDetailsModal v-if="isPanelDisplayed && mq.phone" />
    </teleport>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import GroupList from '@/components/Groups/GroupList'
import GroupToolbar from '@components/Groups/GroupToolbar'
import GroupDetails from '@components/Groups/GroupDetails'
import { defineAsyncComponent } from 'vue'
const GroupDetailsModal = defineAsyncComponent(() => import('@/components/Groups/GroupDetailsModal'))

export default {
  name: 'Groups',
  components: {
    GroupDetails,
    GroupToolbar,
    Layout,
    GroupList,
    GroupDetailsModal
  },
  inject: ['mq'],
  computed: {
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
@import '@/design';

.layout {
  height: 100%;

  .body {
    display: flex;
    height: calc(100% - $groups-header-height);
  }
}
</style>
