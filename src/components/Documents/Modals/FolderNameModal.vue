<template>
  <PentilaWindow
    class="folder-name-modal"
    :class="mq.phone ? 'mobile': ''"
    :is-full-screen="mq.phone"
    :modal="true"
    :draggable="true"
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
        v-model="form.folderName"
        class="name-input"
        data-test="folderName-input"
        :error-type="formErrorList"
        @blur="v$.form.folderName.$touch()"
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
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import folderServices from '@/api/documents/folder.service'

const isFolderNameValid = (str) => {
  return !(str.trim() === '') // test if folder name is not only spaces
}
// TODO
// const notBeginByDot = (value) => validators.notBeginByDot(value)
// const containsNoCotes = (value) => validators.containsNoCotes(value)
// const isUnderMaxSize = (value) => validators.isUnderMaxSize(value)

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
      form: {
        folderName: ''
      }
    }
  },
  validations: {
    form: {
      folderName: {
        required,
        isFolderNameValid
      }
    }
  },
  computed: {
    currentFolderId () {
      return this.$store.state.documents.currentFolderId
    }
  },
  mounted () {
    const input = this.$refs.folderNameInput
    input.focus()
    input.select()
  },
  created () {
    if (this.initFolder !== undefined) {
      this.form.folderName = this.initFolder.name
    }
  },
  methods: {
    formErrorList () {
      return (this.v$.form.folderName.$invalid && this.v$.form.folderName.$dirty)
        ? (!this.v$.form.folderName.required
            ? 'required'
            : (!this.v$.form.folderName.isFolderNameValid
                ? 'invalidVersionName'
                : ''))
        : ''
    },
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
      folderServices.createFolder(this.currentFolderId, this.form.folderName).then((data) => {
        if (data.success) {
          this.$store.dispatch('documents/refreshCurrentFolder')
          this.onClose()
        } else {
          console.error('An error was occurred')
        }
      })
    },
    renameFolder () {
      folderServices.renameFolder(this.initFolder.id, this.form.folderName).then((data) => {
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

<style lang="scss" scoped>
.folder-name-modal {
  display: flex;
}

.name-input {
  width: 500px;
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
  "createHeader": "Nouveau dossier",
  "createSubmit": "Créer",
  "rename": "Renommer",
  "renameHeader": "Renommer"
}
</i18n>
