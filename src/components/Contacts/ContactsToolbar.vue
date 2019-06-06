<template>
  <NeroToolbar>
    <PentilaButton
      icon="fa fa-bars"
      @click="console.log('TODO')"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'ContactsToolbar',
  components: {
    NeroToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
