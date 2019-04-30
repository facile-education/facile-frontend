<template>
  <div class="service">
    <SLMSynchronization
      v-if="synchronizationType"
      :synchronization="synchronizationType"
    />
    <SLMWizard v-else />
  </div>
</template>

<script>
// TODO Toolbar ?
import schoolLifeManagerStore from '@/store/modules/schoolLifeManager.store'

import SLMSynchronization from '@/components/SchoolLifeManager/SLMSynchronization'
import SLMWizard from '@/components/SchoolLifeManager/SLMWizard'

export default {
  name: 'SchoolLifeManager',
  components: {
    SLMSynchronization,
    SLMWizard
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
