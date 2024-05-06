<template>
  <WeprodeWindow
    class="folder-name-modal"
    data-test="folder-name-modal"
    :class="mq.phone ? 'mobile': ''"
    :full-screen="mq.phone"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="submitAction==='rename' ? 'Documents.FolderNameModal.renameHeader' : 'Documents.FolderNameModal.createHeader'" />
    </template>

    <template #body>
      <div style="position: relative">
        <WeprodeSpinner v-if="isActionInProgress" />

        <WeprodeInput
          ref="folderNameInput"
          v-model="folderName"
          class="name-input"
          data-test="folderName-input"
          @blur="v$.folderName.$touch()"
          @input="backError=''"
          @keyup.enter="submit"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :disabled="isActionInProgress"
        :label="submitAction==='rename' ? $t('Documents.FolderNameModal.rename') : $t('Documents.FolderNameModal.createSubmit')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import folderServices from '@/api/documents/folder.service'
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
  name: 'FolderNameModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    currentFolder: {
      type: Object,
      default: undefined
    },
    folderToRename: {
      type: Object,
      default: undefined
    },
    submitAction: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'createFolder', 'renameFolder'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      isActionInProgress: false,
      folderName: '',
      backError: ''
    }
  },
  validations: {
    folderName: {
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
    formErrorList () {
      if (this.v$.folderName.$invalid && this.v$.folderName.$dirty) {
        if (this.v$.folderName.$errors[0].$validator === 'required') {
          return this.$t('Commons.required')
        } else if (this.v$.folderName.$errors[0].$validator === 'isUnderMaxSize') {
          return this.$t('Documents.FolderNameModal.sizeLimit', { maxSize: entityNameMaxSize })
        } else if (this.v$.folderName.$errors[0].$validator === 'notBeginByDot') {
          return this.$t('Documents.FolderNameModal.notBeginByDot')
        } else if (this.v$.folderName.$errors[0].$validator === 'containsNoCotes') {
          return this.$t('Documents.FolderNameModal.containsNoCotes')
        } else {
          console.error('Unknown validation error')
          return ''
        }
      } else if (this.backError === 'DuplicateFileException') {
        return this.$t('Documents.FolderNameModal.duplicateFileException')
      } else if (this.backError) {
        return this.$t('Documents.FolderNameModal.backError')
      } else {
        return ''
      }
    }
  },
  mounted () {
    const input = this.$refs.folderNameInput
    input.focus()
    input.select()
  },
  created () {
    if (this.folderToRename !== undefined) {
      this.folderName = this.folderToRename.name
    } else {
      this.folderName = ''
    }
  },
  methods: {
    submit () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        switch (this.submitAction) {
          case 'createFolder':
            this.createFolder()
            break
          case 'rename':
            this.renameFolder()
            break
          default:
            console.error('Unknown submit action: ' + this.submitAction)
        }
      }
    },
    createFolder () {
      this.isActionInProgress = true
      folderServices.createFolder(this.currentFolder.id, this.folderName).then((data) => {
        this.isActionInProgress = false
        if (data.success) {
          this.$emit('createFolder')
          this.onClose()
        } else if (data.error === 'DuplicateFileException') {
          this.backError = 'DuplicateFileException'
        } else {
          this.backError = 'createFolderError'
          console.error('An error was occurred')
        }
      }, (err) => {
        console.error(err)
        this.isActionInProgress = false
        this.backError = 'renameFolderError'
      })
    },
    renameFolder () {
      this.isActionInProgress = true
      folderServices.renameFolder(this.folderToRename.id, this.folderName).then((data) => {
        this.isActionInProgress = false
        if (data.success) {
          this.$emit('renameFolder')
          this.onClose()
        } else if (data.error === 'DuplicateFileException') {
          this.backError = 'DuplicateFileException'
        } else {
          this.backError = 'renameFolderError'
          console.error('An error was occurred')
        }
      }, (err) => {
        console.error(err)
        this.isActionInProgress = false
        this.backError = 'renameFolderError'
      })
    },
    onClose () {
      this.folderName = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.name-input {
  max-width: 100%;
}

.mobile {
  .name-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
