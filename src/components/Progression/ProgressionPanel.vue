<template>
  <div
    class="progression-panel"
  >
    <ProgressionSwitchMode
      class="switch"
    />
    <div
      v-if="isEditMode"
      class="tree-edit"
    >
      <ProgressionTree
        class="tree"
      />
      <div
        class="header-edit"
      >
        <ProgressionEditHeader
          class="header"
        />
        <ProgressionEdit
          class="edit"
        />
      </div>
    </div>
    <ProgressionAssignment
      v-else
      class="assignment"
    />
  </div>
</template>

<script>
import ProgressionSwitchMode from './ProgressionSwitchMode.vue'
import ProgressionEditHeader from './Edit/ProgressionEditHeader.vue'
import ProgressionEdit from './Edit/ProgressionEdit.vue'
import ProgressionAssignment from './Assignment/ProgressionAssignment.vue'
import ProgressionTree from './Tree/ProgressionTree.vue'

export default {
  name: 'ProgressionPanel',
  components: { ProgressionSwitchMode, ProgressionEditHeader, ProgressionEdit, ProgressionAssignment, ProgressionTree },
  data () {
    return {
    }
  },
  computed: {
    isEditMode () {
      return this.$store.state.progression.isEditMode
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.progression-panel {
  height: 100%;
  .switch {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid black;
  }
  .tree-edit {
    display: flex;
    height: 100%;
    .tree {
      width: 15%;
      height: 100%;
      border-right: 1px solid black;
    }
    .header-edit {
      width: 85%;
      height: 100%;
    }
  }
  .assignment {
    display: flex;
    height: 100%;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
