<template>
  <PentilaWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone}"
    data-test="file-picker-modal"
    :modal="true"
    :is-full-screen="mq.phone"
    :width="!mq.phone? '50vw' : ''"
    :height="!mq.phone? '60vh' : ''"
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
      <PentilaSpinner v-if="isLoadingFiles" />

      <!-- My Documents-->
      <div class="body">
        <FilePickerBreadCrumb
          class="breadcrumb"
          :breadcrumb="currentBreadcrumb"
          @itemClicked="loadFolderContent"
        />

        <div class="documents-list">
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
            :file="file"
            :is-selected="isSelected(file)"
            :dark="getEntityIndex(file.id) % 2 === 0"
            @fileClicked="clickOnFile"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <PentilaButton
        v-if="folderSelection"
        data-test="submitButton"
        :label="selectedFolder ? $t('chooseSelectedFolder') + selectedFolder.name : $t('chooseCurrentFolder')"
        @click="emitSelectedFolder"
      />
      <PentilaButton
        v-else
        data-test="submitButton"
        :label="$t('submitButton')"
        @click="addNewFiles"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import navigationService from '@/api/documents/folder.service'
import documentsService from '@/api/documents/documents.service'
import FilePickerBreadCrumb from '@components/FilePicker/FilePickerBreadCrumb'
import FilePickerFolder from '@components/FilePicker/FilePickerFolder'
import FilePickerFile from '@components/FilePicker/FilePickerFile'
import { returnAddedFiles } from '@utils/upload.util'
import fileService from '@/api/documents/file.service'

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
    allowFilesFromDevice: {
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
    defaultHeader () {
      return this.folderSelection ? this.$t('headerFolder') : this.$t('headerFile')
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
      navigationService.getAllEntities(folderId, false).then((data) => {
        if (data.success) {
          this.currentFolders = data.subFolders
          this.currentFiles = data.files
          this.selectedFolder = undefined
          navigationService.getFolderBreadcrumb(folderId).then((data) => {
            if (data.success) {
              // data.breadcrumb[0].name = this.$t('router.views.Documents.title') // Translate '_PRIVATE_' folder's name // TODO
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
      this.close()
    },
    onInputChange (e) {
      returnAddedFiles(e, this.$store, this.maxUploadSize).then((files) => {
        if (files.length !== 0) {
          this.uploadFiles(files)
        } else {
          this.$refs['upload-file-input'].value = ''
          alert(this.$t('errorNoFiles'))
        }
      })
    },
    async uploadFiles (files) { // Upload device selected files in user temp folder and then, emits them
      const uploadedFiles = []
      for (const file of files) {
        this.isLoadingFiles = true
        await fileService.uploadFile(0, file).then((data) => { // id 0 means upload in the temp folder
          this.isLoadingFiles = false
          if (data.success) {
            uploadedFiles.push(data.uploadedFile)
          } else {
            console.error('Error when trying upload file')
            if (data.error === 'fileSizeException') {
              this.$store.dispatch('error/setErrorType', 'reachMaxSize')
              this.$store.dispatch('error/setListFilesConcerns', [file])
              this.$store.dispatch('monDrive/openErrorModal')
            }
          }
        })
      }
      this.$emit('addedFiles', uploadedFiles)
      this.close()
    },
    addNewFiles () {
      this.$emit('addedFiles', this.selectedFiles)
      this.close()
    },
    close () {
      if (!this.isLoadingFiles) { // Avoid filePicker closure when loading file
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss">
.filepicker-window {

  .window-wrapper.tablet {
    .body {
      min-width: 0;
    }
  }

  .window-footer {
    text-align: center;
    padding-bottom: 16px;
  }
}

.filepicker-window.tablet {
  z-index: 1001;
}

.filepicker-window.mobile {
  .window-header {
    padding: 0 8px;
  }

  .window-body {
    padding: 0;
  }

  .window-footer {
    padding-bottom: 8px;
  }
}
</style>

<style lang="scss" scoped>

.filepicker-window {
  display: flex;

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

  button {
    height: 67px;
    width: 191px;
  }
}

.mobile {
  .body {
    max-height: 100%;
    min-width: 0;

    .breadcrumb{
      padding: 0;
    }

    .upload {
      margin-top: 15px;
    }
  }

  button {
    margin-left: auto;
    margin-right: auto;
    height: 48px;
    width: 130px;
  }

}

</style>

<i18n locale="fr">
{
  "errorNoFiles": "Il n'y a aucun fichier valide à téléverser !",
  "headerFolder": "Sélectionnez un dossier de destination",
  "headerFile": "Ajouter un document",
  "or": "ou",
  "submitButton": "Ajouter",
  "uploadFile": "Importer un ou plusieurs documents",
  "chooseCurrentFolder": "Choisir ce dossier",
  "chooseSelectedFolder": "Choisir  "
}
</i18n>
