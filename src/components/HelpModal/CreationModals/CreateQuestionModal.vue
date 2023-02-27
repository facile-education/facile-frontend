<template>
  <PentilaWindow
    class="create-question-modal"
    data-test="create-question-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <PentilaInput
        ref="questionInput"
        v-model="questionInput"
        class="question-input"
        :placeholder="$t('questionPlaceHolder')"
      />

      <CKEditor
        v-model="answerInput"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="questionInput.length === 0 || answerInput.length === 0"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import { saveItem } from '@/api/help.service'

export default {
  name: 'CreateQuestionModal',
  components: { CKEditor },
  emits: ['close'],
  data () {
    return {
      questionInput: '',
      answerInput: '',
      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('answerPlaceholder')
      }
    }
  },
  computed: {
    selectedHelpArticle () {
      return this.$store.state.help.currentArticle
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    const input = this.$refs.questionInput
    input.focus()
    input.select()
  },
  methods: {
    submit () {
      const updatedArticle = JSON.parse(JSON.stringify(this.selectedHelpArticle))
      updatedArticle.questions.push({ question: this.questionInput, answer: this.answerInput })
      saveItem(0, updatedArticle).then((data) => { // No need of categoryId for item modification
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
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
.question-input {
  margin-bottom: 15px;
}

.ck-editor {
  border: 1px solid black;
  max-height: 70vh;
  overflow-y: auto;
}
</style>

<i18n locale="fr">
{
  "title": "AJOUTER UNE QUESTION/RÉPONSE",
  "questionPlaceHolder": "Question",
  "answerPlaceholder": "Réponse",
  "submit": "Valider"
}
</i18n>
