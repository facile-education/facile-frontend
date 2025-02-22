<template>
  <WeprodeWindow
    class="file-name-modal"
    data-test="file-name-modal"
    :class="mq.phone ? 'mobile': ''"
    :modal="true"
    :draggable="true"
    :width="600"
    :full-screen="mq.phone"
    @close="onClose"
  >
    <template #header>
      <span v-t="submitAction==='rename' ? 'Documents.FileNameModal.renameHeader' : 'Documents.FileNameModal.createHeader'" />
    </template>

    <template #body>
      <div style="position: relative">
        <WeprodeSpinner v-if="isActionInProgress" />

        <WeprodeInput
          ref="fileNameInput"
          v-model="inputText"
          class="name-input"
          data-test="folderName-input"
          :error-type="formErrorList"
          @blur="v$.inputText.$touch()"
          @input="backError=''"
          @keyup.enter="submit"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList"
        />

        <AudioRecorder
          v-if="submitAction==='createAudio'"
          @audio-file="setAudioFile"
          @stopped-state="setStoppedState"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        v-if="!(submitAction==='createAudio' && !stoppedState)"
        data-test="submitButton"
        :disabled="isActionInProgress"
        :label="submitAction==='rename' ? $t('Documents.FileNameModal.rename') : $t('Documents.FileNameModal.createSubmit')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import AudioRecorder from '@components/Base/AudioRecorder.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import apiConstants from '@/api/constants'
import fileServices from '@/api/documents/file.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import { entityNameMaxSize } from '@/constants/appConstants'
import validators from '@/utils/validators'

const notBeginByDot = (value) => validators.notBeginByDot(value)
const containsNoCotes = (value) => validators.containsNoCotes(value)
const isUnderMaxSize = (value) => validators.isUnderMaxSize(value, entityNameMaxSize)

export default {
  name: 'FileNameModal',
  components: { AudioRecorder, WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeWindow },
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
    isCreatingFile () {
      return this.$store.getters['currentActions/isInProgress']('createFile')
    },
    isRenamingFile () {
      return this.$store.getters['currentActions/isInProgress']('renameFile')
    },
    isActionInProgress () {
      return this.isCreatingFile || this.isRenamingFile
    },
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
          return this.$t('Documents.FileNameModal.sizeLimit', { maxSize: entityNameMaxSize })
        } else if (this.v$.inputText.$errors[0].$validator === 'notBeginByDot') {
          return this.$t('Documents.FileNameModal.notBeginByDot')
        } else if (this.v$.inputText.$errors[0].$validator === 'containsNoCotes') {
          return this.$t('Documents.FileNameModal.containsNoCotes')
        } else {
          console.error('Unknown validation error')
          return ''
        }
      } else {
        if (this.backError) {
          return this.$t('Documents.FileNameModal.backError')
        } else {
          return ''
        }
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
      } else if (!this.isActionInProgress) {
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
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
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'createFile' })
        console.error(err)
        this.backError = 'renameFolderError'
      })
    },
    rename () {
      this.$store.dispatch('currentActions/addAction', { name: 'renameFile' })
      fileServices.renameFile(this.initFile.id, this.inputText + '.' + this.initFile.extension).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'renameFile' })
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      }, (err) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'renameFile' })
        console.error(err)
        this.backError = 'renameFolderError'
      })
    },
    onClose () {
      this.inputText = ''
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
