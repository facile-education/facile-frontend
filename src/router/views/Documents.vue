<template>
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
      @option-clicked="handleOption"
    />

    <Breadcrumb
      class="breadCrumb"
      :breadcrumb="breadcrumb"
      @change-dir="changeDir"
      @change-space="changeSpace"
    />

    <div class="body">
      <WeprodeSpinner
        v-if="areActionsInProgress"
        class="spinner"
      />
      <FilePickerArea
        class="file-picker-area"
        :disabled="isLoadDocumentsError || !canUploadFilesInCurrentFolder"
        @file-added="importDocument"
        @click.right.prevent="openContextMenu"
      >
        <div
          class="scroll"
          @click="clickOnScrollDiv"
          @click.right.prevent="rightClickOnScrollDiv"
        >
          <DocumentList @open-context-menu="openContextMenu" />
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
    <WeprodeSpinner />
  </div>

  <ContextMenu
    v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
    @choose-option="handleOption"
    @close="isContextMenuDisplayed=false"
  />

  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerModalDisplayed"
      :folder-selection="true"
      :init-in-current-folder="false"
      @chosen-folder="doSelectFolderAction"
      @close="isFilePickerModalDisplayed = false"
    />
    <FolderNameModal
      v-if="isFolderNameModalDisplayed"
      :submit-action="modalSubmitAction"
      :current-folder="currentFolder"
      :folder-to-rename="documentToRename"
      @create-folder="refreshCurrentFolder"
      @rename-folder="refreshCurrentFolder"
      @close="isFolderNameModalDisplayed = false"
    />
    <FileNameModal
      v-if="isFileNameModalDisplayed"
      :submit-action="modalSubmitAction"
      :init-file="documentToRename"
      @open-file="openFile"
      @close="isFileNameModalDisplayed=false"
    />
    <PermissionsModal
      v-if="isPermissionModalDisplayed"
      :document="selectedDocuments[0] || currentFolder"
      @save-entity-permissions="refreshCurrentFolder"
      @close="isPermissionModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import ContextMenu from '@components/ContextMenu/ContextMenu'
import Breadcrumb from '@components/Documents/Breadcrumb'
import DocumentList from '@components/Documents/DocumentList'
import CurrentOptions from '@components/Documents/Options'
import FilePickerArea from '@components/FilePicker/FilePickerArea'
import { computeDocumentsOptions, deleteEntities, downloadDocuments, importDocuments } from '@utils/documents.util'
import { alertNoFile, returnAddedFiles } from '@utils/upload.util'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { DOCUMENTS } from '@/constants/appConstants'
import { defaultFields, fieldsWithoutSize } from '@/constants/documentsConstants'
import { documentSpaceOptions, groupOptions, mobileDocumentSpaceOptions } from '@/constants/options'
import { removeMenuOptionIfExist } from '@/utils/commons.util'

const FolderNameModal = defineAsyncComponent(() => import('@components/Documents/Modals/FolderNameModal.vue'))
const FileNameModal = defineAsyncComponent(() => import('@components/Documents/Modals/FileNameModal.vue'))
const PermissionsModal = defineAsyncComponent(() => import('@components/Documents/Modals/PermissionModal/PermissionsModal'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))
const DocumentDetails = defineAsyncComponent(() => import('@components/Documents/DocumentDetails/DocumentDetails'))
const DocumentDetailsModal = defineAsyncComponent(() => import('@components/Documents/DocumentDetails/DocumentDetailsModal'))

