<template>
  <div>
    <!-- TODO: placeholder when no entities -->
    <FilesFields
      :current-sort="sort"
      @handleSort="handleSort"
    />
    <!--    <div class="entities">-->
    <!--      <FolderDocument-->
    <!--        v-for="folder in sortedSubFolders"-->
    <!--        :key="folder.id"-->
    <!--        :folder="folder"-->
    <!--        :quick-options="spacesStructure.private.documentQuickOptions"-->
    <!--        :dark="getEntityIndex(folder.id) % 2 === 0"-->
    <!--        :is-draggable="true"-->
    <!--        @shiftSelect="shiftSelect"-->
    <!--      />-->
    <!--      <FileDocument-->
    <!--        v-for="file in sortedFiles"-->
    <!--        :key="file.id"-->
    <!--        :file="file"-->
    <!--        :quick-options="spacesStructure.private.documentQuickOptions"-->
    <!--        :dark="getEntityIndex(file.id) % 2 === 0"-->
    <!--        :is-draggable="true"-->
    <!--        @shiftSelect="shiftSelect"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script>
import FilesFields from '@components/Documents/FilesFields'
export default {
  name: 'DocumentList',
  components: { FilesFields },
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
