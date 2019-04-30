<template>
  <div class="service-container">
    <AMToolbar />
    <CategoryList />
    <BroadcastScopeModal v-if="showBroadcastModal" />
    <ApplicationEditionModal v-if="showEditionModal" />
  </div>
</template>

<script>
import applicationManager from '@/store/modules/applicationManager.store'

import AMToolbar from '@/components/ApplicationManager/AMToolbar'
import ApplicationEditionModal from '@/components/ApplicationManager/ApplicationEditionModal'
import BroadcastScopeModal from '@/components/ApplicationManager/BroadcastScopeModal'
import CategoryList from '@/components/ApplicationManager/CategoryList'

export default {
  name: 'ApplicationManager',
  components: {
    CategoryList,
    AMToolbar,
    ApplicationEditionModal,
    BroadcastScopeModal
  },
  computed: {
    showBroadcastModal () {
      return this.$store.state.applicationManager.showBroadcastModal
    },
    showEditionModal () {
      return this.$store.state.applicationManager.showEditionModal
    }
  },
  beforeCreate () {
    this.$store.registerModule('applicationManager', applicationManager)
  },
  destroyed () {
    this.$store.unregisterModule('applicationManager')
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  height: 100%;
  overflow: auto;
}
</style>
