<template>
  <div
    v-if="!readOnly"
    class="attached-picker"
  >
    <label v-t="'title'" />
    <button
      class="add-document-button"
      :title="$t('addAttachFileButton')"
      @click="isFilePickerModalDisplayed = true"
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
    <ul class="file-list">
      <li
        v-for="attachedFile in modelValue"
        :key="attachedFile.fileId"
      >
        <AttachedFile
          :read-only="readOnly"
          :attached-file="attachedFile"
          @removeAttachedFile="$emit('removeAttachedFile', $event)"
        />
      </li>
    </ul>
  </div>

  <teleport to="body">
    <!-- Picker -->
    <FilePickerModal
      v-if="isFilePickerModalDisplayed"
      :multi-selection="true"
      @addedFiles="addNewFiles"
      @close="isFilePickerModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { importDocuments } from '@utils/documents.util'
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import AttachedFile from '@components/AttachedFiles/AttachedFile.vue'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'AttachedFiles',
  components: {
    AttachedFile,
    FilePickerModal
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

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
