<template>
  <div>
    <div
      v-for="entry in contentList"
      :key="entry.id">
      <FolderContentItem :entry="entry"/>
    </div>
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

</style>
