<template>
  <NeroToolbar>
    <PentilaButton
      icon="fa fa-bars"
    />
    <PentilaButton
      icon="fa fa-sync-alt"
    />
    <PentilaButton
      icon="fa fa-edit"
    />
    <PentilaButton
      icon="fa fa-angle-double-left"
    />
    <PentilaButton
      icon="fa fa-angle-left"
    />
    <PentilaButton
      icon="fa fa-angle-right"
    />
    <PentilaButton
      icon="fa fa-trash"
    />
    <PentilaButton
      icon="fa fa-print"
    />
    <PentilaButton
      icon="fa fa-cog"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'MessagingToolbar',
  components: {
    NeroToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
