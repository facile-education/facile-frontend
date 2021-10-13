<template>
  <PentilaWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone}"
    data-test="file-picker-modal"
    :modal="true"
    :is-full-screen="mq.phone"
    :width="!mq.phone? '90vw' : ''"
    :height="!mq.phone? '85vh' : ''"
    @close="close"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
    @keydown.exact.escape.stop="close"
  >
    <template #header>
      <span> {{ header=== '' ? defaultHeader : header }}</span>
    </template>

    <template #body>
      <!-- My Documents-->
      <div class="portfolio">
        <FilePickerBreadCrumb
          class="breadcrumb"
          :breadcrumb="currentBreadcrumb"
          @itemClicked="loadFolderContent"
        />

        <div class="documents-list">
          <div class="scroll">
            <FilePickerFolder
              v-for="subFolder in currentFolders"
              :key="subFolder.id"
              :folder="subFolder"
              :is-selected="isFolderSelected(subFolder)"
              @folderClicked="clickOnFolder"
              @folderDblClicked="dblClickOnFolder"
            />
            <FilePickerFile
              v-for="file in currentFiles"
              :key="file.id"
              :file="file"
              :is-selected="isSelected(file)"
              @fileClicked="clickOnFile"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <PentilaButton
        v-if="folderSelection"
        data-test="submitButton"
        :label="selectedFolder ? $t('FilePickerModal.chooseSelectedFolder') + selectedFolder.name : $t('FilePickerModal.chooseCurrentFolder')"
        @click="emitSelectedFolder"
      />
      <PentilaButton
        v-else
        data-test="submitButton"
        :label="$t('FilePickerModal.submitButton')"
        @click="addNewFiles"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import navigationService from '@/api/documents/folder.service'
import FilePickerBreadCrumb from '@components/FilePicker/FilePickerBreadCrumb'
import FilePickerFolder from '@components/FilePicker/FilePickerFolder'
import FilePickerFile from '@components/FilePicker/FilePickerFile'
import documentsUtils from '@utils/documents.utils.js'

export default {
  name: 'FilePickerModal',
  components: { FilePickerFile, FilePickerFolder, FilePickerBreadCrumb },
  inject: ['mq'],
  props: {
    height: {
      type: String,
      default: '100%'
    },
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
    header: {
      type: String,
      default: ''
    }
  },
  emits: ['addedFiles', 'chosenFolder', 'close'],
  data () {
    return {
      currentBreadcrumb: [],
      currentFolders: [],
      currentFiles: [],
      selectedFiles: [],
      selectedFolder: undefined
    }
  },
  computed: {
    currentFolder () {
      return this.currentBreadcrumb.length > 0 ? this.currentBreadcrumb[this.currentBreadcrumb.length - 1] : undefined
    },
    appSelectedEntities () {
      return this.$store.state.documents.selectedFiles
    },
    defaultHeader () {
      return this.folderSelection ? this.$t('FilePickerModal.headerFolder') : this.$t('FilePickerModal.header')
    }
  },
  created () {
    if (this.initInCurrentFolder) {
      this.loadFolderContent(this.$store.state.documents.currentFolderId)
    } else {
      navigationService.getSpacesFolders().then((data) => {
        this.loadFolderContent(data.private.id)
      })
    }
  },
  methods: {
    loadFolderContent (folderId) {
      navigationService.getAllEntities(folderId).then((data) => {
        if (data.success) {
          this.currentFolders = data.subFolders
          this.currentFiles = data.files
          this.selectedFolder = undefined
          navigationService.getFolderBreadcrumb(folderId).then((data) => {
            if (data.success) {
              data.breadcrumb[0].name = this.$t('router.views.Documents.title') // Translate '_PRIVATE_' folder's name
              this.currentBreadcrumb = data.breadcrumb
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
        } else {
          if (!this.belongsToAppSelectedEntities(folder)) { // Cannot select itself
            this.selectedFolder = folder
          }
        }
      } else {
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
    importDocument (fileList) {
      documentsUtils.importMessagingAttachFiles(fileList).then((importedFiles) => {
        this.selectedFiles = this.selectedFiles.concat(importedFiles)
      })
    },
    emitSelectedFolder () {
      this.$emit('chosenFolder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
      this.close()
    },
    addNewFiles () {
      this.$emit('addedFiles', this.selectedFiles)
      this.close()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.filepicker-window.mobile {
  .window-header {
    padding: 0 8px;
  }

  .window-body {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>

.filepicker-window {
  display: flex;

  .portfolio {
    width: 100%;
    min-width: 600px;

    .breadcrumb{
      padding: 0 15px;
    }

    .documents-list {
      margin-top: 10px;
      position: relative;
      display: flex;
      flex: 1;
      height: 400px;

      .scroll{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        flex: 1;
        /* for Firefox */
        min-height: 0;
        overflow-y: auto;
      }
    }
  }
}

.mobile {
  button {
    margin-left: auto;
    margin-right: 8px;
  }

  .portfolio {
    min-width: 0;

    .breadcrumb{
      padding: 0;
    }
  }

}

</style>
