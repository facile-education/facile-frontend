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
      <FolderNameModal
        v-if="isFolderNameModalDisplayed"
        @close="isFolderNameModalDisplayed=false"
      />
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
import FilePickerArea from '@components/FilePicker/FilePickerArea'
import { computeDocumentsOptions, downLoadDocument, deleteEntities, importDocuments } from '@utils/documents.util'
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import FolderNameModal from '@components/Documents/Modals/FolderNameModal'

export default {
  name: 'Documents',
  components: { FolderNameModal, FilePickerArea, ContextMenu, DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, Layout },
  inject: ['mq'],
  data () {
    return {
      isFolderNameModalDisplayed: false,
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
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
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
      switch (option.name) {
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
            text: this.$t('deletionWarning'),
            lastAction: { fct: deleteEntities, params: [this.selectedDocuments] }
          })
          break
        case 'download':
          downLoadDocument(this.selectedDocuments[0])
          break
        case 'rename':
          this.$store.dispatch('modals/openRenameModal', this.selectedDocuments[0])
          break
        case 'share':
          this.$store.dispatch('post/setIndicator', undefined)
          this.$store.dispatch('post/setFile', this.document)
          this.$store.dispatch('modals/openCreatePostModal')
          break
        case 'uploadFolder':
          this.importDocumentFromWorkSpace(true)
          break
        case 'uploadFiles':
          this.importDocumentFromWorkSpace(false)
          break
        case 'newFolder':
          this.isFolderNameModalDisplayed = true
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    // keyboard shortcuts management
    keyMonitor: function (event) {
      // F2 for renaming
      if ((event.key === 'F2') && this.selectedDocuments.length === 1) {
        this.handleOption({ name: 'rename' })
        // 'Suppr' for deletion
      } else if (event.key === 'Delete') {
        this.handleOption({ name: 'delete' })
      } else if (event.ctrlKey && ((event.key === 'c') || (event.key === 'C'))) {
        this.handleOption({ name: 'copy' })
        // ctrl-X to cut
      } else if (event.ctrlKey && ((event.key === 'x') || (event.key === 'X'))) {
        this.handleOption({ name: 'cut' })
        // ctrl-V to paste
      } else if (event.ctrlKey && ((event.key === 'v') || (event.key === 'V'))) {
        this.handleOption({ name: 'paste' })
        // ctrl-D to duplicate
      } else if (event.ctrlKey && ((event.key === 'd') || (event.key === 'D'))) {
        this.handleOption({ name: 'duplicate' })
      }
    },
    importDocumentFromWorkSpace (isFolder) {
      // Create hidden inputFile
      const input = document.createElement('input')
      input.style.display = 'none'
      input.type = 'file'
      if (isFolder) {
        input.webkitdirectory = true
        input.directory = true
        input.multiple = false
      } else {
        input.accept = '*/*'
        input.multiple = true
      }
      input.onchange = e => {
        returnAddedFiles(e, this.$store).then((files) => {
          if (files.length !== 0) {
            this.importDocument(files)
          } else {
            alertNoFile()
          }
        })
      }

      // Click it
      input.click()
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

<i18n locale="fr">
{
  "deletionWarning": "Ce document sera définitivement perdu"
}
</i18n>
