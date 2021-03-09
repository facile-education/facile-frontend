<template>
  <Layout>
    <CMToolbar />
    <div class="rules">
      <InternalRightList />
      <ExternalRightList />
    </div>
  </Layout>
</template>

<script>
import communicationManagerStore from '@/store/modules/communicationManager.store'

import Layout from '@/router/layouts/EmptyLayout'
import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    ExternalRightList,
    InternalRightList,
    Layout
  },
  beforeCreate () {
    this.$store.registerModule('communicationManager', communicationManagerStore)
  },
  unmounted () {
    this.$store.unregisterModule('communicationManager')
  }
}
</script>

<style lang="scss" scoped>
.rules {
  padding: 5px;
}
</style>
