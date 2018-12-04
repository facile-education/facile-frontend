<template>
  <div class="content">
    <table>
      <tr>
        <th>Nom (TODO)</th>
        <th>Taille</th>
        <th>Date</th>
        <th>Type</th>
      </tr>
      <FolderContentItem
        v-for="entry in contentList"
        :key="entry.id"
        :entry="entry"
      />
    </table>
  </div>
</template>

<script>
import FolderContentItem from '@/components/Workspace/FolderContentItem'

export default {
  name: 'FolderContentList',
  components: {
    FolderContentItem
  },
  computed: {
    contentList () {
      return this.$store.state.workspace.folderContent
    }
  },
  created () {
    if (this.contentList === undefined) {
      this.$store.dispatch('selectWorkspaceFolder')
    }
  }
}
</script>

<style lang="scss" scoped>
/* TODO handle height - toolbar */
.content {
  height: calc(100% - 37px);
  overflow: auto;
}
</style>
