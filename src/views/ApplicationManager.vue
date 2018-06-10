<template>
  <div>
    <Toolbar/>
    <CategoryList/>
    <BroadcastScopeModal v-if="showBroadcastModal"/>
    <ApplicationEditionModal v-if="showEditionModal"/>
  </div>
</template>

<script>
import CategoryList from '@/components/ApplicationManager/CategoryList'
import Toolbar from '@/components/ApplicationManager/Toolbar'
import ApplicationEditionModal from '@/components/ApplicationManager/ApplicationEditionModal'
import BroadcastScopeModal from '@/components/ApplicationManager/BroadcastScopeModal'

export default {
  name: 'ApplicationManager',
  components: {
    CategoryList,
    Toolbar,
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
  }
}
</script>

<style lang="scss" scoped>

</style>
