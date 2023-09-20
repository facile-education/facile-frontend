<template>
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
</template>

<script>
import GroupToolbar from '@components/Groups/GroupToolbar'
import { defineAsyncComponent } from 'vue'

import GroupList from '@/components/Groups/GroupList'

const GroupDetails = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetails'))
const GroupDetailsModal = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetailsModal'))

export default {
  name: 'Groups',
  components: {
    GroupDetails,
    GroupToolbar,
    GroupList,
    GroupDetailsModal
  },
  inject: ['mq'],
  emits: ['update:layout'],
  computed: {
    isPanelDisplayed () {
      return this.$store.state.groups.isPanelDisplayed
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
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
