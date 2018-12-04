<template>
  <NeroToolbar>
    <NeroButton
      icon="fa fa-bars"
    />
    <NeroButton
      icon="fa fa-sync-alt"
    />
    <NeroButton
      icon="fa fa-edit"
    />
    <NeroButton
      icon="fa fa-angle-double-left"
    />
    <NeroButton
      icon="fa fa-angle-left"
    />
    <NeroButton
      icon="fa fa-angle-right"
    />
    <NeroButton
      icon="fa fa-trash"
    />
    <NeroButton
      icon="fa fa-print"
    />
    <NeroButton
      icon="fa fa-cog"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/NeroToolbar'
import NeroButton from '@/components/NeroButton'

export default {
  name: 'MessagingToolbar',
  components: {
    NeroToolbar,
    NeroButton
  }
}
</script>

<style lang="scss" scoped>

</style>
