<template>
  <PentilaWindow
    class="file-name-modal"
    data-test="file-name-modal"
    :class="mq.phone ? 'mobile': ''"
    :modal="true"
    :draggable="true"
    :width="600"
    :full-screen="mq.phone"
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
        @input="backError=''"
      />
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
import { entityNameMaxSize } from '@/constants/appConstants'
import validators from '@/utils/validators'
import apiConstants from '@/api/constants'
import fileServices from '@/api/documents/file.service'
import AudioRecorder from '@components/Nero/AudioRecorder'

const notBeginByDot = (value) => validators.notBeginByDot(value)
const containsNoCotes = (value) => validators.containsNoCotes(value)
const isUnderMaxSize = (value) => validators.isUnderMaxSize(value)

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
      backError: '',
      // AudioRecorder data
      stoppedState: false,
      audioFile: undefined
    }
  },
  validations: {
    inputText: {
      required,
      notBeginByDot,
      containsNoCotes,
      isUnderMaxSize
    }
  },
  computed: {
    currentFolderId () {
      return this.$store.state.documents.currentFolderId
    },
    entityExtension () {
      switch (this.submitAction) {
        case 'rename':
          return this.initFile.extension
        case 'createODT': // TODO: put all that logic in ONE objet to avoid multiple conditions
          return apiConstants.ODT_TYPE
        case 'createODS':
          return apiConstants.ODS_TYPE
        case 'createODP':
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
      const parts = this.initFile.name.split('.')
      if (parts.length > 1) {
        return parts.slice(0, -1).join('.')
      } else {
        return parts[0] // To handle case where file doesn't have extension
      }
    },
    formErrorList () {
      if (this.v$.inputText.$invalid && this.v$.inputText.$dirty) {
        if (this.v$.inputText.$errors[0].$validator === 'required') {
          return this.$t('Commons.required')
        } else if (this.v$.inputText.$errors[0].$validator === 'isUnderMaxSize') {
          return this.$t('sizeLimit1') + entityNameMaxSize + this.$t('sizeLimit2')
        } else if (this.v$.inputText.$errors[0].$validator === 'notBeginByDot') {
          return this.$t('notBeginByDot')
        } else if (this.v$.inputText.$errors[0].$validator === 'containsNoCotes') {
          return this.$t('containsNoCotes')
        } else {
          console.error('Unknown validation error')
          return ''
        }
      } else {
        if (this.backError) {
          return this.$t('backError')
        } else {
          return ''
        }
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
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
          this.backError = 'renameFolderError'
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
          this.backError = 'renameFolderError'
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
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      })
    },
    createODT () {
      this.createLoolFile(apiConstants.ODT_TYPE)
    },
    createODS () {
      this.createLoolFile(apiConstants.ODS_TYPE)
    },
    createODP () {
      this.createLoolFile(apiConstants.ODP_TYPE)
    },
    createHTML () {
      this.$store.dispatch('currentActions/addAction', { name: 'createFile' })
      fileServices.createHtmlFile(this.currentFolderId, this.inputText).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.$emit('openFile', data.file)
          this.onClose()
        } else {
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      })
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
          this.backError = 'renameFolderError'
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
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      })
    },
    rename () {
      fileServices.renameFile(this.initFile.id, this.inputText + '.' + this.initFile.extension).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
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
  max-width: 100%;
}

p {
  padding-top: 10px;
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
  "backError": "Une erreur est survenue",
  "containsNoCotes": "Ne doit pas contenir de caractères spéciaux",
  "createHeader": "Nouveau",
  "createSubmit": "Créer",
  "notBeginByDot": "Ne doit pas commencer par un '.'",
  "rename": "Renommer",
  "renameHeader": "Renommer",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères"
}
</i18n>
