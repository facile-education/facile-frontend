<template>
  <PentilaWindow
    class="file-name-modal"
    :class="mq.phone ? 'mobile': ''"
    :modal="true"
    @close="onClose"
    @keydown.exact.enter.stop="submit"
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'createHeader'" />
    </template>

    <template #body>
      <PentilaInput
        ref="folderNameInput"
        v-model="form.folderName"
        class="name-input"
        data-test="folderName-input"
        :error-type="formErrorList"
        @blur="v$.form.folderName.$touch()"
      />
      <p
        v-if="entityToRename.type==='File'"
        class="extension"
      >
        .{{ entityExtension }}
      </p>
      <PentilaErrorMessage
        :error-message="formErrorList"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('createSubmit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
// import validators from '@/utils/validators'
import constants from '@/constants/appConstants'
import apiConstants from '@/api/constant'
import fileServices from '@/api/documents/file.service'

// const notBeginByDot = (value) => validators.notBeginByDot(value)
// const containsNoCotes = (value) => validators.containsNoCotes(value)
// const isUnderMaxSize = (value) => validators.isUnderMaxSize(value)
// const hasNoSiblingWithSameName = (value, vm) => validators.hasNoSiblingWithSameName(value, vm.siblingEntities)

export default {
  name: 'FileNameModal',
  inject: ['mq'],
  props: {
    initFile: {
      type: Object,
      default: undefined
    },
    submitAction: {
      type: String,
      required: true
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      inputText: ''
    }
  },
  validations: {
    newName: {
      required
      // notBeginByDot,
      // containsNoCotes,
      // isUnderMaxSize
      // hasNoSiblingWithSameName
    }
  },
  computed: {
    entityToRename () {
      return this.$store.state.modals.renameModal.entityToRename
    },
    // siblingEntities () {
    //   const parentFolder = filesService.getParentFolder(
    //     this.$store.state.privateFilesManager.privateLoadedTree,
    //     this.entityToRename
    //   )
    //   let entities = this.$store.getters['privateFilesManager/entitiesInNode'](parentFolder.id)
    //   entities = entities.subFolders.concat(entities.files)
    //   utils.removeEntitiesFromArray(entities, [this.entityToRename])
    //   return entities
    // },
    entityExtension () {
      const parts = this.entityToRename.name.split('.')
      return parts[parts.length - 1]
    },
    fileNameWithoutExtension () {
      return this.entityToRename.name.split('.').slice(0, -1).join('.')
    },
    newName () {
      if (this.entityToRename.type === 'File') {
        return this.inputText.trim().concat('.' + this.entityExtension)
      } else {
        return this.inputText.trim()
      }
    },
    formErrorList () {
      if (this.v$.newName.$invalid && this.v$.newName.$dirty) {
        if (this.v$.newName.$errors[0].$validator === 'required') {
          return this.$t('AppCommonsLabels.formErrors.required')
        } else if (this.v$.newName.$errors[0].$validator === 'notBeginByDot') {
          return this.$t('AppCommonsLabels.formErrors.notBeginByDot')
        } else if (this.v$.newName.$errors[0].$validator === 'containsNoCotes') {
          return this.$t('AppCommonsLabels.formErrors.containsNoCotes')
          // } else if (!this.v$.newName.hasNoSiblingWithSameName) {
          //   return 'a document with the same name already exist in the current folder'
        } else {
          return this.$t('AppCommonsLabels.formErrors.sizeLimit1') + // it only could be that
            ((this.entityToRename.type === 'Folder')
              ? constants.entityNameMaxSize.folder
              : constants.entityNameMaxSize.file) +
            this.$t('AppCommonsLabels.formErrors.sizeLimit2')
        }
      } else {
        return ''
      }
    }
  },
  created () {
    // be careful if this.entityToRename could be undefined at this point
    if (this.entityToRename.type === 'File') {
      this.inputText = this.fileNameWithoutExtension
    } else {
      this.inputText = this.entityToRename.name
    }
  },
  mounted () {
    const input = document.getElementById('pentila-rename-input')
    input.focus()
    input.select()
  },
  methods: {
    submit () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        this[this.submitAction]()
      }
    },
    createMindMap () {
      fileServices.createMindMapFile(this.currentFolderId, this.newName).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
          // TODO open the created file
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createGeogebra () {
      fileServices.createGeogebraFile(this.currentFolderId, this.newName).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
          // TODO open the created file
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createScratch () {
      fileServices.createScratchFile(this.currentFolderId, this.newName).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
          // TODO open the created file
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createODT () {
      this.createLoolFile(apiConstants.ODT_TYPE)
    },
    createLoolFile (type) {
      fileServices.createLoolFile(this.currentFolderId, this.newName, type).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
          // TODO open the craeated file
        } else {
          console.error('An error was occurred')
        }
      })
    },
    rename () {
      console.log('todo')
      // this.$store.dispatch('files/renameEntity', {
      //   entity: this.entityToRename,
      //   name: this.newName,
      //   currentSpace: this.$route.name
      // })
      this.onClose()
    },
    onClose () {
      this.$store.dispatch('modals/closeRenameModal')
    }
  }
}
</script>

<style lang="scss">
.file-name-modal.mobile {
  .window-wrapper {
    max-width: 95vw;
    width: 100%;
  }
}
.file-name-modal.tablet {
  z-index: 1001;
}
</style>

<style lang="scss" scoped>
.file-name-modal {
  display: flex;
}

.window-body {
  width: 100%;

  .name {
    width: 100%;
    display: flex;
  }

  .error-message {
    margin-top: 5px;
  }
}

.name-input {
  flex: auto;
  min-width: 500px;
}

p {
  padding-top: 10px;
}

.extension {
  margin: 0;
}

.mobile {
  .name-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
