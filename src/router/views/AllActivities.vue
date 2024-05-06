<template>
  <ServicesWrapper
    :is-title-visible="false"
  >
    <ActivityWidget :display-all="true" />
  </ServicesWrapper>
</template>

<script>
import ActivityWidget from '@components/Dashboard/ActivityWidget/ActivityWidget.vue'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'AllActivities',
  components: { ActivityWidget, ServicesWrapper },
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>

</style>
