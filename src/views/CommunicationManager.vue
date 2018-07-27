<template>
  <div class="service-container">
    <CMToolbar/>
    <div class="service-body">
      <InternalRights/>
      <ExternalRights/>
    </div>
  </div>
</template>

<script>
import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import InternalRights from '@/components/CommunicationManager/InternalRights'
import ExternalRights from '@/components/CommunicationManager/ExternalRights'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    InternalRights,
    ExternalRights
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
