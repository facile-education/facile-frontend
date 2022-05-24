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
      <span v-t="submitAction==='rename' ? 'renameHeader' : 'createHeader'" />
    </template>

    <template #body>
      <PentilaInput
        ref="fileNameInput"
        v-model="inputText"
        class="name-input"
        data-test="folderName-input"
        :error-type="formErrorList"
        @blur="v$.inputText.$touch()"
      />
      <p class="extension">
        .{{ entityExtension }}
      </p>
      <PentilaErrorMessage
        :error-message="formErrorList"
      />

      <AudioRecorder
        v-if="submitAction==='createAudio'"
        @audioFile="setAudioFile"
        @stoppedState="setStoppedState"
      />
    </template>

    <template #footer>
      <PentilaButton
        v-if="!(submitAction==='createAudio' && !stoppedState)"
        data-test="submitButton"
        :label="submitAction==='rename' ? $t('rename') : $t('createSubmit')"
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
import apiConstants from '@/api/constants'
import fileServices from '@/api/documents/file.service'
import AudioRecorder from '@components/Nero/AudioRecorder'

// const notBeginByDot = (value) => validators.notBeginByDot(value)
// const containsNoCotes = (value) => validators.containsNoCotes(value)
// const isUnderMaxSize = (value) => validators.isUnderMaxSize(value)
// const hasNoSiblingWithSameName = (value, vm) => validators.hasNoSiblingWithSameName(value, vm.siblingEntities)

export default {
  name: 'FileNameModal',
  components: { AudioRecorder },
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
  emits: ['close', 'openFile'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      inputText: '',
      // AudioRecorder data
      stoppedState: false,
      audioFile: undefined
    }
  },
  validations: {
    inputText: {
      required
      // notBeginByDot,
      // containsNoCotes,
      // isUnderMaxSize
      // hasNoSiblingWithSameName
    }
  },
  computed: {
    // siblingEntities () {
    //   const parentFolder = filesService.getParentFolder(
    //     this.$store.state.privateFilesManager.privateLoadedTree,
    //     this.initFile
    //   )
    //   let entities = this.$store.getters['privateFilesManager/entitiesInNode'](parentFolder.id)
    //   entities = entities.subFolders.concat(entities.files)
    //   utils.removeEntitiesFromArray(entities, [this.initFile])
    //   return entities
    // },
    currentFolderId () {
      return this.$store.state.documents.currentFolderId
    },
    entityExtension () {
      switch (this.submitAction) {
        case 'rename':
          // eslint-disable-next-line no-case-declarations
          const parts = this.initFile.name.split('.')
          return parts[parts.length - 1]
        case 'createODT': // TODO: put all that logic in ONE objet to avoid multiple conditions
          return apiConstants.ODT_TYPE
        case 'createODS':
          return apiConstants.ODS_TYPE
        case 'createOTP':
          return apiConstants.ODP_TYPE
        case 'createAudio':
          return apiConstants.AUDIO_TYPE
        case 'createHTML':
          return apiConstants.HTML_TYPE
        case 'createMindMap':
          return apiConstants.MINDMAP_TYPE
        case 'createGeogebra':
          return apiConstants.GEOGEBRA_TYPE
        case 'createScratch':
          return apiConstants.SCRATCH_TYPE
        default:
          console.error('Cannot compute extension for option ' + this.submitAction)
          return ''
      }
    },
    fileNameWithoutExtension () {
      return this.initFile.name.split('.').slice(0, -1).join('.')
    },
    formErrorList () {
      if (this.v$.inputText.$invalid && this.v$.inputText.$dirty) {
        if (this.v$.inputText.$errors[0].$validator === 'required') {
          return this.$t('Commons.required')
        } else {
          return this.$t('AppCommonsLabels.formErrors.sizeLimit1') + // it only could be that
            (constants.entityNameMaxSize.file) +
            this.$t('AppCommonsLabels.formErrors.sizeLimit2')
        }
        // else if (this.v$.inputText.$errors[0].$validator === 'notBeginByDot') {
        //   return this.$t('AppCommonsLabels.formErrors.notBeginByDot')
        // } else if (this.v$.inputText.$errors[0].$validator === 'containsNoCotes') {
        //   return this.$t('AppCommonsLabels.formErrors.containsNoCotes')
        // } else if (!this.v$.inputText.hasNoSiblingWithSameName) {
        //   return 'a document with the same name already exist in the current folder'
      } else {
        return ''
      }
    }
  },
  created () {
    if (this.submitAction === 'rename') {
      this.inputText = this.fileNameWithoutExtension
    }
  },
  mounted () {
    const input = this.$refs.fileNameInput
    input.focus()
    input.select()
  },
  methods: {
    setStoppedState (state) {
      this.stoppedState = state
    },
    setAudioFile (file) {
      this.audioFile = file
    },
    submit () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        this[this.submitAction]()
      }
    },
    createMindMap () {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createMindMapFile(this.currentFolderId, this.inputText).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.$emit('openFile', data.file) // Open the created file to edit it
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createGeogebra () {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createGeogebraFile(this.currentFolderId, this.inputText).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.$emit('openFile', data.file)
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createScratch () {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createScratchFile(this.currentFolderId, this.inputText).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.$emit('openFile', data.file)
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createODT () {
      this.createLoolFile(apiConstants.ODT_TYPE)
    },
    createLoolFile (type) {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createLoolFile(this.currentFolderId, this.inputText, type).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.$emit('openFile', data.file)
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    createAudio () {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createAudioFile(this.currentFolderId, this.inputText, this.audioFile).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    rename () {
      this.$store.dispatch('currentActions/addAction', { name: 'renameFile' })
      fileServices.renameFile(this.initFile.id, this.inputText).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'renameFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    onClose () {
      this.$emit('close')
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

<i18n locale="fr">
{
  "createHeader": "Nouveau",
  "createSubmit": "Créer",
  "renameHeader": "Renommer",
  "rename": "Renommer"
}
</i18n>
