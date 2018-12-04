<template>
  <div>
    <h3 v-t="'SchoolLifeManager.SLMSynchronization.title'" />
    <SLMAafInformations v-if="isAAF" />
    <SLMEdtInformations v-if="isEDT" />
    <!-- UDT v-if -->
  </div>
</template>

<script>
import SLMAafInformations from '@/components/SchoolLifeManager/SLMAafInformations'
import SLMEdtInformations from '@/components/SchoolLifeManager/SLMEdtInformations'

export default {
  name: 'SLMSynchronization',
  components: {
    SLMAafInformations,
    SLMEdtInformations
  },
  props: {
    synchronization: {
      type: String,
      required: true
    }
  },
  computed: {
    isAAF () {
      return (this.synchronization === 'AAF')
    },
    isEDT () {
      return (this.synchronization === 'EDT')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
