<template>
  <div class="main-editor">
    <div
      :id="editorId"
      class="editor"
      :config="editorConfig"
    />
  </div>
</template>

<script>
import CadycoEditor from '@/assets/ckeditor'

export default {
  name: 'CKEditor',
  props: {
    initialContent: {
      type: String,
      required: false,
      default: ''
    },
    editorId: {
      type: String,
      required: true
    }
  },
  emits: ['input'],
  data () {
    return {
      editorConfig: {
        height: 300
      }
    }
  },
  computed: {
    querySelector () {
      return '#' + this.editorId
    }
  },
  mounted () {
    CadycoEditor
      // Do not specify the plugin and toolbar configuration — using defaults from the build.
      .create(document.querySelector(this.querySelector))
      .then(editor => {
        // Initialize content
        editor.setData(this.initialContent)

        // Add listener to CKEditor content
        editor.model.document.on('change:data', () => {
          this.$emit('input', editor.getData())
        })

        if (window.Cypress) {
          // Make CKEditor available for tests
          window.ckeditor = editor
        }
      })
      .catch(error => {
        console.error(error.stack)
      })
  },
  methods: {
  }
}
</script>

<!-- not scoped to target ckeditor tags -->
<style>
.ck-editor__editable {
  min-height: 10rem;
  max-height: 15rem;
}
</style>
