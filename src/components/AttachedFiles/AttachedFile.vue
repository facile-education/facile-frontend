<template>
  <div
    :title="$t('viewFile', {target: attachedFile.name})"
    class="attached-file theme-hover-border-color"
    data-test="attached-file"
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
          :src="require('@assets/icons/dots.svg')"
          alt="options"
        >
      </button>

      <span
        v-else
        class="file-actions"
      >
        <WeprodeButton
          :title="$t('save')"
          :aria-label="$t('save')"
          class="circle"
          @click.stop="isDepositModalDisplayed = true"
          @keyup.stop
        >
          <CustomIcon
            icon-name="icon-folder"
            :style="'font-size: 1rem'"
          />
        </WeprodeButton>
        <WeprodeButton
          :title="$t('download')"
          :aria-label="$t('download')"
          class="circle"
          @click.stop="downloadAttachedFile"
          @keyup.stop
        >
          <CustomIcon
            icon-name="icon-download"
            :style="'font-size: 1rem'"
          />
        </WeprodeButton>
      </span>
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
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import FileIcon from '@components/Base/FileIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { formatSize } from '@utils/commons.util'
import { downloadDocuments } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'

import { icons } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'AttachedFile',
  components: { WeprodeButton, CustomIcon, ContextMenu, FileIcon, FilePickerModal },
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
      downloadDocuments([this.attachedFile])
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

.attached-file {
  --icon-width: 50px;
  height: 60px;
  width: 100%;
  padding: 0.5rem;
  border-radius: $content-boarder-radius;
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  background-color: $neutral-10;
  cursor: pointer;
  position: relative;

  &.has-remove-button {
    --option-length: 2rem;
  }

  &:not(.has-remove-button).phone {
    --option-length: 2rem;
  }

  &:not(.has-remove-button):not(.phone) {
    --option-length: calc(2*30px + 0.25rem + 0.5rem);
  }

  .data {
    width: calc(100% - (var(--icon-width) + var(--option-length) + 0.5rem));
  }
}

.icon {
  height: var(--icon-width);
  width: var(--icon-width);
  min-width: var(--icon-width);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.data {
  height: 100%;
  padding: 5px 0;
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
  margin-top: 4px;
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
  button {
    padding: 0.5rem;
  }
}

.file-actions {
  margin-left: 0.5rem;
  height: 100%;
  display: flex;
  gap: 0.25rem;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .3s ease;

  .circle{
    display: flex;
    align-items: center;
    justify-content: center;
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
