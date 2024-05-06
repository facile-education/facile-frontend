<template>
  <WeprodeWindow
    class="edit-manual-modal"
    data-test="edit-manual-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'HelpModal.EditManualModal.title'" />
    </template>

    <template #body>
      <CKEditor
        v-model="htmlInput"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('HelpModal.EditManualModal.submit')"
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
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'EditManualModal',
  components: { CKEditor, WeprodeButton, WeprodeWindow },
  inject: ['mq'],
  props: {
    htmlContent: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      htmlInput: '',
      editor: InlineEditor,
      editorConfig: {}
    }
  },
  computed: {
    selectedHelpArticle () {
      return this.$store.state.help.currentArticle
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.htmlInput = this.htmlContent
  },
  methods: {
    submit () {
      const updatedArticle = JSON.parse(JSON.stringify(this.selectedHelpArticle))
      updatedArticle.manual = this.htmlInput
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
.ck-editor {
  border: 1px solid black;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
