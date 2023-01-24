<template>
  <Layout :is-allowed="true">
    <h1 :aria-label="$t('serviceTitle')" />
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

      <Breadcrumb
        class="breadCrumb"
        :breadcrumb="breadcrumb"
        @change-dir="changeDir"
        @change-space="changeSpace"
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
          <div
            class="scroll"
            @click="clickOnScrollDiv"
            @click.right.prevent="rightClickOnScrollDiv"
          >
            <DocumentList @openContextMenu="openContextMenu" />
          </div>
        </FilePickerArea>
        <DocumentDetails
          v-if="isDocumentPanelDisplayed && !mq.phone"
          class="document-details"
        />
        <DocumentDetailsModal
          v-if="isDocumentPanelDisplayed && mq.phone"
        />
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
        @close="isFolderNameModalDisplayed = false"
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
        :document="selectedDocuments[0] || currentFolder"
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
import { documentSpaceOptions, mobileDocumentSpaceOptions, groupOptions } from '@/constants/options'
import { defaultFields, fieldsWithoutSize } from '@/constants/documentsConstants'
import FilePickerArea from '@components/FilePicker/FilePickerArea'
import { computeDocumentsOptions, downloadDocument, deleteEntities, importDocuments } from '@utils/documents.util'
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import FolderNameModal from '@components/Documents/Modals/FolderNameModal'
import FileNameModal from '@components/Documents/Modals/FileNameModal'
import FilePickerModal from '@components/FilePicker/FilePickerModal'
import DocumentDetailsModal from '@components/Documents/DocumentDetails/DocumentDetailsModal'
import PermissionsModal from '@components/Documents/Modals/PermissionModal/PermissionsModal'
import { removeMenuOptionIfExist } from '@/utils/commons.util'
import fileService from '@/api/documents/file.service'

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
    breadcrumb () {
      const breadCrumb = JSON.parse(JSON.stringify(this.$store.state.documents.breadcrumb)) // deep copy vuex state to avoid mutate it from here
      // Add dropMethod on each folder to avoid code duplication
      breadCrumb.forEach((folder) => {
        folder.dropMethod = this.dropMethod
      })
      return breadCrumb
    },
    documentProperties () {
      return this.$store.state.documents.documentsProperties
    },
    isLoadDocumentsError () {
      return this.$store.state.documents.loadDocumentsError
    },
    currentUploadingFile () {
      return this.$store.state.currentActions.currentUploadingFile
    },
    listFilesToUpload () {
      return this.$store.state.currentActions.listFilesToUpload
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
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
      const options = (this.selectedDocuments.length === 0 && this.currentFolder &&
          this.currentFolder.isGroupRootFolder && this.currentFolder.permissions && this.currentFolder.permissions.PERMISSIONS)
        ? groupOptions
        : (this.selectedDocuments.length > 0)
            ? this.selectedDocumentsOptions
            : (this.currentFolder && this.currentFolder.type !== 'Group' && (this.currentFolder.permissions && this.currentFolder.permissions.ADD_OBJECT)
                ? (this.mq.phone || this.mq.tablet
                    ? mobileDocumentSpaceOptions
                    : documentSpaceOptions)
                : [])
      // Remove Mindmap, Geogebra and Scratch if not broadcasted to user
      if (options !== undefined && options.length >= 1 && options[0].subMenu !== undefined &&
          (this.documentProperties === undefined || !this.documentProperties.hasMindmapBroadcasted)) {
        removeMenuOptionIfExist(options[0].subMenu, 'newMindMap')
      }
      if (options !== undefined && options.length >= 1 && options[0].subMenu !== undefined &&
          (this.documentProperties === undefined || !this.documentProperties.hasGeogebraBroadcasted)) {
        removeMenuOptionIfExist(options[0].subMenu, 'newGeogebra')
      }
      if (options !== undefined && options.length >= 1 && options[0].subMenu !== undefined &&
          (this.documentProperties === undefined || !this.documentProperties.hasScratchBroadcasted)) {
        removeMenuOptionIfExist(options[0].subMenu, 'newScratch')
      }
      // Remove CopyUrl option if local documents
      if (options !== undefined && options.length >= 1 && !this.currentFolder.isGroupDirectory) {
        removeMenuOptionIfExist(options, 'copyUrl')
      }
      return options
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
        } else if (this.$route.name === 'GroupDocuments') {
          if (this.$route.params.folderId) {
            this.$store.dispatch('documents/changeDirectory', { id: this.$route.params.folderId, isGroupDirectory: true })
          } else if (this.$route.params.fileId) {
            fileService.getFileInfos(this.$route.params.fileId).then((data) => {
              if (data.success) {
                this.$store.dispatch('documents/changeDirectory', { id: data.folderId, isGroupDirectory: true })
              }
            })
          } else {
            this.$store.dispatch('documents/goInGroupRoot')
          }
        } else {
          console.error('unknown route')
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
    changeDir (folder) {
      if (folder.isGroupDirectory) {
        this.$router.push({ name: 'GroupDocuments', params: { folderId: folder.id } })
        if (folder.isGroupRootFolder || folder.id === 'collaborative') {
          this.$store.dispatch('documents/closeDocumentPanel')
        }
      } else {
        this.$router.push({ name: 'Documents', params: { folderId: folder.id } })
      }
      // this.$store.dispatch('documents/closeDocumentPanel') // TODO: discuss about ergonomics
    },
    changeSpace (space) {
      this.$router.push(space)
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
    dropMethod (event, folder) {
      this.$store.dispatch('clipboard/move', {
        targetFolder: folder,
        entities: JSON.parse(event.dataTransfer.getData('entitiesToDrop'))
      })
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
          downloadDocument(this.selectedDocuments[0])
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
          if (this.documentToRename.type === 'Folder' && (!this.documentToRename.isGroupFolder || this.documentToRename.permissions.UPDATE)) {
            this.isFolderNameModalDisplayed = true
          } else if (this.documentToRename.type === 'File' && (!this.documentToRename.isGroupFile || this.documentToRename.permissions.UPDATE)) {
            this.isFileNameModalDisplayed = true
          }
          break
        case 'copyUrl':
          if (this.selectedDocuments[0].type === 'File') {
            this.copyToClipboard(window.location.protocol + '//' + window.location.host + '/nero/viewer/' + this.selectedDocuments[0].id)
          } else {
            this.copyToClipboard(window.location.protocol + '//' + window.location.host + '/user//nero#/documents?folderId=' + this.selectedDocuments[0].id)
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
    copyToClipboard (textToCopy) {
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy)
      } else {
        // text area method
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        // make the textarea out of viewport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((resolve, reject) => {
          // here the magic happens
          document.execCommand('copy')
          textArea.remove()
        })
      }
    },
    doSelectFolderAction (targetFolder) {
      if (this.folderSelectionOption === 'move') {
        if (targetFolder.id === this.currentFolderId) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('moveInCurrentFolder'), type: 'warning' })
        } else {
          this.$store.dispatch('clipboard/move', { targetFolder, entities: this.selectedDocuments })
        }
      } else if (this.folderSelectionOption === 'duplicate') {
        this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: this.selectedDocuments })
      } else {
        console.error('Unknown option' + this.folderSelectionOption)
      }
    },
    // keyboard shortcuts management
    keyMonitor: function (event) {
      if (!this.isModalOpen) {
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
      // Prevent upload in root collaborative
      if (this.currentFolderId === 'collaborative') {
        return
      }

      if (this.currentUploadingFile === undefined) { // Reset file upload list
        this.$store.dispatch('currentActions/setImportFileList', fileList)
      } else { // Add files to upload list
        // Remove files that are already in list
        this.listFilesToUpload.forEach((fileToUpload) => {
          const index = fileList.find(element => element.name === fileToUpload.name)
          if (index !== -1) {
            fileList.splice(index, 1)
          }
        })
        this.$store.dispatch('currentActions/addImportFileList', fileList)
      }
      this.$store.dispatch('currentActions/displayUploadProgression')
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

  .breadCrumb {
    height: $doc-breadcrumb-size;
  }

  .body {
    position: relative;
    height: calc(100% - #{$doc-currents-options-height} - #{$doc-breadcrumb-size});
    display: flex;

    .spinner {
      position: absolute;
      z-index: 1;
    }

    .file-picker-area {
      height: 100%;
      flex: 3;

      .scroll {
        height: 100%;
        overflow-y: auto;
        padding-top: 20px;
      }
    }

    .document-details {
      flex: 1;
      min-width: 300px;
    }
  }

  &.mobile {
    .currents-options {
      height: $doc-currents-mobile-options-height;
    }

    .breadCrumb {
      height: $doc-breadcrumb-mobile-size;
      padding-left: 5px;
    }

    .body {
      height: calc(100% - #{$doc-currents-mobile-options-height} - #{$doc-breadcrumb-mobile-size});
      .document-details {
        width: 100%;
      }
    }
  }
}

</style>

<i18n locale="fr">
{
  "deletionWarning": "Ce document sera définitivement perdu",
  "moveInCurrentFolder": "Le dossier de destination est le même que celui de départ!",
  "serviceTitle": "Mes documents",
  "rootCollaborativeUploadForbidden": "Il n'est pas autorisé d'ajouter un document ici"
}
</i18n>
