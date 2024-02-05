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
      v-if="readOnly && withHeader"
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
    withHeader: {
      type: Boolean,
      default: true
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
      returnAddedFiles(event, this.$store).then((result) => {
        if (result.listFiles.length !== 0) {
          this.$store.dispatch('currentActions/setImportFileList', result.listFiles)
          this.$store.dispatch('currentActions/displayUploadProgression')

          importDocuments(undefined, result.listFiles).then(() => {
            this.addNewFiles(this.$store.state.currentActions.listUploadedFiles)
            this.$store.dispatch('currentActions/hideUploadProgression')
          })
        } else if (!result.sizeException) {
          alertNoFile()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.select-buttons {
  margin: 10px 0;
}

.file-list {
  width: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
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
  padding: 20px 0 8px 0;
  font-weight: 600;
  width: 100%;
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
