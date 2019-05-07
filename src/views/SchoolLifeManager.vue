<template>
  <div class="service">
    <SynchronizationManager
      v-if="synchronizationType"
      :synchronization="synchronizationType"
    />
    <SynchronizationWizard v-else />
  </div>
</template>

<script>
// TODO Toolbar ?
import schoolLifeManagerStore from '@/store/modules/schoolLifeManager.store'

import SynchronizationManager from '@/components/SchoolLifeManager/SynchronizationManager'
import SynchronizationWizard from '@/components/SchoolLifeManager/SynchronizationWizard'

export default {
  name: 'SchoolLifeManager',
  components: {
    SynchronizationManager,
    SynchronizationWizard
  },
  computed: {
    synchronizationType () {
      return this.$store.state.schoolLifeManager.synchronizationType
    }
  },
  beforeCreate () {
    this.$store.registerModule('schoolLifeManager', schoolLifeManagerStore)
  },
  created () {
    if (this.synchronizationType === undefined) {
      this.$store.dispatch('schoolLifeManager/getSynchronizationType')
    }
  },
  destroyed () {
    this.$store.unregisterModule('schoolLifeManager')
  }
}
</script>

<style lang="scss" scoped>
.service {
  padding: 10px;
  height: 100%;
  overflow: auto;
}
</style>
