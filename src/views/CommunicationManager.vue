<template>
  <div class="service-container">
    <CMToolbar />
    <div class="service-body">
      <InternalRightList />
      <ExternalRightList />
    </div>
  </div>
</template>

<script>
import communicationManagerStore from '@/store/modules/communicationManager.store'

import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    InternalRightList,
    ExternalRightList
  },
  beforeCreate () {
    this.$store.registerModule('communicationManager', communicationManagerStore)
  },
  destroyed () {
    this.$store.unregisterModule('communicationManager')
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  height: 100%;
  overflow: auto;
}

.service-body {
  padding: 5px;
}
</style>
