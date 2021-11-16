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
      <div class="edit">
        <ProgressionEditHeader
          class="header"
        />
        <ProgressionEdit
          class="section"
        />
      </div>
    </div>

    <!-- ASSIGNMENT MODE -->
    <div v-else>
      <CalendarPicker
        v-if="isCalendarPickerMode"
      />
      <HomeworkAssignmentPanel
        v-else-if="isHomeworkAssignmentMode"
      />
      <ProgressionAssignment
        v-else
        class="assignment"
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
import HomeworkAssignmentPanel from '@/components/Progression/Assignment/HomeworkAssignmentPanel'

export default {
  name: 'ProgressionPanel',
  components: { ProgressionSwitchMode, ProgressionEditHeader, ProgressionEdit, ProgressionAssignment, ProgressionTree, CalendarPicker, HomeworkAssignmentPanel },
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
    },
    isHomeworkAssignmentMode () {
      return this.$store.state.progression.isHomeworkAssignmentMode
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.progression-panel {
  height: 100%;

  .switch {
    width: 100%;
    height: $switch-mode-banner-height;
    border-bottom: 1px solid rgb(204, 204, 204);
  }

  .tree-edit {
    display: flex;
    height: calc(100% - #{$switch-mode-banner-height});

    .tree {
      width: 20%;
      height: 100%;
      overflow-y: auto;
    }

    .edit {
      width: 80%;
      height: 100%;
      padding: 0 20px 20px 25px;
      overflow-y: auto;
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
  "add": "Créer"
}
</i18n>
