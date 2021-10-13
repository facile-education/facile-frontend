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
          <Breadcrumb @click.right.prevent.stop />
          <DocumentList
            @openContextMenu="openContextMenu"
            @click.right.prevent.stop
          />
        </div>
        <DocumentDetails
          v-if="isDocumentPanelDisplayed"
          class="document-details"
        />
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

    <teleport to="body">
      <!--      <FilePickerModal-->
      <!--        v-if="isFilePickerModalDisplayed"-->
      <!--        height="30em"-->
      <!--        :folder-selection="true"-->
      <!--        :init-in-current-folder="true"-->
      <!--        @chosenFolder="doSelectFolderAction"-->
      <!--        @close="isFilePickerModalDisplayed = false"-->
      <!--      />-->
      <!--      <DeleteConfirmModal-->
      <!--        v-if="isDeleteDefinitelyModalDisplayed"-->
      <!--        :entities-to-definitely-delete="selectedFiles"-->
      <!--        @confirmDeletion="deleteDefinitely"-->
      <!--        @close="isDeleteDefinitelyModalDisplayed=false"-->
      <!--      />-->
    </teleport>
  </Layout>
</template>

<script>

import Layout from '@layouts/EmptyLayout'
import CurrentOptions from '@components/Documents/Options'
import Breadcrumb from '@components/Documents/Breadcrumb'
import DocumentList from '@components/Documents/DocumentList'
import DocumentDetails from '@components/Documents/DocumentDetails'
import ContextMenu from '@components/ContextMenu/ContextMenu'
import { documentSpaceOptions } from '@/constants/options'
import { computeDocumentsOptions, downLoadDocument, deleteEntities } from '@/utils/documents.utils'

export default {
  name: 'Documents',
  components: { ContextMenu, DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, Layout },
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
    isDocumentPanelDisplayed () {
      return this.$store.state.documents.isDocumentPanelDisplayed
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
      switch (option) {
        case 'copy':
          this.$store.dispatch('clipboard/copy')
          break
        case 'cut':
          this.$store.dispatch('clipboard/cut')
          break
        case 'duplicate':
          this.folderSelectionOption = 'duplicate'
          this.isFilePickerModalDisplayed = true
          break
        case 'move':
          this.folderSelectionOption = 'move'
          this.isFilePickerModalDisplayed = true
          break
        case 'paste':
          this.$store.dispatch('clipboard/paste', this.document.id)
          break
        case 'delete':
          this.$store.dispatch('warningModal/addWarning', {
            text: this.$t('router.views.Documents.Warning.deleteDocument'),
            lastAction: { fct: deleteEntities, params: [this.selectedFiles] }
          })
          break
        case 'download':
          downLoadDocument(this.selectedDocuments[0])
          break
        case 'rename':
          this.$store.dispatch('modals/openRenameModal', this.selectedFiles[0])
          break
        case 'share':
          this.$store.dispatch('post/setIndicator', undefined)
          this.$store.dispatch('post/setFile', this.document)
          this.$store.dispatch('modals/openCreatePostModal')
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    doSelectFolderAction (targetFolder) {
      if (this.folderSelectionOption === 'move') {
        this.$store.dispatch('clipboard/move', targetFolder)
      } else if (this.folderSelectionOption === 'duplicate') {
        this.$store.dispatch('clipboard/duplicate', targetFolder)
      } else {
        console.error('Unknown option' + this.folderSelectionOption)
      }
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
