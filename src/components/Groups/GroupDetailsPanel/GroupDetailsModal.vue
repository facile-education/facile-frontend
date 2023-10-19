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
export default {
  name: 'GroupDetailsModal',
  components: { GroupDetails },
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
