<template>
  <div
    :draggable="isDraggable"
    :class="[computeClass, {'dark': dark}]"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <GridDocument
      v-if="display==='grid'"
      :document="document"
      :document-icon="documentIcon"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @click.exact="toggleSelection"
      @click.ctrl.exact="toggleCtrlSelection"
      @click.meta.exact="toggleCtrlSelection"
      @click.shift="toggleShiftSelection"
      @contextmenu.prevent="openContextMenu"
      @chooseOption="handleChosenOption"
    />
    <ListDocument
      v-else-if="display==='list'"
      :document="document"
      :document-icon="documentIcon"
      :quick-options="quickOptions"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @triggerAction="triggerAction"
      @select="toggleSelection"
      @ctrlSelect="toggleCtrlSelection"
      @shiftSelect="toggleShiftSelection"
      @contextmenu.prevent="openContextMenu"
      @chooseOption="handleChosenOption"
    />
  </div>
</template>

<script>
import GridDocument from '@components/Documents/DocumentItem/GridDocument'
import ListDocument from '@components/Documents/DocumentItem/ListDocument'

export default {
  name: 'GenericDocument',
  components: { ListDocument, GridDocument },
  inject: ['mq'],
  props: {
    document: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    documentIcon: {
      type: String,
      required: true
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
      default: true
    }
  },
  emits: ['shiftSelect', 'openContextMenu', 'triggerAction'],
  data () {
    return {
      isHovering: false
    }
  },
  computed: {
    computeClass () {
      if (this.isDragged) {
        return 'is-dragging'
      } else {
        if (this.isSelected) {
          return 'selected'
        } else {
          if (this.isHovering && !this.mq.phone && !this.mq.tablet) {
            return 'hovering'
          } else {
            return 'document'
          }
        }
      }
    },
    selectedFiles () {
      return this.$store.state.documents.selectedEntities
    },
    draggedEntities () {
      return this.$store.state.misc.draggedEntities
    },
    isSelected () {
      for (let i = 0; i < this.selectedFiles.length; ++i) {
        if (this.document.id === this.selectedFiles[i].id) {
          return true
        }
      }
      return false
    },
    isDragged () {
      for (let i = 0; i < this.draggedEntities.length; ++i) {
        if (this.document.id === this.draggedEntities[i].id) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    onDragStart (e) {
      if (!this.isSelected) {
        this.toggleSelection()
      }
      let entitiesToDrag
      if (this.selectedFiles.length > 1) {
        entitiesToDrag = this.selectedFiles
      } else {
        entitiesToDrag = [this.document]
      }
      e.dataTransfer.setData('entitiesToDrop', JSON.stringify(entitiesToDrag))
      this.$store.dispatch('misc/addDraggedEntities', entitiesToDrag)
    },
    onDragEnd () {
      this.$store.dispatch('misc/removeDraggedEntities')
    },
    handleChosenOption (option) {
      // TODO handle quickOptions
      console.log('quickOptionClicked!', option)
    },
    triggerAction () {
      this.$emit('triggerAction')
    },
    toggleSelection () {
      this.$store.dispatch('documents/selectOneDocument', this.document)
    },
    toggleCtrlSelection () {
      this.$store.dispatch('documents/updateCtrlSelectedDocument', this.document)
    },
    toggleShiftSelection () {
      this.$emit('shiftSelect', { id: this.document.id, name: this.document.name })
    },
    openContextMenu (e) {
      this.toggleSelection() // /!\ be careful about async order
      this.$emit('openContextMenu', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.document {
  background-color: white;
}

.dark {
  background-color: $color-not-white-bg;
}

.is-dragging {
  color: $color-active-bg;
  background-color : $color-hover-bg;
}

.hovering {
  background-color : $color-hover-bg;
}

.selected {
  background-color : $color-selected-bg;
}

</style>