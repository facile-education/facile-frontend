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
          :v-model="title"
          :placeholder="$t('titlePlaceholder')"
        />
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
          :config="{}"
        />
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
      // TODO: form validation
      if (this.isCreation) {
        this.createVersionNote()
      } else {
        this.updateVersionNote()
      }
    },
    createVersionNote () {
      createVersionNote(this.title, this.htmlContent).then((data) => {
        if (data.success) {
          this.dispatch('about/getVersionList')
          this.$emit('close')
        }
        // TODO: handle errors
      })
    },
    updateVersionNote () {
      updateVersionNote(this.selectedNote.versionNoteId, this.title, this.htmlContent).then((data) => {
        if (data.success) {
          this.dispatch('about/getVersionNoteDetails', this.selectedNote)
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
  "titlePlaceholder": "Titre",
  "update": "Modifier",
  "updateHeader": "Modification d'une note de version"
}
</i18n>
