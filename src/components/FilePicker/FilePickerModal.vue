<template>
  <PentilaWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone}"
    data-test="file-picker-modal"
    :modal="true"
    :is-full-screen="mq.phone"
    :width="!mq.phone? '50vw' : ''"
    :height="!mq.phone? '60vh' : ''"
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
      <PentilaTabList>
        <PentilaTabItem :title="$t('documents')">
          <FilePickerModalDocumentTab
            :folder-selection="folderSelection"
            :init-in-current-folder="initInCurrentFolder"
            :multi-selection="multiSelection"
            :allow-files-from-device="allowFilesFromDevice"
            @selectedFolder="updateSelectedFolder"
            @currentFolder="updateCurrentFolder"
            @chosenFolder="emitSelectedFolder"
            @addedFiles="addNewFiles"
          />
        </PentilaTabItem>

        <PentilaTabItem :title="$t('groups')">
          <FilePickerModalGroupTab
            :folder-selection="folderSelection"
            :init-in-current-folder="initInCurrentFolder"
            :multi-selection="multiSelection"
            :allow-files-from-device="allowFilesFromDevice"
            @selectedFolder="updateSelectedFolder"
            @currentFolder="updateCurrentFolder"
            @chosenFolder="emitSelectedFolder"
            @addedFiles="addNewFiles"
          />
        </PentilaTabItem>
      </Pentilatablist>
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
import FilePickerModalDocumentTab from '@components/FilePicker/FilePickerModalDocumentTab'
import FilePickerModalGroupTab from '@components/FilePicker/FilePickerModalGroupTab'

export default {
  name: 'FilePickerModal',
  components: { FilePickerModalGroupTab, FilePickerModalDocumentTab },
  inject: ['mq'],
  props: {
    height: {
      type: String,
      default: '100%'
    },
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
      selectedFolder: undefined
    }
  },
  computed: {
    defaultHeader () {
      return this.folderSelection ? this.$t('headerFolder') : this.$t('headerFile')
    },
    submitLabel () {
      if (this.selectedFolder && this.selectedFolder.hasPermission) {
        return this.$t('chooseSelectedFolder') + this.selectedFolder.name
      } else if (this.currentFolder && this.currentFolder.hasPermission) {
        return this.$t('chooseCurrentFolder')
      } else {
        return 'noSelectedFolder'
      }
      // return this.selectedFolder ? this.$t('chooseSelectedFolder') + this.selectedFolder.name : this.$t('chooseCurrentFolder')
    }
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
    updateCurrentFolder (folder) {
      this.currentFolder = folder
    },
    emitSelectedFolder () {
      this.$emit('chosenFolder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
      this.close()
    },
    addNewFiles (files) {
      this.$emit('addedFiles', files)
      this.close()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.filepicker-window {

  .window-wrapper.tablet {
    .body {
      min-width: 0;
    }
  }

  .window-footer {
    text-align: center;
    padding-bottom: 16px;
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

  button {
    height: 67px;
    width: 191px;
  }
}

.mobile {

  button {
    margin-left: auto;
    margin-right: auto;
    height: 48px;
    width: 130px;
  }

}

</style>

<i18n locale="fr">
{
  "documents": "Documents",
  "errorNoFiles": "Il n'y a aucun fichier valide à téléverser !",
  "groups": "Groupes",
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
