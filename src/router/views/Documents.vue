<template>
  <Layout :is-allowed="true">
    <div
      v-if="currentUser.userId !== 0"
      ref="documents"
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
          :disabled="isLoadDocumentsError"
          @fileAdded="importDocument"
          @click.right.prevent="openContextMenu"
        >
          <Breadcrumb class="breadCrumb" />
          <div
            class="scroll"
            @click="clickOnScrollDiv"
            @click.right.prevent="rightClickOnScrollDiv"
          >
            <DocumentList @openContextMenu="openContextMenu" />
          </div>
          <DocumentDetails
            v-if="isDocumentPanelDisplayed && !mq.phone"
            class="document-details"
          />
          <DocumentDetailsModal
            v-if="isDocumentPanelDisplayed && mq.phone"
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
      <FilePickerModal
        v-if="isFilePickerModalDisplayed"
        :folder-selection="true"
        :init-in-current-folder="false"
        @chosenFolder="doSelectFolderAction"
        @close="isFilePickerModalDisplayed = false"
      />
      <FolderNameModal
        v-if="isFolderNameModalDisplayed"
        :submit-action="modalSubmitAction"
        :init-folder="documentToRename"
        @close="isFolderNameModalDisplayed=false"
      />
      <FileNameModal
        v-if="isFileNameModalDisplayed"
        :submit-action="modalSubmitAction"
        :init-file="documentToRename"
        @openFile="openFile"
        @close="isFileNameModalDisplayed=false"
      />
      <PermissionsModal
        v-if="isPermissionModalDisplayed"
        :document="selectedDocuments[0]"
        @close="isPermissionModalDisplayed=false"
      />
    </teleport>
  </Layout>
</template>

<script>

import Layout from '@layouts/EmptyLayout'
import CurrentOptions from '@components/Documents/Options'
import Breadcrumb from '@components/Documents/Breadcrumb'
import DocumentList from '@components/Documents/DocumentList'
import DocumentDetails from '@components/Documents/DocumentDetails/DocumentDetails'
import ContextMenu from '@components/ContextMenu/ContextMenu'
import { documentSpaceOptions } from '@/constants/options'
import { defaultFields, fieldsWithoutSize } from '@/constants/documentsConstants'
import FilePickerArea from '@components/FilePicker/FilePickerArea'
import { computeDocumentsOptions, downLoadDocument, deleteEntities, importDocuments, copyWebdavUrl } from '@utils/documents.util'
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import FolderNameModal from '@components/Documents/Modals/FolderNameModal'
import FileNameModal from '@components/Documents/Modals/FileNameModal'
import FilePickerModal from '@components/FilePicker/FilePickerModal'
import DocumentDetailsModal from '@components/Documents/DocumentDetails/DocumentDetailsModal'
import PermissionsModal from '@components/Documents/Modals/PermissionModal/PermissionsModal'

