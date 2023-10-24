<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    class="save-version-note-modal"
    data-test="saveVersionNoteModal"
    @close="$emit('close')"
  >
    <template #header>
      <span v-t="isCreation ? 'createHeader' : 'updateHeader'" />
    </template>

    <template #body>
      <WeprodeSpinner v-if="isLoading" />

      <div class="title">
        <WeprodeInput
          v-model="title"
          :placeholder="$t('titlePlaceholder')"
        />
        <WeprodeErrorMessage :error-message="formErrorList.title" />
      </div>
      <div class="content">
        <div
          v-t="'contentLabel'"
          class="content-label"
        />
        <TextContent
          v-model:content="htmlContent"
          class="ck-editor"
        />
        <WeprodeErrorMessage :error-message="formErrorList.htmlContent" />
      </div>
    </template>
    <template #footer>
      <WeprodeButton
        :label="$t(isCreation ? 'create' : 'update')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import TextContent from '@components/Base/TextContent.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { createVersionNote, updateVersionNote } from '@/api/versionNotes.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'SaveVersionNoteModal',
  components: { TextContent, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    isCreation: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    title: {
      required
    },
    htmlContent: {
      required
    }
  },
  data () {
    return {
      title: undefined,
      htmlContent: undefined,
      editor: InlineEditor,
      isLoading: false
    }
  },
  computed: {
    selectedNote () {
      return this.$store.state.versionNotes.selectedNote
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty) ? this.$t('required') : '',
        htmlContent: (this.v$.htmlContent.$invalid && this.v$.htmlContent.$dirty) ? this.$t('required') : ''
      }
    }
  },
  created () {
    if (!this.isCreation) {
      this.title = this.selectedNote.title
      // this.htmlContent = this.$store.state.versionNotes.versionNoteDetails
    }
  },
  methods: {
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        if (this.isCreation) {
          this.createVersionNote()
        } else {
          this.updateVersionNote()
        }
      }
    },
    createVersionNote () {
      this.isLoading = true
      createVersionNote(this.title, this.htmlContent).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('versionNotes/getVersionNotesList')
          this.$emit('close')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error('Cannot create versionNote')
        }
      }, (err) => {
        this.isLoading = false
        this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        console.error(err)
      })
    },
    updateVersionNote () {
      this.isLoading = true
      updateVersionNote(this.selectedNote.versionNoteId, this.title, this.htmlContent).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('versionNotes/getVersionNoteContent', this.selectedNote)
          this.$emit('close')
        } else {
          console.error('Cannot update versionNote')
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        }
      }, (err) => {
        this.isLoading = false
        this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss">
.save-version-note-modal {
  .window-body {
    position: relative;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

.title {
  margin-bottom: 1rem;
}

.content-label {
  @extend %font-regular-s;
  margin-bottom: 4px;
}

.ck-editor {
  border: 1px solid black !important;
}

</style>

<i18n locale="fr">
{
  "contentLabel": "Contenu:",
  "create": "Créer",
  "createHeader": "Création d'une note de version",
  "error": "Échec de la requète",
  "required": "Champs requis",
  "titlePlaceholder": "Titre",
  "update": "Modifier",
  "updateHeader": "Modification d'une note de version"
}
</i18n>
