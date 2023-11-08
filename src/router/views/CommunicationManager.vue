<template>
  <h1 :aria-label="$t('serviceTitle')" />
  <CMToolbar />
  <div class="rules">
    <InternalRightList />
    <ExternalRightList />
  </div>
</template>

<script>

import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    ExternalRightList,
    InternalRightList
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

<i18n locale="fr">
{
  "serviceTitle": "Administration des communications"
}
</i18n>
