<template>
  <CKEditor
    class="ck-editor"
    :model-value="content.contentValue"
    :editor-id="editorId"
    :editor="editor"
    :config="editorOptions"
    :disabled="disabled"
    @input="updateContent"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
  />
</template>

<script>
import '@ckeditor/ckeditor5-build-inline/build/translations/fr'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'

export default {
  name: 'TextContent',
  components: { CKEditor },
  props: {
    content: {
      type: Object,
      required: true
    },
    isInProgression: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['focus', 'blur', 'save'],
  data () {
    return {
      timeout: undefined,
      editor: InlineEditor,
      editorOptions: {
        removePlugins: [
          'CKFinder',
          'CKFinderUploadAdapter',
          'CloudServicesUploadAdapter',
          'CloudServices',
          'EasyImage',
          'Image',
          'ImageCaption',
          'ImageStyle',
          'ImageToolbar',
          'ImageUpload',
          'MediaEmbed'
        ],
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
        language: 'fr'
      }
    }
  },
  computed: {
    editorId () {
      // Used to manage multiple editors - editorId is based on the (unique) order
      return 'editor' + this.content.order
    }
  },
  methods: {
    onEditorFocus () {
      this.$emit('focus')
    },
    onEditorBlur () {
      this.$emit('blur')
    },
    updateContent (newValue) {
      clearTimeout(this.timeout)
      if (this.isInProgression) {
        this.$store.dispatch('progression/setIsWaiting', true)
      }
      // 2s timeout
      this.timeout = setTimeout(() => {
        const updatedContent = { ...this.content }
        updatedContent.contentValue = newValue
        if (this.isInProgression) {
          this.$store.dispatch('progression/updateItemContent', updatedContent)
        } else {
          this.$emit('save', updatedContent)
        }
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.ck-editor {
  width: 100%
}
</style>
