<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone"
    @close="$emit('close')"
  >
    <template #header>
      <span v-t="isCreation ? 'createHeader' : 'updateHeader'" />
    </template>

    <template #body>
      <div class="title">
        <PentilaInput
          v-model="title"
          :placeholder="$t('titlePlaceholder')"
        />
        <PentilaErrorMessage :error-message="formErrorList.title" />
      </div>
      <div class="content">
        <div
          v-t="'contentLabel'"
          class="content-label"
        />
        <CKEditor
          v-model="htmlContent"
          class="ck-editor"
          :editor="editor"
        />
        <PentilaErrorMessage :error-message="formErrorList.htmlContent" />
      </div>
    </template>
    <template #footer>
      <PentilaButton
        :label="$t(isCreation ? 'create' : 'update')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { createVersionNote, updateVersionNote } from '@/api/about.service'

export default {
  name: 'SaveVersionNoteModal',
  components: { CKEditor },
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
      editor: InlineEditor
    }
  },
  computed: {
    selectedNote () {
      return this.$store.state.about.selectedNote
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
      this.htmlContent = this.$store.state.about.versionNoteDetails
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
      createVersionNote(this.title, this.htmlContent).then((data) => {
        if (data.success) {
          this.$store.dispatch('about/getVersionNotesList')
          this.$emit('close')
        }
        // TODO: handle errors
      })
    },
    updateVersionNote () {
      updateVersionNote(this.selectedNote.versionNoteId, this.title, this.htmlContent).then((data) => {
        if (data.success) {
          this.$store.dispatch('about/getVersionNoteContent', this.selectedNote)
          this.$emit('close')
        }
        // TODO: handle errors
      })
    }
  }
}
</script>

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
  border: 1px solid $neutral-40 !important;
}

</style>

<i18n locale="fr">
{
  "contentLabel": "Contenu:",
  "create": "Créer",
  "createHeader": "Création d'une note de version",
  "required": "Champs requis",
  "titlePlaceholder": "Titre",
  "update": "Modifier",
  "updateHeader": "Modification d'une note de version"
}
</i18n>
