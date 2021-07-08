<template>
  <Layout>
    <AMToolbar />
    <CategoryList />
    <BroadcastScopeModal v-if="showBroadcastModal" />
    <ApplicationEditionModal v-if="showEditionModal" />
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import AMToolbar from '@/components/ApplicationManager/AMToolbar'
import ApplicationEditionModal from '@/components/ApplicationManager/ApplicationEditionModal'
import BroadcastScopeModal from '@/components/ApplicationManager/BroadcastScopeModal'
import CategoryList from '@/components/ApplicationManager/CategoryList'

export default {
  name: 'ApplicationManager',
  components: {
    AMToolbar,
    ApplicationEditionModal,
    BroadcastScopeModal,
    CategoryList,
    Layout
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
