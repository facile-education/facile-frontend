<template>
  <div class="body">
    <Breadcrumb
      class="breadcrumb"
      :breadcrumb="currentBreadcrumb"
      :hidden-actions="true"
      @change-dir="loadFolderContent"
      @change-space="changeSpace"
    />

    <div class="documents-list">
      <PentilaSpinner v-if="isLoadingFiles" />

      <div
        v-if="allSortedDocuments.length === 0"
        v-t="('emptyPlaceholder')"
        class="placeholder"
      />

      <FilePickerFolder
        v-for="subFolder in currentFolders"
        :key="subFolder.id"
        :folder="subFolder"
        :is-selected="isFolderSelected(subFolder)"
        :dark="getEntityIndex(subFolder.id) % 2 === 0"
        @folderClicked="clickOnFolder"
        @folderDblClicked="dblClickOnFolder"
      />
      <FilePickerFile
        v-for="file in currentFiles"
        :key="file.id"
        :grayed="folderSelection"
        :file="file"
        :is-selected="isSelected(file)"
        :dark="getEntityIndex(file.id) % 2 === 0"
        @fileClicked="clickOnFile"
      />
    </div>
  </div>
</template>

<script>
import documentsService from '@/api/documents/documents.service'
import groupService from '@/api/documents/group.service'
import navigationService from '@/api/documents/folder.service'
import Breadcrumb from '@components/Documents/Breadcrumb'
import FilePickerFolder from '@components/FilePicker/FilePickerFolder'
import FilePickerFile from '@components/FilePicker/FilePickerFile'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'FilePickerModalDocumentTab',
  components: { Breadcrumb, FilePickerFile, FilePickerFolder },
  inject: ['mq'],
  props: {
    folderSelection: {
      type: Boolean,
      default: false
    },
    multiSelection: {
      type: Boolean,
      default: false
    },
    initInCurrentFolder: {
      type: Boolean,
      default: false
    },
    allowFilesFromDevice: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    }
  },
  emits: ['addedFiles', 'chosenFolder', 'close', 'selectedFolder', 'currentFolder', 'updateSelectedFiles'],
  data () {
    return {
      inputText: undefined,
      currentBreadcrumb: [],
      currentFolders: [],
      currentFiles: [],
      currentSpace: 'User',
      userFolderId: undefined,
      selectedFiles: [],
      selectedFolder: undefined,
      maxUploadSize: undefined,
      isLoadingFiles: false
    }
  },
  computed: {
    currentFolder () {
      return this.currentBreadcrumb.length > 0 ? this.currentBreadcrumb[this.currentBreadcrumb.length - 1] : undefined
    },
    appSelectedEntities () {
      return this.$store.state.documents.selectedEntities
    },
    allSortedDocuments () {
      return [...this.currentFolders, ...this.currentFiles]
    }
  },
  created () {
    if (this.initInCurrentFolder) {
      this.loadUserFolderContent(this.$store.state.documents.currentFolderId)
    } else {
      documentsService.getGlobalDocumentsProperties().then((data) => {
        this.maxUploadSize = data.maxUploadSize
        this.userFolderId = data.private.id
        this.loadUserFolderContent(this.userFolderId)
      })
    }
  },
  methods: {
    changeSpace (space) {
      switch (space) {
        case '/documents':
          this.currentSpace = 'User'
          this.loadUserFolderContent(this.userFolderId)
          break
        case '/documents/groups':
          this.currentSpace = 'Group'
          this.loadGroupFolderContent('collaborative') // TODO get those key from data
          break
        case '/documents/recent':
          // this.loadFolderContent(recent)
          break
      }
    },
    getEntityIndex (entityId) {
      return this.allSortedDocuments.map(item => item.id).indexOf(entityId)
    },
    loadGroupFolderContent (folderId) {
      this.isLoadingFiles = true
      groupService.getGroupEntities(folderId).then((data) => {
        this.isLoadingFiles = false
        if (data.success) {
          this.currentFolders = data.folders ? data.folders : []
          this.currentFolders = PentilaUtils.Array.sortWithString(this.currentFolders, false, 'name')

          this.currentFiles = data.files ? data.files : []
          this.currentFiles = PentilaUtils.Array.sortWithString(this.currentFiles, false, 'name')

          this.selectedFolder = undefined
          this.$emit('selectedFolder', undefined)
          groupService.getGroupBreadcrumb(folderId).then((data) => {
            if (data.success) {
              this.currentBreadcrumb = data.breadCrumb
              this.$emit('currentFolder', this.currentFolder)
            } else {
              console.error('Unable to get breadcrumb from backend for folder id ' + folderId)
            }
          })
        } else {
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      })
    },
    loadFolderContent (folder) {
      if (this.currentSpace === 'Group') {
        this.loadGroupFolderContent(folder.id)
      } else {
        this.loadUserFolderContent(folder.id)
      }
    },
    loadUserFolderContent (folderId) {
      this.isLoadingFiles = true
      navigationService.getAllEntities(folderId, false).then((data) => {
        this.isLoadingFiles = false
        if (data.success) {
          data.subFolders.forEach(subFolder => { subFolder.hasAddPermission = true }) // Add hasAddPermission = true property to all document folder for compliance with group objects
          this.currentFolders = data.subFolders ? data.subFolders : []
          this.currentFolders = PentilaUtils.Array.sortWithString(this.currentFolders, false, 'name')

          this.currentFiles = data.files ? data.files : []
          this.currentFiles = PentilaUtils.Array.sortWithString(this.currentFiles, false, 'name')

          this.selectedFolder = undefined
          this.$emit('selectedFolder', undefined)
          navigationService.getBreadcrumb(folderId).then((data) => {
            if (data.success) {
              data.breadcrumb.forEach(folder => { folder.hasAddPermission = true }) // Add hasAddPermission = true property to all document folder for compliance with group objects
              this.currentBreadcrumb = data.breadcrumb
              this.$emit('currentFolder', this.currentFolder)
            } else {
              console.error('Unable to get breadcrumb from backend for folder id ' + folderId)
            }
          })
        } else {
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      })
    },
    clickOnFile (file) {
      if (!this.folderSelection) {
        if (!this.multiSelection) {
          if (this.isSelected(file)) {
            this.selectedFiles = []
          } else {
            this.selectedFiles = []
            this.selectedFiles.push(file)
          }
        } else {
          if (!this.isSelected(file)) {
            this.selectedFiles.push(file)
          } else {
            this.removeFromSelected(file)
          }
        }
      }
      this.$emit('updateSelectedFiles', this.selectedFiles)
    },
    clickOnFolder (folder, e) {
      if (this.folderSelection && !this.mq.phone && !this.mq.tablet && (e.pointerType === 'mouse' || e.mozInputSource === 1)) { // On phone and tablet, we need to navigate on simple click
        if (this.isFolderSelected(folder)) {
          this.selectedFolder = undefined
          this.$emit('selectedFolder', undefined)
        } else {
          if (!this.belongsToAppSelectedEntities(folder) && folder.permissions.ADD_OBJECT) { // Cannot select itself
            this.selectedFolder = folder
            this.$emit('selectedFolder', folder)
          }
        }
      } else {
        this.selectedFiles = []
        this.loadFolderContent(folder)
      }
    },
    dblClickOnFolder (folder) {
      if (this.folderSelection && !this.belongsToAppSelectedEntities(folder)) { // Prevent to select folders's children
        this.loadFolderContent(folder)
      }
    },
    isSelected (file) {
      for (let i = 0; i < this.selectedFiles.length; ++i) {
        if (file.id === this.selectedFiles[i].id) {
          return true
        }
      }
      return false
    },
    isFolderSelected (folder) {
      return this.selectedFolder ? folder.id === this.selectedFolder.id : false
    },
    belongsToAppSelectedEntities (entity) {
      for (let i = 0; i < this.appSelectedEntities.length; ++i) {
        if (entity.id === this.appSelectedEntities[i].id) {
          return true
        }
      }
      return false
    },
    removeFromSelected (file) {
      for (let i = 0; i < this.selectedFiles.length; ++i) {
        if (file.id === this.selectedFiles[i].id) {
          this.selectedFiles.splice(i, 1)
        }
      }
    },
    emitSelectedFolder () {
      this.$emit('chosenFolder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
    },
    addNewFiles () {
      this.$emit('addedFiles', this.selectedFiles)
    }
  }
}
</script>

<style lang="scss" scoped>

.body {
  width: 100%;
  min-width: 550px;
  max-height: 600px;
  display: flex;
  flex-direction: column;

  .breadcrumb {
    padding: 0 15px;
  }

  .placeholder {
    height: 15vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25em;
  }

  .documents-list {
    flex: 1;
    margin-top: 10px;
    overflow-y: auto;
    position: relative;
  }

  .upload {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: black;

    label {
      margin-top: 5px;
      text-decoration: underline;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 0.875rem;

      img {
        width: 24px;
        margin-right: 7px;
      }

      input {
        display: none;
        color: blue;
      }
    }
  }
}

.mobile {
  .body {
    max-height: 100%;
    min-width: 0;

    .breadcrumb {
      padding: 0;
    }

    .upload {
      margin-top: 15px;
    }
  }
}
</style>

<i18n locale="fr" >
{
  "emptyPlaceholder": "Aucun document"
}
</i18n>
