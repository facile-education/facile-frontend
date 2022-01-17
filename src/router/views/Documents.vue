<template>
  <Layout :is-allowed="true">
    <div
      v-if="currentUser.userId !== 0"
      class="documents"
      :class="{'mobile': mq.phone}"
      @click.right.prevent
    >
      <CurrentOptions
        class="currents-options"
        :options="currentOptions"
        @optionClicked="handleOption"
      />

      <div class="body">
        <PentilaSpinner
          v-if="areActionsInProgress"
          class="spinner"
        />
        <FilePickerArea
          class="file-picker-area"
          @fileAdded="importDocument"
        >
          <div
            class="scroll"
            @click="clickOnScrollDiv"
            @click.right.prevent="rightClickOnScrollDiv"
          >
            <Breadcrumb class="breadCrumb" />
            <DocumentList @openContextMenu="openContextMenu" />
          </div>
          <DocumentDetails
            v-if="isDocumentPanelDisplayed"
            class="document-details"
          />
        </FilePickerArea>
      </div>
    </div>
    <div v-else>
      <PentilaSpinner />
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
      <!--        :entities-to-definitely-delete="selectedEntities"-->
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
import { computeDocumentsOptions, downLoadDocument, deleteEntities, importDocuments } from '@utils/documents.util'
import FilePickerArea from '@components/FilePicker/FilePickerArea'

export default {
  name: 'Documents',
  components: { FilePickerArea, ContextMenu, DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, Layout },
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
      return this.$store.state.documents.selectedEntities
    },
    currentFolderId () {
      return this.$store.state.documents.currentFolderId
    },
    selectedDocumentsOptions () {
      return computeDocumentsOptions(this.selectedDocuments)
    },
    currentOptions () {
      return (this.selectedDocuments.length > 0) ? this.selectedDocumentsOptions : documentSpaceOptions
    },
    isDocumentPanelDisplayed () {
      return this.$store.state.documents.isDocumentPanelDisplayed
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    }
  },
  created () {
    this.$store.dispatch('documents/getGlobalDocumentsProperties')

    // Watch route changes to react on progressionId change
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.folderId) {
          this.$store.dispatch('documents/changeDirectory', this.$route.params.folderId)
        } else {
          this.$store.dispatch('documents/goInDocumentRoot')
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    clearSelectedEntities () {
      this.$store.dispatch('documents/cleanSelectedEntities') // /!\ be careful with asynchronous order!
    },
    clickOnScrollDiv (event) {
      // Clear selected entities ONLY if the click is on those elements, and continue propagation
      if (event.target.classList.contains('scroll') || event.target.classList.contains('breadCrumb')) {
        this.clearSelectedEntities()
      }
    },
    rightClickOnScrollDiv (event) {
      // Open documents space options (and unselect entities) ONLY if the click is on those elements, and continue propagation
      if (event.target.classList.contains('scroll') || event.target.classList.contains('breadCrumb') || event.target.classList.contains('fields')) {
        this.clearSelectedEntities()
        this.openContextMenu(event)
      }
    },
    openContextMenu (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: this.currentOptions
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
    importDocument (fileList) {
      importDocuments(this.currentFolderId, fileList)
    }
    // doSelectFolderAction (targetFolder) {
    //   if (this.folderSelectionOption === 'move') {
    //     this.$store.dispatch('clipboard/move', targetFolder)
    //   } else if (this.folderSelectionOption === 'duplicate') {
    //     this.$store.dispatch('clipboard/duplicate', targetFolder)
    //   } else {
    //     console.error('Unknown option' + this.folderSelectionOption)
    //   }
    // }
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

    .spinner {
      z-index: 1;
    }

    .file-picker-area {
      height: 100%;

      .scroll {
        height: 100%;
        overflow-y: auto;

        .breadCrumb {
          margin-left: 10px;
        }
      }
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
