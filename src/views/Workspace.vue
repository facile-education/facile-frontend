<template>
  <div>
    <WorkspaceToolbar/>
    <div class="workspace-body">
      <FolderTree class="body-height"/>
      <FolderContentList class="body-height"/>
    </div>
  </div>
</template>

<script>
import WorkspaceToolbar from '@/components/Workspace/WorkspaceToolbar'
import FolderTree from '@/components/Workspace/FolderTree'
import FolderContentList from '@/components/Workspace/FolderContentList'

export default {
  name: 'Workspace',
  components: {
    WorkspaceToolbar,
    FolderTree,
    FolderContentList
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.workspace-body {
  display: flex;
  height: $body-height-toolbar;
}

.body-height {
  height: $body-height-toolbar;
  overflow-y: auto;
}
</style>
