<template>
  <CKEditor
    class="ck-editor"
    :class="{'maximised' : maximised }"
    :model-value="content.contentValue"
    :editor-id="editorId"
    :editor="editor"
    :config="editorOptions"
    :disabled="disabled"
    @ready="onEditorReady"
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
    },
    maximised: {
      type: Boolean,
      default: false
    }
  },
  emits: ['focus', 'blur', 'input', 'save'],
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
    onEditorReady (e) {
      // Make CKEditor available for tests
      if (window.Cypress) {
        window.ckeditor = e
      }
    },
    updateContent (newValue) {
      this.$emit('input', newValue)
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

<!-- not scoped to target ckeditor tags -->
<style lang="scss">
.ck-editor__editable {
  &:not(.maximised) {
    max-height: 15rem;
  }
}
</style>

<style lang="scss" scoped>
.ck-editor {
  width: 100%
}
</style>
