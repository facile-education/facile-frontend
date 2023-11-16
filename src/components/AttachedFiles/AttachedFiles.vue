<template>
  <SelectFilesButtons
    v-if="!readOnly"
    class="select-buttons"
    :label="$t('title')"
    :allow-multiple="true"
    @load="importDocument"
    @select-files="addNewFiles"
  />

  <div class="attached-files">
    <div
      v-if="readOnly"
      class="header"
    >
      {{ modelValue.length + (modelValue.length > 1 ? $t('attachedFiles') : $t('attachedFile')) }}
    </div>
    <ul
      class="file-list"
      :style="'max-height: ' + maxHeight"
    >
      <li
        v-for="attachedFile in modelValue"
        :key="attachedFile.fileId"
      >
        <AttachedFile
          :read-only="readOnly"
          :attached-file="attachedFile"
          @remove-attached-file="$emit('removeAttachedFile', $event)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import SelectFilesButtons from '@components/FilePicker/SelectFilesButtons.vue'
import { importDocuments } from '@utils/documents.util'
import { alertNoFile, returnAddedFiles } from '@utils/upload.util'
import { defineAsyncComponent } from 'vue'
const AttachedFile = defineAsyncComponent(() => import('@components/AttachedFiles/AttachedFile.vue'))

export default {
  name: 'AttachedFiles',
  components: {
    SelectFilesButtons,
    AttachedFile
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
    },
    maxHeight: {
      type: String,
      default: ''
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
    importDocument (event) {
      returnAddedFiles(event, this.$store).then((files) => {
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

.select-buttons {
  margin-top: 10px;
}

.file-list {
  overflow: auto;
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
