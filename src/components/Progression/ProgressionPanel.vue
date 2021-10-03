<template>
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
    <ProgressionEditMode
      class="edit"
    />
  </div>
  <ProgressionAssignmentMode
    v-else
    class="assignment"
  />
</template>

<script>
import ProgressionSwitchMode from './ProgressionSwitchMode.vue'
import ProgressionEditMode from './Edit/ProgressionEditMode.vue'
import ProgressionAssignmentMode from './Assignment/ProgressionAssignmentMode.vue'
import ProgressionTree from './Tree/ProgressionTree.vue'

export default {
  name: 'ProgressionPanel',
  components: { ProgressionSwitchMode, ProgressionEditMode, ProgressionAssignmentMode, ProgressionTree },
  data () {
    return {
      isEditMode: true
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.switch {
  width: 100%;
  height: 80px;
  border: 1px solid black;
}
.tree-edit {
  display: flex;
  height: 100%;
  .tree {
    width: 20%;
    height: 100%;
    border: 1px solid black;
  }
  .edit {
    width: 80%;
    height: 100%;
    border: 1px solid black;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