export default {
  name: 'Documents',
  components: { PermissionsModal, DocumentDetailsModal, FilePickerModal, FileNameModal, FolderNameModal, FilePickerArea, ContextMenu, DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, Layout },
  inject: ['mq'],
  data () {
    return {
      isUnderTabletSize: false,
      isFolderNameModalDisplayed: false,
      isFileNameModalDisplayed: false,
      isFilePickerModalDisplayed: false,
      isPermissionModalDisplayed: false,
      isContextMenuDisplayed: false,
      folderSelectionOption: undefined,
      modalSubmitAction: undefined,
      documentToRename: undefined
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    isLoadDocumentsError () {
      return this.$store.state.documents.loadDocumentsError
    },
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    currentFolderId () {
      return this.$store.state.documents.currentFolderId
    },
    currentFolder () {
      return this.$store.getters['documents/currentFolder']
    },
    selectedDocumentsOptions () {
      return computeDocumentsOptions(this.selectedDocuments)
    },
    currentOptions () {
      return (this.selectedDocuments.length > 0) ? this.selectedDocumentsOptions : (this.currentFolder && this.currentFolder.type !== 'Group' && (this.currentFolder.permissions && this.currentFolder.permissions.ADD_OBJECT) ? documentSpaceOptions : [])
    },
    isDocumentPanelDisplayed () {
      return this.$store.state.documents.isDocumentPanelDisplayed
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    openFiles () {
      return this.$store.state.documents.openFiles
    }
  },
  created () {
    this.$store.dispatch('fileFields/initFields')
    this.$store.dispatch('documents/getGlobalDocumentsProperties')

    // Watch route changes to react on progressionId change
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name === 'Documents') {
          if (this.$route.params.folderId) {
            this.$store.dispatch('documents/changeDirectory', { id: this.$route.params.folderId })
          } else {
            this.$store.dispatch('documents/goInDocumentRoot')
          }
        } else if (this.$route.name === 'Groups') {
          if (this.$route.params.folderId) {
            this.$store.dispatch('documents/changeDirectory', { id: this.$route.params.folderId, isGroupDirectory: true })
          } else {
            this.$store.dispatch('documents/goInGroupRoot')
          }
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  mounted () {
    this.getWidth()
    window.addEventListener('resize', this.getWidth)
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.getWidth)
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    getWidth () {
      if (!this.isUnderTabletSize && (this.mq.tablet || this.mq.phone)) {
        this.isUnderTabletSize = true
        this.$store.dispatch('fileFields/updateFields', [...fieldsWithoutSize])
      } else if (this.isUnderTabletSize && (!this.mq.tablet && !this.mq.phone)) {
        this.isUnderTabletSize = false
        this.$store.dispatch('fileFields/updateFields', [...defaultFields])
      }
    },
    clearSelectedEntities () {
      this.$store.dispatch('documents/cleanSelectedEntities') // /!\ be careful with asynchronous order!
    },
    clickOnScrollDiv (event) {
      // Clear selected entities ONLY if the click is on those elements, and continue propagation
      if (event.target.classList.contains('scroll') || event.target.classList.contains('fields') || event.target.classList.contains('breadCrumb')) {
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
      if (!this.isAContextMenuDisplayed && this.currentOptions.length > 0) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: this.currentOptions
          })
      }
    },
    openFile (file) {
      // Select file (not mandatory but more user-Friendly)
      this.$store.dispatch('documents/selectOneDocument', file)
      // Open it
      this.$store.dispatch('documents/openFile', file)
    },
    handleOption (option) {
      switch (option.name) {
        case 'open':
          this.openFile(this.selectedDocuments[0])
          break
        case 'copy':
          this.$store.dispatch('clipboard/copy')
          break
        case 'cut':
          this.$store.dispatch('clipboard/cut')
          break
        case 'details':
          this.$store.dispatch('documents/toggleDetails')
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
          if (this.$store.state.clipboard.action === 'copy') {
            this.$store.dispatch('clipboard/duplicate', { targetFolder: this.currentFolder, entities: this.$store.state.clipboard.documentList })
          } else if (this.$store.state.clipboard.action === 'cut') {
            this.$store.dispatch('clipboard/move', { targetFolder: this.currentFolder, entities: this.$store.state.clipboard.documentList })
          }
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
        case 'copyWebdavUrl':
          copyWebdavUrl(this.selectedDocuments[0])
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
        case 'rename':
          this.modalSubmitAction = 'rename'
          this.documentToRename = this.selectedDocuments[0]
          if (this.documentToRename.type === 'Folder') {
            this.isFolderNameModalDisplayed = true
          } else {
            this.isFileNameModalDisplayed = true
          }
          break
        case 'managePermissions':
          this.isPermissionModalDisplayed = true
          break
        // TODO HTML, ODS, ODP
        case 'newFolder':
          this.modalSubmitAction = 'createFolder'
          this.isFolderNameModalDisplayed = true
          break
        case 'newODT':
          this.modalSubmitAction = 'createODT'
          this.isFileNameModalDisplayed = true
          break
        case 'newODS':
          this.modalSubmitAction = 'createODS'
          this.isFileNameModalDisplayed = true
          break
        case 'newODP':
          this.modalSubmitAction = 'createODP'
          this.isFileNameModalDisplayed = true
          break
        case 'newGeogebra':
          this.modalSubmitAction = 'createGeogebra'
          this.isFileNameModalDisplayed = true
          break
        case 'newMindMap':
          this.modalSubmitAction = 'createMindMap'
          this.isFileNameModalDisplayed = true
          break
        case 'newScratch':
          this.modalSubmitAction = 'createScratch'
          this.isFileNameModalDisplayed = true
          break
        case 'newAudio':
          this.modalSubmitAction = 'createAudio'
          this.isFileNameModalDisplayed = true
          break
        case 'newHTML':
          this.modalSubmitAction = 'createHTML'
          this.isFileNameModalDisplayed = true
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    doSelectFolderAction (targetFolder) {
      if (this.folderSelectionOption === 'move') {
        this.$store.dispatch('clipboard/move', { targetFolder, entities: this.selectedDocuments })
      } else if (this.folderSelectionOption === 'duplicate') {
        this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: this.selectedDocuments })
      } else {
        console.error('Unknown option' + this.folderSelectionOption)
      }
    },
    // keyboard shortcuts management
    keyMonitor: function (event) {
      // F2 for renaming
      if ((event.key === 'F2') && this.selectedDocuments.length === 1) {
        this.handleOption({ name: 'rename' })
        // 'Suppr' for deletion
      } else if (event.key === 'Delete') {
        if (this.openFiles.length === 0) {
          this.handleOption({ name: 'delete' })
        }
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
        flex: 3;
        height: calc(100% - #{$doc-breadcrumb-size});
        overflow-y: auto;

        .breadCrumb {
          margin-left: 10px;
        }
      }

      .document-details {
        flex: 1;
        min-width: 300px;
      }
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
