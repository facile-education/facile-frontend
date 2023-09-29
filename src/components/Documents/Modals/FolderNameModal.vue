<template>
  <PentilaWindow
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
      <span v-t="submitAction==='rename' ? 'renameHeader' : 'createHeader'" />
    </template>

    <template #body>
      <div style="position: relative">
        <PentilaSpinner v-if="isActionInProgress" />

        <PentilaInput
          ref="folderNameInput"
          v-model="folderName"
          class="name-input"
          data-test="folderName-input"
          @blur="v$.folderName.$touch()"
          @input="backError=''"
          @keyup.enter="submit"
        />
        <PentilaErrorMessage
          :error-message="formErrorList"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :disabled="isActionInProgress"
        :label="submitAction==='rename' ? $t('rename') : $t('createSubmit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import folderServices from '@/api/documents/folder.service'
import { entityNameMaxSize } from '@/constants/appConstants'
import validators from '@/utils/validators'

const notBeginByDot = (value) => validators.notBeginByDot(value)
const containsNoCotes = (value) => validators.containsNoCotes(value)
const isUnderMaxSize = (value) => validators.isUnderMaxSize(value, entityNameMaxSize)

export default {
  name: 'FolderNameModal',
  inject: ['mq'],
  props: {
    initFolder: {
      type: Object,
      default: undefined
    },
    submitAction: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
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
          return this.$t('sizeLimit1') + entityNameMaxSize + this.$t('sizeLimit2')
        } else if (this.v$.folderName.$errors[0].$validator === 'notBeginByDot') {
          return this.$t('notBeginByDot')
        } else if (this.v$.folderName.$errors[0].$validator === 'containsNoCotes') {
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
  mounted () {
    const input = this.$refs.folderNameInput
    input.focus()
    input.select()
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (this.initFolder !== undefined) {
      this.folderName = this.initFolder.name
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
      folderServices.createFolder(this.currentFolderId, this.folderName).then((data) => {
        this.isActionInProgress = false
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
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
      folderServices.renameFolder(this.initFolder.id, this.folderName).then((data) => {
        this.isActionInProgress = false
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
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
      console.log('empty')
      this.folderName = ''
      this.$store.dispatch('misc/decreaseModalCount')
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

<i18n locale="fr">
{
  "backError": "Une erreur est survenue",
  "containsNoCotes": "Ne doit pas contenir de caractères spéciaux",
  "createHeader": "Nouveau dossier",
  "createSubmit": "Créer",
  "notBeginByDot": "Ne doit pas commencer par un '.'",
  "rename": "Renommer",
  "renameHeader": "Renommer",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères"
}
</i18n>
