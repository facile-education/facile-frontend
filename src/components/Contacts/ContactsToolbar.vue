<template>
  <NeroToolbar>
    <NeroButton
      icon="fa fa-bars"
      @click="console.log('TODO')"
    />
  </NeroToolbar>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import NeroToolbar from '@/components/NeroToolbar'

export default {
  name: 'ContactsToolbar',
  components: {
    NeroButton,
    NeroToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
