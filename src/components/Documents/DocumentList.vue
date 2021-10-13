<template>
  <div>
    <!-- TODO: placeholder when no entities -->
    <FilesFields
      :current-sort="sort"
      @handleSort="handleSort"
    />
    <div class="entities">
      <Folder
        v-for="folder in sortedSubFolders"
        :key="folder.id"
        :folder="folder"
        :quick-options="spacesStructure.private.documentQuickOptions"
        :dark="getEntityIndex(folder.id) % 2 === 0"
        :is-draggable="true"
        @shiftSelect="shiftSelect"
        @openContextMenu="openContextMenu"
      />
      <File
        v-for="file in sortedFiles"
        :key="file.id"
        :file="file"
        :quick-options="spacesStructure.private.documentQuickOptions"
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
