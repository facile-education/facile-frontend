<template>
  <CKEditor
    class="ck-editor"
    :class="{'maximised' : maximised , 'disabled': disabled && ready}"
    :model-value="content"
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
import { defineAsyncComponent } from 'vue'
const CKEditor = defineAsyncComponent({
  loader: async () => { return (await import('@ckeditor/ckeditor5-vue')).component }
  // loadingComponent: CKLoadingPlaceholder // TODO: CKLoadingPlaceholder with same size and spinner
})

export default {
  name: 'TextContent',
  components: { CKEditor },
  props: {
    content: {
      type: String,
      required: true
    },
    isInProgression: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maximised: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: undefined
    },
    editorId: {
      type: Number,
      default: 0
    }
  },
  emits: ['focus', 'blur', 'input', 'save', 'update:content'],
  data () {
    return {
      timeout: undefined,
      editor: InlineEditor,
      ready: false, // Mandatory to not set the 'disable' class too earlier and prevent bad class toggle on editor focus
      editorOptions: {
        removePlugins: [
          'CKFinder',
          'CKFinderUploadAdapter',
          'CKBox',
          'CKBoxEditing',
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
        language: 'fr',
        placeholder: this.placeholder
      }
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
      this.ready = true
      // Make CKEditor available for tests
      if (window.Cypress) {
        window.ckeditor = e
      }
    },
    updateContent (newValue) {
      this.$emit('input', newValue)
      this.$emit('update:content', newValue)
      clearTimeout(this.timeout)
      if (this.isInProgression) {
        this.$store.dispatch('progression/setIsWaiting', true)
      }
      // 2s timeout
      this.timeout = setTimeout(() => {
        const updatedContent = { contentValue: this.content }
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
