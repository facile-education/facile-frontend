<template>
  <div>
    <h3 v-t="'SchoolLifeManager.SynchronizationManager.title'" />
    <AAFInformations v-if="isAAF" />
    <EDTInformations v-if="isEDT" />
    <!-- UDT v-if -->
  </div>
</template>

<script>
import AAFInformations from '@/components/SchoolLifeManager/AAFInformations'
import EDTInformations from '@/components/SchoolLifeManager/EDTInformations'

export default {
  name: 'SynchronizationManager',
  components: {
    AAFInformations,
    EDTInformations
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
