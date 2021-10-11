<template>
  <Layout :is-allowed="true">
    <div
      v-if="currentUser.userId !== 0"
      class="documents"
      :class="{'mobile': mq.phone}"
    >
      <CurrentOptions class="currents-options" />

      <div class="body">
        <!-- TODO: Add file drop zone component here -->
        <div class="scroll">
          <Breadcrumb />
          <DocumentList />
        </div>
        <DocumentDetails class="documentDetails" />
      </div>
    </div>
    <div v-else>
      <PentilaSpinner v-if="areActionsInProgress" />
    </div>
  </Layout>
</template>

<script>

import Layout from '@layouts/EmptyLayout'
import CurrentOptions from '@components/Documents/Options'
import Breadcrumb from '@components/Documents/Breadcrumb'
import DocumentList from '@components/Documents/DocumentList'

export default {
  name: 'Documents',
  components: { DocumentList, Breadcrumb, CurrentOptions, Layout },
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
@import '@design';

.documents {
  height: 100%;

  .currents-options {
    width: 100%;
    height: $doc-currents-options-height;
  }

  .body {
    position: relative;
    height: calc(100% - #{$doc-currents-options-height});

    .scroll {
      height: 100%;
      overflow-y: auto;
    }

    .document-details {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 300px;
    }
  }

  &.mobile {
    .body {
      .document-details {
        width: 100%;
      }
    }
  }
}

</style>
