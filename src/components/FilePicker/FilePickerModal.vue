<template>
  <PentilaWindow
    class="filepicker-window"
    :class="{'mobile': mq.phone}"
    data-test="file-picker-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone"
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
import FilePickerModalDocuments from '@components/FilePicker/FilePickerModalDocuments'

import groupService from '@/api/documents/group.service'

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
      selectedFiles: undefined
    }
  },
  computed: {
    defaultHeader () {
      return this.imagesOnly ? this.$t('headerImagePicker') : (this.folderSelection ? this.$t('headerFolder') : this.$t('headerFile'))
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
  },
  methods: {
    submit () {
      groupService.getGroupEntities(this.inputText).then((data) => {
        // TODO ?
        // console.log(data)
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
      this.$emit('chosen-folder', this.selectedFolder ? this.selectedFolder : this.currentFolder)
      this.close()
    },
    addNewFiles () {
      this.$emit('added-files', this.selectedFiles)
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
.filepicker-window.tablet {
  z-index: 1001;
}
</style>

<style lang="scss" scoped>

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
  "headerImagePicker": "Sélectionnez une image",
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
