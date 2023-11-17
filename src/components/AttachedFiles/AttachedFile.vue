<template>
  <div
    :title="$t('viewFile', {target: attachedFile.name})"
    class="attached-file theme-hover-border-color"
    :class="{'phone': mq.phone}"
    tabindex="0"
    @click="viewAttachedFile"
    @keyup.enter="viewAttachedFile"
  >
    <FileIcon
      class="file-icon"
      :file="attachedFile"
      width="36px"
      height="36px"
    />
    <div class="file-data">
      <div class="file-name">
        {{ attachedFile.name }}
      </div>
      <div class="file-size">
        {{ formattedSize }}
      </div>
    </div>

    <div class="options">
      <button
        v-if="!readOnly"
        class="remove-button"
        :title="$t('AttachedFiles.remove')"
        @click.stop="removeAttachedFile"
      >
        <CustomIcon
          icon-name="icon-cross-L"
          class="icon"
        />
      </button>
      <button
        v-else
        class="options-button"
        :aria-label="$t('options')"
        :title="$t('options')"
        @click="toggleContextMenu"
      >
        <img
          height="20"
          width="20"
          :src="require('@/assets/icons/vertical_dots.svg')"
          alt="options"
        >
      </button>
    </div>
  </div>

  <teleport
    v-if="isDepositModalDisplayed"
    to="body"
  >
    <!-- Deposit destination -->
    <FilePickerModal
      :folder-selection="true"
      :init-in-current-folder="false"
      @chosen-folder="saveInFolder"
      @close="isDepositModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      class="context-menu-with-padding"
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import FileIcon from '@components/Base/FileIcon.vue'
import { formatSize } from '@utils/commons.util'
import { downloadDocument } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'

import { icons } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'AttachedFile',
  components: { ContextMenu, CustomIcon, FileIcon, FilePickerModal },
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
      isDepositModalDisplayed: false,
      displayMenu: false
    }
  },
  computed: {
    formattedSize () {
      return this.attachedFile.size !== undefined ? formatSize(this.attachedFile.size) : '-'
    }
  },
  methods: {
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event,
        options: [
          {
            name: 'save',
            title: this.$t('save'),
            icon: icons.options.save,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'download',
            title: this.$t('download'),
            icon: icons.options.download,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'save':
          this.isDepositModalDisplayed = true
          break
        case 'download':
          this.downloadAttachedFile()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
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
  height: 70px;
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  cursor: pointer;
}

.file-icon {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;

  img {
    height: 38px;
    width: 38px;
  }
}

.file-data {
  width: calc(100% - 102px);
  height: 100%;
  padding: 8px 0;
}

.file-name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @extend %font-bold-s;
}

.file-size {
  @extend %font-regular-xs;
}

.remove-button {
  display: flex;
  align-items: center;
  margin: 0 10px;

  .icon {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.context-menu-with-padding {
  padding: 10px 0;
}

.options {
  button {
    padding: 0.5rem;
  }
}

.file-actions {
  margin: 0 10px;

  img {
    cursor: pointer;
    height: 16px;
    width: 16px;
  }
  .add-to-folder {
    height: 19px;
    width: 19px;
    margin-right: 10px;
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
  "save": "Enregistrer",
  "addToFolderSuccess": "Fichier déposé",
  "download": "Télécharger",
  "options": "Options",
  "viewFile": "Visualiser {target}",
  "remove": "Supprimer"
}
</i18n>
