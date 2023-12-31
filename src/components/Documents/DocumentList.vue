<template>
  <div v-if="allSortedDocuments.length > 0 || areActionsInProgress">
    <!-- TODO: placeholder when no entities -->
    <FilesFields
      v-if="display === 'list'"
      :current-sort="sort"
      :are-all-selected="areAllSelected"
      @handle-sort="handleSort"
    />
    <div
      class="entities"
      :class="{'display-grid': display === 'grid', 'phone': mq.phone}"
    >
      <Folder
        v-for="(folder, index) in sortedFolders"
        :key="folder.id"
        :folder="folder"
        :is-last="index === allSortedDocuments.length - 1"
        :quick-options="[]"
        :dark="getEntityIndex(folder.id) % 2 === 0"
        :is-draggable="isDraggable(folder)"
        @shift-select="shiftSelect"
        @open-context-menu="openContextMenu"
      />
      <File
        v-for="(file, index) in sortedFiles"
        :key="file.id"
        :file="file"
        :is-last="index === sortedFiles.length - 1"
        :quick-options="[]"
        :dark="getEntityIndex(file.id) % 2 === 0"
        :is-draggable="isDraggable(file)"
        @shift-select="shiftSelect"
        @open-context-menu="openContextMenu"
      />
    </div>
  </div>
  <DocumentPlaceHolder v-else />
</template>

<script>
import File from '@components/Documents/DocumentItem/File'
import Folder from '@components/Documents/DocumentItem/Folder'
import DocumentPlaceHolder from '@components/Documents/DocumentPlaceHolder'
import FilesFields from '@components/Documents/FilesFields'
import { compare } from '@utils/commons.util'
import { ctrlSelectNextEntity, ctrlSelectPreviousEntity, selectBetween, selectNextEntity, selectPreviousEntity } from '@utils/documents.util'

export default {
  name: 'DocumentList',
  components: { DocumentPlaceHolder, File, Folder, FilesFields },
  inject: ['mq'],
  emits: ['openContextMenu'],
  data () {
    return {
      sort: {
        type: 'name',
        isOrderAsc: true,
        possibilities: [
          'name',
          'lastModifiedDate'
        ]
      }
    }
  },
  computed: {
    display () {
      return this.$store.state.documents.currentDisplay
    },
    currentEntities () {
      return this.$store.state.documents.folderContent
    },
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    draggablePermissionOnSelectedDocuments () {
      let isDraggable = true
      this.selectedDocuments.forEach((entity) => { // All selected documents need the delete permission to be drag
        if (!entity.permissions.DELETE) {
          isDraggable = false
        }
      })
      return isDraggable
    },
    areAllSelected () {
      return this.selectedDocuments.length === this.allSortedDocuments.length
    },
    sortedFiles () {
      return (this.currentEntities === undefined || this.currentEntities.files === undefined)
        ? []
        : this.currentEntities.files.slice().sort(compare(this.sort.type, this.sort.isOrderAsc))
    },
    sortedFolders () {
      return (this.currentEntities === undefined || this.currentEntities.subFolders === undefined)
        ? []
        : this.currentEntities.subFolders.slice().sort(compare(this.sort.type, this.sort.isOrderAsc))
    },
    allSortedDocuments () {
      return this.sortedFolders.concat(this.sortedFiles)
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    isDraggable (document) {
      return document.permissions.DELETE && this.draggablePermissionOnSelectedDocuments
    },
    isSelected (document) {
      return this.selectedEntities.map(entity => entity.id).indexOf(document.id) !== -1
    },
    handleSort (type) {
      if (type === this.sort.type) {
        this.sort.isOrderAsc = !this.sort.isOrderAsc
      } else {
        this.sort.type = type
      }
    },
    openContextMenu (e) {
      this.$emit('openContextMenu', e)
    },
    getEntityIndex (entityId) {
      return this.allSortedDocuments.map(item => item.id).indexOf(entityId)
    },
    // keyboard shortcuts management
    keyMonitor: function (event) {
      if (!this.isModalOpen) {
        // ctrl-arrow for multi-selection
        if ((event.ctrlKey || event.cmdKey) && event.key === 'ArrowDown') {
          ctrlSelectNextEntity(this.allSortedDocuments, this.$store.state.documents.lastSelectedEntity)
        } else if ((event.ctrlKey || event.cmdKey) && event.key === 'ArrowUp') {
          ctrlSelectPreviousEntity(this.allSortedDocuments, this.$store.state.documents.lastSelectedEntity)
          // ctrl-A for 'All' selection
        } else if ((event.ctrlKey || event.cmdKey) && ((event.key === 'a') || (event.key === 'A'))) {
          event.preventDefault()
          this.$store.dispatch('documents/selectAll')
          // Simple arrows
        } else if ((event.key === 'ArrowDown')) {
          selectNextEntity(this.allSortedDocuments, this.selectedDocuments[0])
        } else if ((event.key === 'ArrowUp')) {
          selectPreviousEntity(this.allSortedDocuments, this.selectedDocuments[0])
        }
      }
    },
    shiftSelect (file) {
      const firstDocumentOfSelection = this.$store.state.documents.lastSelectedEntity ? this.$store.state.documents.lastSelectedEntity : this.allSortedDocuments[0]
      const listDocumentsToSelect = selectBetween(this.allSortedDocuments, firstDocumentOfSelection, file)
      this.$store.dispatch('documents/selectManyDocuments', listDocumentsToSelect)
    }
  }
}
</script>

<style lang="scss" scoped>
.display-grid {
  width: 100%;
  overflow: auto;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: space-evenly;

  &.phone {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, 160px);
  }
}
</style>
