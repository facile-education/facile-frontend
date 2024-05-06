<template>
  <WeprodeWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone || mq.tablet}"
    data-test="file-picker-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    :max-width="600"
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
      <FilePickerModalDocuments
        ref="documentList"
        :folder-selection="folderSelection"
        :init-in-current-folder="initInCurrentFolder"
        :multi-selection="multiSelection"
        :allow-files-from-device="allowFilesFromDevice"
        :collaborative-only="collaborativeOnly"
        :images-only="imagesOnly"
        @selected-folder="updateSelectedFolder"
        @current-folder="updateCurrentFolder"
        @chosen-folder="emitSelectedFolder"
        @update-selected-files="updateSelectedFiles"
      />
    </template>

    <template #footer>
      <div
        v-if="folderSelection"
        class="footer"
      >
        <WeprodeButton
          v-if="canCreateFolderInCurrentFolder"
          class="create-folder-button"
          :label="$t('FilePicker.FilePickerModal.createFolder')"
          @click="createFolder"
        />
        <WeprodeButton
          data-test="submitButton"
          class="submit-button"
          :label="submitLabel !== 'noSelectedFolder' ? submitLabel : $t('FilePicker.FilePickerModal.noSelectedFolder')"
          :disabled="submitLabel === 'noSelectedFolder'"
          @click="emitSelectedFolder"
        />
      </div>

      <WeprodeButton
        v-else
        data-test="submitButton"
        :label="$t('FilePicker.FilePickerModal.submitButton')"
        :disabled="!selectedFiles || selectedFiles.length === 0"
        @click="addNewFiles"
      />
    </template>
  </WeprodeWindow>

  <teleport
    v-if="isFolderNameModalDisplayed"
    to="body"
  >
    <FolderNameModal
      submit-action="createFolder"
      :current-folder="currentFolder"
      @create-folder="refreshCurrentFolder"
      @close="isFolderNameModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import FilePickerModalDocuments from '@components/FilePicker/FilePickerModalDocuments'
import { defineAsyncComponent } from 'vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

const FolderNameModal = defineAsyncComponent(() => import('@components/Documents/Modals/FolderNameModal.vue'))

export default {
  name: 'FilePickerModal',
  components: { FolderNameModal, FilePickerModalDocuments, WeprodeButton, WeprodeWindow },
  inject: ['mq'],
  props: {
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
    collaborativeOnly: {
      type: Boolean,
      default: false
    },
    imagesOnly: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    }
  },
  emits: ['added-files', 'chosen-folder', 'close'],
  data () {
    return {
      inputText: undefined,
      currentFolder: undefined,
      selectedFolder: undefined,
      selectedFiles: undefined,
      isFolderNameModalDisplayed: false
    }
  },
  computed: {
    defaultHeader () {
      if (this.imagesOnly) {
        return this.$t('FilePicker.FilePickerModal.headerImagePicker')
      } else {
        return this.folderSelection ? this.$t('FilePicker.FilePickerModal.headerFolder') : this.$t('FilePicker.FilePickerModal.headerFile')
      }
    },
    canCreateFolderInCurrentFolder () {
      return this.currentFolder?.permissions.ADD_OBJECT
    },
    submitLabel () {
      if (this.selectedFolder?.permissions.ADD_OBJECT) {
        return this.$t('FilePicker.FilePickerModal.chooseSelectedFolder', { folderName: this.selectedFolder.name })
      } else if (this.currentFolder?.permissions.ADD_OBJECT) {
        return this.$t('FilePicker.FilePickerModal.chooseCurrentFolder')
      } else {
        return 'noSelectedFolder'
      }
    }
  },
  methods: {
    refreshCurrentFolder () {
      this.$refs.documentList.loadFolderContent(this.currentFolder)
    },
    createFolder () {
      this.isFolderNameModalDisplayed = true
    },
    updateSelectedFolder (folder) {
      this.selectedFolder = folder
    },
    updateSelectedFiles (files) {
      this.selectedFiles = files
    },
    updateCurrentFolder (folder) {
      this.selectedFiles = undefined
      this.currentFolder = folder
    },
    emitSelectedFolder () {
      this.$emit('chosen-folder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
      this.close()
    },
    addNewFiles () {
      this.$emit('added-files', this.selectedFiles)
      this.close()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.filepicker-window.tablet {
  z-index: 1001;
}
</style>

<style lang="scss" scoped>
@import "@design";

.footer  {
  display: flex;
}

.create-folder-button {
  background-color: $neutral-40;
  color: black;

  &:hover {
    filter: brightness(105%) !important;
  }
}

.submit-button {
  margin-left: auto;
}

.mobile button {
    margin-left: auto;
    margin-right: auto;
    height: 48px;
}

</style>
