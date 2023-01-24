<template>
  <PentilaWindow
    class="edit-manual-modal"
    data-test="edit-manual-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
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
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { saveItem } from '@/api/help.service'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'

export default {
  name: 'EditManualModal',
  components: { CKEditor },
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

<i18n locale="fr">
{
  "title": "ÉDITER LE MANUEL",
  "submit": "Valider"
}
</i18n>
