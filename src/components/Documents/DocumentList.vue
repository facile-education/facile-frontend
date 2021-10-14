<template>
  <div v-if="allSortedDocuments.length > 0">
    <!-- TODO: placeholder when no entities -->
    <FilesFields
      :current-sort="sort"
      @handleSort="handleSort"
    />
    <div class="entities">
      <Folder
        v-for="folder in sortedFolders"
        :key="folder.id"
        :folder="folder"
        :quick-options="[]"
        :dark="getEntityIndex(folder.id) % 2 === 0"
        :is-draggable="true"
        @shiftSelect="shiftSelect"
        @openContextMenu="openContextMenu"
      />
      <File
        v-for="file in sortedFiles"
        :key="file.id"
        :file="file"
        :quick-options="[]"
        :dark="getEntityIndex(file.id) % 2 === 0"
        :is-draggable="true"
        @shiftSelect="shiftSelect"
        @openContextMenu="openContextMenu"
      />
    </div>
  </div>
</template>

<script>
import FilesFields from '@components/Documents/FilesFields'
import Folder from '@components/Documents/DocumentItem/Folder'
import File from '@components/Documents/DocumentItem/File'
import { selectBetween } from '@utils/documents.util'
import { compare } from '@utils/commons.util'

export default {
  name: 'DocumentList',
  components: { File, Folder, FilesFields },
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
