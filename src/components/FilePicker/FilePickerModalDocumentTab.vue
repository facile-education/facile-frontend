<template>
  <!-- My Documents-->
  <div class="body">
    <FilePickerBreadCrumb
      class="breadcrumb"
      :breadcrumb="currentBreadcrumb"
      @itemClicked="loadFolderContent"
    />

    <div class="documents-list">
      <PentilaSpinner v-if="isLoadingFiles" />

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
        :grayed="folderSelection"
        :key="file.id"
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
import navigationService from '@/api/documents/folder.service'
import FilePickerBreadCrumb from '@components/FilePicker/FilePickerBreadCrumb'
import FilePickerFolder from '@components/FilePicker/FilePickerFolder'
import FilePickerFile from '@components/FilePicker/FilePickerFile'

export default {
  name: 'FilePickerModalDocumentTab',
  components: { FilePickerFile, FilePickerFolder, FilePickerBreadCrumb },
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
  emits: ['addedFiles', 'chosenFolder', 'close', 'selectedFolder', 'currentFolder'],
  data () {
    return {
      inputText: undefined,
      currentBreadcrumb: [],
      currentFolders: [],
      currentFiles: [],
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
      this.loadFolderContent(this.$store.state.documents.currentFolderId)
    } else {
      documentsService.getGlobalDocumentsProperties().then((data) => {
        this.maxUploadSize = data.maxUploadSize
        this.loadFolderContent(data.private.id)
      })
    }
  },
  methods: {
    getEntityIndex (entityId) {
      return this.allSortedDocuments.map(item => item.id).indexOf(entityId)
    },
    loadFolderContent (folderId) {
      this.isLoadingFiles = true
      navigationService.getAllEntities(folderId, false).then((data) => {
        this.isLoadingFiles = false
        if (data.success) {
          data.subFolders.forEach(subFolder => { subFolder.hasAddPermission = true }) // Add hasAddPermission = true property to all document folder for compliance with group objects
          this.currentFolders = data.subFolders ? data.subFolders : []
          this.currentFiles = data.files ? data.files : []
          this.selectedFolder = undefined
          this.$emit('selectedFolder', undefined)
          navigationService.getFolderBreadcrumb(folderId).then((data) => {
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
    },
    clickOnFolder (folder) {
      if (this.folderSelection && !this.mq.phone && !this.mq.tablet) { // On phone and tablet, we need to navigate on simple click
        if (this.isFolderSelected(folder)) {
          this.selectedFolder = undefined
          this.$emit('selectedFolder', undefined)
        } else {
          if (!this.belongsToAppSelectedEntities(folder)) { // Cannot select itself
            this.selectedFolder = folder
            this.$emit('selectedFolder', folder)
          }
        }
      } else {
        this.selectedFiles = []
        this.loadFolderContent(folder.id)
      }
    },
    dblClickOnFolder (folder) {
      if (this.folderSelection && !this.belongsToAppSelectedEntities(folder)) { // Prevent to select folders's children
        this.loadFolderContent(folder.id)
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
