<template>
  <Layout :is-allowed="true">
    <div
      v-if="currentUser.userId !== 0"
      class="documents"
      :class="{'mobile': mq.phone}"
    >
      <CurrentOptions
        class="currents-options"
        :selected-documents-options="[]"
        @optionClicked="handleOption"
      />

      <div class="body">
        <!-- TODO: Add file drop zone component here -->
        <div
          class="scroll"
          @click.right.prevent="rightClickOnSpace"
        >
          <Breadcrumb />
          <DocumentList @openContextMenu="openContextMenu" />
        </div>
        <DocumentDetails class="documentDetails" />
      </div>
    </div>
    <div v-else>
      <PentilaSpinner v-if="areActionsInProgress" />
    </div>

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      @chooseOption="handleOption"
      @close="isContextMenuDisplayed=false"
    />
  </Layout>
</template>

<script>

import Layout from '@layouts/EmptyLayout'
import CurrentOptions from '@components/Documents/Options'
import Breadcrumb from '@components/Documents/Breadcrumb'
import DocumentList from '@components/Documents/DocumentList'
import DocumentDetails from '@components/Documents/DocumentDetails'
import { documentSpaceOptions } from '@/constants/options'
import { computeDocumentsOptions } from '@/utils/documents.utils'

export default {
  name: 'Documents',
  components: { DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, Layout },
  inject: ['mq'],
  data () {
    return {
      isContextMenuDisplayed: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    selectedDocuments () {
      return this.$store.state.documents.selectedFiles
    },
    selectedDocumentsOptions () {
      return computeDocumentsOptions(this.selectedDocuments)
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    }
  },
  beforeCreate () {
    this.$store.dispatch('documents/getSpacesFolders')
    // this.$store.dispatch('fileFields/resetPrivateFields')
  },
  methods: {
    rightClickOnSpace (event) {
      this.$store.dispatch('documents/cleanSelectedFiles') // /!\ be careful with asynchronous order!
      this.openContextMenu(event)
    },
    openContextMenu (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        let currentOptions
        if (this.selectedDocuments.length > 0) { // remove paste option if no documents were copied
          currentOptions = this.selectedDocumentsOptions
        } else {
          currentOptions = [...documentSpaceOptions]
        }
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: currentOptions
          })
      }
    },
    handleOption (option) {
      // TODO
      console.log(option)
    }
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
