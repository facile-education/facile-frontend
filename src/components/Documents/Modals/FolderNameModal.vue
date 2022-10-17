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
        ref="folderNameInput"
        v-model="folderName"
        class="name-input"
        data-test="folderName-input"
        @blur="v$.folderName.$touch()"
        @input="backError=''"
      />
      <PentilaErrorMessage
        :error-message="formErrorList"
      />
    </template>

    <template #footer>
      <PentilaButton
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
import folderServices from '@/api/documents/folder.service'

const notBeginByDot = (value) => validators.notBeginByDot(value)
const containsNoCotes = (value) => validators.containsNoCotes(value)
const isUnderMaxSize = (value) => validators.isUnderMaxSize(value)

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
      folderServices.createFolder(this.currentFolderId, this.folderName).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          this.backError = 'createFolderError'
          console.error('An error was occurred')
        }
      })
    },
    renameFolder () {
      folderServices.renameFolder(this.initFolder.id, this.folderName).then((data) => {
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

<style lang="scss" scoped>
.folder-name-modal {
  display: flex;
}

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
