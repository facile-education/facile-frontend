<template>
  <Layout>
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
import { defineAsyncComponent } from 'vue'

import Layout from '@/router/layouts/EmptyLayout'
import GroupList from '@/components/Groups/GroupList'
import GroupToolbar from '@components/Groups/GroupToolbar'

const GroupDetails = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetails'))
const GroupDetailsModal = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetailsModal'))

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
  },
  created () {
    this.$store.dispatch('groups/closePanel')
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.body {
  display: flex;
  height: calc(100% - $groups-header-height);
}
</style>
