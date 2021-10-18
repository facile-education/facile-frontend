<template>
  <div
    class="progression-panel"
  >
    <ProgressionSwitchMode
      class="switch"
    />

    <!-- EDIT MODE -->
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

    <!-- ASSIGNMENT MODE -->
    <div
      v-else
    >
      <ProgressionAssignment
        v-if="!isCalendarPickerMode"
        class="assignment"
      />
      <CalendarPicker
        v-else
      />
    </div>
  </div>
</template>

<script>
import ProgressionSwitchMode from './ProgressionSwitchMode.vue'
import ProgressionEditHeader from './Edit/ProgressionEditHeader.vue'
import ProgressionEdit from './Edit/ProgressionEdit.vue'
import ProgressionAssignment from './Assignment/ProgressionAssignment.vue'
import ProgressionTree from './Tree/ProgressionTree.vue'
import CalendarPicker from '@/components/Progression/Assignment/CalendarPicker'

export default {
  name: 'ProgressionPanel',
  components: { ProgressionSwitchMode, ProgressionEditHeader, ProgressionEdit, ProgressionAssignment, ProgressionTree, CalendarPicker },
  data () {
    return {
    }
  },
  computed: {
    isEditMode () {
      return this.$store.state.progression.isEditMode
    },
    isCalendarPickerMode () {
      return this.$store.state.progression.isCalendarPickerMode
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
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .tree-edit {
    display: flex;
    height: 100%;
    .tree {
      width: 15%;
      height: 100%;
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
