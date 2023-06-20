<template>
  <button
    :title="$t('viewFile', {target: attachedFile.name})"
    class="attached-file"
    :class="{'phone': mq.phone}"
    @click="viewAttachedFile"
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
      @click.stop="removeAttachedFile"
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
        @click.stop="isDepositModalDisplayed = true"
      >
        <img
          class="file-action add-to-folder"
          src="@assets/add_to_folder.svg"
          :alt="$t('addToFolder')"
        >
      </button>
      <button
        :title="$t('download')"
        @click.stop="downloadAttachedFile"
      >
        <img
          class="file-action"
          src="@assets/attached_file_download.svg"
          :alt="$t('download')"
        >
      </button>
    </span>
  </button>

  <teleport
    v-if="isDepositModalDisplayed"
    to="body"
  >
    <!-- Deposit destination -->
    <FilePickerModal
      :folder-selection="true"
      :init-in-current-folder="false"
      @chosenFolder="saveInFolder"
      @close="isDepositModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import FileIcon from '@components/Base/FileIcon.vue'
import { downloadDocument } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'AttachedFile',
  components: { FileIcon, FilePickerModal },
  inject: ['mq'],
  props: {
    attachedFile: {
      type: Object,
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
      isDepositModalDisplayed: false
    }
  },
  methods: {
    viewAttachedFile () {
      this.$store.dispatch('documents/openFile', { id: this.attachedFile.id, name: this.attachedFile.name, readOnly: true })
    },
    removeAttachedFile () {
      this.$emit('removeAttachedFile', this.attachedFile)
    },
    downloadAttachedFile () {
      downloadDocument(this.attachedFile)
    },
    saveInFolder (targetFolder) {
      this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: [this.attachedFile], successMessage: this.$t('addToFolderSuccess') })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
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
  "viewFile": "Visualiser {target}",
  "remove": "Supprimer"
}
</i18n>
