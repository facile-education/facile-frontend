<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('CommunicationManager.serviceTitle')"
  >
    <CMToolbar />
    <div class="rules">
      <InternalRightList />
      <ExternalRightList />
    </div>
  </ServicesWrapper>
</template>

<script>

import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    ExternalRightList,
    InternalRightList,
    ServicesWrapper
  },
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>
.rules {
  padding: 5px;
}
</style>
