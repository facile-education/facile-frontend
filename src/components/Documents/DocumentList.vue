<template>
  <div v-if="allSortedDocuments.length > 0">
    <!-- TODO: placeholder when no entities -->
    <FilesFields
      :current-sort="sort"
      :are-all-selected="areAllSelected"
      @handleSort="handleSort"
    />
    <div class="entities">
      <Folder
        v-for="(folder, index) in sortedFolders"
        :key="folder.id"
        :folder="folder"
        :is-last="index === allSortedDocuments.length - 1"
        :quick-options="[]"
        :dark="getEntityIndex(folder.id) % 2 === 0"
        :is-draggable="folder.type !== 'Group' && !folder.isGroupRootFolder"
        @shiftSelect="shiftSelect"
        @openContextMenu="openContextMenu"
      />
      <File
        v-for="(file, index) in sortedFiles"
        :key="file.id"
        :file="file"
        :is-last="index === sortedFiles.length - 1"
        :quick-options="[]"
        :dark="getEntityIndex(file.id) % 2 === 0"
        :is-draggable="true"
        @shiftSelect="shiftSelect"
        @openContextMenu="openContextMenu"
      />
    </div>
  </div>
  <DocumentPlaceHolder v-else />
</template>

<script>
import FilesFields from '@components/Documents/FilesFields'
import Folder from '@components/Documents/DocumentItem/Folder'
import File from '@components/Documents/DocumentItem/File'
import { ctrlSelectNextEntity, ctrlSelectPreviousEntity, selectBetween, selectNextEntity, selectPreviousEntity } from '@utils/documents.util'
import { compare } from '@utils/commons.util'
import DocumentPlaceHolder from '@components/Documents/DocumentPlaceHolder'

export default {
  name: 'DocumentList',
  components: { DocumentPlaceHolder, File, Folder, FilesFields },
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
    currentEntities () {
      return this.$store.state.documents.folderContent
    },
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
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
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
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
      // ctrl-arrow for multi-selection
      if (event.ctrlKey && event.key === 'ArrowDown') {
        ctrlSelectNextEntity(this.allSortedDocuments, this.$store.state.documents.lastSelectedEntity)
      } else if (event.ctrlKey && event.key === 'ArrowUp') {
        ctrlSelectPreviousEntity(this.allSortedDocuments, this.$store.state.documents.lastSelectedEntity)
        // ctrl-A for 'All' selection
      } else if (event.ctrlKey && ((event.key === 'a') || (event.key === 'A'))) {
        event.preventDefault()
        this.$store.dispatch('documents/selectAll')
        // Simple arrows
      } else if ((event.key === 'ArrowDown')) {
        selectNextEntity(this.allSortedDocuments, this.selectedDocuments[0])
      } else if ((event.key === 'ArrowUp')) {
        selectPreviousEntity(this.allSortedDocuments, this.selectedDocuments[0])
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

</style>
