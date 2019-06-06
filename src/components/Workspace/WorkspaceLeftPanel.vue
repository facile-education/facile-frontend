<template>
  <div class="tree-panel">
    <PentilaTabList>
      <PentilaTabItem title="Perso">
        <NeroTree
          :folders-only="true"
          :model="data"
        />
      </PentilaTabItem>
      <PentilaTabItem title="Groups">
        <NeroTree
          :model="groupList"
        />
      </PentilaTabItem>
    </PentilaTabList>
  </div>
</template>

<script>
import NeroTree from '@/components/Nero/NeroTree'

export default {
  name: 'WorkspaceLeftPanel',
  components: {
    NeroTree
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
