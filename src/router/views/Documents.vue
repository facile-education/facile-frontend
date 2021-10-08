<template>
  <Layout :is-allowed="true">
    <div
      v-if="currentUser.userId !== 0"
      class="documents"
    >
      <div
        v-for="(entity, index) in currentEntities"
        :key="index"
      >
        {{ entity }}
      </div>
    </div>
    <div v-else>
      <PentilaSpinner v-if="areActionsInProgress" />
    </div>
  </Layout>
</template>

<script>

import Layout from '@layouts/EmptyLayout'

export default {
  name: 'Documents',
  components: { Layout },
  inject: ['mq'],
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    currentEntities () {
      // Why is this necessary to slice child arrays ?
      return JSON.parse(JSON.stringify(this.$store.state.documents.folderContent))
    }
  },
  beforeCreate () {
    this.$store.dispatch('documents/getSpacesFolders')
    // this.$store.dispatch('fileFields/resetPrivateFields')
  }
}
</script>

<style lang="scss" scoped>

</style>
