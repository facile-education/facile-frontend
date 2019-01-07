<template>
  <NeroToolbar>
    <NeroButton
      icon="fa fa-plus"
      label="Creation Dropdown"
    />
    <NeroButton
      icon="fa fa-plus-square"
    />
    <NeroButton
      icon="fa fa-edit"
      label="Edit Dropdown"
    />
    <NeroButton
      icon="fa fa-image"
      label="View Dropdown"
    />
    <NeroButton
      icon="fa fa-envelope"
    />
    <NeroButton
      icon="fa fa-sort"
      label="Sort Dropdown"
    />
    <NeroButton
      icon="fa fa-sync-alt"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'WorkspaceToolbar',
  components: {
    NeroToolbar,
    NeroButton
  }
}
</script>

<style lang="scss" scoped>

</style>
