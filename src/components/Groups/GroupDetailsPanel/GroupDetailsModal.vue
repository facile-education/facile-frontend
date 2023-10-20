<template>
  <WeprodeWindow
    data-test="groups-details-modal"
    :modal="true"
    :full-screen="true"
    @close="onClose"
  >
    <template #header>
      {{ selectedGroup.groupName ? selectedGroup.groupName : selectedGroup.name }}
    </template>

    <template #body>
      <GroupDetails />
    </template>

    <template #footer />
  </WeprodeWindow>
</template>

<script>
import GroupDetails from '@components/Groups/GroupDetailsPanel/GroupDetails'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'GroupDetailsModal',
  components: { GroupDetails, WeprodeWindow },
  computed: {
    selectedGroup () {
      return this.$store.state.groups.selectedGroup
    }
  },
  methods: {
    onClose () {
      this.$store.dispatch('groups/closePanel')
      this.$store.dispatch('documents/closeDocumentPanel')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
