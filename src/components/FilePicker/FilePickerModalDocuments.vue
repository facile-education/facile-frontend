<template>
  <div class="body">
    <Breadcrumb
      class="breadcrumb"
      :breadcrumb="currentBreadcrumb"
      :hidden-actions="true"
      :multi-space="!collaborativeOnly"
      @change-dir="loadFolderContent"
      @change-space="changeSpace"
    />

    <div class="documents-list">
      <WeprodeSpinner v-if="isLoadingFiles" />

      <div
        v-if="(currentFolders && currentFiles) && allSortedDocuments.length === 0"
        v-t="('emptyPlaceholder')"
        class="placeholder"
      />

      <ul>
        <li
          v-for="subFolder in currentFolders"
          :key="subFolder.id"
        >
          <FilePickerFolder
            data-test="document-item"
            :folder="subFolder"
            :is-selected="isFolderSelected(subFolder)"
            :dark="getEntityIndex(subFolder.id) % 2 === 0"
            @folder-clicked="clickOnFolder"
            @folder-dbl-clicked="dblClickOnFolder"
          />
        </li>
        <li
          v-for="file in currentFiles"
          :key="file.id"
        >
          <FilePickerFile
            data-test="document-item"
            :grayed="folderSelection"
            :file="file"
            :is-selected="isSelected(file)"
            :dark="getEntityIndex(file.id) % 2 === 0"
            @file-clicked="clickOnFile"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@components/Documents/Breadcrumb'
import FilePickerFile from '@components/FilePicker/FilePickerFile'
import FilePickerFolder from '@components/FilePicker/FilePickerFolder'
import WeprodeUtils from '@utils/weprode.utils'

import documentsService from '@/api/documents/documents.service'
import navigationService from '@/api/documents/folder.service'
import groupService from '@/api/documents/group.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'FilePickerModalDocumentTab',
  components: { Breadcrumb, FilePickerFile, FilePickerFolder, WeprodeSpinner },
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
    collaborativeOnly: {
      type: Boolean,
      default: false
    },
    imagesOnly: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    }
  },
  emits: ['added-files', 'chosen-folder', 'close', 'selected-folder', 'current-folder', 'update-selected-files'],
  data () {
    return {
      inputText: undefined,
      currentBreadcrumb: [],
      currentFolders: undefined,
      currentFiles: undefined,
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
        if (this.collaborativeOnly) {
          this.currentSpace = 'Group'
          this.loadGroupFolderContent('collaborative') // TODO get those key from data
        } else {
          this.loadUserFolderContent(this.userFolderId)
        }
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
    loadFolderContent (folder) {
      if (this.currentSpace === 'Group') {
        this.loadGroupFolderContent(folder.id)
      } else {
        this.loadUserFolderContent(folder.id)
      }
    },
    loadUserFolderContent (folderId) {
      this.isLoadingFiles = true
      if (this.imagesOnly) {
        navigationService.getImagesEntities(folderId, false).then((data) => {
          this.handleResponse(data, folderId)
        })
      } else {
        navigationService.getAllEntities(folderId, false).then((data) => {
          this.handleResponse(data, folderId)
        })
      }
    },
    loadGroupFolderContent (folderId) {
      this.isLoadingFiles = true
      if (this.imagesOnly) {
        groupService.getGroupImages(folderId).then((data) => {
          this.handleGroupResponse(data, folderId)
        })
      } else {
        groupService.getGroupEntities(folderId, false).then((data) => {
          this.handleGroupResponse(data, folderId)
        })
      }
    },
    handleResponse (data, folderId) {
      this.isLoadingFiles = false
      if (data.success) {
        data.subFolders.forEach(subFolder => { subFolder.hasAddPermission = true }) // Add hasAddPermission = true property to all document folder for compliance with group objects
        this.currentFolders = data.subFolders ? data.subFolders : []
        this.currentFolders = WeprodeUtils.sortArrayWithString(this.currentFolders, false, 'name')

        this.currentFiles = data.files ? data.files : []
        this.currentFiles = WeprodeUtils.sortArrayWithString(this.currentFiles, false, 'name')

        this.selectedFolder = undefined
        this.$emit('selected-folder', undefined)
        navigationService.getBreadcrumb(folderId).then((data) => {
          if (data.success) {
            data.breadcrumb.forEach(folder => { folder.hasAddPermission = true }) // Add hasAddPermission = true property to all document folder for compliance with group objects
            this.currentBreadcrumb = data.breadcrumb
            this.$emit('current-folder', this.currentFolder)
          } else {
            console.error('Unable to get breadcrumb from backend for folder id ' + folderId)
          }
        })
      } else {
        console.error('Unable to get entities from backend for folder id ' + folderId)
      }
    },
    handleGroupResponse (data, folderId) {
      this.isLoadingFiles = false
      if (data.success) {
        this.currentFolders = data.folders ? data.folders : []
        this.currentFolders = WeprodeUtils.sortArrayWithString(this.currentFolders, false, 'name')

        this.currentFiles = data.files ? data.files : []
        this.currentFiles = WeprodeUtils.sortArrayWithString(this.currentFiles, false, 'name')

        this.selectedFolder = undefined
        this.$emit('selected-folder', undefined)
        groupService.getGroupBreadcrumb(folderId).then((data) => {
          if (data.success) {
            this.currentBreadcrumb = data.breadCrumb
            this.$emit('current-folder', this.currentFolder)
          } else {
            console.error('Unable to get breadcrumb from backend for folder id ' + folderId)
          }
        })
      } else {
        console.error('Unable to get entities from backend for folder id ' + folderId)
      }
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
      this.$emit('update-selected-files', this.selectedFiles)
    },
    clickOnFolder (folder, e) {
      if (this.folderSelection && !this.mq.phone && !this.mq.tablet && (e.pointerType === 'mouse' || e.mozInputSource === 1)) { // On phone and tablet, we need to navigate on simple click
        if (this.isFolderSelected(folder)) {
          this.selectedFolder = undefined
          this.$emit('selected-folder', undefined)
        } else if (!this.belongsToAppSelectedEntities(folder) && folder.permissions.ADD_OBJECT) { // Cannot select itself
          this.selectedFolder = folder
          this.$emit('selected-folder', folder)
        }
      } else if (!this.folderSelection || (!this.belongsToAppSelectedEntities(folder) && folder.permissions.ADD_OBJECT)) {
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
      for (const selectedFile of this.selectedFiles) {
        if (file.id === selectedFile.id) {
          return true
        }
      }
      return false
    },
    isFolderSelected (folder) {
      return this.selectedFolder ? folder.id === this.selectedFolder.id : false
    },
    belongsToAppSelectedEntities (entity) {
      for (const selectedEntity of this.appSelectedEntities) {
        if (entity.id === selectedEntity.id) {
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
      this.$emit('chosen-folder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
    },
    addNewFiles () {
      this.$emit('added-files', this.selectedFiles)
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
    min-height: 100px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
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

<i18n locale="fr">
{
  "emptyPlaceholder": "Aucun document"
}
</i18n>
