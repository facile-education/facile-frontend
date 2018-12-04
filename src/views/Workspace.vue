<template>
  <Split>
    <SplitArea
      :size="25"
      :min-size="150"
    >
      <WorkspaceLeftPanel class="body-height" />
    </SplitArea>
    <SplitArea
      :size="75"
      class="body-height"
    >
      <WorkspaceToolbar />
      <FolderContentList />
    </SplitArea>
  </Split>
</template>

<script>
import WorkspaceToolbar from '@/components/Workspace/WorkspaceToolbar'
import WorkspaceLeftPanel from '@/components/Workspace/WorkspaceLeftPanel'
import FolderContentList from '@/components/Workspace/FolderContentList'
import Split from '@/components/Split/Split'
import SplitArea from '@/components/Split/SplitArea'

export default {
  name: 'Workspace',
  components: {
    WorkspaceToolbar,
    WorkspaceLeftPanel,
    FolderContentList,
    Split,
    SplitArea
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.body-height {
  height: 100%;
  width: 100%;
}
</style>
