<template>
  <div class="attached-files">
    <div
      v-if="readOnly"
      class="header"
    >
      {{ attachedFiles.length + (attachedFiles.length > 1 ? $t('attachedFiles') : $t('attachedFile')) }}
    </div>
    <div class="file-list">
      <div
        v-for="attachedFile in attachedFiles"
        :key="attachedFile.fileId"
        :title="viewFileName(attachedFile)"
        class="attached-file"
        @click="viewAttachedFile(attachedFile)"
      >
        <FileIcon
          class="file-icon"
          :file="attachedFile"
        />
        <p class="file-name">
          {{ attachedFile.name }}
        </p>
        <div
          v-if="!readOnly"
          class="file-actions"
        >
          <img
            class="file-action cross"
            src="@assets/big-cross-black.svg"
            :alt="$t('AttachedFiles.remove')"
            :title="$t('AttachedFiles.remove')"
            @click.stop="removeAttachedFile(attachedFile)"
          >
        </div>
        <div
          v-else
          class="file-actions"
        >
          <img
            class="file-action add-to-folder"
            src="@assets/add_to_folder.svg"
            :alt="$t('addToFolder')"
            :title="$t('addToFolder')"
            @click.stop="addToMyDocs(attachedFile)"
          >
          <img
            class="file-action"
            src="@assets/attached_file_download.svg"
            :alt="$t('download')"
            :title="$t('download')"
            @click.stop="downloadAttachedFile(attachedFile)"
          >
        </div>
      </div>
    </div>
  </div>

  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerModalDisplayed"
      :folder-selection="true"
      :init-in-current-folder="false"
      @chosenFolder="doSelectFolderAction"
      @close="isFilePickerModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import FileIcon from '@components/Base/FileIcon'
import { downloadDocument } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'AttachedFiles',
  components: {
    FilePickerModal,
    FileIcon
  },
  props: {
    attachedFiles: {
      type: Array,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['removeAttachedFile'],
  data () {
    return {
      isFilePickerModalDisplayed: false,
      selectedFileForAction: undefined
    }
  },
  methods: {
    removeAttachedFile (e, attachedFile) {
      this.$emit('removeAttachedFile', e, attachedFile)
    },
    downloadAttachedFile (attachedFile) {
      if (this.readOnly) {
        downloadDocument(attachedFile)
      }
    },
    addToMyDocs (attachedFile) {
      this.selectedFileForAction = attachedFile
      this.isFilePickerModalDisplayed = true
    },
    doSelectFolderAction (targetFolder) {
      this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: [this.selectedFileForAction] })
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

.attached-files {
  margin-bottom: 10px;

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

    .attached-file {
      height: 50px;
      border-radius: 8px 8px 8px 8px;
      margin: 10px 10px 10px 0;
      display: flex;
      align-items: center;
      border: 1px solid $color-border;

      &:hover {
        border: 1px solid black;
      }

      .file-icon {
        margin-left: 10px;
      }

      p {
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
    }
  }
  &:hover {
    cursor: pointer;
  }
}
</style>

<i18n locale="fr">
{
  "attachedFile": " pièce jointe",
  "attachedFiles": " pièces jointes",
  "addToFolder": "Enregistrer dans mes documents",
  "download": "Télécharger",
  "view": "Visualiser",
  "remove": "Supprimer"
}
</i18n>
