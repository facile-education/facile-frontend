<template>
  <div
    v-if="!readOnly"
    class="attached-picker"
  >
    <label v-t="'title'" />
    <button
      class="add-document-button"
      :title="$t('addAttachFileButton')"
      @click="displayFilePicker"
    >
      <img
        class="icon"
        src="@assets/options/dossier-pj.svg"
        :alt="$t('addAttachFileButton')"
      >
    </button>
    <button
      class="add-document-button"
      :title="$t('addLocalAttachFileButton')"
      @click="importDocument"
    >
      <img
        class="icon"
        src="@assets/options/icon_upload.svg"
        :alt="$t('addLocalAttachFileButton')"
      >
    </button>
  </div>
  <div class="attached-files">
    <div
      v-if="readOnly"
      class="header"
    >
      {{ modelValue.length + (modelValue.length > 1 ? $t('attachedFiles') : $t('attachedFile')) }}
    </div>
    <div class="file-list">
      <button
        v-for="attachedFile in modelValue"
        :key="attachedFile.fileId"
        :title="viewFileName(attachedFile)"
        class="attached-file"
        :class="{'phone': mq.phone}"
        @click="viewAttachedFile(attachedFile)"
      >
        <FileIcon
          class="file-icon"
          :file="attachedFile"
        />
        <span class="file-name">
          {{ attachedFile.name }}
        </span>
        <button
          v-if="!readOnly"
          class="file-actions"
          :title="$t('AttachedFiles.remove')"
          @click.stop="removeAttachedFile(attachedFile)"
        >
          <img
            class="file-action cross"
            src="@assets/big-cross-black.svg"
            :alt="$t('AttachedFiles.remove')"
          >
        </button>
        <span
          v-else
          class="file-actions"
        >
          <button
            :title="$t('addToFolder')"
            @click.stop="addToMyDocs(attachedFile, $event)"
          >
            <img
              class="file-action add-to-folder"
              src="@assets/add_to_folder.svg"
              :alt="$t('addToFolder')"
            >
          </button>
          <button
            :title="$t('download')"
            @click.stop="downloadAttachedFile(attachedFile)"
          >
            <img
              class="file-action"
              src="@assets/attached_file_download.svg"
              :alt="$t('download')"
            >
          </button>
        </span>
      </button>
    </div>
  </div>

  <teleport to="body">
    <!-- Picker -->
    <FilePickerModal
      v-if="isFilePickerModalDisplayed"
      :multi-selection="true"
      @addedFiles="addNewFiles"
      @close="closeFilePicker"
    />

    <!-- Deposit destination -->
    <FilePickerModal
      v-if="isDepositModalDisplayed"
      :folder-selection="true"
      :init-in-current-folder="false"
      @chosenFolder="doSelectFolderAction"
      @close="isDepositModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { downloadDocument, importDocuments } from '@utils/documents.util'
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import FileIcon from '@components/Base/FileIcon'

import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'AttachedFiles',
  components: {
    FilePickerModal,
    FileIcon
  },
  inject: ['mq'],
  props: {
    modelValue: {
      type: Array,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['removeAttachedFile', 'update:modelValue'],
  data () {
    return {
      isDepositModalDisplayed: false,
      isFilePickerModalDisplayed: false,
      selectedFileForAction: undefined
    }
  },
  created () {
    if (this.$store.state.documentsProperties === undefined) {
      this.$store.dispatch('documents/getGlobalDocumentsProperties')
    }
  },
  methods: {
    addNewFiles (newFiles) {
      this.$emit('update:modelValue', [...this.modelValue, ...newFiles])
    },
    addToMyDocs (attachedFile) {
      this.selectedFileForAction = attachedFile
      this.isDepositModalDisplayed = true
    },
    closeFilePicker () {
      this.isFilePickerModalDisplayed = false
    },
    displayFilePicker () {
      this.isFilePickerModalDisplayed = true
    },
    doSelectFolderAction (targetFolder) {
      this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: [this.selectedFileForAction], successMessage: this.$t('addToFolderSuccess') })
    },
    downloadAttachedFile (attachedFile) {
      if (this.readOnly) {
        downloadDocument(attachedFile)
      }
    },
    importDocument () {
      // Create hidden inputFile
      const input = document.createElement('input')
      input.style.display = 'none'
      input.type = 'file'
      input.accept = '*/*'
      input.multiple = true

      input.onchange = e => {
        returnAddedFiles(e, this.$store).then((files) => {
          if (files.length !== 0) {
            this.$store.dispatch('currentActions/setImportFileList', files)
            this.$store.dispatch('currentActions/displayUploadProgression')

            importDocuments(undefined, files).then((data) => {
              this.addNewFiles(this.$store.state.currentActions.listUploadedFiles)
              this.$store.dispatch('currentActions/hideUploadProgression')
            })
          } else {
            alertNoFile()
          }
        })
      }

      // Click it
      input.click()
    },
    removeAttachedFile (attachedFile) {
      this.$emit('removeAttachedFile', attachedFile)
    },
    viewAttachedFile (attachedFile) {
      this.$store.dispatch('documents/openFile', { id: attachedFile.id, name: attachedFile.name, readOnly: true })
    },
    viewFileName (attachedFile) {
      return this.$t('view') + ' ' + attachedFile.name
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.attached-picker {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-document-button {
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
  }
}

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.attached-files {
  margin-bottom: 10px;
}

.header {
  border-top: 1px solid $color-border;
  padding-top: 20px;
  font-weight: 600;
  width: 100%;
  padding-left: 10px;
}

.file-list {
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
}

.attached-file {
  height: 50px;
  border-radius: 8px 8px 8px 8px;
  margin: 10px 10px 10px 0;
  display: flex;
  align-items: center;
  border: 1px solid $color-border;

  &.phone {
    height: 40px;
    margin: 3px 5px 3px 0;
  }

  &:hover {
    border: 1px solid black;
  }
}

.file-icon {
  margin-left: 10px;
}

.file-name {
  margin-left: 10px;
  margin-right: 10px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions {
  img {
    cursor: pointer;
    margin-right: 10px;
    height: 16px;
    width: 16px;
  }
  .cross {
    height: 13px;
    width: 13px;
  }
  .add-to-folder {
    height: 19px;
    width: 19px;
  }
}
</style>

<i18n locale="fr">
{
  "attachedFile": " pièce jointe",
  "attachedFiles": " pièces jointes",
  "title": "Pièces jointes :",
  "addAttachFileButton": "Ajouter une pièce jointe depuis mes documents",
  "addLocalAttachFileButton": "Ajouter une pièce jointe depuis mon poste de travail",
  "addToFolder": "Enregistrer dans mes documents",
  "addToFolderSuccess": "Fichier déposé",
  "download": "Télécharger",
  "view": "Visualiser",
  "remove": "Supprimer"
}
</i18n>
