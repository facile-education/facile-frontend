<template>
  <div class="tree-panel">
    <NeroTabList>
      <NeroTabItem title="Perso">
        <NeroTree
          :folders-only="true"
          :model="data"
        />
      </NeroTabItem>
      <NeroTabItem title="Groups">
        <NeroTree
          :model="groupList"
        />
      </NeroTabItem>
    </NeroTabList>
  </div>
</template>

<script>
import NeroTree from '@/components/NeroTree'
import NeroTabList from '@/components/NeroTabList'
import NeroTabItem from '@/components/NeroTabItem'

export default {
  name: 'WorkspaceLeftPanel',
  components: {
    NeroTree,
    NeroTabList,
    NeroTabItem
  },
  computed: {
    data () {
      return { children: this.$store.state.workspace.folderContent }
    },
    groupList () {
      return { children: this.$store.state.workspace.groupList }
    }
  },
  created () {
    if (this.$store.state.workspace.groupList === undefined) {
      this.$store.dispatch('initGroupList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.tab {
  width: 50%;
}

.tree-panel {
  padding: 5px;
  @extend %nero-menu;
}
</style>
