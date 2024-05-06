<template>
  <WeprodeWindow
    class="create-question-modal"
    data-test="create-question-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'HelpModal.CreateQuestionModal.title'" />
    </template>

    <template #body>
      <WeprodeInput
        ref="questionInput"
        v-model="questionInput"
        class="question-input"
        :placeholder="$t('HelpModal.CreateQuestionModal.questionPlaceHolder')"
      />

      <CKEditor
        v-model="answerInput"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('HelpModal.CreateQuestionModal.submit')"
        :disabled="questionInput.length === 0 || answerInput.length === 0"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { saveItem } from '@/api/help.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'CreateQuestionModal',
  components: { CKEditor, WeprodeButton, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      questionInput: '',
      answerInput: '',
      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('HelpModal.CreateQuestionModal.answerPlaceholder')
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
