<template>
  <PentilaWindow
    data-test="groups-details-modal"
    :modal="true"
    :full-screen="true"
    @close="onClose"
  >
    <template #header>
      {{ selectedGroup.groupName }}
    </template>

    <template #body>
      <GroupDetails />
    </template>

    <template #footer />
  </PentilaWindow>
</template>

<script>
import GroupDetails from '@components/Groups/GroupDetails'
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