export default {
  name: 'Documents',
  components: { PermissionsModal, DocumentDetailsModal, FilePickerModal, FileNameModal, FolderNameModal, FilePickerArea, ContextMenu, DocumentDetails, DocumentList, Breadcrumb, CurrentOptions, WeprodeSpinner },
  inject: ['mq'],
  emits: ['update:layout'],
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
    canUploadFilesInCurrentFolder () {
      return this.currentFolder?.permissions.ADD_OBJECT
    },
    selectedDocumentsOptions () {
      return computeDocumentsOptions(this.selectedDocuments)
    },
    currentOptions () {
      let options = []

      if (this.selectedDocuments.length === 0 && this.currentFolder?.isGroupRootFolder && this.currentFolder?.permissions?.PERMISSIONS) {
        options = [...groupOptions]
      } else if (this.selectedDocuments.length > 0) {
        options = this.selectedDocumentsOptions
      } else if (this.currentFolder?.type !== 'Group' && this.currentFolder?.permissions?.ADD_OBJECT) {
        if (this.mq.phone || this.mq.tablet) {
          options = [...mobileDocumentSpaceOptions]
        } else {
          options = [...documentSpaceOptions]
        }
      }

      this.removeOptionsDependingOnContext(options)

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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.$store.dispatch('fileFields/initFields')

    // Watch route changes to react on changes
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name === DOCUMENTS) {
          if (this.$route.params.folderId) {
            this.$store.dispatch('documents/changeDirectory', { folderId: this.$route.params.folderId, fileId: this.$route.params.fileId, displayFile: this.$route.params.display })
          } else {
            this.$store.dispatch('documents/goInDocumentRoot')
          }
        } else if (this.$route.name === 'GroupDocuments') {
          if (this.$route.params.folderId) {
            this.$store.dispatch('documents/changeDirectory', { folderId: this.$route.params.folderId, isGroupDirectory: true, fileId: this.$route.params.fileId, displayFile: this.$route.params.display })
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
  unmounted () {
    window.removeEventListener('resize', this.getWidth)
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    refreshCurrentFolder () {
      this.$store.dispatch('documents/refreshCurrentFolder')
    },
    removeOptionsDependingOnContext (options) {
      // Remove Lool, Mindmap, Geogebra and Scratch if not broadcasted to user
      if (options !== undefined && options.length >= 1 && options[0].subMenu !== undefined &&
        (this.documentProperties === undefined || !this.documentProperties.hasLoolBroadcasted)) {
        removeMenuOptionIfExist(options[0].subMenu, 'newODT')
        removeMenuOptionIfExist(options[0].subMenu, 'newODS')
        removeMenuOptionIfExist(options[0].subMenu, 'newODP')
      }
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
      if ((options !== undefined && options.length >= 1 && !this.currentFolder.isGroupDirectory) || !navigator.clipboard || !window.isSecureContext) {
        removeMenuOptionIfExist(options, 'copyUrl')
      }
    },
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
        this.$router.push({ name: DOCUMENTS, params: { folderId: folder.id } })
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
            event,
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
          if (this.currentFolder.permissions.ADD_OBJECT) {
            if (this.$store.state.clipboard.action === 'copy') {
              this.$store.dispatch('clipboard/duplicate', { targetFolder: this.currentFolder, entities: this.$store.state.clipboard.documentList })
            } else if (this.$store.state.clipboard.action === 'cut') {
              this.$store.dispatch('clipboard/move', { targetFolder: this.currentFolder, entities: this.$store.state.clipboard.documentList })
            }
          } else {
            console.error('Missing ADD_OBJECT permission in current folder')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('missingPastePermissions'), type: 'error' })
          }
          break
        case 'delete':
          this.$store.dispatch('warningModal/addWarning', {
            text: this.$t('deletionWarning'),
            lastAction: { fct: deleteEntities, params: [this.selectedDocuments] }
          })
          break
        case 'download':
          downloadDocuments(this.selectedDocuments)
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
          if (this.documentToRename.type === 'Folder' && (!this.documentToRename.isGroupRootFolder && this.documentToRename.permissions.ADD_OBJECT)) {
            this.isFolderNameModalDisplayed = true
          } else if (this.documentToRename.type === 'File' && (this.documentToRename.permissions.UPDATE)) {
            this.isFileNameModalDisplayed = true
          }
          break
        case 'copyUrl':
          if (this.selectedDocuments[0].type === 'File') {
            this.copyToClipboard(window.location.protocol + '//' + window.location.host + '/viewer/' + this.selectedDocuments[0].id)
          } else {
            this.copyToClipboard(window.location.protocol + '//' + window.location.host + '/documents/groups/' + this.selectedDocuments[0].id)
          }
          break
        case 'managePermissions':
          this.isPermissionModalDisplayed = true
          break
        case 'newFolder':
          this.documentToRename = undefined
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
      if (navigator.clipboard && window.isSecureContext) { // navigator clipboard api needs a secure context (https)
        return navigator.clipboard.writeText(textToCopy)
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
          // Check if there is no open file + we have the permission to delete
          if (this.openFiles.length === 0 && this.currentOptions.map(option => option.name).indexOf('delete') !== -1) {
            this.handleOption({ name: 'delete' })
          }
        } else if ((event.ctrlKey || event.cmdKey) && ((event.key === 'c') || (event.key === 'C'))) {
          this.handleOption({ name: 'copy' })
          // ctrl-X to cut
        } else if ((event.ctrlKey || event.cmdKey) && ((event.key === 'x') || (event.key === 'X'))) {
          this.handleOption({ name: 'cut' })
          // ctrl-V to paste
        } else if ((event.ctrlKey || event.cmdKey) && ((event.key === 'v') || (event.key === 'V'))) {
          this.handleOption({ name: 'paste' })
          // ctrl-D to duplicate
        } else if ((event.ctrlKey || event.cmdKey) && ((event.key === 'd') || (event.key === 'D'))) {
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
        returnAddedFiles(e, this.$store).then((result) => {
          if (result.listFiles.length !== 0) {
            this.importDocument(result.listFiles)
          } else if (!result.sizeException) {
            alertNoFile()
          }
          input.parentNode.removeChild(input)
        })
      }

      this.$refs.documents.appendChild(input) // To make it accessible for the tests

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
        padding-top: 7px;
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
  "rootCollaborativeUploadForbidden": "Il n'est pas autorisé d'ajouter un document ici",
  "missingPastePermissions": "Dépose non autorisée ici"
}
</i18n>
