<template>
  <div class="service-container">
    <AMToolbar />
    <AMCategoryList />
    <AMBroadcastScopeModal v-if="showBroadcastModal" />
    <AMApplicationEditionModal v-if="showEditionModal" />
  </div>
</template>

<script>
import AMCategoryList from '@/components/ApplicationManager/AMCategoryList'
import AMToolbar from '@/components/ApplicationManager/AMToolbar'
import AMApplicationEditionModal from '@/components/ApplicationManager/AMApplicationEditionModal'
import AMBroadcastScopeModal from '@/components/ApplicationManager/AMBroadcastScopeModal'

export default {
  name: 'ApplicationManager',
  components: {
    AMCategoryList,
    AMToolbar,
    AMApplicationEditionModal,
    AMBroadcastScopeModal
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
.service-container {
  height: 100%;
  overflow: auto;
}
</style>
