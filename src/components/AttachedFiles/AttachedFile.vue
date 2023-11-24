<template>
  <div
    :title="$t('viewFile', {target: attachedFile.name})"
    class="attached-file theme-hover-border-color"
    :class="{'phone': mq.phone || mq.tablet, 'has-remove-button': !readOnly}"
    tabindex="0"
    @click="viewAttachedFile"
    @keyup.enter="viewAttachedFile"
  >
    <FileIcon
      class="icon"
      :file="attachedFile"
      width="34px"
      height="34px"
    />
    <div class="data">
      <strong class="name">
        {{ attachedFile.name }}
      </strong>
      <div class="size">
        {{ formattedSize }}
      </div>
    </div>

    <div class="options">
      <button
        v-if="!readOnly"
        class="remove-button"
        :title="$t('AttachedFiles.remove')"
        :aria-label="$t('AttachedFiles.remove')"
        @click.stop="removeAttachedFile"
      >
        <img
          :src="require('@/assets/icons/trash.svg')"
          alt="options"
        >
      </button>

      <button
        v-else-if="mq.phone || mq.tablet"
        class="options-button"
        :aria-label="$t('options')"
        :title="$t('options')"
        @click="toggleContextMenu"
      >
        <img
          height="16"
          width="16"
          :src="require('@/assets/icons/vertical_dots.svg')"
          alt="options"
        >
      </button>

      <span
        v-else
        class="file-actions"
      >
        <button
          :title="$t('save')"
          :aria-label="$t('save')"
          @click.stop="isDepositModalDisplayed = true"
          @keyup.stop
        >
          <img
            class="file-action add-to-folder"
            :src="saveIcon"
            :alt="$t('save')"
          >
        </button>
        <button
          class="right-button"
          :title="$t('download')"
          :aria-label="$t('download')"
          @click.stop="downloadAttachedFile"
          @keyup.stop
        >
          <img
            class="file-action"
            src="@assets/attached_file_download.svg"
            :alt="$t('download')"
          >
        </button>
      </span>
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
import FileIcon from '@components/Base/FileIcon.vue'
import { formatSize } from '@utils/commons.util'
import { downloadDocument } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'

import { icons } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'AttachedFile',
  components: { ContextMenu, FileIcon, FilePickerModal },
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
    saveIcon () {
      return icons.options.save
    },
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
  border-radius: $content-boarder-radius;
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  background-color: $neutral-10;
  cursor: pointer;
  position: relative;

  &:hover, &:focus-within {
    .file-actions {
      opacity: 100%;

      button {
        width: 40px;
      }
    }
  }

  &:not(.phone):not(.has-remove-button) {
    .data {
      width: calc(100% - (50px + 0.5rem));
    }
  }
}

.icon {
  height: 50px;
  width: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.data {
  width: calc(100% - (50px + 0.5rem + 2rem));
  height: 100%;
  padding: 8px 0;
}

.name {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @extend %font-bold-s;
}

.size {
  @extend %font-regular-xs;
}

.remove-button, .options-button {
  background-color: transparent;
}

.remove-button {
  padding: 6px !important;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }
}

.context-menu-with-padding {
  padding: 10px 0;
}

.options {
  width: 2rem;

  button {
    padding: 0.5rem;
  }
}

.file-actions {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .3s ease;
  opacity: 0;

  button {
    width: 0;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background-color: $neutral-20;

    img {
      height: 1rem;
    }

    &:hover {
      background-color: $color-hover-bg;
    }
  }

  .right-button {
    border-radius: 0 $content-boarder-radius $content-boarder-radius 0;
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
