<template>
  <div>
    <CMToolbar/>
    <InternalRights/>
    <ExternalRights/>
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

</style>
