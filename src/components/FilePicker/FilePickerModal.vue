<template>
  <PentilaWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone}"
    data-test="file-picker-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone"
    :width="width"
    :heigth="height"
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
        :folder-selection="folderSelection"
        :init-in-current-folder="initInCurrentFolder"
        :multi-selection="multiSelection"
        :allow-files-from-device="allowFilesFromDevice"
        @selectedFolder="updateSelectedFolder"
        @currentFolder="updateCurrentFolder"
        @chosenFolder="emitSelectedFolder"
        @updateSelectedFiles="updateSelectedFiles"
      />
    </template>

    <template #footer>
      <PentilaButton
        v-if="folderSelection"
        data-test="submitButton"
        :label="submitLabel !== 'noSelectedFolder' ? submitLabel : $t('noSelectedFolder')"
        :disabled="submitLabel === 'noSelectedFolder'"
        @click="emitSelectedFolder"
      />
      <PentilaButton
        v-else
        data-test="submitButton"
        :label="$t('submitButton')"
        @click="addNewFiles"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import groupService from '@/api/documents/group.service'
import FilePickerModalDocuments from '@components/FilePicker/FilePickerModalDocuments'

export default {
  name: 'FilePickerModal',
  components: { FilePickerModalDocuments },
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
    header: {
      type: String,
      default: ''
    }
  },
  emits: ['addedFiles', 'chosenFolder', 'close'],
  data () {
    return {
      inputText: undefined,
      currentFolder: undefined,
      selectedFolder: undefined,
      selectedFiles: undefined,
      height: undefined,
      width: undefined
    }
  },
  computed: {
    defaultHeader () {
      return this.folderSelection ? this.$t('headerFolder') : this.$t('headerFile')
    },
    submitLabel () {
      if (this.selectedFolder && this.selectedFolder.permissions.ADD_OBJECT) {
        return this.$t('chooseSelectedFolder') + this.selectedFolder.name
      } else if (this.currentFolder && this.currentFolder.permissions.ADD_OBJECT) {
        return this.$t('chooseCurrentFolder')
      } else {
        return 'noSelectedFolder'
      }
      // return this.selectedFolder ? this.$t('chooseSelectedFolder') + this.selectedFolder.name : this.$t('chooseCurrentFolder')
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.width = !this.mq.phone ? Math.max(600, document.documentElement.clientWidth / 2) : ''
    this.height = document.documentElement.clientHeight * 9 / 10
  },
  methods: {
    submit () {
      groupService.getGroupEntities(this.inputText).then((data) => {
        console.log(data)
      })
    },
    updateSelectedFolder (folder) {
      this.selectedFolder = folder
    },
    updateSelectedFiles (files) {
      this.selectedFiles = files
    },
    updateCurrentFolder (folder) {
      this.currentFolder = folder
    },
    emitSelectedFolder () {
      this.$emit('chosenFolder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
      this.close()
    },
    addNewFiles () {
      this.$emit('addedFiles', this.selectedFiles)
      this.close()
    },
    close () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.filepicker-window {

  &.mobile {
    .resizable-component {
      .window-container {
        .window-body {
          --body-max-height: calc(100vh - 133px);
        }
      }
    }
  }

  &:not(.mobile) .window-body .body {
    --tab-content-max-height: calc(var(--body-max-height) - 87px);
    max-height: calc(var(--tab-content-max-height) - 10px);
  }

  // Shit to make the thing works (inherit max-height minus elements paddings)
  .window-body {
    --body-max-height: calc(90vh - 133px);
    max-height: var(--body-max-height);
  }
}

.filepicker-window.tablet {
  z-index: 1001;
}

.filepicker-window.mobile {
  .window-header {
    padding: 0 8px;
  }

  .window-body {
    padding: 0;
  }

  .window-footer {
    padding-bottom: 8px;
  }
}
</style>

<style lang="scss" scoped>

.filepicker-window {
  display: flex;
}

.mobile button {
    margin-left: auto;
    margin-right: auto;
    height: 48px;
}

</style>

<i18n locale="fr">
{
  "documents": "Personnels",
  "errorNoFiles": "Le chargement n'est pas autorisé",
  "groups": "Collaboratifs",
  "headerFolder": "Sélectionnez un dossier de destination",
  "headerFile": "Ajouter un document",
  "noSelectedFolder": "Dépose impossible",
  "or": "ou",
  "submitButton": "Ajouter",
  "uploadFile": "Importer un ou plusieurs documents",
  "chooseCurrentFolder": "Choisir ce dossier",
  "chooseSelectedFolder": "Choisir  "
}
</i18n>
