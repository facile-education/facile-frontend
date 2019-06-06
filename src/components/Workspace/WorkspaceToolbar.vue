<template>
  <NeroToolbar>
    <PentilaButton
      icon="fa fa-plus"
      label="Creation Dropdown"
    />
    <PentilaButton
      icon="fa fa-plus-square"
    />
    <PentilaButton
      icon="fa fa-edit"
      label="Edit Dropdown"
    />
    <PentilaButton
      icon="fa fa-image"
      label="View Dropdown"
    />
    <PentilaButton
      icon="fa fa-envelope"
    />
    <PentilaButton
      icon="fa fa-sort"
      label="Sort Dropdown"
    />
    <PentilaButton
      icon="fa fa-sync-alt"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'WorkspaceToolbar',
  components: {
    NeroToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
