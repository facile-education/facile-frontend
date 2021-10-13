<template>
  <GenericDocument
    :document="document"
    :quick-options="quickOptions"
    :display="display"
    :is-draggable="isDraggable"
    :dark="dark"
    @open="openFile"
    @click="handleClick"
    @dblclick="openFile"
    @shiftSelect="dispatchEvent"
    @openContextMenu="openContextMenu"
  />
</template>

<script>
import { icons } from '@/constants/icons'
import GenericDocument from '@components/Documents/DocumentItem/GenericDocument'

export default {
  name: 'File',
  components: { GenericDocument },
  inject: ['mq'],
  myIcons: icons,
  props: {
    file: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    display: {
      type: String,
      default: 'list'
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    quickOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['shiftSelect', 'openContextMenu'],
  computed: {
    isSelected () {
      for (let i = 0; i < this.$store.state.documents.selectedFiles.length; ++i) {
        if (this.file.id === this.$store.state.documents.selectedFiles[i].id) {
          return true
        }
      }
      return false
    },
    isMultiSelectionActive () {
      return this.$store.state.documents.isMultiSelectionActive
    },
    document () {
      const obj = this.file
      obj.icon = this.fileIcon
      return obj
    },
    fileIcon () {
      if (this.$options.myIcons.extensions[this.file.extension] === undefined) {
        return this.$options.myIcons.file
      } else {
        return this.$options.myIcons.extensions[this.file.extension]
      }
    }
  },
  methods: {
    enterAction () {
      if (this.isSelected) {
        this.openFile()
      }
    },
    openFile () {
      this.$store.dispatch('files/openDocumentPanel')
    },
    handleClick () {
      if (this.mq.phone || this.mq.tablet) {
        if (this.isMultiSelectionActive) {
          this.$store.dispatch('files/updateCtrlSelectedFiles', this.file)
        } else {
          this.$store.dispatch('files/selectOneFile', this.file)
          this.openFile()
        }
      }
    },
    dispatchEvent (file) {
      this.$emit('shiftSelect', { id: file.id, name: file.name })
    },
    openContextMenu (e) {
      this.$emit('openContextMenu', e)
    }
  }
}
</script>
