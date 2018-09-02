<template>
  <div class="service-container">
    <CMToolbar/>
    <div class="service-body">
      <CMInternalRights/>
      <CMExternalRights/>
    </div>
  </div>
</template>

<script>
import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import CMInternalRights from '@/components/CommunicationManager/CMInternalRights'
import CMExternalRights from '@/components/CommunicationManager/CMExternalRights'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    CMInternalRights,
    CMExternalRights
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
